import {
  DEFAULT_CELLS,
  MAX_LEVELS,
  PALETTE,
  SERIALIZATION_MAGIC,
  SERIALIZATION_VERSION,
  WORLD_RADIUS,
} from "./config";
import type {
  CellFeature,
  CellState,
  Direction,
  WorldSnapshot,
} from "./types";

interface MutableCell {
  readonly x: number;
  readonly z: number;
  readonly foundation: boolean;
  readonly foundationColor: number;
  readonly storeys: Map<number, number>;
}

type MutableWorld = Map<string, MutableCell>;

const BASE64URL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const DIRECTIONS: ReadonlyArray<readonly [Direction, number, number]> = [
  ["north", 0, -1],
  ["east", 1, 0],
  ["south", 0, 1],
  ["west", -1, 0],
];

function cellKey(x: number, z: number): string {
  return `${x},${z}`;
}

function coordinates(key: string): readonly [number, number] | null {
  const match = /^(-?\d+),(-?\d+)$/.exec(key);
  if (match === null) return null;
  const x = Number(match[1]);
  const z = Number(match[2]);
  return Number.isSafeInteger(x) && Number.isSafeInteger(z) ? [x, z] : null;
}

function compareCells(left: MutableCell, right: MutableCell): number {
  return left.x - right.x || left.z - right.z;
}

function compareKeys(left: string, right: string): number {
  const leftCoordinates = coordinates(left);
  const rightCoordinates = coordinates(right);
  if (leftCoordinates === null || rightCoordinates === null) return left.localeCompare(right);
  return leftCoordinates[0] - rightCoordinates[0] || leftCoordinates[1] - rightCoordinates[1];
}

function isInWorld(x: number, z: number): boolean {
  return Number.isInteger(x)
    && Number.isInteger(z)
    && x * x + z * z <= WORLD_RADIUS * WORLD_RADIUS;
}

function isValidColor(color: number): boolean {
  return Number.isInteger(color) && color >= 0 && color < PALETTE.length;
}

function maxStorey(cell: MutableCell): number {
  let maximum = 0;
  for (const level of cell.storeys.keys()) maximum = Math.max(maximum, level);
  return maximum;
}

function cellColor(cell: MutableCell): number {
  return cell.storeys.get(maxStorey(cell)) ?? cell.foundationColor;
}

function cloneWorld(world: MutableWorld): MutableWorld {
  return new Map([...world].map(([key, cell]) => [key, { ...cell, storeys: new Map(cell.storeys) }]));
}

function worldsEqual(left: MutableWorld, right: MutableWorld): boolean {
  if (left.size !== right.size) return false;
  for (const [key, cell] of left) {
    const other = right.get(key);
    if (other === undefined
      || other.foundation !== cell.foundation
      || other.foundationColor !== cell.foundationColor
      || other.storeys.size !== cell.storeys.size
      || [...cell.storeys].some(([level, color]) => other.storeys.get(level) !== color)
    ) return false;
  }
  return true;
}

function changedKeys(left: MutableWorld, right: MutableWorld): string[] {
  const changed = new Set<string>();
  for (const [key, cell] of left) {
    const other = right.get(key);
    if (other === undefined
      || other.foundation !== cell.foundation
      || other.foundationColor !== cell.foundationColor
      || other.storeys.size !== cell.storeys.size
      || [...cell.storeys].some(([level, color]) => other.storeys.get(level) !== color)
    ) changed.add(key);
  }
  for (const key of right.keys()) {
    if (!left.has(key)) changed.add(key);
  }
  return [...changed].sort(compareKeys);
}

function defaultWorld(): MutableWorld {
  const world: MutableWorld = new Map();
  for (const cell of DEFAULT_CELLS) {
    if (!cell.foundation || !isInWorld(cell.x, cell.z)) continue;
    if (cell.level < 0 || cell.level > MAX_LEVELS || !isValidColor(cell.color)) continue;
    const storeys = new Map<number, number>();
    for (let level = 1; level <= cell.level; level += 1) storeys.set(level, cell.color);
    world.set(cellKey(cell.x, cell.z), {
      x: cell.x,
      z: cell.z,
      foundation: true,
      foundationColor: cell.color,
      storeys,
    });
  }
  return world;
}

function encodeBase64Url(bytes: Uint8Array): string {
  let encoded = "";
  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index] ?? 0;
    const second = bytes[index + 1];
    const third = bytes[index + 2];
    encoded += BASE64URL.charAt((first >>> 2) & 63);
    encoded += BASE64URL.charAt(((first & 3) << 4) | ((second ?? 0) >>> 4));
    if (second !== undefined) encoded += BASE64URL.charAt(((second & 15) << 2) | ((third ?? 0) >>> 6));
    if (third !== undefined) encoded += BASE64URL.charAt(third & 63);
  }
  return encoded;
}

function decodeBase64Url(encoded: string): Uint8Array | null {
  if (!/^[A-Za-z0-9_-]*$/.test(encoded) || encoded.length % 4 === 1) return null;
  const bytes: number[] = [];
  let accumulator = 0;
  let bitCount = 0;
  for (const character of encoded) {
    const value = BASE64URL.indexOf(character);
    if (value < 0) return null;
    accumulator = (accumulator << 6) | value;
    bitCount += 6;
    if (bitCount >= 8) {
      bitCount -= 8;
      bytes.push((accumulator >>> bitCount) & 0xff);
      accumulator &= (1 << bitCount) - 1;
    }
  }
  if (accumulator !== 0) return null;
  return Uint8Array.from(bytes);
}

function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 0x1_0000_0000;
  };
}

export class WorldModel {
  private world: MutableWorld;
  private revision = 0;
  private readonly undoHistory: MutableWorld[] = [];
  private readonly redoHistory: MutableWorld[] = [];
  private readonly features = new Map<string, CellFeature>();
  private dirtyCellIds: readonly string[] = [];

  constructor() {
    this.world = defaultWorld();
    this.refreshAllFeatures();
  }

  seedDefault(): void {
    this.replaceWorld(defaultWorld());
  }

  add(x: number, z: number, color: number, targetLevel?: number): boolean {
    if (
      !isInWorld(x, z)
      || !isValidColor(color)
      || (targetLevel !== undefined && (!Number.isInteger(targetLevel) || targetLevel < 1 || targetLevel > MAX_LEVELS))
    ) return false;
    const key = cellKey(x, z);
    const current = this.world.get(key);
    if (targetLevel === undefined && current === undefined) {
      this.recordCurrentForUndo();
      this.world.set(key, { x, z, foundation: true, foundationColor: color, storeys: new Map() });
    } else {
      const level = targetLevel ?? maxStorey(current!) + 1;
      if (level > MAX_LEVELS || current?.storeys.has(level)) return false;
      this.recordCurrentForUndo();
      const storeys = new Map(current?.storeys);
      storeys.set(level, color);
      this.world.set(key, {
        x,
        z,
        foundation: current?.foundation ?? false,
        foundationColor: current?.foundationColor ?? color,
        storeys,
      });
    }
    this.revision += 1;
    this.recomputeDirtyNeighborhood([key]);
    return true;
  }

  paint(x: number, z: number, color: number): boolean {
    return this.add(x, z, color);
  }

  remove(x: number, z: number, targetLevel?: number): boolean {
    if (!isInWorld(x, z)
      || (targetLevel !== undefined && (!Number.isInteger(targetLevel) || targetLevel < 1 || targetLevel > MAX_LEVELS))
    ) return false;
    const key = cellKey(x, z);
    const current = this.world.get(key);
    if (current === undefined) return false;
    const level = targetLevel ?? maxStorey(current);
    if (level > 0 && !current.storeys.has(level)) return false;
    if (level === 0 && !current.foundation) return false;

    this.recordCurrentForUndo();
    const storeys = new Map(current.storeys);
    if (level > 0) storeys.delete(level);
    const foundation = level === 0 ? false : current.foundation;
    if (!foundation && storeys.size === 0) this.world.delete(key);
    else this.world.set(key, { ...current, foundation, storeys });
    this.revision += 1;
    this.recomputeDirtyNeighborhood([key]);
    return true;
  }

  clear(): void {
    if (this.world.size > 0) this.replaceWorld(new Map());
  }

  randomTown(seed?: number): void {
    const normalizedSeed = seed === undefined
      ? Date.now() >>> 0
      : Number.isFinite(seed) ? Math.trunc(seed) >>> 0 : 0;
    const random = seededRandom(normalizedSeed);
    const next: MutableWorld = new Map();
    const rotation = Math.floor(random() * 4);
    const reflect = random() < 0.5;
    const transform = (sourceX: number, sourceZ: number): readonly [number, number] => {
      let x = reflect ? -sourceX : sourceX;
      let z = sourceZ;
      for (let turn = 0; turn < rotation; turn += 1) [x, z] = [-z, x];
      return [x, z];
    };

    for (let sourceX = -3; sourceX <= 3; sourceX += 1) {
      for (let sourceZ = -3; sourceZ <= 3; sourceZ += 1) {
        if (Math.abs(sourceX) + Math.abs(sourceZ) > 5) continue;
        if ((sourceX === 0 && sourceZ <= 1) || (sourceX === 1 && sourceZ === 1)) continue;
        const [x, z] = transform(sourceX, sourceZ);
        if (!isInWorld(x, z)) continue;
        const level = Math.min(MAX_LEVELS, 1 + Math.floor(random() * 3));
        const color = Math.floor(random() * PALETTE.length);
        const storeys = new Map<number, number>();
        for (let storey = 1; storey <= level; storey += 1) storeys.set(storey, color);
        next.set(cellKey(x, z), { x, z, foundation: true, foundationColor: color, storeys });
      }
    }
    this.replaceWorld(next);
  }

  snapshot(): WorldSnapshot {
    const cells = [...this.world.values()].sort(compareCells).map((cell): CellState => ({
      id: cellKey(cell.x, cell.z),
      x: cell.x,
      z: cell.z,
      foundation: cell.foundation,
      level: maxStorey(cell),
      color: cellColor(cell),
      storeys: [...cell.storeys].sort(([left], [right]) => left - right).map(([level, color]) => ({ level, color })),
    }));
    const features = cells.map((cell) => this.features.get(cell.id)).filter(
      (feature): feature is CellFeature => feature !== undefined,
    );
    return { cells, features, revision: this.revision };
  }

  getCell(x: number, z: number): CellState | undefined {
    if (!isInWorld(x, z)) return undefined;
    const cell = this.world.get(cellKey(x, z));
    if (cell === undefined) return undefined;
    return {
      id: cellKey(x, z),
      x,
      z,
      foundation: cell.foundation,
      level: maxStorey(cell),
      color: cellColor(cell),
      storeys: [...cell.storeys].sort(([left], [right]) => left - right).map(([level, color]) => ({ level, color })),
    };
  }

  getHeight(x: number, z: number): number {
    return this.getCell(x, z)?.level ?? 0;
  }

  getDirtyCellIds(): readonly string[] {
    return this.dirtyCellIds;
  }

  recomputeDirtyNeighborhood(changed: Iterable<string>): readonly string[] {
    const dirty = new Set<string>();
    for (const key of changed) {
      const position = coordinates(key);
      if (position === null) continue;
      dirty.add(key);
      for (const [, dx, dz] of DIRECTIONS) dirty.add(cellKey(position[0] + dx, position[1] + dz));
    }
    const ordered = [...dirty].sort(compareKeys);
    for (const key of ordered) {
      const cell = this.world.get(key);
      if (cell === undefined) this.features.delete(key);
      else this.features.set(key, this.deriveFeature(cell));
    }
    this.dirtyCellIds = ordered;
    return ordered;
  }

  canUndo(): boolean {
    return this.undoHistory.length > 0;
  }

  canRedo(): boolean {
    return this.redoHistory.length > 0;
  }

  undo(): boolean {
    const previous = this.undoHistory.pop();
    if (previous === undefined) return false;
    const changed = changedKeys(this.world, previous);
    this.redoHistory.push(this.world);
    this.world = previous;
    this.revision += 1;
    this.recomputeDirtyNeighborhood(changed);
    return true;
  }

  redo(): boolean {
    const next = this.redoHistory.pop();
    if (next === undefined) return false;
    const changed = changedKeys(this.world, next);
    this.undoHistory.push(this.world);
    this.world = next;
    this.revision += 1;
    this.recomputeDirtyNeighborhood(changed);
    return true;
  }

  serialize(): string {
    const cells = [...this.world.values()].sort(compareCells);
    const byteLength = 5 + cells.reduce((length, cell) => length + 5 + cell.storeys.size, 0);
    const bytes = new Uint8Array(byteLength);
    bytes[0] = SERIALIZATION_MAGIC[0];
    bytes[1] = SERIALIZATION_MAGIC[1];
    bytes[2] = SERIALIZATION_VERSION;
    bytes[3] = 0xff;
    bytes[4] = cells.length;
    let offset = 5;
    for (const cell of cells) {
      let mask = 0;
      for (const level of cell.storeys.keys()) mask |= 1 << (level - 1);
      bytes[offset++] = cell.x + WORLD_RADIUS;
      bytes[offset++] = cell.z + WORLD_RADIUS;
      bytes[offset++] = cell.foundation ? 1 : 0;
      bytes[offset++] = cell.foundationColor;
      bytes[offset++] = mask;
      for (let level = 1; level <= MAX_LEVELS; level += 1) {
        const color = cell.storeys.get(level);
        if (color !== undefined) bytes[offset++] = color;
      }
    }
    return encodeBase64Url(bytes);
  }

  deserialize(encoded: string, recordHistory = true): boolean {
    if (typeof encoded !== "string") return false;
    const bytes = decodeBase64Url(encoded);
    if (
      bytes === null
      || bytes.length < 5
      || bytes[0] !== SERIALIZATION_MAGIC[0]
      || bytes[1] !== SERIALIZATION_MAGIC[1]
      || (bytes[2] !== 2 && bytes[2] !== SERIALIZATION_VERSION)
    ) return false;

    const version = bytes[2];

    const next: MutableWorld = new Map();
    if (version === SERIALIZATION_VERSION && bytes[3] === 0xff) {
      const count = bytes[4] ?? 0;
      let offset = 5;
      for (let index = 0; index < count; index += 1) {
        if (offset + 5 > bytes.length) return false;
        const x = (bytes[offset++] ?? 0) - WORLD_RADIUS;
        const z = (bytes[offset++] ?? 0) - WORLD_RADIUS;
        const foundationByte = bytes[offset++];
        const foundationColor = bytes[offset++];
        const mask = bytes[offset++];
        if (
          !isInWorld(x, z)
          || (foundationByte !== 0 && foundationByte !== 1)
          || foundationColor === undefined
          || !isValidColor(foundationColor)
          || mask === undefined
          || (mask >>> MAX_LEVELS) !== 0
        ) return false;
        const storeys = new Map<number, number>();
        for (let level = 1; level <= MAX_LEVELS; level += 1) {
          if ((mask & (1 << (level - 1))) === 0) continue;
          const color = bytes[offset++];
          if (color === undefined || !isValidColor(color)) return false;
          storeys.set(level, color);
        }
        if (foundationByte === 0 && storeys.size === 0) return false;
        const key = cellKey(x, z);
        if (next.has(key)) return false;
        next.set(key, { x, z, foundation: foundationByte === 1, foundationColor, storeys });
      }
      if (offset !== bytes.length) return false;
    } else if (version === 2) {
      const count = ((bytes[3] ?? 0) << 8) | (bytes[4] ?? 0);
      if (bytes.length !== 5 + count * 5) return false;
      let offset = 5;
      for (let index = 0; index < count; index += 1) {
        const x = (bytes[offset++] ?? 0) - WORLD_RADIUS;
        const z = (bytes[offset++] ?? 0) - WORLD_RADIUS;
        const foundation = bytes[offset++];
        const level = bytes[offset++];
        const color = bytes[offset++];
        if (
          foundation !== 1
          || !isInWorld(x, z)
          || level === undefined
          || level > MAX_LEVELS
          || color === undefined
          || !isValidColor(color)
        ) return false;
        const key = cellKey(x, z);
        if (next.has(key)) return false;
        const storeys = new Map<number, number>();
        for (let storey = 1; storey <= level; storey += 1) storeys.set(storey, color);
        next.set(key, { x, z, foundation: true, foundationColor: color, storeys });
      }
    } else {
      return false;
    }
    this.replaceWorld(next, recordHistory);
    return true;
  }

  private deriveFeature(cell: MutableCell): CellFeature {
    const level = maxStorey(cell);
    const neighbors: Partial<Record<Direction, string>> = {};
    const supportedNeighbors = new Set<Direction>();
    const exposed = {} as Record<Direction, boolean>;
    for (const [direction, dx, dz] of DIRECTIONS) {
      const neighbor = this.world.get(cellKey(cell.x + dx, cell.z + dz));
      if (neighbor !== undefined) {
        neighbors[direction] = cellKey(neighbor.x, neighbor.z);
        if (neighbor.foundation) supportedNeighbors.add(direction);
      }
      exposed[direction] = level === 0
        ? neighbor?.foundation !== true
        : neighbor?.storeys.has(level) !== true;
    }
    const foundationNeighborCount = supportedNeighbors.size;
    const northSouth = supportedNeighbors.has("north") && supportedNeighbors.has("south");
    const eastWest = supportedNeighbors.has("east") && supportedNeighbors.has("west");
    let kind: CellFeature["kind"] = level === 0 ? "foundation" : "house";
    let bridgeSpan: readonly [Direction, Direction] | undefined;
    if (level === 0 && foundationNeighborCount >= 3) kind = "courtyard";
    else if (
      level === 0
      && northSouth
      && !supportedNeighbors.has("east")
      && !supportedNeighbors.has("west")
    ) {
      kind = "bridge";
      bridgeSpan = ["north", "south"];
    } else if (
      level === 0
      && eastWest
      && !supportedNeighbors.has("north")
      && !supportedNeighbors.has("south")
    ) {
      kind = "bridge";
      bridgeSpan = ["east", "west"];
    }

    return {
      id: cellKey(cell.x, cell.z),
      kind,
      level,
      color: cellColor(cell),
      storeys: [...cell.storeys].sort(([left], [right]) => left - right).map(([storeyLevel, color]) => ({
        level: storeyLevel,
        color,
      })),
      neighbors,
      exposed,
      bridgeSpan,
    };
  }

  private recordCurrentForUndo(): void {
    this.undoHistory.push(cloneWorld(this.world));
    this.redoHistory.length = 0;
  }

  private replaceWorld(next: MutableWorld, recordHistory = true): boolean {
    if (worldsEqual(this.world, next)) return false;
    const changed = changedKeys(this.world, next);
    if (recordHistory) this.undoHistory.push(this.world);
    else {
      this.undoHistory.length = 0;
      this.redoHistory.length = 0;
    }
    this.redoHistory.length = 0;
    this.world = next;
    this.revision += 1;
    this.recomputeDirtyNeighborhood(changed);
    return true;
  }

  private refreshAllFeatures(): void {
    this.features.clear();
    const keys = [...this.world.keys()].sort(compareKeys);
    for (const key of keys) {
      const cell = this.world.get(key);
      if (cell !== undefined) this.features.set(key, this.deriveFeature(cell));
    }
    this.dirtyCellIds = keys;
  }
}
