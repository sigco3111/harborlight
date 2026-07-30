import * as THREE from "three";
import { Water } from "three/addons/objects/Water.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { SSAOPass } from "three/addons/postprocessing/SSAOPass.js";
import {
  CELL_SIZE,
  FEATURE_TUNING,
  LEVEL_HEIGHT,
  MATERIAL_COLORS,
  MATERIAL_TUNING,
  PALETTE,
  WATER_LEVEL,
  WATER_EFFECT_TUNING,
  WORLD_RADIUS,
} from "./config";
import type { CellFeature, CellPick, CellState, WorldSnapshot } from "./types";

type PickObject = THREE.Object3D & { userData: { cellPick?: CellPick } };
type EdgeName = "north" | "east" | "south" | "west";
type EdgeMask = Record<EdgeName, boolean>;
type Point2 = readonly [x: number, z: number];
type Vertex3 = readonly [x: number, y: number, z: number];

const EDGE_NAMES: readonly EdgeName[] = ["north", "east", "south", "west"];
const ALL_EDGES: EdgeMask = { north: true, east: true, south: true, west: true };

const INK = MATERIAL_COLORS.ink;
const WATER_COLOR = MATERIAL_COLORS.water;
const BUILDING_BASE = FEATURE_TUNING.foundationHeight;
const UP = new THREE.Vector3(0, 1, 0);

function hash(x: number, z: number, level = 0): number {
  let value = Math.imul(x | 0, 374761393) ^ Math.imul(z | 0, 668265263) ^ Math.imul(level | 0, 1442695041);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
}

function tint(hex: number, amount: number): THREE.Color {
  const color = new THREE.Color(hex);
  color.offsetHSL(0, 0, amount);
  return color;
}
function paint(hex: number, saturation: number, lightness: number): THREE.Color {
  const color = new THREE.Color(hex);
  color.offsetHSL(0, saturation, lightness);
  return color;
}

function makeSkyGradientTexture(): THREE.CanvasTexture {
  const width = 128;
  const height = 512;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (context) {
    const color = (hex: number): string => `#${hex.toString(16).padStart(6, "0")}`;
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, color(MATERIAL_COLORS.skyZenith));
    gradient.addColorStop(0.44, color(MATERIAL_COLORS.sky));
    gradient.addColorStop(0.76, color(MATERIAL_COLORS.skyHorizon));
    gradient.addColorStop(1, color(MATERIAL_COLORS.fog));
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    const image = context.getImageData(0, 0, width, height);
    for (let pixel = 0; pixel < width * height; pixel += 1) {
      const x = pixel % width;
      const y = Math.floor(pixel / width);
      const dither = ((x * 17 + y * 31 + (x ^ y) * 7) % 3) - 1;
      const offset = pixel * 4;
      image.data[offset] = Math.max(0, Math.min(255, image.data[offset]! + dither));
      image.data[offset + 1] = Math.max(0, Math.min(255, image.data[offset + 1]! + dither));
      image.data[offset + 2] = Math.max(0, Math.min(255, image.data[offset + 2]! + dither));
    }
    context.putImageData(image, 0, 0);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}


function makeNoiseTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 96;
  const context = canvas.getContext("2d");
  if (context) {
    context.fillStyle = "#f2f2ed";
    context.fillRect(0, 0, 96, 96);
    const image = context.getImageData(0, 0, 96, 96);
    for (let index = 0; index < image.data.length; index += 4) {
      const pixel = index / 4;
      const x = pixel % 96;
      const y = Math.floor(pixel / 96);
      const broad = Math.sin(x * 0.075) * 4.5
        + Math.cos(y * 0.09) * 3.8
        + Math.sin((x + y) * 0.045) * 2.4;
      const noise = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      const grain = ((noise - Math.floor(noise)) * 2 - 1) * 1.8;
      const value = Math.max(226, Math.min(255, Math.round(242 + broad * 1.25 + grain)));
      image.data[index] = value;
      image.data[index + 1] = value;
      image.data[index + 2] = Math.min(255, value + 1);
      image.data[index + 3] = 255;
    }
    context.putImageData(image, 0, 0);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.15, 1.15);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function makeFoamTexture(): THREE.DataTexture {
  const width = 64;
  const height = 16;
  const data = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    const across = Math.sin((y / (height - 1)) * Math.PI) ** 1.7;
    for (let x = 0; x < width; x += 1) {
      const along = Math.sin((x / (width - 1)) * Math.PI) ** 0.28;
      const value = Math.round(255 * across * along);
      const offset = (y * width + x) * 4;
      data[offset] = value;
      data[offset + 1] = value;
      data[offset + 2] = value;
      data[offset + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.minFilter = texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

function makeWaterNormals(size: number): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = (x / size) * Math.PI * 2;
      const v = (y / size) * Math.PI * 2;
      const broadA = u + v * 0.28;
      const broadB = v * 0.72 - u * 0.18;
      const cross = (u + v) * 1.55;
      const nx = Math.cos(broadA) * 0.105 - Math.cos(broadB) * 0.018 + Math.cos(cross) * 0.025;
      const ny = Math.cos(broadA) * 0.029 + Math.cos(broadB) * 0.085 + Math.cos(cross) * 0.025;
      const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
      const offset = (y * size + x) * 4;
      data[offset] = Math.round((nx * 0.5 + 0.5) * 255);
      data[offset + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      data[offset + 2] = Math.round(nz * 255);
      data[offset + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}
function latticeVertex(ix: number, iz: number): Point2 {
  const amount = CELL_SIZE * FEATURE_TUNING.footprintJitter;
  const x = ix * 0.5 * CELL_SIZE + (hash(ix, iz, 301) - 0.5) * amount;
  const z = iz * 0.5 * CELL_SIZE + (hash(ix, iz, 911) - 0.5) * amount;
  return [x, z];
}

function cellPolygon(x: number, z: number, local = true): readonly Point2[] {
  const centerX = x * CELL_SIZE;
  const centerZ = z * CELL_SIZE;
  const points = [
    latticeVertex(x * 2 - 1, z * 2 - 1),
    latticeVertex(x * 2 + 1, z * 2 - 1),
    latticeVertex(x * 2 + 1, z * 2 + 1),
    latticeVertex(x * 2 - 1, z * 2 + 1),
  ] as const;
  return local ? points.map(([px, pz]) => [px - centerX, pz - centerZ] as const) : points;
}

export function findTerminalSupportIds(features: ReadonlyMap<string, CellFeature>): Set<string> {
  const result = new Set<string>();
  const visited = new Set<string>();
  const axes: readonly [readonly [EdgeName, EdgeName], string][] = [
    [["west", "east"], "x"],
    [["north", "south"], "z"],
  ];
  for (const feature of features.values()) {
    if (feature.kind !== "house" || feature.level <= 1) continue;
    for (const [[backward, forward], axis] of axes) {
      const visitKey = `${axis}:${feature.id}`;
      if (visited.has(visitKey)) continue;
      let start = feature;
      const seenBackward = new Set<string>();
      while (!seenBackward.has(start.id)) {
        seenBackward.add(start.id);
        const previousId = start.neighbors[backward];
        const previous = previousId ? features.get(previousId) : undefined;
        if (previous?.kind !== "house" || previous.level !== feature.level) break;
        start = previous;
      }
      const run: CellFeature[] = [];
      const seenForward = new Set<string>();
      let current: CellFeature | undefined = start;
      while (current && !seenForward.has(current.id)) {
        seenForward.add(current.id);
        visited.add(`${axis}:${current.id}`);
        run.push(current);
        const nextId: string | undefined = current.neighbors[forward];
        const next: CellFeature | undefined = nextId ? features.get(nextId) : undefined;
        current = next?.kind === "house" && next.level === feature.level ? next : undefined;
      }
      if (run.length < 4) continue;
      for (const endpoint of [run[0]!, run[run.length - 1]!]) {
        const sameHeightNeighbors = EDGE_NAMES.filter((edge) => {
          const neighborId = endpoint.neighbors[edge];
          const neighbor = neighborId ? features.get(neighborId) : undefined;
          return neighbor?.kind === "house" && neighbor.level === endpoint.level;
        }).length;
        if (sameHeightNeighbors === 1) result.add(endpoint.id);
      }
    }
  }
  return result;
}

export function neighborRenderSignature(
  neighborId: string | undefined,
  feature: CellFeature | undefined,
  cell: CellState | undefined,
): string {
  const storeys = cell?.storeys.map((storey) => `${storey.level}:${storey.color}`).join(",") ?? "";
  return `${neighborId ?? ""}:${feature?.kind ?? "water"}:${feature?.level ?? 0}:${Number(cell?.foundation ?? false)}:${storeys}`;
}

export function hasImmediateUpperStorey(cell: CellState | undefined, storeyLevel: number): boolean {
  return cell?.storeys.some((candidate) => candidate.level === storeyLevel + 1) ?? false;
}

function polygonCenter(points: readonly Point2[]): Point2 {
  let x = 0;
  let z = 0;
  for (const point of points) {
    x += point[0];
    z += point[1];
  }
  return [x / points.length, z / points.length];
}

function insetPolygon(points: readonly Point2[], amount: number): readonly Point2[] {
  const center = polygonCenter(points);
  return points.map(([x, z]) => {
    const dx = center[0] - x;
    const dz = center[1] - z;
    const length = Math.hypot(dx, dz);
    return [x + (dx / length) * amount, z + (dz / length) * amount] as const;
  });
}

function insetPolygonEdges(points: readonly Point2[], amount: number, edges: EdgeMask): readonly Point2[] {
  if (amount === 0 || points.length < 3) return points;
  const lines = points.map((point, index) => {
    const next = points[(index + 1) % points.length]!;
    const dx = next[0] - point[0];
    const dz = next[1] - point[1];
    const length = Math.hypot(dx, dz) || 1;
    const edge = EDGE_NAMES[index]!;
    const offset = edges[edge] ? amount : 0;
    return {
      point: [point[0] - (dz / length) * offset, point[1] + (dx / length) * offset] as const,
      direction: [dx, dz] as const,
    };
  });
  const cross = (left: Point2, right: Point2): number => left[0] * right[1] - left[1] * right[0];
  return points.map((_point, index) => {
    const previous = lines[(index + points.length - 1) % points.length]!;
    const current = lines[index]!;
    const denominator = cross(previous.direction, current.direction);
    if (Math.abs(denominator) < 0.000001) return points[index]!;
    const delta: Point2 = [current.point[0] - previous.point[0], current.point[1] - previous.point[1]];
    const distance = cross(delta, current.direction) / denominator;
    return [
      previous.point[0] + previous.direction[0] * distance,
      previous.point[1] + previous.direction[1] * distance,
    ] as const;
  });
}

function polygonPrismGeometry(
  points: readonly Point2[],
  height: number,
  edges?: EdgeMask,
  bevel = 0.055,
  batter = 0,
): THREE.BufferGeometry {
  const positions: number[] = [];
  const bottom = batter > 0 ? insetPolygonEdges(points, -batter, edges ?? ALL_EDGES) : points;
  const uvs: number[] = [];
  const top = bevel > 0 ? insetPolygonEdges(points, bevel, edges ?? ALL_EDGES) : points;
  const shoulderY = Math.max(0, height - bevel);
  const addTriangle = (a: Vertex3, b: Vertex3, c: Vertex3): void => {
    for (const vertex of [a, b, c]) {
      positions.push(...vertex);
      uvs.push((vertex[0] + vertex[2]) * 0.28, vertex[1] * 0.45 + vertex[2] * 0.08);
    }
  };
  addTriangle([top[0]![0], height, top[0]![1]], [top[2]![0], height, top[2]![1]], [top[1]![0], height, top[1]![1]]);
  addTriangle([top[0]![0], height, top[0]![1]], [top[3]![0], height, top[3]![1]], [top[2]![0], height, top[2]![1]]);
  EDGE_NAMES.forEach((name, index) => {
    const next = (index + 1) % 4;
    const a = points[index]!;
    const b = points[next]!;
    const bottomA = bottom[index]!;
    const bottomB = bottom[next]!;
    const ta = top[index]!;
    const tb = top[next]!;
    if (!edges || edges[name]) {
      addTriangle([bottomA[0], 0, bottomA[1]], [b[0], shoulderY, b[1]], [bottomB[0], 0, bottomB[1]]);
      addTriangle([bottomA[0], 0, bottomA[1]], [a[0], shoulderY, a[1]], [b[0], shoulderY, b[1]]);
    }
    addTriangle([a[0], shoulderY, a[1]], [tb[0], height, tb[1]], [b[0], shoulderY, b[1]]);
    addTriangle([a[0], shoulderY, a[1]], [ta[0], height, ta[1]], [tb[0], height, tb[1]]);
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  return geometry;
}
function smoothPolygon(points: readonly Point2[]): readonly Point2[] {
  const smoothed: Point2[] = [];
  for (let index = 0; index < points.length; index += 1) {
    const a = points[index]!;
    const b = points[(index + 1) % points.length]!;
    smoothed.push([
      a[0] * 0.75 + b[0] * 0.25,
      a[1] * 0.75 + b[1] * 0.25,
    ]);
    smoothed.push([
      a[0] * 0.25 + b[0] * 0.75,
      a[1] * 0.25 + b[1] * 0.75,
    ]);
  }
  return smoothed;
}

function polygonPrismGeometryN(
  points: readonly Point2[],
  height: number,
  bevel = 0.12,
  batter = 0.2,
): THREE.BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const bottom = insetPolygon(points, -batter);
  const top = insetPolygon(points, bevel);
  const shoulderY = Math.max(0, height - bevel);
  const addTriangle = (a: Vertex3, b: Vertex3, c: Vertex3): void => {
    for (const vertex of [a, b, c]) {
      positions.push(...vertex);
      uvs.push((vertex[0] + vertex[2]) * 0.28, vertex[1] * 0.45 + vertex[2] * 0.08);
    }
  };
  const topTriangles = THREE.ShapeUtils.triangulateShape(
    top.map(([x, z]) => new THREE.Vector2(x, z)),
    [],
  );
  for (const [a, b, c] of topTriangles) {
    const topA = top[a ?? 0]!;
    const topB = top[b ?? 0]!;
    const topC = top[c ?? 0]!;
    addTriangle(
      [topA[0], height, topA[1]],
      [topC[0], height, topC[1]],
      [topB[0], height, topB[1]],
    );
  }
  for (let index = 0; index < points.length; index += 1) {
    const next = (index + 1) % points.length;
    const a = points[index]!;
    const b = points[next]!;
    const bottomA = bottom[index]!;
    const bottomB = bottom[next]!;
    const topA = top[index]!;
    const topB = top[next]!;
    addTriangle([bottomA[0], 0, bottomA[1]], [bottomB[0], 0, bottomB[1]], [b[0], shoulderY, b[1]]);
    addTriangle([bottomA[0], 0, bottomA[1]], [b[0], shoulderY, b[1]], [a[0], shoulderY, a[1]]);
    addTriangle([a[0], shoulderY, a[1]], [b[0], shoulderY, b[1]], [topB[0], height, topB[1]]);
    addTriangle([a[0], shoulderY, a[1]], [topB[0], height, topB[1]], [topA[0], height, topA[1]]);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  return geometry;
}

function polygonSkirtGeometry(points: readonly Point2[], height: number): THREE.BufferGeometry {
  const positions: number[] = [];
  for (let index = 0; index < points.length; index += 1) {
    const a = points[index]!;
    const b = points[(index + 1) % points.length]!;
    positions.push(
      a[0], 0, a[1],
      b[0], 0, b[1],
      b[0], height, b[1],
      a[0], 0, a[1],
      b[0], height, b[1],
      a[0], height, a[1],
    );
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
}
function roundedBodyGeometry(width: number, depth: number, height: number, seed: number): THREE.BufferGeometry {
  const halfWidth = width * 0.5;
  const halfDepth = depth * 0.5;
  const radius = Math.min(halfWidth, halfDepth, 0.09 + seed * 0.035);
  const shape = new THREE.Shape();
  shape.moveTo(-halfWidth + radius, -halfDepth);
  shape.lineTo(halfWidth - radius, -halfDepth);
  shape.quadraticCurveTo(halfWidth, -halfDepth, halfWidth, -halfDepth + radius);
  shape.lineTo(halfWidth, halfDepth - radius);
  shape.quadraticCurveTo(halfWidth, halfDepth, halfWidth - radius, halfDepth);
  shape.lineTo(-halfWidth + radius, halfDepth);
  shape.quadraticCurveTo(-halfWidth, halfDepth, -halfWidth, halfDepth - radius);
  shape.lineTo(-halfWidth, -halfDepth + radius);
  shape.quadraticCurveTo(-halfWidth, -halfDepth, -halfWidth + radius, -halfDepth);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    steps: 1,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.035,
    bevelThickness: 0.025,
    curveSegments: 3,
  });
  geometry.rotateX(-Math.PI / 2);
  geometry.computeVertexNormals();
  return geometry;
}
function roundedIslandGeometry(points: readonly Point2[], height: number): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const first = points[0]!;
  shape.moveTo(first[0], -first[1]);
  for (const [x, z] of points.slice(1)) shape.lineTo(x, -z);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    steps: 1,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.16,
    bevelThickness: 0.16,
    curveSegments: 3,
  });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

function polygonRingGeometry(
  outer: readonly Point2[],
  inner: readonly Point2[],
  y: number,
): THREE.BufferGeometry {
  const positions: number[] = [];
  for (let index = 0; index < outer.length; index += 1) {
    const next = (index + 1) % outer.length;
    const outerA = outer[index]!;
    const outerB = outer[next]!;
    const innerA = inner[index]!;
    const innerB = inner[next]!;
    positions.push(
      outerA[0], y, outerA[1],
      outerB[0], y, outerB[1],
      innerB[0], y, innerB[1],
      outerA[0], y, outerA[1],
      innerB[0], y, innerB[1],
      innerA[0], y, innerA[1],
    );
  }
  return new THREE.BufferGeometry().setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
}
function roofGeometry(points: readonly Point2[], height: number, gableAxis: "x" | "z" | null): THREE.BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const push = (...vertices: Vertex3[]): void => {
    for (const vertex of vertices) {
      positions.push(...vertex);
      uvs.push((vertex[0] + vertex[2]) * 0.3, vertex[1] * 0.5 + vertex[2] * 0.1);
    }
  };
  if (!gableAxis) {
    const center = polygonCenter(points);
    for (let index = 0; index < 4; index += 1) {
      const a = points[index]!;
      const b = points[(index + 1) % 4]!;
      push([a[0], 0, a[1]], [center[0], height, center[1]], [b[0], 0, b[1]]);
    }
  } else {
    const a = gableAxis === "x" ? polygonCenter([points[0]!, points[3]!]) : polygonCenter([points[0]!, points[1]!]);
    const b = gableAxis === "x" ? polygonCenter([points[1]!, points[2]!]) : polygonCenter([points[3]!, points[2]!]);
    const ridgeA: readonly [number, number, number] = [a[0], height, a[1]];
    const ridgeB: readonly [number, number, number] = [b[0], height, b[1]];
    if (gableAxis === "x") {
      push([points[0]![0], 0, points[0]![1]], ridgeA, ridgeB, [points[0]![0], 0, points[0]![1]], ridgeB, [points[1]![0], 0, points[1]![1]]);
      push([points[3]![0], 0, points[3]![1]], [points[2]![0], 0, points[2]![1]], ridgeB, [points[3]![0], 0, points[3]![1]], ridgeB, ridgeA);
      push([points[0]![0], 0, points[0]![1]], [points[3]![0], 0, points[3]![1]], ridgeA);
      push([points[1]![0], 0, points[1]![1]], ridgeB, [points[2]![0], 0, points[2]![1]]);
    } else {
      push([points[0]![0], 0, points[0]![1]], [points[3]![0], 0, points[3]![1]], ridgeB, [points[0]![0], 0, points[0]![1]], ridgeB, ridgeA);
      push([points[1]![0], 0, points[1]![1]], ridgeA, ridgeB, [points[1]![0], 0, points[1]![1]], ridgeB, [points[2]![0], 0, points[2]![1]]);
      push([points[0]![0], 0, points[0]![1]], ridgeA, [points[1]![0], 0, points[1]![1]]);
      push([points[3]![0], 0, points[3]![1]], [points[2]![0], 0, points[2]![1]], ridgeB);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  return geometry;
}

function leanToRoofGeometry(
  points: readonly Point2[],
  height: number,
  higherNeighbors: EdgeMask,
): THREE.BufferGeometry {
  const vertexEdges: readonly (readonly [EdgeName, EdgeName])[] = [
    ["west", "north"],
    ["north", "east"],
    ["east", "south"],
    ["south", "west"],
  ];
  const heights = vertexEdges.map(([first, second]) => (
    higherNeighbors[first] || higherNeighbors[second] ? height : 0.045
  ));
  const center = polygonCenter(points);
  const centerHeight = heights.reduce((sum, value) => sum + value, 0) / heights.length;
  const positions: number[] = [];
  const uvs: number[] = [];
  const push = (...vertices: Vertex3[]): void => {
    for (const vertex of vertices) {
      positions.push(...vertex);
      uvs.push((vertex[0] + vertex[2]) * 0.3, vertex[1] * 0.55 + vertex[2] * 0.1);
    }
  };
  for (let index = 0; index < points.length; index += 1) {
    const next = (index + 1) % points.length;
    const a = points[index]!;
    const b = points[next]!;
    const aHeight = heights[index]!;
    const bHeight = heights[next]!;
    push(
      [a[0], aHeight, a[1]],
      [center[0], centerHeight, center[1]],
      [b[0], bHeight, b[1]],
    );
    push(
      [a[0], -0.08, a[1]],
      [b[0], -0.08, b[1]],
      [b[0], bHeight, b[1]],
      [a[0], -0.08, a[1]],
      [b[0], bHeight, b[1]],
      [a[0], aHeight, a[1]],
    );
  }
  const underside = Math.min(...heights) - 0.08;
  for (let index = 1; index < points.length - 1; index += 1) {
    const a = points[0]!;
    const b = points[index]!;
    const c = points[index + 1]!;
    push([a[0], underside, a[1]], [c[0], underside, c[1]], [b[0], underside, b[1]]);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  return geometry;
}

function pointInPolygon(x: number, z: number, points: readonly Point2[]): boolean {
  let inside = false;
  for (let index = 0, previous = points.length - 1; index < points.length; previous = index, index += 1) {
    const a = points[index]!;
    const b = points[previous]!;
    if ((a[1] > z) !== (b[1] > z) && x < ((b[0] - a[0]) * (z - a[1])) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}
function disposeTree(root: THREE.Object3D): void {
  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const materials = Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : [];
    for (const material of materials) material.dispose();
  });
}


function makeScreenSpaceReflectionMaterial(
  reflectionMap: THREE.Texture,
  targetSize: number,
): THREE.ShaderMaterial {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      reflectionMap: { value: reflectionMap },
      viewportWidth: { value: 1 },
      texelSize: { value: new THREE.Vector2(1 / targetSize, 1 / targetSize) },
      time: { value: 0 },
      viewportHeight: { value: 1 },
      fadeNear: { value: 0.44 },
      fadeFar: { value: 0.35 },
    },
    vertexShader: `
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D reflectionMap;
      uniform vec2 texelSize;
      uniform float time;
      uniform float viewportHeight;
      uniform float viewportWidth;
      uniform float fadeNear;
      uniform float fadeFar;

      void main() {
        vec2 screenUv = gl_FragCoord.xy / vec2(
          max(viewportWidth, 1.0),
          max(viewportHeight, 1.0)
        );
        vec2 projectedUv = vec2(screenUv.x, fadeNear * 2.0 - screenUv.y);
        if (
          projectedUv.x <= 0.0 || projectedUv.x >= 1.0
          || projectedUv.y <= 0.0 || projectedUv.y >= 1.0
        ) discard;

        float lateralRipple =
          sin(gl_FragCoord.y * 0.095 + time * 1.0) * 0.28
          + sin(gl_FragCoord.y * 0.041 - gl_FragCoord.x * 0.014 - time * 0.72) * 0.12;
        float verticalRipple =
          sin(gl_FragCoord.x * 0.068 + time * 0.64) * 0.22
          + sin((gl_FragCoord.x + gl_FragCoord.y) * 0.023 - time * 0.48) * 0.1;
        vec2 uv = projectedUv + texelSize * vec2(
          lateralRipple * 4.2 + sin(gl_FragCoord.y * 0.034 - time * 0.7) * 1.1,
          verticalRipple * 0.65
        );
        vec2 blurX = vec2(texelSize.x * 2.8, 0.0);
        vec2 blurFarX = vec2(texelSize.x * 6.0, 0.0);
        vec2 blurY = vec2(0.0, texelSize.y * 1.2);
        vec2 blurDiagonal = vec2(texelSize.x * 3.6, texelSize.y * 0.8);
        vec4 reflected =
          texture2D(reflectionMap, uv) * 0.38
          + texture2D(reflectionMap, uv + blurX) * 0.13
          + texture2D(reflectionMap, uv - blurX) * 0.13
          + texture2D(reflectionMap, uv + blurFarX) * 0.07
          + texture2D(reflectionMap, uv - blurFarX) * 0.07
          + texture2D(reflectionMap, uv + blurY) * 0.08
          + texture2D(reflectionMap, uv - blurY) * 0.08
          + texture2D(reflectionMap, uv + blurDiagonal) * 0.03
          + texture2D(reflectionMap, uv - blurDiagonal) * 0.03;
        float rippleBand = 0.92 + 0.08 * smoothstep(
          -0.38,
          0.48,
          sin(gl_FragCoord.y * 0.21 + gl_FragCoord.x * 0.018 - time * 1.8)
        );
        float fineBand = 0.96 + 0.04 * smoothstep(
          -0.42,
          0.48,
          sin(gl_FragCoord.y * 0.37 - gl_FragCoord.x * 0.025 + time * 2.3)
        );
        float screenY = gl_FragCoord.y / max(viewportHeight, 1.0);
        float screenFade = pow(smoothstep(fadeFar, fadeNear, screenY), 0.68)
          * (1.0 - smoothstep(fadeNear - 0.004, fadeNear + 0.008, screenY));
        float contact = smoothstep(fadeNear - 0.025, fadeNear + 0.015, screenY);
        float alpha = reflected.a * 0.54 * (0.82 + contact * 0.18) * rippleBand * fineBand * screenFade;
        if (alpha < 0.012) discard;
        vec3 sourceColor = reflected.rgb / max(reflected.a, 0.001);
        vec3 reflectedColor = mix(sourceColor, vec3(0.34, 0.64, 0.66), 0.1);
        reflectedColor *= mix(1.08, 1.14, contact);
        gl_FragColor = vec4(reflectedColor, alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }
    `,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    side: THREE.DoubleSide,
  });
  material.toneMapped = true;
  return material;
}


function makeWaterGridGeometry(): THREE.BufferGeometry {
  const positions: number[] = [];
  const edges = new Set<string>();
  const appendSegment = (a: Point2, b: Point2): void => {
    positions.push(a[0], 0, a[1], b[0], 0, b[1]);
  };
  const appendEdge = (aX: number, aZ: number, bX: number, bZ: number): void => {
    const aKey = `${aX},${aZ}`;
    const bKey = `${bX},${bZ}`;
    const key = aKey < bKey ? `${aKey}:${bKey}` : `${bKey}:${aKey}`;
    if (edges.has(key)) return;
    edges.add(key);
    appendSegment(latticeVertex(aX, aZ), latticeVertex(bX, bZ));
  };

  for (let z = -WORLD_RADIUS; z <= WORLD_RADIUS; z += 1) {
    for (let x = -WORLD_RADIUS; x <= WORLD_RADIUS; x += 1) {
      if (x * x + z * z > WORLD_RADIUS * WORLD_RADIUS) continue;
      const west = x * 2 - 1;
      const east = x * 2 + 1;
      const north = z * 2 - 1;
      const south = z * 2 + 1;
      appendEdge(west, north, east, north);
      appendEdge(east, north, east, south);
      appendEdge(east, south, west, south);
      appendEdge(west, south, west, north);

      const center = polygonCenter(cellPolygon(x, z, false));
      const halfCross = CELL_SIZE * 0.07;
      const angle = (hash(x, z, 1709) - 0.5) * 0.32;
      const alongX = Math.cos(angle) * halfCross;
      const alongZ = Math.sin(angle) * halfCross;
      const acrossX = -alongZ;
      const acrossZ = alongX;
      appendSegment(
        [center[0] - alongX, center[1] - alongZ],
        [center[0] + alongX, center[1] + alongZ],
      );
      appendSegment(
        [center[0] - acrossX, center[1] - acrossZ],
        [center[0] + acrossX, center[1] + acrossZ],
      );
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeBoundingSphere();
  return geometry;
}

export class TownRenderer {
  readonly scene = new THREE.Scene();
  readonly renderer: THREE.WebGLRenderer;
  readonly camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 600);

  private readonly composer: EffectComposer;
  private readonly ssaoPass: SSAOPass;
  private readonly outputPass: OutputPass;
  private readonly canvas: HTMLCanvasElement;
  private readonly raycaster = new THREE.Raycaster();
  private readonly pointer = new THREE.Vector2();
  private readonly skyGradientTexture = makeSkyGradientTexture();
  private readonly noiseTexture = makeNoiseTexture();
  private readonly foamTexture = makeFoamTexture();
  private readonly townRoot = new THREE.Group();
  private readonly islandFoundationRoot = new THREE.Group();
  private readonly hoverRoot = new THREE.Group();
  private readonly ambientWaterRoot = new THREE.Group();
  private readonly constructionEffectsRoot = new THREE.Group();
  private hoverSignature: string | null = null;
  private readonly pickTargets: THREE.Object3D[] = [];
  private readonly cellGroups = new Map<string, THREE.Group>();
  private readonly cellLevels = new Map<string, number>();
  private readonly cellKinds = new Map<string, CellPick["kind"]>();
  private readonly cellSignatures = new Map<string, string>();
  private readonly activeRevealGroups = new Set<THREE.Group>();
  private readonly activeRipples = new Set<THREE.Mesh>();
  private readonly activeSplashDrops = new Set<THREE.Mesh>();
  private readonly activeWaterEffects = new Set<THREE.Object3D>();
  private readonly swayingTrees = new Set<THREE.Group>();
  private readonly waterMaterial: THREE.ShaderMaterial;
  private readonly waterGeometry = new THREE.PlaneGeometry(1000, 1000, 96, 96);
  private readonly waterNormals = makeWaterNormals(256);
  private readonly water: Water;
  private readonly reflectionRenderTarget: THREE.WebGLRenderTarget;
  private readonly reflectionFadePoint = new THREE.Vector3();
  private readonly reflectionClearColor = new THREE.Color();
  private readonly reflectionOverlayMaterial: THREE.ShaderMaterial;
  private readonly reflectionOverlay: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  private readonly birds = new THREE.Group();
  private perchAnchors: THREE.Vector3[] = [];
  private readonly gridGeometry = makeWaterGridGeometry();
  private readonly gridMaterial = new THREE.LineBasicMaterial({
    color: tint(WATER_COLOR, -0.24),
    transparent: true,
    opacity: 0.26,
    depthTest: true,
    depthWrite: false,
    toneMapped: false,
  });
  private readonly grid = new THREE.LineSegments(this.gridGeometry, this.gridMaterial);
  private azimuth = 0.1;
  private elevation = 0.64;
  private viewZoom = 1;
  private fittedBounds: THREE.Box3 | null = null;
  private fittedZoom = 1;
  private fittingTown = false;
  private viewportWidth = 0;
  private viewportHeight = 0;
  private target = new THREE.Vector3(0, 1.5, 0);
  private pointerStart = new THREE.Vector2();
  private pointerLast = new THREE.Vector2();
  private pointerMoved = false;
  private pointerActive = false;
  private panGesture = false;
  private pointerButton = 0;
  private shiftPressed = false;
  private activePointers = 0;
  private reducedMotion = false;
  private postProcessingEnabled = true;
  private reflectionDirty = true;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, preserveDrawingBuffer: true });
    this.renderer.localClippingEnabled = true;
    this.renderer.setClearColor(MATERIAL_COLORS.skyHorizon, 1);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.scene.background = this.skyGradientTexture;
    this.scene.fog = new THREE.FogExp2(MATERIAL_COLORS.fog, 0.0032);

    const hemisphere = new THREE.HemisphereLight(0xfff4dd, 0x5a7f80, 0.31);
    this.scene.add(hemisphere);
    const sun = new THREE.DirectionalLight(0xffe8c8, 4.7);
    sun.position.set(-11, 18, 9);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1536, 1536);
    sun.shadow.camera.left = sun.shadow.camera.bottom = -22;
    sun.shadow.camera.right = sun.shadow.camera.top = 22;
    sun.shadow.bias = -0.0007;
    sun.shadow.intensity = 0.92;
    sun.shadow.radius = 2;
    this.scene.add(sun);

    const waterTargetSize = Math.min(window.innerWidth, window.innerHeight) < 700 ? 256 : 512;
    const reflectionTargetSize = Math.min(window.innerWidth, window.innerHeight) < 700 ? 256 : 1024;
    this.reflectionRenderTarget = new THREE.WebGLRenderTarget(
      reflectionTargetSize,
      reflectionTargetSize,
      { depthBuffer: true },
    );
    this.reflectionRenderTarget.texture.minFilter = THREE.LinearFilter;
    this.reflectionRenderTarget.texture.magFilter = THREE.LinearFilter;
    this.reflectionRenderTarget.texture.generateMipmaps = false;
    this.reflectionOverlayMaterial = makeScreenSpaceReflectionMaterial(
      this.reflectionRenderTarget.texture,
      reflectionTargetSize,
    );
    this.reflectionOverlay = new THREE.Mesh(this.waterGeometry, this.reflectionOverlayMaterial);
    this.reflectionOverlay.rotation.x = -Math.PI / 2;
    this.reflectionOverlay.position.y = WATER_LEVEL + 0.004;
    this.reflectionOverlay.renderOrder = 3;
    this.reflectionOverlay.frustumCulled = false;
    this.water = new Water(this.waterGeometry, {
      textureWidth: waterTargetSize,
      textureHeight: waterTargetSize,
      clipBias: 0.001,
      waterNormals: this.waterNormals,
      sunDirection: sun.position.clone().normalize(),
      sunColor: 0xffe4c4,
      waterColor: WATER_COLOR,
      distortionScale: 1.28,
      alpha: MATERIAL_TUNING.waterOpacity,
      fog: Boolean(this.scene.fog),
    });
    const water = this.water;
    this.waterMaterial = water.material as THREE.ShaderMaterial;
    this.waterMaterial.toneMapped = true;
    this.waterMaterial.uniforms.size!.value = 18;
    this.waterMaterial.uniforms.harborViewportHeight = { value: Math.max(1, this.canvas.height) };
    this.waterMaterial.fragmentShader = `uniform float harborViewportHeight;
${this.waterMaterial.fragmentShader}`
      .replace("float rf0 = 0.3;", "float rf0 = 0.07;")
      .replace("reflectionSample * 0.9", "reflectionSample * 0.0")
      .replace(
        "vec3 outgoingLight = albedo;",
        `vec2 harborPoint = worldPosition.xz;
        float harborBandA = sin(dot(harborPoint, vec2(0.34, 0.12)) - time * 0.31);
        float harborBandB = sin(dot(harborPoint, vec2(-0.13, 0.29)) + time * 0.23 + 1.4);
        float harborBandC = sin(dot(harborPoint, vec2(0.17, 0.23)) - time * 0.18 + 3.1);
        float harborLongWave = harborBandA * 0.19 + harborBandB * 0.12 + harborBandC * 0.075;
        float harborFineA = sin(dot(harborPoint, vec2(1.7, -0.82)) - time * 0.58);
        float harborFineB = sin(dot(harborPoint, vec2(-1.15, 1.48)) + time * 0.46 + 2.2);
        float harborFine = (harborFineA + harborFineB) * 0.024;
        float harborCrest = smoothstep(0.205, 0.33, harborLongWave) * 0.72;
        float harborScreenDepth = 1.0 - clamp(gl_FragCoord.y / harborViewportHeight, 0.0, 1.0);
        float harborUpper = smoothstep(0.08, 0.32, harborScreenDepth);
        float harborLower = smoothstep(0.64, 0.98, harborScreenDepth);
        vec3 harborTint = mix(vec3(1.18, 1.25, 1.3), vec3(0.84, 1.06, 1.12), harborUpper);
        harborTint = mix(harborTint, vec3(0.69, 1.0, 1.05), harborLower);
        vec3 outgoingLight = (
          albedo
          + vec3(0.2, 0.4, 0.45) * (harborLongWave + harborFine) * 0.16
          + vec3(0.31, 0.43, 0.45) * harborCrest * 0.085
        ) * harborTint;`,
      );
    // Keep view-dependent water shading while skipping Water's duplicate scene render.
    water.onBeforeRender = (_renderer, _scene, camera): void => {
      (this.waterMaterial.uniforms.eye!.value as THREE.Vector3).setFromMatrixPosition(camera.matrixWorld);
    };
    water.renderOrder = 2;
    this.waterMaterial.transparent = true;
    this.waterMaterial.depthWrite = false;
    water.rotation.x = -Math.PI / 2;
    water.position.y = WATER_LEVEL;
    water.receiveShadow = false;
    water.userData.cellPick = { id: "water", x: 0, z: 0, level: 0, kind: "water" } satisfies CellPick;
    this.scene.add(water, this.reflectionOverlay);
    this.reflectionOverlay.visible = true;
    this.pickTargets.push(water);
    this.grid.position.y = WATER_LEVEL + 0.012;
    this.grid.renderOrder = 4;
    this.grid.visible = false;
    this.scene.add(this.grid);

    this.scene.add(
      this.islandFoundationRoot,
      this.townRoot,
      this.hoverRoot,
      this.ambientWaterRoot,
      this.constructionEffectsRoot,
      this.birds,
    );
    this.createBirds();
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.ssaoPass = new SSAOPass(this.scene, this.camera, 512, 512, 16);
    this.ssaoPass.ssaoMaterial.defines.PERSPECTIVE_CAMERA = 0;
    this.ssaoPass.ssaoMaterial.needsUpdate = true;
    this.ssaoPass.depthRenderMaterial.defines.PERSPECTIVE_CAMERA = 0;
    this.ssaoPass.depthRenderMaterial.needsUpdate = true;
    this.ssaoPass.kernelRadius = 0.52;
    this.ssaoPass.minDistance = 0.001;
    this.ssaoPass.maxDistance = 0.042;
    this.composer.addPass(this.ssaoPass);
    this.outputPass = new OutputPass();
    this.composer.addPass(this.outputPass);
    this.canvas.addEventListener("pointerdown", this.notePointerDown, true);
    this.canvas.addEventListener("pointerup", this.notePointerUp, true);
    this.canvas.addEventListener("pointercancel", this.notePointerUp, true);
    this.canvas.addEventListener("contextmenu", this.preventContextMenu);
    this.resize();
    this.updateCamera();
  }

  private readonly notePointerDown = (event: PointerEvent): void => {
    this.pointerButton = event.button;
    this.shiftPressed = event.shiftKey;
    this.activePointers += 1;
  };

  private readonly notePointerUp = (): void => {
    this.activePointers = Math.max(0, this.activePointers - 1);
  };

  private readonly preventContextMenu = (event: Event): void => event.preventDefault();

  sync(snapshot: WorldSnapshot, animate = true): void {
    this.reflectionDirty = true;
    const cellsById = new Map(snapshot.cells.map((cell) => [cell.id, cell] as const));
    const featuresById = new Map(snapshot.features.map((feature) => [feature.id, feature] as const));
    const renderFeatures = new Map<string, CellFeature>();
    for (const cell of snapshot.cells) {
      if (!cell.foundation) continue;
      renderFeatures.set(cell.id, featuresById.get(cell.id) ?? {
        id: cell.id,
        kind: "foundation",
        level: 0,
        color: cell.color,
        storeys: cell.storeys,
        neighbors: {},
        exposed: { north: true, east: true, south: true, west: true },
      });
    }
    for (const feature of snapshot.features) renderFeatures.set(feature.id, feature);
    const terminalSupportIds = findTerminalSupportIds(renderFeatures);

    this.cellLevels.clear();
    this.cellKinds.clear();
    const signatures = new Map<string, string>();
    for (const [id, feature] of renderFeatures) {
      const cell = cellsById.get(id);
      const neighborTopology = EDGE_NAMES.map((edge) => {
        const neighborId = feature.neighbors[edge];
        return neighborRenderSignature(
          neighborId,
          neighborId ? renderFeatures.get(neighborId) : undefined,
          neighborId ? cellsById.get(neighborId) : undefined,
        );
      }).join("|");
      signatures.set(id, [
        feature.kind,
        feature.level,
        feature.color,
        Number(cell?.foundation ?? true),
        cell?.storeys.map((storey) => `${storey.level}:${storey.color}`).join(",") ?? "",
        EDGE_NAMES.map((edge) => Number(feature.exposed[edge])).join(""),
        feature.bridgeSpan?.join("-") ?? "",
        neighborTopology,
        Number(terminalSupportIds.has(id)),
      ].join(";"));
      this.cellLevels.set(id, feature.level);
      this.cellKinds.set(id, feature.kind);
    }

    this.hoverSignature = null;
    const previousCellIds = new Set(this.cellSignatures.keys());
    for (const [id, group] of this.cellGroups) {
      if (!renderFeatures.has(id) || this.cellSignatures.get(id) !== signatures.get(id)) {
        this.disposeCellGroup(group);
        this.cellGroups.delete(id);
        this.cellSignatures.delete(id);
      }
    }

    for (const [id, feature] of renderFeatures) {
      if (this.cellGroups.has(id)) continue;
      const cell = cellsById.get(id);
      if (!cell) continue;
      const isNew = !previousCellIds.has(id);
      const group = new THREE.Group();
      group.position.set(cell.x * CELL_SIZE, 0, cell.z * CELL_SIZE);
      const revealDelay = hash(cell.x, cell.z) * 0.18;
      group.userData.reveal = animate && isNew && !this.reducedMotion
        ? performance.now() / 1000 + revealDelay
        : 0;
      group.scale.y = group.userData.reveal ? 0.001 : 1;
      this.townRoot.add(group);
      if (group.userData.reveal) this.activeRevealGroups.add(group);

      const foundationEdges = Object.fromEntries(EDGE_NAMES.map((edge) => {
        const neighborId = feature.neighbors[edge];
        const neighbor = neighborId ? cellsById.get(neighborId) : undefined;
        return [edge, neighbor?.foundation !== true];
      })) as EdgeMask;
      const lowestStorey = cell.storeys[0]?.level;
      const needsElevatedSupport = lowestStorey !== undefined && (!cell.foundation || lowestStorey > 1);
      if (cell.foundation || needsElevatedSupport) {
        this.addWaterContact(group, cell.x, cell.z, foundationEdges, animate && isNew && !this.reducedMotion);
      }
      if (feature.kind === "bridge" && cell.foundation && cell.storeys.length === 0) {
        this.addBridge(group, cell, feature);
      } else {
        const hasBridgeNeighbor = Object.values(feature.neighbors).some((neighborId) => (
          renderFeatures.get(neighborId)?.kind === "bridge"
        ));
        const hasTerminalSupport = feature.kind === "house" && terminalSupportIds.has(id);
        if (cell.foundation) this.addFoundation(group, cell, feature, hasBridgeNeighbor, !hasTerminalSupport);
        if (needsElevatedSupport) {
          this.addTimberSupport(
            group,
            cell.x,
            cell.z,
            cell.storeys[0]!.color,
            foundationEdges,
            BUILDING_BASE + (cell.storeys[0]!.level - 1) * LEVEL_HEIGHT,
          );
        } else if (hasTerminalSupport) {
          this.addTimberSupport(group, cell.x, cell.z, feature.color, foundationEdges, BUILDING_BASE);
        }
        if (feature.kind === "house") {
          for (const storey of cell.storeys) {
            const level = storey.level - 1;
            const sameHeight = Object.fromEntries(EDGE_NAMES.map((edge) => {
              const neighborId = feature.neighbors[edge];
              const neighbor = neighborId ? cellsById.get(neighborId) : undefined;
              return [edge, neighbor?.storeys.some((candidate) => candidate.level === storey.level) ?? false];
            })) as EdgeMask;
            const higherNeighbors = Object.fromEntries(EDGE_NAMES.map((edge) => {
              const neighborId = feature.neighbors[edge];
              const neighbor = neighborId ? cellsById.get(neighborId) : undefined;
              return [edge, hasImmediateUpperStorey(neighbor, storey.level)];
            })) as EdgeMask;
            const levelExposed = Object.fromEntries(EDGE_NAMES.map((edge) => {
              const neighborId = feature.neighbors[edge];
              const neighbor = neighborId ? cellsById.get(neighborId) : undefined;
              return [edge, !neighbor?.storeys.some((candidate) => candidate.level === storey.level)];
            })) as EdgeMask;
            const topologySeed = feature.level * 53 + level * 43;
            const faceSeeds = EDGE_NAMES.map((_, edge) => hash(
              cell.x * 37 + edge * 11,
              cell.z * 41 - edge * 13,
              topologySeed + edge * 17,
            ));
            this.addLevel(
              group,
              id,
              cell.x,
              cell.z,
              level,
              storey.color,
              levelExposed,
              !cell.storeys.some((candidate) => candidate.level === storey.level + 1),
              sameHeight,
              higherNeighbors,
              faceSeeds,
            );
          }
        } else if (feature.kind === "courtyard") {
          this.addCourtyard(group, cell, feature, hasBridgeNeighbor);
        }
      }
      this.cellGroups.set(id, group);
      this.cellSignatures.set(id, signatures.get(id)!);
    }

    this.updateIslandFoundation(snapshot, terminalSupportIds);
    this.updateAmbientWater(snapshot);
    this.updateBirdPerches(renderFeatures, cellsById);
    this.pickTargets.splice(1);
    for (const group of this.cellGroups.values()) {
      group.traverse((object) => {
        if (object.userData.cellPick) this.pickTargets.push(object);
      });
    }
    if (!animate && renderFeatures.size > 0) this.fitTownToView(snapshot);
  }



  private disposeCellGroup(group: THREE.Group): void {
    this.activeRevealGroups.delete(group);
    for (const ripple of this.activeRipples) {
      if (ripple.parent === group) this.activeRipples.delete(ripple);
    }
    group.traverse((object) => {
      this.activeWaterEffects.delete(object);
      if (object.userData.windPhase !== undefined) this.swayingTrees.delete(object as THREE.Group);
    });
    disposeTree(group);
    group.removeFromParent();
  }

  private addFoundation(
    parent: THREE.Group,
    cell: CellState,
    feature: CellFeature,
    nearBridge: boolean,
    allowShorelineTree: boolean,
  ): void {
    const { id, x, z } = cell;
    const exposed = feature.exposed;
    const seed = hash(x, z, 91);
    const points = insetPolygon(cellPolygon(x, z), -FEATURE_TUNING.shorelineOverhang);
    const pick = new THREE.Mesh(
      polygonPrismGeometry(cellPolygon(x, z), 0.18, undefined, 0.08),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
    );
    pick.position.y = BUILDING_BASE - 0.16;
    pick.userData.cellPick = { id, x, z, level: 0, kind: feature.kind } satisfies CellPick;
    parent.add(pick);

    const shorelineEdges = EDGE_NAMES.filter((name) => exposed[name]).length;
    if (allowShorelineTree && !nearBridge && shorelineEdges >= 2 && seed > 0.42) {
      const corner = points.find((_point, index) => exposed[EDGE_NAMES[index]!] || exposed[EDGE_NAMES[(index + 3) % EDGE_NAMES.length]!]);
      if (corner) this.addTree(parent, corner[0] * 1.05, corner[1] * 1.05, seed);
    }
  }

  private addBridge(parent: THREE.Group, cell: CellState, feature: CellFeature): void {
    const { id, x, z } = cell;
    const span = feature.bridgeSpan ?? ["north", "south"];
    const alongX = span.includes("east") || span.includes("west");
    const bridgeLength = CELL_SIZE * 1.12;
    const bridgeWidth = CELL_SIZE * 0.56;
    const deckMaterial = new THREE.MeshStandardMaterial({
      color: tint(MATERIAL_COLORS.foundationShadow, 0.08),
      roughness: MATERIAL_TUNING.stoneRoughness,
      map: this.noiseTexture,
      bumpMap: this.noiseTexture,
      bumpScale: 0.02,
    });
    const deck = new THREE.Mesh(
      roundedBodyGeometry(
        alongX ? bridgeLength : bridgeWidth,
        alongX ? bridgeWidth : bridgeLength,
        FEATURE_TUNING.bridgeDeckThickness,
        hash(x, z, 401),
      ),
      deckMaterial,
    );
    deck.position.y = BUILDING_BASE + FEATURE_TUNING.bridgeClearance;
    deck.castShadow = deck.receiveShadow = true;
    deck.userData.cellPick = { id, x, z, level: feature.level, kind: "bridge" } satisfies CellPick;
    parent.add(deck);

    const deckTop = deck.position.y + FEATURE_TUNING.bridgeDeckThickness;
    const walkway = new THREE.Mesh(
      new THREE.BoxGeometry(
        alongX ? bridgeLength * 0.96 : bridgeWidth * 0.84,
        0.035,
        alongX ? bridgeWidth * 0.84 : bridgeLength * 0.96,
      ),
      new THREE.MeshStandardMaterial({
        color: 0xc18f63,
        roughness: 0.88,
        map: this.noiseTexture,
      }),
    );
    walkway.position.y = deckTop + 0.018;
    walkway.receiveShadow = true;
    parent.add(walkway);
    const seamMaterial = new THREE.MeshBasicMaterial({
      color: 0x654d3d,
      transparent: true,
      opacity: 0.58,
    });
    for (const along of [-0.4, -0.3, -0.2, -0.1, 0, 0.1, 0.2, 0.3, 0.4]) {
      const seam = new THREE.Mesh(
        new THREE.BoxGeometry(
          alongX ? 0.018 : bridgeWidth * 0.72,
          0.008,
          alongX ? bridgeWidth * 0.72 : 0.018,
        ),
        seamMaterial,
      );
      seam.position.set(
        alongX ? along * bridgeLength : 0,
        deckTop + 0.039,
        alongX ? 0 : along * bridgeLength,
      );
      parent.add(seam);
    }

    const supportHeight = Math.max(0.28, deck.position.y - WATER_LEVEL + 0.015);
    const supportMaterial = new THREE.MeshStandardMaterial({
      color: tint(MATERIAL_COLORS.foundationShadow, 0.12),
      roughness: MATERIAL_TUNING.stoneRoughness,
      map: this.noiseTexture,
    });
    for (const along of [-0.44, 0.44]) {
      const abutment = new THREE.Mesh(
        new THREE.BoxGeometry(
          alongX ? 0.18 : bridgeWidth * 0.72,
          supportHeight,
          alongX ? bridgeWidth * 0.72 : 0.18,
        ),
        supportMaterial,
      );
      abutment.position.set(
        alongX ? along * bridgeLength : 0,
        WATER_LEVEL + supportHeight * 0.5,
        alongX ? 0 : along * bridgeLength,
      );
      abutment.castShadow = abutment.receiveShadow = true;
      parent.add(abutment);
    }

    const railMaterial = new THREE.MeshStandardMaterial({
      color: MATERIAL_COLORS.ink,
      roughness: 0.82,
    });
    const sideOffset = bridgeWidth * 0.46;
    const railHeight = FEATURE_TUNING.bridgeRailHeight;
    for (const side of [-1, 1]) {
      const railStart = alongX
        ? new THREE.Vector3(-bridgeLength * 0.46, deckTop + railHeight * 0.75, side * sideOffset)
        : new THREE.Vector3(side * sideOffset, deckTop + railHeight * 0.75, -bridgeLength * 0.46);
      const railControl = alongX
        ? new THREE.Vector3(0, deckTop + railHeight * 1.65, side * sideOffset)
        : new THREE.Vector3(side * sideOffset, deckTop + railHeight * 1.65, 0);
      const railEnd = alongX
        ? new THREE.Vector3(bridgeLength * 0.46, deckTop + railHeight * 0.75, side * sideOffset)
        : new THREE.Vector3(side * sideOffset, deckTop + railHeight * 0.75, bridgeLength * 0.46);
      const rail = new THREE.Mesh(
        new THREE.TubeGeometry(
          new THREE.QuadraticBezierCurve3(railStart, railControl, railEnd),
          16,
          0.034,
          6,
          false,
        ),
        railMaterial,
      );
      rail.castShadow = true;
      parent.add(rail);
      for (const along of [-0.44, -0.22, 0, 0.22, 0.44]) {
        const normalized = along / 0.44;
        const postHeight = railHeight * (1.2 - normalized * normalized * 0.45);
        const post = new THREE.Mesh(
          new THREE.BoxGeometry(0.048, postHeight, 0.048),
          railMaterial,
        );
        post.position.set(
          alongX ? along * bridgeLength : side * sideOffset,
          deckTop + postHeight * 0.5,
          alongX ? side * sideOffset : along * bridgeLength,
        );
        post.castShadow = true;
        parent.add(post);
      }
    }
  }

  private addCourtyard(parent: THREE.Group, cell: CellState, feature: CellFeature, nearBridge: boolean): void {
    const points = insetPolygon(cellPolygon(cell.x, cell.z), FEATURE_TUNING.courtyardInset);
    const lawn = new THREE.Mesh(
      polygonPrismGeometry(points, 0.08, undefined, 0.025),
      new THREE.MeshStandardMaterial({
        color: MATERIAL_COLORS.vegetation,
        roughness: 1,
        map: this.noiseTexture,
      }),
    );
    lawn.position.y = BUILDING_BASE + 0.015;
    lawn.receiveShadow = true;
    lawn.userData.cellPick = {
      id: cell.id,
      x: cell.x,
      z: cell.z,
      level: feature.level,
      kind: "courtyard",
    } satisfies CellPick;
    parent.add(lawn);
    const seed = hash(cell.x, cell.z, 719);
    const path = new THREE.Mesh(
      new THREE.BoxGeometry(CELL_SIZE * 0.75, 0.035, 0.2),
      new THREE.MeshStandardMaterial({ color: 0xb7ad92, roughness: MATERIAL_TUNING.stoneRoughness }),
    );
    path.position.y = BUILDING_BASE + 0.11;
    path.rotation.y = seed > 0.5 ? 0 : Math.PI / 2;
    path.receiveShadow = true;
    parent.add(path);
    if (nearBridge) return;
    if (seed <= 0.65) {
      this.addTree(parent, (seed - 0.5) * 0.65, (hash(cell.z, cell.x, 727) - 0.5) * 0.65, seed);
      this.addGreenery(parent, BUILDING_BASE + 0.18, hash(cell.x, cell.z, 733));
      return;
    }
    const courtyardPalette = PALETTE[feature.color % PALETTE.length] ?? PALETTE[0]!;
    const alongX = seed > 0.5;
    const pergolaMaterial = new THREE.MeshStandardMaterial({
      color: courtyardPalette.trim,
      roughness: MATERIAL_TUNING.trimRoughness,
    });
    const pergolaRoof = new THREE.Mesh(
      new THREE.BoxGeometry(
        alongX ? CELL_SIZE * 0.72 : CELL_SIZE * 0.62,
        0.09,
        alongX ? CELL_SIZE * 0.62 : CELL_SIZE * 0.72,
      ),
      new THREE.MeshStandardMaterial({
        color: courtyardPalette.roof,
        roughness: MATERIAL_TUNING.roofRoughness,
        map: this.noiseTexture,
      }),
    );
    pergolaRoof.position.y = BUILDING_BASE + 0.68;
    pergolaRoof.castShadow = true;
    parent.add(pergolaRoof);
    for (const axis of [-1, 1]) {
      for (const across of [-1, 1]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.55, 0.085), pergolaMaterial);
        post.position.set(
          alongX ? axis * CELL_SIZE * 0.27 : across * CELL_SIZE * 0.27,
          BUILDING_BASE + 0.36,
          alongX ? across * CELL_SIZE * 0.27 : axis * CELL_SIZE * 0.27,
        );
        post.castShadow = true;
        parent.add(post);
      }
    }
    const railMaterial = new THREE.MeshStandardMaterial({ color: 0x4b5149, roughness: 0.86 });
    EDGE_NAMES.forEach((name, index) => {
      if (!feature.exposed[name]) return;
      const a = points[index]!;
      const b = points[(index + 1) % 4]!;
      const dx = b[0] - a[0];
      const dz = b[1] - a[1];
      const length = Math.hypot(dx, dz);
      const outwardX = dz / length;
      const outwardZ = -dx / length;
      const rail = new THREE.Mesh(new THREE.BoxGeometry(length * 0.84, 0.045, 0.045), railMaterial);
      rail.position.set(
        (a[0] + b[0]) * 0.5 + outwardX * 0.08,
        BUILDING_BASE + 0.58,
        (a[1] + b[1]) * 0.5 + outwardZ * 0.08,
      );
      rail.rotation.y = -Math.atan2(dz, dx);
      rail.castShadow = true;
      parent.add(rail);
      for (const along of [-0.31, 0, 0.31]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.42, 0.045), railMaterial);
        post.position.set(
          (a[0] + b[0]) * 0.5 + (dx / length) * along + outwardX * 0.08,
          BUILDING_BASE + 0.38,
          (a[1] + b[1]) * 0.5 + (dz / length) * along + outwardZ * 0.08,
        );
        post.castShadow = true;
        parent.add(post);
      }
    });
    this.addTree(parent, (seed - 0.5) * 0.65, (hash(cell.z, cell.x, 727) - 0.5) * 0.65, seed);
    this.addGreenery(parent, BUILDING_BASE + 0.18, hash(cell.x, cell.z, 733));
  }

  private addTree(parent: THREE.Group, x: number, z: number, seed: number): void {
    const seedKey = Math.round(seed * 100_000);
    const variantRoll = hash(seedKey, 683, 0);
    const variant = seed > 0.78 && variantRoll < 0.25 ? 3 : Math.floor(variantRoll * 4);
    const tree = new THREE.Group();
    tree.position.set(x, BUILDING_BASE + 0.04, z);
    tree.rotation.y = (seed - 0.5) * 0.18;
    tree.userData.windPhase = seed * Math.PI * 2;
    tree.userData.windStrength = (
      variant === 1 ? 0.014 : variant === 2 ? 0.03 : 0.023
    ) + hash(seedKey, 701, 0) * 0.012;

    const trunkHeight = variant === 1
      ? 1 + hash(seedKey, 709, 0) * 0.12
      : variant === 2
        ? 1.05 + hash(seedKey, 709, 0) * 0.13
        : variant === 3
          ? 0.56 + hash(seedKey, 709, 0) * 0.09
          : 0.6 + hash(seedKey, 709, 0) * 0.14;
    const trunkTop = variant === 2 ? 0.042 : variant === 1 ? 0.055 : 0.05 + seed * 0.009;
    const trunkBottom = variant === 2 ? 0.065 : variant === 1 ? 0.085 : 0.075 + seed * 0.012;
    const darkBarkMaterial = new THREE.MeshStandardMaterial({
      color: tint(0x685345, (seed - 0.5) * 0.08),
      roughness: 0.97,
    });
    const trunkMaterial = variant === 2
      ? new THREE.MeshStandardMaterial({
          color: paint(PALETTE[14]!.wall, -0.08, -0.08),
          roughness: 0.96,
        })
      : darkBarkMaterial;
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(trunkTop, trunkBottom, trunkHeight, 6),
      trunkMaterial,
    );
    trunk.position.y = trunkHeight * 0.5;
    trunk.castShadow = true;
    tree.add(trunk);

    if (variant === 2) {
      const barkMarkGeometry = new THREE.CylinderGeometry(trunkTop * 1.08, trunkTop * 1.12, 0.035, 6);
      for (const heightRatio of [0.34, 0.58, 0.78]) {
        const barkMark = new THREE.Mesh(barkMarkGeometry, darkBarkMaterial);
        barkMark.position.y = trunkHeight * heightRatio;
        barkMark.rotation.z = (heightRatio - 0.5) * 0.08;
        tree.add(barkMark);
      }
    }

    if (variant !== 1) {
      const branchGeometry = new THREE.CylinderGeometry(0.018, 0.035, 1, 5);
      const branchCount = variant === 3 ? 3 : 2 + Math.floor(hash(seedKey, 719, 0) * 2);
      for (let branchIndex = 0; branchIndex < branchCount; branchIndex += 1) {
        const variation = hash(seedKey, branchIndex * 37, 727);
        const angle = seed * Math.PI * 2 + branchIndex * 2.4 + variation * 0.5;
        const spread = variant === 3
          ? 0.25 + variation * 0.1
          : variant === 2
            ? 0.11 + variation * 0.055
            : 0.18 + variation * 0.09;
        const branchVector = new THREE.Vector3(
          Math.cos(angle) * spread,
          (variant === 2 ? 0.13 : 0.1) + variation * 0.07,
          Math.sin(angle) * spread,
        );
        const branch = new THREE.Mesh(branchGeometry, darkBarkMaterial);
        const branchBase = variant === 3 ? 0.47 : variant === 2 ? 0.58 : 0.55;
        const branchStep = variant === 3 ? 0.07 : 0.09;
        branch.position.set(0, trunkHeight * (branchBase + branchIndex * branchStep), 0);
        branch.position.addScaledVector(branchVector, 0.5);
        branch.scale.y = branchVector.length();
        branch.quaternion.setFromUnitVectors(UP, branchVector.normalize());
        branch.castShadow = true;
        tree.add(branch);
      }
    }

    if (variant === 1) {
      const coniferGeometry = new THREE.ConeGeometry(0.36, 0.52, 7);
      const coniferMaterials = [
        new THREE.MeshStandardMaterial({
          color: paint(MATERIAL_COLORS.vegetation, 0.055, -0.12),
          roughness: 0.99,
        }),
        new THREE.MeshStandardMaterial({
          color: paint(MATERIAL_COLORS.vegetation, 0.075, -0.055),
          roughness: 0.99,
        }),
      ] as const;
      for (const [tierIndex, tierScale] of [1, 0.78, 0.56].entries()) {
        const tier = new THREE.Mesh(
          coniferGeometry,
          coniferMaterials[(tierIndex + (seed > 0.5 ? 1 : 0)) % coniferMaterials.length]!,
        );
        tier.position.y = trunkHeight * (0.4 + tierIndex * 0.24);
        tier.scale.set(tierScale, 1 - tierIndex * 0.055, tierScale * 0.92);
        tier.rotation.y = seed * Math.PI + tierIndex * 0.47;
        tier.castShadow = true;
        tree.add(tier);
      }
    } else {
      const foliageGeometry = new THREE.IcosahedronGeometry(variant === 2 ? 0.2 : variant === 3 ? 0.24 : 0.29, 0);
      const foliageMaterials = variant === 2
        ? [
            new THREE.MeshStandardMaterial({
              color: paint(MATERIAL_COLORS.vegetation, -0.01, 0.075),
              roughness: 0.98,
            }),
            new THREE.MeshStandardMaterial({
              color: paint(MATERIAL_COLORS.vegetation, 0.035, 0.025),
              roughness: 0.98,
            }),
          ]
        : variant === 3
          ? [
              new THREE.MeshStandardMaterial({
                color: paint(PALETTE[10]!.wall, 0.03, 0.12),
                roughness: 0.96,
              }),
              new THREE.MeshStandardMaterial({
                color: paint(PALETTE[12]!.trim, -0.055, -0.025),
                roughness: 0.96,
              }),
              new THREE.MeshStandardMaterial({
                color: paint(MATERIAL_COLORS.vegetation, 0.025, 0.025),
                roughness: 0.98,
              }),
            ]
          : [
              new THREE.MeshStandardMaterial({
                color: paint(MATERIAL_COLORS.vegetation, 0.035, seed * 0.055 - 0.025),
                roughness: 0.98,
              }),
              new THREE.MeshStandardMaterial({
                color: paint(MATERIAL_COLORS.vegetation, 0.065, seed * 0.035 + 0.025),
                roughness: 0.98,
              }),
            ];
      const clusterCount = variant === 2
        ? 3
        : variant === 3
          ? 5
          : 2 + Math.floor(hash(seedKey, 739, 0) * 3);
      for (let clusterIndex = 0; clusterIndex < clusterCount; clusterIndex += 1) {
        const variation = hash(seedKey, clusterIndex * 43, 743);
        const crown = clusterIndex === 0;
        const angle = seed * Math.PI * 2 + clusterIndex * 2.32 + variation * 0.42;
        const foliage = new THREE.Mesh(
          foliageGeometry,
          foliageMaterials[(clusterIndex + (seed > 0.5 ? 1 : 0)) % foliageMaterials.length]!,
        );
        if (variant === 2) {
          const lateral = clusterIndex === 1 ? -1 : clusterIndex === 2 ? 1 : 0;
          foliage.position.set(
            lateral * (0.065 + variation * 0.025),
            trunkHeight * 0.58 + clusterIndex * 0.2,
            Math.sin(angle) * 0.055,
          );
          foliage.scale.set(0.72 + variation * 0.12, 1.28 + variation * 0.18, 0.62 + variation * 0.12);
        } else if (variant === 3) {
          const radial = crown ? 0.035 : 0.2 + variation * 0.095;
          foliage.position.set(
            Math.cos(angle) * radial,
            trunkHeight * 0.78 + 0.22 + variation * 0.09,
            Math.sin(angle) * radial,
          );
          foliage.scale.set(1.08 + variation * 0.2, 0.84 + variation * 0.15, 0.96 + variation * 0.18);
        } else {
          const radial = crown ? 0.018 : 0.1 + variation * 0.09;
          foliage.position.set(
            Math.cos(angle) * radial,
            trunkHeight * 0.72 + (crown ? 0.25 : 0.08 + variation * 0.18),
            Math.sin(angle) * radial,
          );
          const width = crown ? 1.02 + variation * 0.18 : 0.68 + variation * 0.2;
          foliage.scale.set(
            width,
            (crown ? 1.18 : 0.78) + variation * 0.22,
            width * (0.82 + hash(seedKey, clusterIndex * 47, 751) * 0.18),
          );
        }
        foliage.rotation.set(variation * 0.18, angle * 0.17, variation * 0.12);
        foliage.castShadow = true;
        tree.add(foliage);
      }
    }

    this.swayingTrees.add(tree);
    parent.add(tree);
  }
  private updateIslandFoundation(snapshot: WorldSnapshot, terminalSupportIds: ReadonlySet<string>): void {
    for (const child of [...this.islandFoundationRoot.children]) {
      child.traverse((object) => this.activeWaterEffects.delete(object));
      this.islandFoundationRoot.remove(child);
      disposeTree(child);
    }
    const bridgeIds = new Set(snapshot.features.filter((feature) => feature.kind === "bridge").map((feature) => feature.id));
    const bridgeCells = snapshot.cells.filter((cell) => bridgeIds.has(cell.id));
    const cells = snapshot.cells.filter((cell) => cell.foundation && !bridgeIds.has(cell.id) && !terminalSupportIds.has(cell.id));
    if (cells.length === 0) return;
    const cellMap = new Map<string, CellState>(cells.map((cell) => [`${cell.x},${cell.z}`, cell]));
    const pending = new Set<string>(cellMap.keys());
    const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]] as const;
    const pointKey = ([x, z]: Point2): string => `${x.toFixed(5)},${z.toFixed(5)}`;
    const islandBottom = WATER_LEVEL - 0.14;
    let dockAdded = false;

    while (pending.size > 0) {
      const firstId = pending.values().next().value as string;
      const firstCell = cellMap.get(firstId);
      if (!firstCell) {
        pending.delete(firstId);
        continue;
      }
      const component: CellState[] = [];
      const queue = [firstCell];
      pending.delete(firstId);
      while (queue.length > 0) {
        const cell = queue.shift()!;
        component.push(cell);
        for (const [dx, dz] of directions) {
          const neighborId = `${cell.x + dx},${cell.z + dz}`;
          const neighbor = cellMap.get(neighborId);
          if (neighbor && pending.delete(neighborId)) queue.push(neighbor);
        }
      }

      const edges: { a: Point2; b: Point2 }[] = [];
      for (const cell of component) {
        const points = cellPolygon(cell.x, cell.z, false);
        directions.forEach(([dx, dz], index) => {
          if (cellMap.has(`${cell.x + dx},${cell.z + dz}`)) return;
          edges.push({ a: points[index]!, b: points[(index + 1) % points.length]! });
        });
      }
      const remaining = [...edges];
      while (remaining.length >= 3) {
        const firstEdge = remaining.pop()!;
        const loop: Point2[] = [firstEdge.a, firstEdge.b];
        let current = firstEdge.b;
        let closed = false;
        for (let step = 0; step < edges.length + 2; step += 1) {
          const currentKey = pointKey(current);
          const startKey = pointKey(loop[0]!);
          if (currentKey === startKey) {
            closed = true;
            break;
          }
          const nextIndex = remaining.findIndex((edge) => pointKey(edge.a) === currentKey);
          if (nextIndex < 0) break;
          const nextEdge = remaining.splice(nextIndex, 1)[0]!;
          current = nextEdge.b;
          loop.push(current);
        }
        if (!closed || loop.length < 4) continue;
        loop.pop();
        const touchesTerminalSupport = component.some((cell) => directions.some(([dx, dz]) => terminalSupportIds.has(`${cell.x + dx},${cell.z + dz}`)));
        const foundationExpansion = touchesTerminalSupport ? 0.04 : FEATURE_TUNING.shorelineOverhang + 0.18;
        const outline = insetPolygon(smoothPolygon(loop), -foundationExpansion);
        const shellHeight = BUILDING_BASE - islandBottom;
        const shellGeometry = roundedIslandGeometry(outline, shellHeight);
        const positions = shellGeometry.getAttribute("position");
        const colors = new Float32Array(positions.count * 3);
        const bottomColor = new THREE.Color(MATERIAL_COLORS.foundationShadow)
          .lerp(new THREE.Color(MATERIAL_COLORS.foundation), 0.42);
        const topColor = tint(MATERIAL_COLORS.foundation, 0.1);
        const sampledColor = new THREE.Color();
        for (let index = 0; index < positions.count; index += 1) {
          const normalizedHeight = THREE.MathUtils.clamp(positions.getY(index) / shellHeight, 0, 1);
          const blend = normalizedHeight * normalizedHeight * (3 - 2 * normalizedHeight);
          sampledColor.copy(bottomColor).lerp(topColor, blend);
          sampledColor.toArray(colors, index * 3);
        }
        shellGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        const shellMaterial = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          vertexColors: true,
          roughness: MATERIAL_TUNING.stoneRoughness,
          map: this.noiseTexture,
          bumpMap: this.noiseTexture,
          bumpScale: 0.022,
        });
        const shell = new THREE.Mesh(shellGeometry, shellMaterial);
        shell.position.y = islandBottom;
        shell.castShadow = true;
        shell.receiveShadow = true;
        shell.renderOrder = 1;
        this.islandFoundationRoot.add(shell);
        this.addFoundationMasonry(outline, islandBottom, shellHeight);
        const shorelineShadow = new THREE.Mesh(
          polygonRingGeometry(
            insetPolygon(outline, -0.05),
            outline,
            WATER_LEVEL + 0.042,
          ),
          new THREE.MeshBasicMaterial({
            color: 0x17484b,
            transparent: true,
            opacity: 0.38,
            depthWrite: false,
          }),
        );
        shorelineShadow.renderOrder = 6;
        this.islandFoundationRoot.add(shorelineShadow);
        const shorelineFoam = new THREE.Mesh(
          polygonRingGeometry(
            insetPolygon(outline, -0.12),
            insetPolygon(outline, -0.07),
            WATER_LEVEL + 0.047,
          ),
          new THREE.MeshBasicMaterial({
            color: MATERIAL_COLORS.foam,
            transparent: true,
            opacity: 0.28,
            depthWrite: false,
          }),
        );
        shorelineFoam.renderOrder = 7;
        shorelineFoam.userData.waterEffect = "outlineCrest";
        shorelineFoam.userData.waterPhase = hash(
          Math.round(outline[0]![0] * 10),
          Math.round(outline[0]![1] * 10),
          17,
        );
        shorelineFoam.userData.waterOpacity = 0.28;
        this.activeWaterEffects.add(shorelineFoam);
        this.islandFoundationRoot.add(shorelineFoam);
        const foundationCenter = polygonCenter(outline);
        const capMaterial = new THREE.MeshStandardMaterial({
          color: 0xd8d0b5,
          roughness: 0.88,
        });
        const buttressMaterial = new THREE.MeshStandardMaterial({
          color: tint(MATERIAL_COLORS.foundationShadow, -0.05),
          roughness: 0.96,
          map: this.noiseTexture,
        });
        outline.forEach((a, index) => {
          const b = outline[(index + 1) % outline.length]!;
          const dx = b[0] - a[0];
          const dz = b[1] - a[1];
          const length = Math.hypot(dx, dz);
          if (length < 0.12) return;
          const middleX = (a[0] + b[0]) * 0.5;
          const middleZ = (a[1] + b[1]) * 0.5;
          const radialX = middleX - foundationCenter[0];
          const radialZ = middleZ - foundationCenter[1];
          const radialLength = Math.max(0.001, Math.hypot(radialX, radialZ));
          const outwardX = radialX / radialLength;
          const outwardZ = radialZ / radialLength;
          const rotation = -Math.atan2(dz, dx);
          const cap = new THREE.Mesh(
            new THREE.BoxGeometry(length + 0.08, 0.085, 0.18),
            capMaterial,
          );
          cap.position.set(
            middleX + outwardX * 0.025,
            BUILDING_BASE - 0.018,
            middleZ + outwardZ * 0.025,
          );
          cap.rotation.y = rotation;
          cap.castShadow = cap.receiveShadow = true;
          this.islandFoundationRoot.add(cap);
          if (index % 4 !== 0) return;
          const buttressHeight = shellHeight * 0.68;
          const buttress = new THREE.Mesh(
            new THREE.BoxGeometry(Math.min(0.26, length * 0.74), buttressHeight, 0.2),
            buttressMaterial,
          );
          buttress.position.set(
            middleX + outwardX * 0.055,
            islandBottom + buttressHeight * 0.48,
            middleZ + outwardZ * 0.055,
          );
          buttress.rotation.y = rotation;
          buttress.castShadow = buttress.receiveShadow = true;
          this.islandFoundationRoot.add(buttress);
        });

        const toeMaterial = new THREE.MeshStandardMaterial({
          color: MATERIAL_COLORS.foundationShadow,
          roughness: 0.96,
        });
        const toe = new THREE.Mesh(
          polygonPrismGeometryN(insetPolygon(outline, -0.12), 0.16, 0.08, 0.12),
          toeMaterial,
        );
        toe.position.y = WATER_LEVEL - 0.18;
        toe.receiveShadow = true;
        this.islandFoundationRoot.add(toe);
        const wetBand = new THREE.Mesh(
          polygonSkirtGeometry(insetPolygon(outline, -0.018), 0.13),
          new THREE.MeshStandardMaterial({
            color: 0x4f706d,
            roughness: 0.98,
            transparent: true,
            opacity: 0.62,
            depthWrite: false,
            side: THREE.DoubleSide,
          }),
        );
        wetBand.position.y = WATER_LEVEL - 0.06;
        wetBand.renderOrder = 3;
        this.islandFoundationRoot.add(wetBand);

        for (const fraction of [0.28, 0.55, 0.78]) {
          const seamY = islandBottom + (BUILDING_BASE - islandBottom) * fraction;
          const seamGeometry = new THREE.BufferGeometry().setFromPoints(
            outline.map(([x, z]) => new THREE.Vector3(x, seamY, z)),
          );
          const seam = new THREE.LineLoop(
            seamGeometry,
            new THREE.LineBasicMaterial({ color: 0x526d71, transparent: true, opacity: 0.26 }),
          );
          seam.renderOrder = 3;
          this.islandFoundationRoot.add(seam);
        }
        const contactShadow = new THREE.Mesh(
          polygonRingGeometry(
            outline,
            insetPolygon(outline, 0.075),
            WATER_LEVEL + 0.028,
          ),
          new THREE.MeshBasicMaterial({
            color: 0x315b60,
            transparent: true,
            opacity: 0.38,
            depthWrite: false,
            side: THREE.DoubleSide,
          }),
        );
        contactShadow.renderOrder = 4;
        this.islandFoundationRoot.add(contactShadow);
        const rimGeometry = new THREE.BufferGeometry().setFromPoints(
          outline.map(([x, z]) => new THREE.Vector3(x, BUILDING_BASE + 0.018, z)),
        );
        const rim = new THREE.LineLoop(
          rimGeometry,
          new THREE.LineBasicMaterial({ color: 0xe4eadb, transparent: true, opacity: 0.72 }),
        );
        rim.renderOrder = 5;
        this.islandFoundationRoot.add(rim);
        this.addPromenade(outline, bridgeCells, bridgeIds.size === 0 && !dockAdded);
        this.addFoundationOpenings(outline);
        if (!dockAdded && bridgeIds.size === 0) {
          this.addIslandDock(outline);
          dockAdded = true;
        }
      }
    }
  }

  private addFoundationMasonry(
    outline: readonly Point2[],
    islandBottom: number,
    shellHeight: number,
  ): void {
    const center = polygonCenter(outline);
    const placements: {
      readonly x: number;
      readonly y: number;
      readonly z: number;
      readonly rotation: number;
      readonly width: number;
      readonly height: number;
      readonly color: THREE.Color;
    }[] = [];
    const courseCount = 3;
    outline.forEach((a, edgeIndex) => {
      const b = outline[(edgeIndex + 1) % outline.length]!;
      const dx = b[0] - a[0];
      const dz = b[1] - a[1];
      const length = Math.hypot(dx, dz);
      if (length < 0.12) return;
      const tangentX = dx / length;
      const tangentZ = dz / length;
      const middleX = (a[0] + b[0]) * 0.5;
      const middleZ = (a[1] + b[1]) * 0.5;
      const radialX = middleX - center[0];
      const radialZ = middleZ - center[1];
      const radialLength = Math.max(0.001, Math.hypot(radialX, radialZ));
      const outwardX = radialX / radialLength;
      const outwardZ = radialZ / radialLength;
      const columns = Math.max(1, Math.ceil(length / 0.42));
      const blockWidth = length / columns;
      const blockHeight = shellHeight / courseCount;
      for (let course = 0; course < courseCount; course += 1) {
        for (let column = 0; column < columns; column += 1) {
          const along = -length * 0.5 + (column + 0.5) * blockWidth;
          const variation = hash(edgeIndex * 37 + column, course * 53, columns);
          placements.push({
            x: middleX + tangentX * along + outwardX * 0.035,
            y: islandBottom + (course + 0.5) * blockHeight,
            z: middleZ + tangentZ * along + outwardZ * 0.035,
            rotation: -Math.atan2(dz, dx),
            width: Math.max(0.08, blockWidth - 0.045),
            height: Math.max(0.08, blockHeight - 0.04),
            color: tint(MATERIAL_COLORS.foundation, (variation - 0.5) * 0.18 - course * 0.014),
          });
        }
      }
    });
    if (placements.length === 0) return;
    const masonry = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.96,
        map: this.noiseTexture,
      }),
      placements.length,
    );
    const dummy = new THREE.Object3D();
    placements.forEach((placement, index) => {
      dummy.position.set(placement.x, placement.y, placement.z);
      dummy.rotation.set(0, placement.rotation, 0);
      dummy.scale.set(placement.width, placement.height, 0.06);
      dummy.updateMatrix();
      masonry.setMatrixAt(index, dummy.matrix);
      masonry.setColorAt(index, placement.color);
    });
    masonry.instanceMatrix.needsUpdate = true;
    if (masonry.instanceColor) masonry.instanceColor.needsUpdate = true;
    masonry.castShadow = masonry.receiveShadow = true;
    this.islandFoundationRoot.add(masonry);
  }

  private addPromenade(
    outline: readonly Point2[],
    bridgeCells: readonly CellState[],
    leaveDockGap: boolean,
  ): void {
    if (outline.length < 3) return;
    const center = polygonCenter(outline);
    const deck = new THREE.Mesh(
      polygonRingGeometry(outline, insetPolygon(outline, 0.16), BUILDING_BASE + 0.024),
      new THREE.MeshStandardMaterial({
        color: 0x806b58,
        roughness: 0.9,
        map: this.noiseTexture,
        side: THREE.DoubleSide,
      }),
    );
    deck.receiveShadow = true;
    this.islandFoundationRoot.add(deck);

    let dockIndex = -1;
    if (leaveDockGap) {
      let bestScore = -Infinity;
      outline.forEach((a, index) => {
        const b = outline[(index + 1) % outline.length]!;
        const middleX = (a[0] + b[0]) * 0.5;
        const middleZ = (a[1] + b[1]) * 0.5;
        const radialX = middleX - center[0];
        const radialZ = middleZ - center[1];
        const score = (radialX + radialZ) / Math.max(0.001, Math.hypot(radialX, radialZ));
        if (score > bestScore) {
          bestScore = score;
          dockIndex = index;
        }
      });
    }
    const bridgeCenters = bridgeCells.map((cell) => polygonCenter(cellPolygon(cell.x, cell.z, false)));
    const railMaterials = [
      new THREE.MeshStandardMaterial({ color: 0x526c65, roughness: 0.84 }),
      new THREE.MeshStandardMaterial({ color: 0x708177, roughness: 0.86 }),
    ] as const;
    const accentStart = Math.floor(
      hash(Math.round(center[0] * 10), Math.round(center[1] * 10), outline.length + 811) * outline.length,
    );
    let accentIndex = -1;
    for (let step = 0; step < outline.length; step += 1) {
      const index = (accentStart + step) % outline.length;
      const a = outline[index]!;
      const b = outline[(index + 1) % outline.length]!;
      const middleX = (a[0] + b[0]) * 0.5;
      const middleZ = (a[1] + b[1]) * 0.5;
      const bridgeGap = bridgeCenters.some(([x, z]) => (
        Math.hypot(middleX - x, middleZ - z) < CELL_SIZE * 0.95
      ));
      const dockDistance = dockIndex < 0
        ? Infinity
        : Math.min(Math.abs(index - dockIndex), outline.length - Math.abs(index - dockIndex));
      if (!bridgeGap && dockDistance > 1 && Math.hypot(b[0] - a[0], b[1] - a[1]) >= 0.44) {
        accentIndex = index;
        break;
      }
    }
    outline.forEach((a, index) => {
      const b = outline[(index + 1) % outline.length]!;
      const middleX = (a[0] + b[0]) * 0.5;
      const middleZ = (a[1] + b[1]) * 0.5;
      const bridgeGap = bridgeCenters.some(([x, z]) => (
        Math.hypot(middleX - x, middleZ - z) < CELL_SIZE * 0.95
      ));
      const dockDistance = dockIndex < 0
        ? Infinity
        : Math.min(Math.abs(index - dockIndex), outline.length - Math.abs(index - dockIndex));
      if (bridgeGap || dockDistance <= 1) return;
      const dx = b[0] - a[0];
      const dz = b[1] - a[1];
      const length = Math.hypot(dx, dz);
      if (length < 0.24) return;
      const inwardX = (center[0] - middleX) * 0.035;
      const inwardZ = (center[1] - middleZ) * 0.035;
      const rotation = -Math.atan2(dz, dx);
      const segmentCount = Math.max(1, Math.ceil(length / 0.38));
      const segmentLength = length / segmentCount;
      for (let segment = 0; segment < segmentCount; segment += 1) {
        const along = -length * 0.5 + (segment + 0.5) * segmentLength;
        const rail = new THREE.Mesh(
          new THREE.BoxGeometry(segmentLength * 0.78, 0.055, 0.055),
          railMaterials[(index + segment) % railMaterials.length]!,
        );
        rail.position.set(
          middleX + inwardX + (dx / length) * along,
          BUILDING_BASE + 0.36,
          middleZ + inwardZ + (dz / length) * along,
        );
        rail.rotation.y = rotation;
        rail.castShadow = true;
        this.islandFoundationRoot.add(rail);
        const middleRail = rail.clone();
        middleRail.position.y = BUILDING_BASE + 0.22;
        middleRail.scale.y = 0.8;
        this.islandFoundationRoot.add(middleRail);
      }
      for (const along of [-0.42, 0.42]) {
        const post = new THREE.Mesh(
          new THREE.BoxGeometry(0.055, 0.34, 0.055),
          railMaterials[index % railMaterials.length]!,
        );
        post.position.set(
          middleX + inwardX + (dx / length) * length * along,
          BUILDING_BASE + 0.18,
          middleZ + inwardZ + (dz / length) * length * along,
        );
        post.castShadow = true;
        this.islandFoundationRoot.add(post);
        const cap = new THREE.Mesh(
          new THREE.BoxGeometry(0.09, 0.065, 0.09),
          railMaterials[(index + 1) % railMaterials.length]!,
        );
        cap.position.set(post.position.x, BUILDING_BASE + 0.365, post.position.z);
        cap.castShadow = true;
        this.islandFoundationRoot.add(cap);
      }
      if (index === accentIndex) {
        const towardCenterX = center[0] - middleX;
        const towardCenterZ = center[1] - middleZ;
        const inwardLength = Math.max(0.001, Math.hypot(towardCenterX, towardCenterZ));
        this.addPromenadeAccent(
          middleX + towardCenterX / inwardLength * 0.19,
          middleZ + towardCenterZ / inwardLength * 0.19,
          rotation,
          hash(Math.round(middleX * 10), Math.round(middleZ * 10), outline.length * 13 + index),
        );
      }
    });
  }

  private addPromenadeAccent(x: number, z: number, rotation: number, seed: number): void {
    const accent = new THREE.Group();
    accent.position.set(x, BUILDING_BASE + 0.055, z);
    accent.rotation.y = rotation;
    const variant = Math.min(2, Math.floor(seed * 3));

    if (variant === 0) {
      const wood = new THREE.MeshStandardMaterial({
        color: tint(0x987553, seed * 0.08 - 0.04),
        roughness: 0.94,
      });
      const iron = new THREE.MeshStandardMaterial({ color: 0x455c58, roughness: 0.86 });
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.065, 0.18), wood);
      seat.position.y = 0.18;
      seat.castShadow = true;
      accent.add(seat);
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.2, 0.05), wood);
      back.position.set(0, 0.29, 0.075);
      back.rotation.x = -0.08;
      back.castShadow = true;
      accent.add(back);
      for (const legX of [-0.2, 0.2]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.18, 0.06), iron);
        leg.position.set(legX, 0.09, 0);
        leg.castShadow = true;
        accent.add(leg);
      }
    } else if (variant === 1) {
      const rockGeometry = new THREE.DodecahedronGeometry(0.12, 0);
      const rockMaterials = [
        new THREE.MeshStandardMaterial({ color: tint(MATERIAL_COLORS.foundation, -0.04), roughness: 1 }),
        new THREE.MeshStandardMaterial({ color: tint(MATERIAL_COLORS.foundation, 0.07), roughness: 1 }),
      ] as const;
      for (let index = 0; index < 3; index += 1) {
        const variation = hash(Math.round(seed * 100_000), index * 31, 853);
        const rock = new THREE.Mesh(rockGeometry, rockMaterials[index % rockMaterials.length]!);
        rock.position.set((index - 1) * 0.14, 0.065 + variation * 0.035, (variation - 0.5) * 0.12);
        rock.scale.set(0.72 + variation * 0.4, 0.62 + variation * 0.5, 0.74 + (1 - variation) * 0.3);
        rock.rotation.set(variation * 0.35, variation * 1.8, variation * 0.22);
        rock.castShadow = true;
        accent.add(rock);
      }
    } else {
      const planter = new THREE.Mesh(
        new THREE.BoxGeometry(0.46, 0.14, 0.2),
        new THREE.MeshStandardMaterial({
          color: tint(0x9a6549, seed * 0.06 - 0.03),
          roughness: 0.95,
        }),
      );
      planter.castShadow = true;
      accent.add(planter);
      const soil = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.025, 0.16),
        new THREE.MeshStandardMaterial({ color: 0x58493c, roughness: 1 }),
      );
      soil.position.y = 0.08;
      accent.add(soil);
      const stemGeometry = new THREE.CylinderGeometry(0.007, 0.01, 0.2, 5);
      const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x55775a, roughness: 1 });
      const flowerGeometry = new THREE.IcosahedronGeometry(0.045, 0);
      const flowerMaterials = [
        new THREE.MeshStandardMaterial({ color: 0xd97867, roughness: 0.92 }),
        new THREE.MeshStandardMaterial({ color: 0xe2bd6d, roughness: 0.92 }),
      ] as const;
      for (let index = 0; index < 5; index += 1) {
        const variation = hash(Math.round(seed * 100_000), index * 29, 859);
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.set((index - 2) * 0.075, 0.17 + variation * 0.035, (variation - 0.5) * 0.1);
        stem.rotation.z = (index - 2) * 0.035;
        accent.add(stem);
        const flower = new THREE.Mesh(flowerGeometry, flowerMaterials[index % flowerMaterials.length]!);
        flower.position.set(stem.position.x, stem.position.y + 0.11, stem.position.z);
        flower.scale.y = 0.72;
        flower.castShadow = true;
        accent.add(flower);
      }
    }
    this.islandFoundationRoot.add(accent);
  }

  private addFoundationOpenings(outline: readonly Point2[]): void {
    if (outline.length < 4) return;
    const center = polygonCenter(outline);
    const candidates = outline.map((a, index) => {
      const b = outline[(index + 1) % outline.length]!;
      const middleX = (a[0] + b[0]) * 0.5;
      const middleZ = (a[1] + b[1]) * 0.5;
      const radialX = middleX - center[0];
      const radialZ = middleZ - center[1];
      const radialLength = Math.max(0.001, Math.hypot(radialX, radialZ));
      const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
      return {
        a,
        b,
        index,
        length,
        middleX,
        middleZ,
        outwardX: radialX / radialLength,
        outwardZ: radialZ / radialLength,
        score: length + (-radialX + radialZ) / radialLength * 0.24,
      };
    }).sort((left, right) => right.score - left.score);
    const selected: (typeof candidates)[number][] = [];
    for (const candidate of candidates) {
      const overlaps = selected.some((entry) => {
        const distance = Math.abs(entry.index - candidate.index);
        return Math.min(distance, outline.length - distance) < 2;
      });
      if (!overlaps && candidate.length >= 0.42) selected.push(candidate);
      if (selected.length >= 4) break;
    }

    const openingHeight = Math.min(0.5, BUILDING_BASE - WATER_LEVEL - 0.1);
    const cavityDepth = 0.13;
    const cavityMaterial = new THREE.MeshBasicMaterial({
      color: tint(MATERIAL_COLORS.ink, -0.16),
      side: THREE.DoubleSide,
    });
    const revealMaterial = new THREE.MeshStandardMaterial({
      color: tint(MATERIAL_COLORS.foundationShadow, -0.08),
      roughness: 1,
      flatShading: true,
      side: THREE.DoubleSide,
    });
    const trimMaterial = new THREE.MeshStandardMaterial({
      color: tint(MATERIAL_COLORS.foundation, 0.09),
      roughness: 0.9,
    });
    const runoffGeometry = new THREE.CylinderGeometry(0.06, 0.088, 1, 10);
    const runoffMaterial = new THREE.MeshBasicMaterial({
      color: 0x3ce5cf,
      transparent: true,
      opacity: 1,
      depthWrite: false,
    });
    const runoffShadowGeometry = new THREE.BoxGeometry(0.19, 1, 0.018);
    const runoffShadowMaterial = new THREE.MeshBasicMaterial({
      color: 0x0b4f5b,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    const runoffRippleGeometry = new THREE.RingGeometry(0.09, 0.21, 32);
    const runoffRippleMaterial = new THREE.MeshBasicMaterial({
      color: 0x74ffe1,
      transparent: true,
      opacity: 0.88,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const runoffImpactGeometry = new THREE.CircleGeometry(0.12, 24);
    const runoffImpactMaterial = new THREE.MeshBasicMaterial({
      color: 0x9bffe9,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const runoffDropGeometry = new THREE.SphereGeometry(0.025, 7, 5);
    const runoffDropMaterial = new THREE.MeshBasicMaterial({
      color: tint(MATERIAL_COLORS.foam, 0.03),
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    });
    for (const candidate of selected) {
      const width = Math.min(0.58, candidate.length * 0.62);
      const shoulder = openingHeight * 0.54;
      const openingShape = new THREE.Shape();
      openingShape.moveTo(-width * 0.5, 0);
      openingShape.lineTo(width * 0.5, 0);
      openingShape.lineTo(width * 0.5, shoulder);
      openingShape.quadraticCurveTo(width * 0.5, openingHeight, 0, openingHeight);
      openingShape.quadraticCurveTo(-width * 0.5, openingHeight, -width * 0.5, shoulder);
      openingShape.closePath();

      const revealThickness = Math.min(0.045, width * 0.1);
      const innerWidth = width - revealThickness * 2;
      const innerShoulder = shoulder - revealThickness * 0.5;
      const innerHeight = openingHeight - revealThickness;
      const revealShape = openingShape.clone();
      const revealOpening = new THREE.Path();
      revealOpening.moveTo(-innerWidth * 0.5, revealThickness * 0.4);
      revealOpening.lineTo(-innerWidth * 0.5, innerShoulder);
      revealOpening.quadraticCurveTo(-innerWidth * 0.5, innerHeight, 0, innerHeight);
      revealOpening.quadraticCurveTo(innerWidth * 0.5, innerHeight, innerWidth * 0.5, innerShoulder);
      revealOpening.lineTo(innerWidth * 0.5, revealThickness * 0.4);
      revealOpening.closePath();
      revealShape.holes.push(revealOpening);

      const group = new THREE.Group();
      group.position.set(
        candidate.middleX + candidate.outwardX * 0.2,
        WATER_LEVEL - 0.018,
        candidate.middleZ + candidate.outwardZ * 0.2,
      );
      group.rotation.y = -Math.atan2(
        candidate.b[1] - candidate.a[1],
        candidate.b[0] - candidate.a[0],
      );
      const cavity = new THREE.Mesh(new THREE.ShapeGeometry(openingShape, 8), cavityMaterial);
      cavity.position.z = -cavityDepth - 0.004;
      cavity.renderOrder = 3;
      group.add(cavity);
      const reveal = new THREE.Mesh(
        new THREE.ExtrudeGeometry(revealShape, {
          depth: cavityDepth,
          steps: 1,
          bevelEnabled: false,
          curveSegments: 5,
        }),
        revealMaterial,
      );
      reveal.position.z = -cavityDepth;
      reveal.renderOrder = 4;
      group.add(reveal);
      const crown = new THREE.Mesh(
        new THREE.TorusGeometry(width * 0.38, 0.035, 6, 18, Math.PI),
        trimMaterial,
      );
      crown.position.y = shoulder;
      crown.renderOrder = 5;
      group.add(crown);
      for (const x of [-width * 0.5, width * 0.5]) {
        const pier = new THREE.Mesh(new THREE.BoxGeometry(0.055, shoulder, 0.045), trimMaterial);
        pier.position.set(x, shoulder * 0.5, 0.008);
        pier.renderOrder = 5;
        group.add(pier);
      }
      const runoffPhase = hash(
        Math.round(candidate.middleX * 10),
        Math.round(candidate.middleZ * 10),
        candidate.index + 73,
      );
      const outletY = Math.max(0.48, shoulder * 1.08);
      const streamLength = Math.max(0.46, outletY - 0.015);
      const runoffShadow = new THREE.Mesh(runoffShadowGeometry, runoffShadowMaterial.clone());
      runoffShadow.position.set(0, outletY - streamLength * 0.5, -cavityDepth - 0.046);
      runoffShadow.renderOrder = 6;
      runoffShadow.userData.waterEffect = "drainStream";
      runoffShadow.userData.waterPhase = runoffPhase;
      runoffShadow.userData.waterTop = outletY;
      runoffShadow.userData.waterLength = streamLength;
      runoffShadow.userData.waterOpacity = 0.8;
      this.activeWaterEffects.add(runoffShadow);
      group.add(runoffShadow);
      const runoff = new THREE.Mesh(runoffGeometry, runoffMaterial.clone());
      runoff.position.set(0, outletY - streamLength * 0.5, -cavityDepth - 0.055);
      runoff.renderOrder = 7;
      runoff.userData.waterEffect = "drainStream";
      runoff.userData.waterPhase = runoffPhase;
      runoff.userData.waterTop = outletY;
      runoff.userData.waterLength = streamLength;
      runoff.userData.waterOpacity = 1;
      this.activeWaterEffects.add(runoff);
      group.add(runoff);
      const runoffImpact = new THREE.Mesh(runoffImpactGeometry, runoffImpactMaterial.clone());
      runoffImpact.rotation.x = -Math.PI / 2;
      runoffImpact.position.set(0, 0.052, -cavityDepth - 0.085);
      runoffImpact.renderOrder = 8;
      group.add(runoffImpact);
      for (let rippleIndex = 0; rippleIndex < 2; rippleIndex += 1) {
        const runoffRipple = new THREE.Mesh(runoffRippleGeometry, runoffRippleMaterial.clone());
        runoffRipple.rotation.x = -Math.PI / 2;
        runoffRipple.position.set(0, 0.055 + rippleIndex * 0.003, -cavityDepth - 0.085);
        runoffRipple.renderOrder = 9;
        runoffRipple.userData.waterEffect = "drainRipple";
        runoffRipple.userData.waterPhase = (runoffPhase + rippleIndex * 0.5) % 1;
        runoffRipple.userData.waterOpacity = 0.88 - rippleIndex * 0.12;
        this.activeWaterEffects.add(runoffRipple);
        group.add(runoffRipple);
      }
      for (let dropIndex = 0; dropIndex < 2; dropIndex += 1) {
        const runoffDrop = new THREE.Mesh(runoffDropGeometry, runoffDropMaterial.clone());
        runoffDrop.position.set(0, 0.06, -cavityDepth - 0.085);
        runoffDrop.renderOrder = 10;
        runoffDrop.userData.waterEffect = "drainSplash";
        runoffDrop.userData.waterPhase = (runoffPhase + dropIndex * 0.17) % 1;
        runoffDrop.userData.waterBaseX = 0;
        runoffDrop.userData.waterBaseZ = -cavityDepth - 0.085;
        runoffDrop.userData.waterOpacity = 0.72;
        this.activeWaterEffects.add(runoffDrop);
        group.add(runoffDrop);
      }
      this.islandFoundationRoot.add(group);
    }
    runoffImpactMaterial.dispose();
    runoffShadowMaterial.dispose();
    runoffMaterial.dispose();
    runoffRippleMaterial.dispose();
    runoffDropMaterial.dispose();
  }
  private addIslandDock(outline: readonly Point2[]): void {
    if (outline.length < 3) return;
    const center = polygonCenter(outline);
    let dockIndex = 0;
    let bestScore = -Infinity;
    for (let index = 0; index < outline.length; index += 1) {
      const a = outline[index]!;
      const b = outline[(index + 1) % outline.length]!;
      const middleX = (a[0] + b[0]) * 0.5;
      const middleZ = (a[1] + b[1]) * 0.5;
      const radialX = middleX - center[0];
      const radialZ = middleZ - center[1];
      const radialLength = Math.max(0.001, Math.hypot(radialX, radialZ));
      const score = (radialX + radialZ) / radialLength;
      if (score <= bestScore) continue;
      bestScore = score;
      dockIndex = index;
    }
    const a = outline[dockIndex]!;
    const b = outline[(dockIndex + 1) % outline.length]!;
    const middleX = (a[0] + b[0]) * 0.5;
    const middleZ = (a[1] + b[1]) * 0.5;
    const radialX = middleX - center[0];
    const radialZ = middleZ - center[1];
    const radialLength = Math.max(0.001, Math.hypot(radialX, radialZ));
    const outwardX = radialX / radialLength;
    const outwardZ = radialZ / radialLength;
    const width = 1.02;
    const dock = new THREE.Group();
    dock.position.set(middleX + outwardX * 0.04, 0, middleZ + outwardZ * 0.04);
    dock.rotation.y = Math.atan2(outwardX, outwardZ);
    const wood = new THREE.MeshStandardMaterial({
      color: 0xb49468,
      roughness: 0.78,
      map: this.noiseTexture,
      bumpMap: this.noiseTexture,
      bumpScale: 0.012,
    });
    const rail = new THREE.MeshStandardMaterial({ color: 0x3f5350, roughness: 0.86 });
    const deck = new THREE.Mesh(new THREE.BoxGeometry(width, 0.1, 1.58), wood);
    deck.position.set(0, WATER_LEVEL + 0.14, 0.82);
    deck.castShadow = deck.receiveShadow = true;
    dock.add(deck);
    const dockShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(width * 1.12, 1.7),
      new THREE.MeshBasicMaterial({
        color: 0x17484b,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    dockShadow.rotation.x = -Math.PI / 2;
    dockShadow.position.set(0, WATER_LEVEL + 0.021, 0.82);
    dockShadow.renderOrder = 4;
    dock.add(dockShadow);
    for (const x of [-width * 0.38, width * 0.38]) {
      for (const z of [0.42, 1.25]) {
        const support = new THREE.Mesh(
          new THREE.CylinderGeometry(0.055, 0.075, 0.44, 7),
          rail,
        );
        support.position.set(x, WATER_LEVEL - 0.13, z);
        support.castShadow = true;
        dock.add(support);
      }
    }
    const rampRun = 0.86;
    const rampTop = BUILDING_BASE + 0.015;
    const rampBottom = WATER_LEVEL + 0.2;
    const rampRise = rampTop - rampBottom;
    const ramp = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.86, 0.1, Math.hypot(rampRun, rampRise)),
      wood,
    );
    ramp.position.set(0, (rampTop + rampBottom) * 0.5, rampRun * 0.46);
    ramp.rotation.x = Math.atan2(rampRise, rampRun);
    ramp.castShadow = ramp.receiveShadow = true;
    dock.add(ramp);
    for (const x of [-width * 0.4, width * 0.4]) {
      const bollard = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.07, 0.38, 7),
        rail,
      );
      bollard.position.set(x, WATER_LEVEL + 0.21, 1.42);
      bollard.castShadow = true;
      dock.add(bollard);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 5), rail);
      cap.position.set(x, WATER_LEVEL + 0.405, 1.42);
      cap.castShadow = true;
      dock.add(cap);
    }
    const crateMaterial = new THREE.MeshStandardMaterial({ color: 0x866542, roughness: 0.96 });
    const crate = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.2, 0.24), crateMaterial);
    crate.position.set(0.2, WATER_LEVEL + 0.29, 1.08);
    crate.rotation.y = 0.18;
    crate.castShadow = true;
    dock.add(crate);
    const parcel = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 0.2), crateMaterial);
    parcel.position.set(-0.08, WATER_LEVEL + 0.26, 1.18);
    parcel.rotation.y = -0.12;
    parcel.castShadow = true;
    dock.add(parcel);

    const boatShape = new THREE.Shape();
    boatShape.moveTo(0, -0.78);
    boatShape.quadraticCurveTo(-0.31, -0.5, -0.26, 0.5);
    boatShape.quadraticCurveTo(-0.2, 0.7, 0, 0.82);
    boatShape.quadraticCurveTo(0.2, 0.7, 0.26, 0.5);
    boatShape.quadraticCurveTo(0.31, -0.5, 0, -0.78);
    boatShape.closePath();
    const skiff = new THREE.Group();
    skiff.position.set(-1.34, WATER_LEVEL + 0.145, 1.08);
    skiff.rotation.y = -0.08;
    const hullGeometry = new THREE.ExtrudeGeometry(boatShape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.035,
      bevelThickness: 0.035,
      curveSegments: 18,
    });
    hullGeometry.rotateX(Math.PI / 2);
    const hull = new THREE.Mesh(
      hullGeometry,
      new THREE.MeshStandardMaterial({
        color: 0xc55f52,
        roughness: 0.72,
        side: THREE.DoubleSide,
      }),
    );
    hull.castShadow = hull.receiveShadow = true;
    skiff.add(hull);
    skiff.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(hullGeometry, 26),
      new THREE.LineBasicMaterial({ color: 0xf0d29f, transparent: true, opacity: 0.86 }),
    ));
    const cockpit = new THREE.Mesh(
      new THREE.ShapeGeometry(boatShape, 18),
      new THREE.MeshStandardMaterial({ color: 0x36575a, roughness: 0.91, side: THREE.DoubleSide }),
    );
    cockpit.rotation.x = Math.PI / 2;
    cockpit.position.y = 0.012;
    cockpit.scale.set(0.7, 0.74, 0.7);
    skiff.add(cockpit);
    for (const z of [-0.2, 0.2]) {
      const bench = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.045, 0.09), wood);
      bench.position.set(0, 0.045, z);
      bench.castShadow = true;
      skiff.add(bench);
    }
    const oar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.022, 0.82, 6),
      new THREE.MeshStandardMaterial({ color: 0x8b6845, roughness: 0.96 }),
    );
    oar.position.set(0, 0.1, 0.04);
    oar.rotation.set(0, 0, Math.PI / 2);
    oar.rotateY(0.32);
    oar.castShadow = true;
    skiff.add(oar);
    const skiffContact = new THREE.Mesh(
      new THREE.RingGeometry(0.8, 1, 48),
      new THREE.MeshBasicMaterial({
        color: 0x17484b,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    skiffContact.rotation.x = -Math.PI / 2;
    skiffContact.position.y = -0.12;
    skiffContact.scale.set(0.38, 0.88, 1);
    skiffContact.renderOrder = 4;
    skiff.add(skiffContact);
    const skiffWake = new THREE.Mesh(
      new THREE.RingGeometry(0.94, 1, 64),
      new THREE.MeshBasicMaterial({
        color: MATERIAL_COLORS.foam,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    skiffWake.rotation.x = -Math.PI / 2;
    skiffWake.position.y = -0.112;
    skiffWake.scale.set(0.54, 1.12, 1);
    skiffWake.renderOrder = 5;
    skiff.add(skiffWake);
    dock.add(skiff);

    const mooringRope = new THREE.Mesh(
      new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(-width * 0.4, WATER_LEVEL + 0.4, 1.4),
          new THREE.Vector3(-0.86, WATER_LEVEL + 0.25, 1.58),
          new THREE.Vector3(-1.34, WATER_LEVEL + 0.18, 1.82),
        ]),
        12,
        0.012,
        5,
        false,
      ),
      new THREE.MeshStandardMaterial({ color: 0xb7a37d, roughness: 1 }),
    );
    mooringRope.castShadow = true;
    dock.add(mooringRope);
    this.islandFoundationRoot.add(dock);
  }

  private updateAmbientWater(snapshot: WorldSnapshot): void {
    for (const child of [...this.ambientWaterRoot.children]) {
      child.traverse((object) => this.activeWaterEffects.delete(object));
      this.ambientWaterRoot.remove(child);
      disposeTree(child);
    }
    const cells = snapshot.cells.filter((cell) => cell.foundation);
    if (cells.length === 0) return;
    const centerX = (
      Math.min(...cells.map((cell) => cell.x))
      + Math.max(...cells.map((cell) => cell.x))
    ) * CELL_SIZE * 0.5;
    const centerZ = (
      Math.min(...cells.map((cell) => cell.z))
      + Math.max(...cells.map((cell) => cell.z))
    ) * CELL_SIZE * 0.5;
    const halfWidth = (
      Math.max(...cells.map((cell) => cell.x))
      - Math.min(...cells.map((cell) => cell.x))
      + 1
    ) * CELL_SIZE * 0.5 + FEATURE_TUNING.shorelineOverhang;
    const halfDepth = (
      Math.max(...cells.map((cell) => cell.z))
      - Math.min(...cells.map((cell) => cell.z))
      + 1
    ) * CELL_SIZE * 0.5 + FEATURE_TUNING.shorelineOverhang;
    const rings = [
      { offset: 0.24, opacity: 0.085, start: 0.08, length: Math.PI * 1.72 },
      { offset: 0.78, opacity: 0.045, start: 0.72, length: Math.PI * 1.22 },
      { offset: 1.35, opacity: 0.025, start: 3.34, length: Math.PI * 0.96 },
    ] as const;
    rings.forEach((ringData, index) => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(1, 1.018, 128, 1, ringData.start, ringData.length),
        new THREE.MeshBasicMaterial({
          color: 0xeff2dd,
          transparent: true,
          opacity: ringData.opacity,
          depthWrite: false,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.scale.set(halfWidth + ringData.offset, halfDepth + ringData.offset, 1);
      ring.userData.waveBaseX = halfWidth + ringData.offset;
      ring.userData.waveBaseZ = halfDepth + ringData.offset;
      ring.userData.waveOpacity = ringData.opacity;
      ring.userData.wavePhase = index / rings.length;
      ring.position.set(centerX, WATER_LEVEL + 0.026, centerZ);
      ring.renderOrder = 3;
      this.ambientWaterRoot.add(ring);
    });
  }

  private addWaterContact(
    parent: THREE.Group,
    x: number,
    z: number,
    exposed: EdgeMask,
    ripple: boolean,
  ): void {
    const points = insetPolygon(cellPolygon(x, z), -FEATURE_TUNING.shorelineOverhang);
    EDGE_NAMES.forEach((name, index) => {
      if (!exposed[name]) return;
      const a = points[index]!;
      const b = points[(index + 1) % 4]!;
      const dx = b[0] - a[0];
      const dz = b[1] - a[1];
      const length = Math.hypot(dx, dz);
      const outwardX = dz / length;
      const outwardZ = -dx / length;
      const middleX = (a[0] + b[0]) * 0.5;
      const middleZ = (a[1] + b[1]) * 0.5;
      const rotation = -Math.atan2(dz, dx);


      const foamWash = new THREE.Mesh(
        new THREE.BoxGeometry(length * 1.08, 0.006, 0.22),
        new THREE.MeshBasicMaterial({
          color: MATERIAL_COLORS.foam,
          alphaMap: this.foamTexture,
          transparent: true,
          opacity: 0.18,
          depthWrite: false,
        }),
      );
      foamWash.position.set(middleX + outwardX * 0.16, WATER_LEVEL + 0.029, middleZ + outwardZ * 0.16);
      foamWash.rotation.y = rotation;
      foamWash.renderOrder = 3;
      foamWash.userData.waterEffect = "shoreCrest";
      foamWash.userData.waterPhase = hash(x, z, index + 101);
      foamWash.userData.waterBaseX = foamWash.position.x;
      foamWash.userData.waterBaseZ = foamWash.position.z;
      foamWash.userData.waterOutwardX = outwardX;
      foamWash.userData.waterOutwardZ = outwardZ;
      foamWash.userData.waterOpacity = 0.3;
      this.activeWaterEffects.add(foamWash);
      parent.add(foamWash);
      const contact = new THREE.Mesh(
        new THREE.BoxGeometry(length * 1.05, 0.018, 0.065),
        new THREE.MeshBasicMaterial({
          color: 0x315b60,
          transparent: true,
          opacity: 0.48,
          depthWrite: false,
        }),
      );
      contact.position.set(middleX + outwardX * 0.035, WATER_LEVEL + 0.027, middleZ + outwardZ * 0.035);
      contact.rotation.y = rotation;
      contact.renderOrder = 3;
      parent.add(contact);
      const meniscus = new THREE.Mesh(
        new THREE.BoxGeometry(length * 1.08, 0.016, 0.08),
        new THREE.MeshBasicMaterial({
          color: 0xe5eee1,
          transparent: true,
          opacity: 0.42,
          depthWrite: false,
        }),
      );
      meniscus.position.set(middleX + outwardX * 0.095, WATER_LEVEL + 0.041, middleZ + outwardZ * 0.095);
      meniscus.rotation.y = rotation;
      meniscus.renderOrder = 3;
      meniscus.userData.waterEffect = "shoreCrest";
      meniscus.userData.waterPhase = (hash(x, z, index + 101) + 0.42) % 1;
      meniscus.userData.waterBaseX = meniscus.position.x;
      meniscus.userData.waterBaseZ = meniscus.position.z;
      meniscus.userData.waterOutwardX = outwardX;
      meniscus.userData.waterOutwardZ = outwardZ;
      meniscus.userData.waterOpacity = 0.48;
      this.activeWaterEffects.add(meniscus);
      parent.add(meniscus);
    });

    if (!ripple) return;
    const center = polygonCenter(points);
    for (let index = 0; index < 2; index += 1) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(CELL_SIZE * (0.62 + index * 0.16), CELL_SIZE * (0.65 + index * 0.16), 64),
        new THREE.MeshBasicMaterial({
          color: 0xf4f0d2,
          transparent: true,
          opacity: 0.46 - index * 0.16,
          depthWrite: false,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(center[0], WATER_LEVEL + 0.035, center[1]);
      ring.userData.ripplePhase = index * 0.24;
      ring.userData.rippleStart = performance.now() / 1000;
      ring.userData.rippleOpacity = 0.46 - index * 0.16;
      this.activeRipples.add(ring);
      parent.add(ring);
    }
  }

  private addTimberSupport(
    parent: THREE.Group,
    x: number,
    z: number,
    colorIndex: number,
    exposed: EdgeMask,
    supportTopY: number = BUILDING_BASE,
  ): void {
    const palette = PALETTE[colorIndex % PALETTE.length] ?? PALETTE[0]!;
    const points = insetPolygon(cellPolygon(x, z), 0.09);
    const center = polygonCenter(points);
    const bottomY = WATER_LEVEL + 0.035;
    const topY = supportTopY - 0.02;
    const height = Math.max(0.24, topY - bottomY);
    const woodMaterial = new THREE.MeshStandardMaterial({
      color: paint(palette.trim, -0.08, -0.12),
      roughness: 0.88,
      map: this.noiseTexture,
      bumpMap: this.noiseTexture,
      bumpScale: 0.014,
    });
    const braceMaterial = new THREE.MeshStandardMaterial({
      color: paint(MATERIAL_COLORS.ink, -0.08, -0.02),
      roughness: 0.82,
    });
    const deck = new THREE.Mesh(
      polygonPrismGeometry(points, 0.08, ALL_EDGES, 0.02),
      woodMaterial,
    );
    deck.position.y = topY - 0.08;
    deck.castShadow = deck.receiveShadow = true;
    parent.add(deck);

    for (const [px, pz] of points) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, height, 0.12), woodMaterial);
      post.position.set(
        THREE.MathUtils.lerp(px, center[0], 0.1),
        bottomY + height * 0.5,
        THREE.MathUtils.lerp(pz, center[1], 0.1),
      );
      post.castShadow = post.receiveShadow = true;
      parent.add(post);
    }

    EDGE_NAMES.forEach((name, index) => {
      const a = points[index]!;
      const b = points[(index + 1) % points.length]!;
      const dx = b[0] - a[0];
      const dz = b[1] - a[1];
      const length = Math.hypot(dx, dz);
      const beam = new THREE.Mesh(new THREE.BoxGeometry(length, 0.1, 0.1), woodMaterial);
      beam.position.set((a[0] + b[0]) * 0.5, topY - 0.065, (a[1] + b[1]) * 0.5);
      beam.rotation.y = -Math.atan2(dz, dx);
      beam.castShadow = true;
      parent.add(beam);
      if (!exposed[name]) return;
      const start = new THREE.Vector3(a[0], bottomY + 0.045, a[1]);
      const end = new THREE.Vector3(b[0], topY - 0.11, b[1]);
      const delta = end.clone().sub(start);
      const brace = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, delta.length(), 6), braceMaterial);
      brace.position.copy(start).add(end).multiplyScalar(0.5);
      brace.quaternion.setFromUnitVectors(UP, delta.normalize());
      brace.castShadow = true;
      parent.add(brace);
    });
  }

  private addLevel(
    parent: THREE.Group,
    id: string,
    x: number,
    z: number,
    level: number,
    colorIndex: number,
    exposed: EdgeMask,
    top: boolean,
    sameHeight: EdgeMask,
    higherNeighbors: EdgeMask,
    faceSeeds: readonly number[],
  ): void {
    const palette = PALETTE[colorIndex % PALETTE.length] ?? PALETTE[0]!;
    const seed = hash(x, z, level);
    const halfTimberFloor = level > 0 && hash(x, z, level + 1703) > 0.82;
    const points = insetPolygonEdges(
      cellPolygon(x, z),
      FEATURE_TUNING.wallInset * (0.72 + seed * 0.22),
      exposed,
    );
    const height = LEVEL_HEIGHT * 0.98;
    const material = new THREE.MeshStandardMaterial({
      color: paint(palette.wall, 0.035, seed * 0.035 + 0.04),
      roughness: MATERIAL_TUNING.plasterRoughness,
      map: this.noiseTexture,
      bumpMap: this.noiseTexture,
      bumpScale: 0.022,
    });
    const body = new THREE.Mesh(polygonPrismGeometry(points, height, exposed, 0.085), material);
    body.position.y = BUILDING_BASE + level * LEVEL_HEIGHT;
    const contactShade = new THREE.Mesh(
      polygonPrismGeometry(points, 0.14, exposed, 0.025),
      new THREE.MeshBasicMaterial({ color: tint(palette.wallShadow, -0.08), transparent: true, opacity: 0.52, depthWrite: false }),
    );
    contactShade.position.y = body.position.y - 0.025;
    parent.add(contactShade);
    const center = polygonCenter(points);
    points.forEach(([px, pz], index) => {
      const previousEdge = EDGE_NAMES[(index + 3) % 4]!;
      const nextEdge = EDGE_NAMES[index]!;
      if (!exposed[previousEdge] || !exposed[nextEdge]) return;
      const corner = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, height - 0.07, 5), material);
      corner.position.set(px + (center[0] - px) * 0.025, body.position.y + height * 0.5 - 0.035, pz + (center[1] - pz) * 0.025);
      corner.rotation.y = hash(x + index, z, level) * 0.35;
      corner.castShadow = true;
      parent.add(corner);
    });
    body.castShadow = body.receiveShadow = true;
    body.userData.cellPick = { id, x, z, level: level + 1, kind: "house" } satisfies CellPick;
    parent.add(body);
    this.pickTargets.push(body);
    const edges = new THREE.LineSegments(
      new THREE.EdgesGeometry(body.geometry, 34),
      new THREE.LineBasicMaterial({
        color: INK,
        transparent: true,
        opacity: MATERIAL_TUNING.inkOpacity * 0.74,
      }),
    );
    edges.position.copy(body.position);
    parent.add(edges);

    const supported = EDGE_NAMES.some((name) => sameHeight[name]);
    EDGE_NAMES.forEach((name, index) => {
      if (!exposed[name]) return;
      this.addFacade(parent, points[index]!, points[(index + 1) % 4]!, level, palette, faceSeeds[index] ?? 0.5, supported, exposed, halfTimberFloor);
    });
    if (top) this.addRoof(parent, level + 1, palette, seed, points, exposed, sameHeight, higherNeighbors);
  }


  private addFacadeMasonry(
    parent: THREE.Group,
    a: Point2,
    b: Point2,
    level: number,
    palette: (typeof PALETTE)[number],
    seed: number,
  ): void {
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const length = Math.hypot(dx, dz);
    const tangentX = dx / length;
    const tangentZ = dz / length;
    const outwardX = dz / length;
    const outwardZ = -dx / length;
    const middleX = (a[0] + b[0]) * 0.5;
    const middleZ = (a[1] + b[1]) * 0.5;
    const rotation = -Math.atan2(dz, dx);
    const mortar = new THREE.Mesh(
      new THREE.BoxGeometry(length * 0.985, LEVEL_HEIGHT - 0.3, 0.03),
      new THREE.MeshStandardMaterial({
        color: paint(palette.wall, -0.03, -0.1),
        roughness: 0.96,
      }),
    );
    mortar.position.set(
      middleX + outwardX * 0.024,
      BUILDING_BASE + level * LEVEL_HEIGHT + LEVEL_HEIGHT * 0.5 + 0.01,
      middleZ + outwardZ * 0.024,
    );
    mortar.rotation.y = rotation;
    mortar.receiveShadow = true;
    parent.add(mortar);
    const columns = Math.max(3, Math.ceil(length / 0.42));
    const rows = 4;
    const blockWidth = length / columns;
    const blockHeight = (LEVEL_HEIGHT - 0.32) / rows;
    const masonry = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.93,
        map: this.noiseTexture,
      }),
      columns * rows,
    );
    const dummy = new THREE.Object3D();
    let instance = 0;
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const along = -length * 0.5 + (column + 0.5) * blockWidth;
        const variation = hash(
          Math.round(seed * 1000) + column * 31,
          level * 47 + row * 19,
          columns,
        );
        dummy.position.set(
          middleX + tangentX * along + outwardX * 0.03,
          BUILDING_BASE + level * LEVEL_HEIGHT + 0.18 + (row + 0.5) * blockHeight,
          middleZ + tangentZ * along + outwardZ * 0.03,
        );
        dummy.rotation.set(0, rotation, 0);
        dummy.scale.set(
          Math.max(0.08, blockWidth - 0.055),
          Math.max(0.08, blockHeight - 0.05),
          0.02,
        );
        dummy.updateMatrix();
        masonry.setMatrixAt(instance, dummy.matrix);
        masonry.setColorAt(
          instance,
          paint(
            palette.wall,
            (variation - 0.5) * 0.07,
            (variation - 0.5) * 0.15 + (row / (rows - 1) - 0.5) * 0.09,
          ),
        );
        instance += 1;
      }
    }
    masonry.instanceMatrix.needsUpdate = true;
    if (masonry.instanceColor) masonry.instanceColor.needsUpdate = true;
    masonry.castShadow = masonry.receiveShadow = true;
    parent.add(masonry);
  }

  private addHalfTimberFacade(
    parent: THREE.Group,
    a: Point2,
    b: Point2,
    level: number,
    palette: (typeof PALETTE)[number],
  ): void {
    if (level === 0) return;
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const length = Math.hypot(dx, dz);
    const outwardX = dz / length;
    const outwardZ = -dx / length;
    const panelHeight = LEVEL_HEIGHT * 0.68;
    const panelWidth = length * 0.91;
    const braceWidth = Math.min(0.36, panelWidth * 0.18);
    const beamTransforms = [
      { x: -panelWidth * 0.5, y: 0, width: 0.065, height: panelHeight, angle: 0 },
      { x: panelWidth * 0.5, y: 0, width: 0.065, height: panelHeight, angle: 0 },
      { x: 0, y: -panelHeight * 0.5, width: panelWidth, height: 0.055, angle: 0 },
      { x: 0, y: panelHeight * 0.5, width: panelWidth, height: 0.055, angle: 0 },
      {
        x: -panelWidth * 0.5 + braceWidth * 0.42,
        y: panelHeight * 0.37,
        width: braceWidth,
        height: 0.05,
        angle: 0.58,
      },
      {
        x: panelWidth * 0.5 - braceWidth * 0.42,
        y: panelHeight * 0.37,
        width: braceWidth,
        height: 0.05,
        angle: -0.58,
      },
    ] as const;
    const beams = new THREE.InstancedMesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({
        color: paint(palette.roof, -0.02, -0.18),
        roughness: 0.92,
        map: this.noiseTexture,
      }),
      beamTransforms.length,
    );
    beams.position.set(
      (a[0] + b[0]) * 0.5 + outwardX * 0.052,
      BUILDING_BASE + level * LEVEL_HEIGHT + LEVEL_HEIGHT * 0.54,
      (a[1] + b[1]) * 0.5 + outwardZ * 0.052,
    );
    beams.rotation.y = -Math.atan2(dz, dx);
    const dummy = new THREE.Object3D();
    beamTransforms.forEach((beam, index) => {
      dummy.position.set(beam.x, beam.y, 0);
      dummy.rotation.set(0, 0, beam.angle);
      dummy.scale.set(beam.width, beam.height, 0.055);
      dummy.updateMatrix();
      beams.setMatrixAt(index, dummy.matrix);
    });
    beams.instanceMatrix.needsUpdate = true;
    beams.castShadow = beams.receiveShadow = true;
    parent.add(beams);
  }

  private addFacade(
    parent: THREE.Group,
    a: Point2,
    b: Point2,
    level: number,
    palette: (typeof PALETTE)[number],
    seed: number,
    supported: boolean,
    exposed: EdgeMask,
    halfTimberFloor: boolean,
  ): void {
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const length = Math.hypot(dx, dz);
    const tangentX = dx / length;
    const tangentZ = dz / length;
    const outwardX = dz / length;
    const outwardZ = -dx / length;
    const middleX = (a[0] + b[0]) * 0.5;
    const middleZ = (a[1] + b[1]) * 0.5;
    const rotation = -Math.atan2(dz, dx);
    const exposedCount = EDGE_NAMES.filter((name) => exposed[name]).length;
    const arcade = level === 0 && exposedCount <= 2 && seed > 0.92;
    const isDoor = level === 0 && !arcade && seed > 0.78;
    const count = arcade || isDoor || seed > 0.72 ? 1 : seed < 0.22 ? 3 : 2;
    const trimMaterial = new THREE.MeshStandardMaterial({
      color: paint(palette.trim, 0.03, 0.055),
      roughness: MATERIAL_TUNING.trimRoughness,
    });
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0x294f5c,
      emissive: 0x102b34,
      emissiveIntensity: 0.18,
      roughness: 0.24,
      metalness: 0.08,
    });
    const accentMaterial = new THREE.MeshStandardMaterial({
      color: paint(palette.roof, 0.02, -0.035),
      roughness: 0.86,
    });
    const bayMaterial = new THREE.MeshStandardMaterial({
      color: paint(palette.wall, 0.025, -0.055),
      roughness: 0.9,
      map: this.noiseTexture,
    });
    this.addFacadeMasonry(parent, a, b, level, palette, seed);
    if (halfTimberFloor) this.addHalfTimberFacade(parent, a, b, level, palette);
    const wallCourse = new THREE.Mesh(
      new THREE.BoxGeometry(length * 0.98, 0.045, 0.085),
      trimMaterial,
    );
    wallCourse.position.set(
      middleX + outwardX * 0.075,
      BUILDING_BASE + (level + 1) * LEVEL_HEIGHT - 0.13,
      middleZ + outwardZ * 0.075,
    );
    wallCourse.rotation.y = rotation;
    wallCourse.castShadow = true;
    parent.add(wallCourse);
    const levelBelt = new THREE.Mesh(
      new THREE.BoxGeometry(length * 1.01, 0.038, 0.075),
      trimMaterial,
    );
    levelBelt.position.set(
      middleX + outwardX * 0.065,
      BUILDING_BASE + level * LEVEL_HEIGHT + 0.16,
      middleZ + outwardZ * 0.065,
    );
    levelBelt.rotation.y = rotation;
    levelBelt.castShadow = true;
    parent.add(levelBelt);
    const muntinPositions: number[] = [];
    for (let index = 0; index < count; index += 1) {
      const spacing = Math.min(0.76, length * 0.34);
      const along = count === 1 ? (seed - 0.5) * 0.16 : (index - (count - 1) * 0.5) * spacing;
      const frameW = arcade ? 0.58 : isDoor ? 0.46 : count === 3 ? 0.34 : 0.44 + (seed % 0.1);
      const frameH = arcade ? 0.98 : isDoor ? 1.08 : 0.68 + (seed % 0.14);
      const isBay = level > 0 && !arcade && !isDoor && count === 1;
      const px = middleX + tangentX * along + outwardX * 0.06;
      const pz = middleZ + tangentZ * along + outwardZ * 0.06;
      const frame = new THREE.Group();
      frame.position.set(
        px + outwardX * (isBay ? 0.2 : 0),
        BUILDING_BASE + (isDoor || arcade ? level * LEVEL_HEIGHT + frameH * 0.5 : level * LEVEL_HEIGHT + 0.88),
        pz + outwardZ * (isBay ? 0.2 : 0),
      );
      frame.rotation.y = rotation;
      if (isBay) {
        const bay = new THREE.Mesh(
          new THREE.BoxGeometry(frameW * 1.38, frameH * 1.12, 0.24),
          bayMaterial,
        );
        bay.position.copy(frame.position).add(new THREE.Vector3(-outwardX * 0.1, 0, -outwardZ * 0.1));
        bay.rotation.y = rotation;
        bay.castShadow = true;
        parent.add(bay);
        const bayCap = new THREE.Mesh(
          new THREE.BoxGeometry(frameW * 1.5, 0.08, 0.36),
          accentMaterial,
        );
        bayCap.position.copy(frame.position).add(new THREE.Vector3(
          outwardX * 0.025,
          frameH * 0.6,
          outwardZ * 0.025,
        ));
        bayCap.rotation.y = rotation;
        bayCap.castShadow = true;
        parent.add(bayCap);
      }
      const horizontalFrameGeometry = new THREE.BoxGeometry(frameW, 0.048, 0.1);
      const verticalFrameGeometry = new THREE.BoxGeometry(0.048, frameH, 0.1);
      for (const offsetY of [-frameH * 0.5 + 0.03, frameH * 0.5 - 0.03]) {
        const bar = new THREE.Mesh(horizontalFrameGeometry, trimMaterial);
        bar.position.y = offsetY;
        bar.castShadow = true;
        frame.add(bar);
      }
      for (const offsetX of [-frameW * 0.5 + 0.03, frameW * 0.5 - 0.03]) {
        const bar = new THREE.Mesh(verticalFrameGeometry, trimMaterial);
        bar.position.x = offsetX;
        bar.castShadow = true;
        frame.add(bar);
      }
      if (!arcade && !isDoor && seed > 0.42 && seed < 0.7) {
        const shutterGeometry = new THREE.BoxGeometry(frameW * 0.16, frameH * 0.72, 0.075);
        for (const shutterX of [-frameW * 0.56, frameW * 0.56]) {
          const shutter = new THREE.Mesh(shutterGeometry, accentMaterial);
          shutter.position.set(shutterX, 0, 0.025);
          shutter.castShadow = true;
          frame.add(shutter);
        }
      }
      parent.add(frame);
      const warmWindow = !arcade
        && !isDoor
        && hash(Math.round(seed * 1000), level * 17, index + 641) > 0.68;
      const openingMaterial = arcade
        ? new THREE.MeshStandardMaterial({ color: 0x496267, roughness: 0.88 })
        : warmWindow
          ? new THREE.MeshStandardMaterial({
            color: 0xe6a85e,
            emissive: 0xffa94f,
            emissiveIntensity: 1.25,
            roughness: 0.38,
          })
          : glassMaterial;
      const opening = new THREE.Mesh(
        new THREE.BoxGeometry(frameW * 0.8, frameH * (arcade ? 0.76 : 0.82), 0.08),
        openingMaterial,
      );
      opening.position.copy(frame.position).add(new THREE.Vector3(-outwardX * 0.055, arcade ? -0.1 : 0, -outwardZ * 0.055));
      opening.rotation.y = rotation;
      parent.add(opening);
      if (!arcade) {
        const sill = new THREE.Mesh(
          new THREE.BoxGeometry(frameW * 1.18, 0.055, 0.16),
          trimMaterial,
        );
        sill.position.copy(frame.position).add(new THREE.Vector3(outwardX * 0.105, -frameH * 0.5 - 0.025, outwardZ * 0.105));
        sill.rotation.y = rotation;
        sill.castShadow = true;
        parent.add(sill);
      }
      if (
        !arcade
        && !isDoor
        && (warmWindow || hash(Math.round(seed * 1000), level * 23, index + 719) > 0.78)
      ) {
        const planter = new THREE.Mesh(
          new THREE.BoxGeometry(frameW * 0.7, 0.09, 0.12),
          new THREE.MeshStandardMaterial({ color: 0x7b5940, roughness: 0.92 }),
        );
        planter.position.copy(frame.position).add(new THREE.Vector3(
          outwardX * 0.16,
          -frameH * 0.5 + 0.055,
          outwardZ * 0.16,
        ));
        planter.rotation.y = rotation;
        planter.castShadow = true;
        parent.add(planter);
        const foliageMaterial = new THREE.MeshStandardMaterial({
          color: 0x6f8f63,
          roughness: 0.9,
        });
        for (const offset of [-0.22, 0, 0.22]) {
          const foliage = new THREE.Mesh(new THREE.SphereGeometry(0.045, 7, 5), foliageMaterial);
          foliage.position.set(
            planter.position.x + tangentX * frameW * offset,
            planter.position.y + 0.09 + Math.abs(offset) * 0.025,
            planter.position.z + tangentZ * frameW * offset,
          );
          foliage.castShadow = true;
          parent.add(foliage);
          const flower = new THREE.Mesh(
            new THREE.SphereGeometry(0.022, 7, 5),
            new THREE.MeshStandardMaterial({
              color: offset === 0 ? 0xf2c867 : 0xe77b76,
              roughness: 0.74,
              emissive: offset === 0 ? 0x4a3008 : 0x3f1210,
              emissiveIntensity: 0.18,
            }),
          );
          flower.position.copy(foliage.position);
          flower.position.y += 0.04;
          flower.position.x += outwardX * 0.012;
          flower.position.z += outwardZ * 0.012;
          flower.castShadow = true;
          parent.add(flower);
        }
      }
      if (!arcade && !isDoor) {
        const mullionX = px + outwardX * 0.022;
        const mullionZ = pz + outwardZ * 0.022;
        const mullionY = frame.position.y;
        muntinPositions.push(
          mullionX, mullionY - frameH * 0.3, mullionZ,
          mullionX, mullionY + frameH * 0.3, mullionZ,
          mullionX - tangentX * frameW * 0.3, mullionY, mullionZ - tangentZ * frameW * 0.3,
          mullionX + tangentX * frameW * 0.3, mullionY, mullionZ + tangentZ * frameW * 0.3,
        );
      }
      if (arcade) {
        const arch = new THREE.Mesh(new THREE.TorusGeometry(frameW * 0.37, 0.055, 6, 18, Math.PI), trimMaterial);
        arch.position.set(px + outwardX * 0.04, BUILDING_BASE + level * LEVEL_HEIGHT + frameH * 0.76, pz + outwardZ * 0.04);
        arch.rotation.set(0, rotation, 0);
        parent.add(arch);
      } else if (!isDoor && !isBay && seed > 0.68) {
        const awning = new THREE.Mesh(
          new THREE.BoxGeometry(frameW * 1.16, 0.07, 0.32),
          new THREE.MeshStandardMaterial({ color: palette.roof, roughness: 0.8 }),
        );
        awning.position.copy(frame.position).add(new THREE.Vector3(outwardX * 0.15, frameH * 0.6, outwardZ * 0.15));
        awning.rotation.y = rotation;
        parent.add(awning);
      }
    }
    if (muntinPositions.length > 0) {
      const muntinGeometry = new THREE.BufferGeometry();
      muntinGeometry.setAttribute("position", new THREE.Float32BufferAttribute(muntinPositions, 3));
      parent.add(new THREE.LineSegments(
        muntinGeometry,
        new THREE.LineBasicMaterial({
          color: tint(palette.trim, 0.12),
          transparent: true,
          opacity: 0.88,
        }),
      ));
    }
    if (level > 0 && seed > 0.62 && (supported || (level >= 2 && seed > 0.84))) {
      const balconyLength = Math.min(1.15, length * 0.58);
      const balcony = new THREE.Mesh(
        new THREE.BoxGeometry(balconyLength, 0.1, 0.42),
        new THREE.MeshStandardMaterial({ color: palette.trim, roughness: 0.82 }),
      );
      balcony.position.set(middleX + outwardX * 0.22, BUILDING_BASE + level * LEVEL_HEIGHT + 0.5, middleZ + outwardZ * 0.22);
      balcony.rotation.y = rotation;
      parent.add(balcony);
      const railY = BUILDING_BASE + level * LEVEL_HEIGHT + 0.76;
      const railX = middleX + outwardX * 0.43;
      const railZ = middleZ + outwardZ * 0.43;
      const railHalf = balconyLength * 0.46;
      const railingMaterial = new THREE.MeshStandardMaterial({ color: INK, roughness: 0.78 });
      const topRail = new THREE.Mesh(new THREE.BoxGeometry(balconyLength * 0.94, 0.045, 0.045), railingMaterial);
      topRail.position.set(railX, railY, railZ);
      topRail.rotation.y = rotation;
      topRail.castShadow = true;
      parent.add(topRail);
      for (const offset of [-railHalf, 0, railHalf]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.28, 0.04), railingMaterial);
        post.position.set(
          railX + tangentX * offset,
          railY - 0.14,
          railZ + tangentZ * offset,
        );
        post.castShadow = true;
        parent.add(post);
      }
      const railPositions = [
        railX - tangentX * railHalf, railY, railZ - tangentZ * railHalf,
        railX + tangentX * railHalf, railY, railZ + tangentZ * railHalf,
      ];
      for (const offset of [-railHalf, 0, railHalf]) {
        railPositions.push(
          railX + tangentX * offset, railY - 0.24, railZ + tangentZ * offset,
          railX + tangentX * offset, railY, railZ + tangentZ * offset,
        );
      }
      const railGeometry = new THREE.BufferGeometry();
      railGeometry.setAttribute("position", new THREE.Float32BufferAttribute(railPositions, 3));
      parent.add(new THREE.LineSegments(
        railGeometry,
        new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.72 }),
      ));
      const clothColors = [paint(palette.roof, 0.08, 0.02), 0xe7c97e] as const;
      for (const [index, offset] of [-railHalf * 0.44, railHalf * 0.28].entries()) {
        const cloth = new THREE.Mesh(
          new THREE.BoxGeometry(index === 0 ? 0.19 : 0.16, index === 0 ? 0.23 : 0.18, 0.018),
          new THREE.MeshStandardMaterial({
            color: clothColors[index]!,
            roughness: 0.94,
            side: THREE.DoubleSide,
          }),
        );
        cloth.position.set(
          railX + tangentX * offset,
          railY - (index === 0 ? 0.13 : 0.1),
          railZ + tangentZ * offset,
        );
        cloth.rotation.y = rotation;
        cloth.castShadow = true;
        parent.add(cloth);
      }
    }
    if (seed > 0.34 && seed < 0.43) {
      const drainpipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.028, 0.035, LEVEL_HEIGHT * 0.86, 7),
        trimMaterial,
      );
      drainpipe.position.set(
        middleX + tangentX * length * 0.42 + outwardX * 0.075,
        BUILDING_BASE + level * LEVEL_HEIGHT + LEVEL_HEIGHT * 0.47,
        middleZ + tangentZ * length * 0.42 + outwardZ * 0.075,
      );
      drainpipe.castShadow = true;
      parent.add(drainpipe);
      if (level === 0) {
        const outletX = drainpipe.position.x + outwardX * 0.035;
        const outletZ = drainpipe.position.z + outwardZ * 0.035;
        const outletY = drainpipe.position.y - LEVEL_HEIGHT * 0.43;
        const runoffLength = Math.max(0.2, outletY - WATER_LEVEL - 0.055);
        const runoffPhase = hash(
          Math.round(outletX * 10),
          Math.round(outletZ * 10),
          149,
        );
        const runoff = new THREE.Mesh(
          new THREE.CylinderGeometry(0.012, 0.022, 1, 7),
          new THREE.MeshBasicMaterial({
            color: 0xbfe8e1,
            transparent: true,
            opacity: 0.62,
            depthWrite: false,
          }),
        );
        runoff.position.set(outletX, outletY - runoffLength * 0.5, outletZ);
        runoff.renderOrder = 6;
        runoff.userData.waterEffect = "drainStream";
        runoff.userData.waterPhase = runoffPhase;
        runoff.userData.waterTop = outletY;
        runoff.userData.waterLength = runoffLength;
        this.activeWaterEffects.add(runoff);
        parent.add(runoff);
        const runoffRipple = new THREE.Mesh(
          new THREE.RingGeometry(0.11, 0.138, 28),
          new THREE.MeshBasicMaterial({
            color: MATERIAL_COLORS.foam,
            transparent: true,
            opacity: 0.38,
            depthWrite: false,
            side: THREE.DoubleSide,
          }),
        );
        runoffRipple.rotation.x = -Math.PI / 2;
        runoffRipple.position.set(outletX, WATER_LEVEL + 0.052, outletZ + outwardZ * 0.055);
        runoffRipple.renderOrder = 6;
        runoffRipple.userData.waterEffect = "drainRipple";
        runoffRipple.userData.waterPhase = runoffPhase;
        runoffRipple.userData.waterOpacity = 0.38;
        this.activeWaterEffects.add(runoffRipple);
        parent.add(runoffRipple);
      }
    }
  }

  private addDormer(
    parent: THREE.Group,
    a: Point2,
    b: Point2,
    center: Point2,
    y: number,
    roofHeight: number,
    palette: (typeof PALETTE)[number],
    seed: number,
  ): void {
    const dx = b[0] - a[0];
    const dz = b[1] - a[1];
    const length = Math.hypot(dx, dz);
    const tangentX = dx / length;
    const tangentZ = dz / length;
    const edgeMiddleX = (a[0] + b[0]) * 0.5;
    const edgeMiddleZ = (a[1] + b[1]) * 0.5;
    const inset = 0.38;
    const along = (seed - 0.5) * Math.min(0.28, length * 0.12);
    const dormer = new THREE.Group();
    dormer.position.set(
      THREE.MathUtils.lerp(edgeMiddleX, center[0], inset) + tangentX * along,
      y + roofHeight * inset + 0.04,
      THREE.MathUtils.lerp(edgeMiddleZ, center[1], inset) + tangentZ * along,
    );
    dormer.rotation.y = -Math.atan2(dz, dx);

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: paint(palette.trim, -0.025, -0.035),
      roughness: MATERIAL_TUNING.plasterRoughness,
      map: this.noiseTexture,
    });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.28, 0.27), wallMaterial);
    body.position.y = 0.14;
    body.castShadow = true;
    dormer.add(body);

    const dormerRoof = new THREE.Mesh(
      roofGeometry([
        [-0.3, -0.19],
        [0.3, -0.19],
        [0.3, 0.19],
        [-0.3, 0.19],
      ], 0.22, "z"),
      new THREE.MeshStandardMaterial({
        color: paint(palette.roof, 0.045, -0.035),
        roughness: MATERIAL_TUNING.roofRoughness,
        map: this.noiseTexture,
      }),
    );
    dormerRoof.position.y = 0.28;
    dormerRoof.castShadow = true;
    dormer.add(dormerRoof);

    const window = new THREE.Mesh(
      new THREE.BoxGeometry(0.23, 0.16, 0.035),
      new THREE.MeshStandardMaterial({
        color: tint(INK, 0.035),
        emissive: INK,
        emissiveIntensity: 0.12,
        roughness: 0.3,
      }),
    );
    window.position.set(0, 0.15, -0.153);
    dormer.add(window);
    parent.add(dormer);
  }

  private addRoof(
    parent: THREE.Group,
    level: number,
    palette: (typeof PALETTE)[number],
    seed: number,
    points: readonly Point2[],
    exposed: EdgeMask,
    sameHeight: EdgeMask,
    higherNeighbors: EdgeMask,
  ): void {
    const y = BUILDING_BASE + level * LEVEL_HEIGHT + 0.03;
    const roofMaterial = new THREE.MeshPhysicalMaterial({
      color: paint(palette.roof, 0.08, seed * 0.02 - 0.035),
      roughness: MATERIAL_TUNING.roofRoughness,
      clearcoat: 0.09,
      clearcoatRoughness: 0.76,
      map: this.noiseTexture,
      bumpMap: this.noiseTexture,
      bumpScale: 0.028,
      side: THREE.DoubleSide,
    });
    const exposedCount = EDGE_NAMES.filter((name) => exposed[name]).length;
    const sameCount = EDGE_NAMES.filter((name) => sameHeight[name]).length;
    const higherCount = EDGE_NAMES.filter((name) => higherNeighbors[name]).length;
    if (higherCount > 0) {
      const center = polygonCenter(points);
      const leanEaves = points.map(([px, pz], index) => {
        const previousEdge = EDGE_NAMES[(index + 3) % EDGE_NAMES.length]!;
        const nextEdge = EDGE_NAMES[index]!;
        const scale = higherNeighbors[previousEdge] || higherNeighbors[nextEdge] ? 1 : 1.025;
        return [
          center[0] + (px - center[0]) * scale,
          center[1] + (pz - center[1]) * scale,
        ] as const;
      });
      const roof = new THREE.Mesh(
        leanToRoofGeometry(leanEaves, FEATURE_TUNING.roofHeight * 0.78, higherNeighbors),
        roofMaterial,
      );
      roof.position.y = y;
      roof.castShadow = true;
      parent.add(roof);
      const outline = new THREE.LineSegments(
        new THREE.EdgesGeometry(roof.geometry, 14),
        new THREE.LineBasicMaterial({
          color: tint(palette.wallShadow, -0.08),
          transparent: true,
          opacity: 0.9,
        }),
      );
      outline.position.copy(roof.position);
      parent.add(outline);
      if (seed > 0.62) this.addChimney(parent, y, seed);
      return;
    }
    const terrace = sameCount >= 3 || (sameCount >= 2 && seed > 0.9);
    if (terrace) {
      const slab = new THREE.Mesh(polygonPrismGeometry(points, 0.12, exposed), roofMaterial);
      slab.position.y = y;
      slab.castShadow = true;
      parent.add(slab);
      const railMaterial = new THREE.MeshStandardMaterial({
        color: palette.trim,
        roughness: MATERIAL_TUNING.trimRoughness,
      });
      EDGE_NAMES.forEach((name, index) => {
        if (!exposed[name]) return;
        const a = points[index]!;
        const b = points[(index + 1) % 4]!;
        const dx = b[0] - a[0];
        const dz = b[1] - a[1];
        const rail = new THREE.Mesh(new THREE.BoxGeometry(
          Math.hypot(dx, dz) * 0.9,
          FEATURE_TUNING.bridgeRailHeight,
          0.045,
        ), railMaterial);
        rail.position.set(
          (a[0] + b[0]) * 0.5,
          y + FEATURE_TUNING.bridgeRailHeight * 0.72,
          (a[1] + b[1]) * 0.5,
        );
        rail.rotation.y = -Math.atan2(dz, dx);
        parent.add(rail);
      });
      if (seed > 0.78) this.addGreenery(parent, y + 0.18, seed);
      return;
    }
    const connectedNorthSouth = sameHeight.north || sameHeight.south;
    const oppositeConnections = (sameHeight.north && sameHeight.south) || (sameHeight.east && sameHeight.west);
    const isolatedGable = sameCount === 0 && seed > 0.3 && seed < 0.72;
    const gableAxis = sameCount === 1 || oppositeConnections || isolatedGable
      ? (connectedNorthSouth || (sameCount === 0 && seed > 0.5) ? "z" : "x")
      : null;
    const center = polygonCenter(points);
    const eaveScale = sameCount === 0 ? 1 + FEATURE_TUNING.roofOverhang / CELL_SIZE : 1.008;
    const eaves = points.map(([px, pz]) => [
      center[0] + (px - center[0]) * eaveScale,
      center[1] + (pz - center[1]) * eaveScale,
    ] as const);
    const eaveMaterial = new THREE.MeshBasicMaterial({
      color: 0x28383a,
      transparent: true,
      opacity: 0.44,
      depthWrite: false,
    });
    EDGE_NAMES.forEach((name, index) => {
      if (!exposed[name]) return;
      const a = eaves[index]!;
      const b = eaves[(index + 1) % 4]!;
      const dx = b[0] - a[0];
      const dz = b[1] - a[1];
      const length = Math.hypot(dx, dz);
      const eave = new THREE.Mesh(new THREE.BoxGeometry(length * 1.015, 0.055, 0.065), eaveMaterial);
      eave.position.set(
        (a[0] + b[0]) * 0.5 + (dz / length) * 0.025,
        y - 0.035,
        (a[1] + b[1]) * 0.5 - (dx / length) * 0.025,
      );
      eave.rotation.y = -Math.atan2(dz, dx);
      parent.add(eave);
    });
    const roofHeight = gableAxis ? FEATURE_TUNING.roofHeight : FEATURE_TUNING.roofHeight * 1.18;
    const roof = new THREE.Mesh(roofGeometry(eaves, roofHeight, gableAxis), roofMaterial);
    roof.position.y = y;
    roof.castShadow = true;
    parent.add(roof);
    if (sameCount === 0) {
      const roofInk = new THREE.LineSegments(
        new THREE.EdgesGeometry(roof.geometry, 18),
        new THREE.LineBasicMaterial({ color: tint(palette.wallShadow, -0.04), transparent: true, opacity: 0.52 }),
      );
      roofInk.position.copy(roof.position);
      parent.add(roofInk);
    }
    if (gableAxis && level < 4 && (sameCount > 0 || seed <= 0.7)) {
      const seedKey = Math.round(seed * 100_000);
      const dormerSelector = hash(seedKey, level, 1901);
      const slopedFaces: readonly EdgeName[] = gableAxis === "x"
        ? ["south", "north"]
        : ["west", "east"];
      const availableFaces = slopedFaces.filter((name) => exposed[name]);
      if (dormerSelector > 0.64 && availableFaces.length > 0) {
        const choice = Math.floor(hash(seedKey, level, 1907) * availableFaces.length);
        const edgeIndex = EDGE_NAMES.indexOf(availableFaces[choice]!);
        this.addDormer(
          parent,
          eaves[edgeIndex]!,
          eaves[(edgeIndex + 1) % eaves.length]!,
          center,
          y,
          roofHeight,
          palette,
          seed,
        );
      }
    }
    const coursePositions: number[] = [];
    if (gableAxis) {
      const ridgeA = gableAxis === "x"
        ? polygonCenter([eaves[0]!, eaves[3]!])
        : polygonCenter([eaves[0]!, eaves[1]!]);
      const ridgeB = gableAxis === "x"
        ? polygonCenter([eaves[1]!, eaves[2]!])
        : polygonCenter([eaves[3]!, eaves[2]!]);
      coursePositions.push(
        ridgeA[0], y + roofHeight + 0.021, ridgeA[1],
        ridgeB[0], y + roofHeight + 0.021, ridgeB[1],
      );
    }
    EDGE_NAMES.forEach((name, index) => {
      if (!exposed[name]) return;
      if (gableAxis === "x" && (name === "east" || name === "west")) return;
      if (gableAxis === "z" && (name === "north" || name === "south")) return;
      const a = eaves[index]!;
      const b = eaves[(index + 1) % 4]!;
      const edgeMiddleX = (a[0] + b[0]) * 0.5;
      const edgeMiddleZ = (a[1] + b[1]) * 0.5;
      for (const inset of [0.08, 0.25, 0.42, 0.59]) {
        const offsetX = (center[0] - edgeMiddleX) * inset;
        const offsetZ = (center[1] - edgeMiddleZ) * inset;
        const startX = gableAxis ? a[0] + offsetX : THREE.MathUtils.lerp(a[0], center[0], inset);
        const startZ = gableAxis ? a[1] + offsetZ : THREE.MathUtils.lerp(a[1], center[1], inset);
        const endX = gableAxis ? b[0] + offsetX : THREE.MathUtils.lerp(b[0], center[0], inset);
        const endZ = gableAxis ? b[1] + offsetZ : THREE.MathUtils.lerp(b[1], center[1], inset);
        const courseY = y + roofHeight * inset + 0.018;
        coursePositions.push(startX, courseY, startZ, endX, courseY, endZ);
      }
      const ridgeA = gableAxis === "x"
        ? polygonCenter([eaves[0]!, eaves[3]!])
        : gableAxis === "z"
          ? polygonCenter([eaves[0]!, eaves[1]!])
          : center;
      const ridgeB = gableAxis === "x"
        ? polygonCenter([eaves[1]!, eaves[2]!])
        : gableAxis === "z"
          ? polygonCenter([eaves[3]!, eaves[2]!])
          : center;
      const distanceToA = Math.hypot(a[0] - ridgeA[0], a[1] - ridgeA[1]);
      const distanceToB = Math.hypot(a[0] - ridgeB[0], a[1] - ridgeB[1]);
      const ridgeStart = distanceToA <= distanceToB ? ridgeA : ridgeB;
      const ridgeEnd = distanceToA <= distanceToB ? ridgeB : ridgeA;
      for (const along of [0.18, 0.38, 0.58, 0.78]) {
        const startX = THREE.MathUtils.lerp(a[0], b[0], along);
        const startZ = THREE.MathUtils.lerp(a[1], b[1], along);
        const endX = THREE.MathUtils.lerp(ridgeStart[0], ridgeEnd[0], along);
        const endZ = THREE.MathUtils.lerp(ridgeStart[1], ridgeEnd[1], along);
        coursePositions.push(
          startX, y + 0.018, startZ,
          endX, y + roofHeight + 0.018, endZ,
        );
      }
    });
    if (coursePositions.length > 0) {
      const courseGeometry = new THREE.BufferGeometry();
      courseGeometry.setAttribute("position", new THREE.Float32BufferAttribute(coursePositions, 3));
      const courses = new THREE.LineSegments(
        courseGeometry,
        new THREE.LineBasicMaterial({
          color: tint(palette.wallShadow, -0.08),
          transparent: true,
          opacity: 0.64,
        }),
      );
      parent.add(courses);
    }
    const adjacentCorner = exposedCount === 2 && (
      (exposed.north && exposed.east) || (exposed.east && exposed.south) ||
      (exposed.south && exposed.west) || (exposed.west && exposed.north)
    );
    const landmark = level >= 4 || (level >= 2 && sameCount === 0 && seed > 0.7);
    if (landmark) this.addCupola(parent, center, y + 0.8, palette);
    if (!landmark && (adjacentCorner || (sameCount <= 1 && (seed > 0.78 || (seed > 0.28 && seed < 0.4))))) {
      this.addChimney(parent, y, seed);
    }
  }

  private addCupola(parent: THREE.Group, center: Point2, y: number, palette: (typeof PALETTE)[number]): void {
    const drum = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.37, 0.44, 8),
      new THREE.MeshStandardMaterial({ color: palette.trim, roughness: 0.82, map: this.noiseTexture }),
    );
    drum.position.set(center[0], y + 0.2, center[1]);
    drum.castShadow = true;
    parent.add(drum);
    const cap = new THREE.Mesh(
      new THREE.ConeGeometry(0.48, 0.52, 8),
      new THREE.MeshStandardMaterial({ color: palette.roof, roughness: 0.9, map: this.noiseTexture }),
    );
    cap.position.set(center[0], y + 0.67, center[1]);
    cap.castShadow = true;
    parent.add(cap);
  }

  private addChimney(parent: THREE.Group, y: number, seed: number): void {
    const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.68, 0.24), new THREE.MeshStandardMaterial({ color: 0x7b5c50, roughness: 0.95 }));
    chimney.position.set((seed - 0.5) * 0.95, y + 0.48, 0.18);
    chimney.rotation.y = seed * 0.15;
    chimney.castShadow = true;
    parent.add(chimney);
  }

  private addGreenery(parent: THREE.Group, y: number, seed: number): void {
    const garden = new THREE.Group();
    garden.position.set((seed - 0.5) * 0.8, y, 0.2);
    garden.rotation.y = (seed - 0.5) * 0.42;
    const variant = Math.floor(seed * 3);
    const leafMaterial = new THREE.MeshStandardMaterial({
      color: paint(MATERIAL_COLORS.vegetation, 0.055, seed * 0.06 - 0.01),
      roughness: 0.98,
    });
    const terracotta = new THREE.MeshStandardMaterial({
      color: tint(0xa45e48, seed * 0.06 - 0.03),
      roughness: 0.92,
    });

    if (variant === 0) {
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.2, 7), terracotta);
      pot.castShadow = true;
      garden.add(pot);
      const stem = new THREE.Mesh(
        new THREE.CylinderGeometry(0.022, 0.032, 0.34, 5),
        new THREE.MeshStandardMaterial({ color: 0x625441, roughness: 0.98 }),
      );
      stem.position.y = 0.24;
      stem.castShadow = true;
      garden.add(stem);
      const topiaryGeometry = new THREE.IcosahedronGeometry(0.18, 0);
      for (const [index, scale] of [0.92, 0.68].entries()) {
        const crown = new THREE.Mesh(topiaryGeometry, leafMaterial);
        crown.position.set(index === 0 ? -0.025 : 0.045, 0.34 + index * 0.2, 0);
        crown.scale.set(scale, scale * 1.08, scale * 0.88);
        crown.rotation.y = seed * Math.PI + index * 0.7;
        crown.castShadow = true;
        garden.add(crown);
      }
    } else if (variant === 1) {
      const trough = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 0.26), terracotta);
      trough.castShadow = true;
      garden.add(trough);
      const shrubGeometry = new THREE.IcosahedronGeometry(0.16, 0);
      for (let index = 0; index < 3; index += 1) {
        const shrub = new THREE.Mesh(shrubGeometry, leafMaterial);
        shrub.position.set((index - 1) * 0.13, 0.16 + (index % 2) * 0.055, (index % 2 - 0.5) * 0.055);
        shrub.scale.set(1, 0.72 + index * 0.08, 0.84);
        shrub.rotation.y = seed * Math.PI * 2 + index;
        shrub.castShadow = true;
        garden.add(shrub);
      }
    } else {
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.16, 8), terracotta);
      pot.castShadow = true;
      garden.add(pot);
      const stemGeometry = new THREE.CylinderGeometry(0.009, 0.012, 0.28, 5);
      const stemMaterial = new THREE.MeshStandardMaterial({ color: 0x507a58, roughness: 1 });
      const flowerGeometry = new THREE.IcosahedronGeometry(0.055, 0);
      const flowerMaterials = [
        new THREE.MeshStandardMaterial({ color: 0xd87563, roughness: 0.9 }),
        new THREE.MeshStandardMaterial({ color: 0xe0bb65, roughness: 0.9 }),
      ] as const;
      for (let index = 0; index < 4; index += 1) {
        const angle = seed * Math.PI * 2 + index * 1.7;
        const radius = index === 0 ? 0.035 : 0.09;
        const stem = new THREE.Mesh(stemGeometry, stemMaterial);
        stem.position.set(Math.cos(angle) * radius, 0.2 + (index % 2) * 0.025, Math.sin(angle) * radius);
        stem.rotation.z = (index - 1.5) * 0.04;
        garden.add(stem);
        const flower = new THREE.Mesh(flowerGeometry, flowerMaterials[index % flowerMaterials.length]!);
        flower.position.set(stem.position.x, stem.position.y + 0.155, stem.position.z);
        flower.scale.y = 0.72;
        flower.castShadow = true;
        garden.add(flower);
      }
    }
    parent.add(garden);
  }

  private createBirds(): void {
    const wingMaterial = new THREE.MeshBasicMaterial({
      color: 0xfff7df,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.94,
      toneMapped: false,
    });
    const bodyMaterial = new THREE.MeshBasicMaterial({
      color: 0xe8dbc2,
      toneMapped: false,
    });
    const beakMaterial = new THREE.MeshBasicMaterial({ color: 0xd6923b, toneMapped: false });
    const legMaterial = new THREE.MeshBasicMaterial({ color: 0x8d6140, toneMapped: false });
    const leftWingGeometry = new THREE.BufferGeometry();
    leftWingGeometry.setAttribute("position", new THREE.Float32BufferAttribute([
      0, 0, 0.16,
      -0.62, 0, -0.1,
      -0.14, 0, 0.28,
    ], 3));
    leftWingGeometry.setIndex([0, 1, 2]);
    leftWingGeometry.computeVertexNormals();
    const rightWingGeometry = new THREE.BufferGeometry();
    rightWingGeometry.setAttribute("position", new THREE.Float32BufferAttribute([
      0, 0, 0.16,
      0.62, 0, -0.1,
      0.14, 0, 0.28,
    ], 3));
    rightWingGeometry.setIndex([0, 1, 2]);
    rightWingGeometry.computeVertexNormals();

    for (let index = 0; index < 6; index += 1) {
      const bird = new THREE.Group();
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 5), bodyMaterial);
      body.scale.set(0.72, 0.58, 2.1);
      bird.add(body);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.085, 7, 5), wingMaterial);
      head.position.set(0, 0.02, 0.25);
      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.033, 0.12, 5), beakMaterial);
      beak.rotation.x = Math.PI / 2;
      beak.position.set(0, 0.012, 0.35);
      const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.13, 5), legMaterial);
      leftLeg.position.set(-0.034, -0.1, 0.025);
      const rightLeg = leftLeg.clone();
      rightLeg.position.x = 0.034;
      bird.add(head, beak, leftLeg, rightLeg);
      const leftWing = new THREE.Mesh(leftWingGeometry, wingMaterial);
      const rightWing = new THREE.Mesh(rightWingGeometry, wingMaterial);
      leftWing.position.y = rightWing.position.y = 0.015;
      bird.add(leftWing, rightWing);

      const phase = index * (Math.PI * 2 / 6) + 0.38;
      const radius = 10 + index * 1.35;
      const altitude = 7.5 + (index % 3) * 0.6;
      const speed = 0.16 + index * 0.012;
      const x = Math.cos(phase) * radius;
      const z = Math.sin(phase) * radius * 0.42;
      bird.position.set(x, altitude, z);
      bird.rotation.y = Math.atan2(-Math.sin(phase) * radius, Math.cos(phase) * radius * 0.42);
      const baseScale = 0.88 + (index % 2) * 0.12;
      bird.scale.setScalar(baseScale);
      bird.userData.phase = phase;
      bird.userData.radius = radius;
      bird.userData.altitude = altitude;
      bird.userData.speed = speed;
      bird.userData.leftWing = leftWing;
      bird.userData.rightWing = rightWing;
      bird.userData.baseScale = baseScale;
      this.birds.add(bird);
    }
  }

  private updateBirdPerches(
    features: ReadonlyMap<string, CellFeature>,
    cells: ReadonlyMap<string, CellState>,
  ): void {
    const candidates: { readonly id: string; readonly anchor: THREE.Vector3; readonly score: number }[] = [];
    for (const feature of features.values()) {
      if (feature.kind !== "house" || feature.level < 1) continue;
      const cell = cells.get(feature.id);
      if (!cell) continue;
      candidates.push({
        id: feature.id,
        anchor: new THREE.Vector3(
          cell.x * CELL_SIZE + (hash(cell.x, cell.z, 811) - 0.5) * 0.36,
          BUILDING_BASE + feature.level * LEVEL_HEIGHT + FEATURE_TUNING.roofHeight + 0.1,
          cell.z * CELL_SIZE + (hash(cell.z, cell.x, 823) - 0.5) * 0.36,
        ),
        score: feature.level * 10 + hash(cell.x, cell.z, 839),
      });
    }
    candidates.sort((left, right) => right.score - left.score);
    this.perchAnchors = candidates.map(({ anchor }) => anchor);
    const now = performance.now() / 1000;
    if (this.perchAnchors.length === 0) {
      this.birds.children.forEach((bird, index) => {
        delete bird.userData.perchId;
        delete bird.userData.perchIndex;
        if (this.reducedMotion) {
          bird.userData.mode = "flight";
          bird.visible = false;
          return;
        }
        if (bird.userData.mode === "flight") return;
        const flattenedZ = bird.position.z / 0.58;
        const startRadius = Math.max(0.8, Math.hypot(bird.position.x, flattenedZ));
        bird.userData.mode = "flight";
        bird.userData.flightStart = now;
        bird.userData.flightUntil = now + 3.5 + index * 0.4;
        bird.userData.flightCenterX = 0;
        bird.userData.flightCenterZ = 0;
        bird.userData.flightStartRadius = startRadius;
        bird.userData.flightTargetRadius = Math.max(
          startRadius,
          Number(bird.userData.radius) * 0.55,
        );
        bird.userData.flightStartAngle = Math.atan2(flattenedZ, bird.position.x);
        bird.userData.flightStartY = bird.position.y;
        bird.visible = true;
      });
      return;
    }
    if (this.reducedMotion) {
      const perchedCount = Math.min(4, this.perchAnchors.length);
      this.birds.children.forEach((bird, index) => {
        if (index >= perchedCount) {
          delete bird.userData.perchId;
          delete bird.userData.perchIndex;
          bird.userData.mode = "flight";
          bird.visible = false;
          return;
        }
        const perchIndex = index % this.perchAnchors.length;
        bird.userData.perchId = candidates[perchIndex]!.id;
        bird.userData.perchIndex = perchIndex;
        bird.userData.mode = "perched";
        bird.position.copy(this.perchAnchors[perchIndex]!);
        bird.visible = true;
      });
      return;
    }
    this.birds.children.forEach((bird, index) => {
      const previousPerchId = bird.userData.perchId as string | undefined;
      const previousPerchIndex = previousPerchId === undefined
        ? -1
        : candidates.findIndex((candidate) => candidate.id === previousPerchId);
      const perchIndex = previousPerchIndex >= 0 ? previousPerchIndex : index % this.perchAnchors.length;
      bird.userData.perchId = candidates[perchIndex]!.id;
      bird.userData.perchIndex = perchIndex;
      const anchor = this.perchAnchors[perchIndex]!;
      if (bird.userData.mode === undefined) {
        if (index < Math.min(4, this.perchAnchors.length)) {
          bird.userData.mode = "perched";
          bird.position.copy(anchor);
          bird.visible = true;
        } else {
          bird.userData.mode = "flight";
          bird.userData.flightStart = now - 1;
          bird.userData.flightUntil = now + 3.5 + index * 0.4;
          bird.userData.flightCenterX = 0;
          bird.userData.flightCenterZ = 0;
          bird.userData.flightStartRadius = Number(bird.userData.radius) * 0.55;
          bird.userData.flightTargetRadius = Number(bird.userData.radius) * 0.55;
          bird.userData.flightStartAngle = Number(bird.userData.phase);
          bird.userData.flightStartY = bird.position.y;
        }
      } else if (bird.userData.mode === "perched") {
        bird.position.copy(anchor);
      }
    });
  }

  notifyConstruction(x: number, z: number): boolean {
    const now = performance.now() / 1000;
    const centerX = x * CELL_SIZE;
    const centerZ = z * CELL_SIZE;
    for (let index = 0; index < 3; index += 1) {
      const inner = 0.1 + index * 0.11;
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(inner, inner + 0.045, 48),
        new THREE.MeshBasicMaterial({
          color: index === 0 ? 0xffffff : MATERIAL_COLORS.foam,
          transparent: true,
          opacity: 0.68 - index * 0.13,
          depthWrite: false,
          toneMapped: false,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(centerX, WATER_LEVEL + 0.045 + index * 0.002, centerZ);
      ring.renderOrder = 5;
      ring.userData.ripplePhase = index * 0.08;
      ring.userData.rippleStart = now;
      ring.userData.rippleOpacity = 0.68 - index * 0.13;
      ring.userData.rippleDuration = 1.05 + index * 0.18;
      ring.userData.rippleGrowth = 3.8 + index * 0.9;
      this.activeRipples.add(ring);
      this.constructionEffectsRoot.add(ring);
    }
    for (let index = 0; index < 7; index += 1) {
      const angle = hash(x * 31 + index, z * 37, 857) * Math.PI * 2;
      const speed = 0.3 + hash(z * 41, x * 43 + index, 863) * 0.5;
      const drop = new THREE.Mesh(
        new THREE.SphereGeometry(0.035 + (index % 3) * 0.012, 6, 4),
        new THREE.MeshBasicMaterial({
          color: 0xe9f3e8,
          transparent: true,
          opacity: 0.82,
          toneMapped: false,
        }),
      );
      drop.scale.y = 1.7;
      drop.position.set(centerX, WATER_LEVEL + 0.05, centerZ);
      drop.userData.splashOriginX = centerX;
      drop.userData.splashOriginZ = centerZ;
      drop.userData.splashStart = now + index * 0.025;
      drop.userData.splashVelocity = new THREE.Vector3(
        Math.cos(angle) * speed,
        1.15 + (index % 3) * 0.16,
        Math.sin(angle) * speed,
      );
      this.activeSplashDrops.add(drop);
      this.constructionEffectsRoot.add(drop);
    }
    if (this.reducedMotion) return false;
    const startleRadius = CELL_SIZE * 1.25;
    const startleRadiusSquared = startleRadius * startleRadius;
    let launched = false;
    this.birds.children.forEach((bird, index) => {
      if (bird.userData.mode !== "perched") return;
      const dx = bird.position.x - centerX;
      const dz = bird.position.z - centerZ;
      const distanceSquared = dx * dx + dz * dz;
      if (distanceSquared >= startleRadiusSquared) return;
      bird.userData.mode = "flight";
      bird.userData.flightStart = now;
      bird.userData.flightUntil = now + 4.8 + index * 0.24;
      bird.userData.flightCenterX = centerX;
      bird.userData.flightCenterZ = centerZ;
      bird.userData.flightStartRadius = Math.max(0.8, Math.sqrt(distanceSquared));
      bird.userData.flightTargetRadius = 4.2 + index * 0.54;
      bird.userData.flightStartAngle = Math.atan2(dz, dx);
      bird.userData.flightStartY = bird.position.y;
      bird.visible = true;
      launched = true;
    });
    return launched;
  }

  pick(clientX: number, clientY: number, forAdd = false): CellPick | null {
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;
    this.pointer.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects(this.pickTargets, false)[0];
    if (!hit) return null;
    const metadata = (hit.object as PickObject).userData.cellPick;
    if (!metadata) return null;
    if (metadata.kind === "water") {
      const baseX = Math.round(hit.point.x / CELL_SIZE);
      const baseZ = Math.round(hit.point.z / CELL_SIZE);
      for (let dz = -1; dz <= 1; dz += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const x = baseX + dx;
          const z = baseZ + dz;
          if (x * x + z * z <= WORLD_RADIUS * WORLD_RADIUS && pointInPolygon(hit.point.x, hit.point.z, cellPolygon(x, z, false))) {
            return { id: `${x},${z}`, x, z, level: 0, kind: "water", face: "water" };
          }
        }
      }
      return null;
    }
    if (!hit.face) return { ...metadata, face: "top" };
    const worldNormal = hit.face.normal.clone().applyNormalMatrix(
      new THREE.Matrix3().getNormalMatrix(hit.object.matrixWorld),
    );
    if (Math.abs(worldNormal.y) >= 0.55 || metadata.kind === "bridge") {
      return { ...metadata, face: "top" };
    }
    const stepX = Math.abs(worldNormal.x) > Math.abs(worldNormal.z) ? Math.sign(worldNormal.x) : 0;
    const stepZ = stepX === 0 ? Math.sign(worldNormal.z) : 0;
    const direction: EdgeName = stepX > 0 ? "east" : stepX < 0 ? "west" : stepZ > 0 ? "south" : "north";
    if (!forAdd) return { ...metadata, face: "side", direction };
    const x = metadata.x + stepX;
    const z = metadata.z + stepZ;
    if (x * x + z * z > WORLD_RADIUS * WORLD_RADIUS) return null;
    const id = `${x},${z}`;
    return {
      id,
      x,
      z,
      level: this.cellLevels.get(id) ?? 0,
      placementLevel: metadata.level > 0 ? metadata.level : undefined,
      kind: this.cellKinds.get(id) ?? "water",
      face: "side",
      direction,
      surfaceX: metadata.x,
      surfaceZ: metadata.z,
    };
  }

  setGrid(enabled: boolean): void {
    this.grid.visible = enabled;
  }

  setHover(pick: CellPick | null, colorIndex: number, remove: boolean): void {
    const signature = pick
      ? `${pick.id},${pick.level},${pick.placementLevel ?? ""},${pick.face ?? ""},${pick.direction ?? ""},${pick.surfaceX ?? ""},${pick.surfaceZ ?? ""},${colorIndex},${remove}`
      : "none";
    if (signature === this.hoverSignature) return;
    this.hoverSignature = signature;
    disposeTree(this.hoverRoot);
    this.hoverRoot.clear();
    if (!pick) return;

    const palette = PALETTE[colorIndex % PALETTE.length] ?? PALETTE[0]!;
    const material = new THREE.MeshBasicMaterial({
      color: remove ? 0xff625f : palette.trim,
      transparent: true,
      opacity: 0.76,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    if (pick.face === "side" && pick.direction) {
      const sourceX = pick.surfaceX ?? pick.x;
      const sourceZ = pick.surfaceZ ?? pick.z;
      const points = insetPolygon(cellPolygon(sourceX, sourceZ, false), FEATURE_TUNING.wallInset * 0.7);
      const edgeIndex = EDGE_NAMES.indexOf(pick.direction);
      const a = points[edgeIndex]!;
      const b = points[(edgeIndex + 1) % points.length]!;
      const dx = b[0] - a[0];
      const dz = b[1] - a[1];
      const length = Math.hypot(dx, dz);
      const outwardX = dz / length;
      const outwardZ = -dx / length;
      const patch = new THREE.Mesh(new THREE.PlaneGeometry(length * 0.86, LEVEL_HEIGHT * 0.76), material);
      patch.position.set(
        (a[0] + b[0]) * 0.5 + outwardX * 0.045,
        BUILDING_BASE + Math.max(0, (pick.placementLevel ?? pick.level) - 1) * LEVEL_HEIGHT + LEVEL_HEIGHT * 0.5,
        (a[1] + b[1]) * 0.5 + outwardZ * 0.045,
      );
      patch.rotation.y = -Math.atan2(dz, dx);
      this.hoverRoot.add(patch);
      return;
    }

    const points = insetPolygon(cellPolygon(pick.x, pick.z, false), 0.055);
    const patch = new THREE.Mesh(polygonPrismGeometry(points, 0.018, ALL_EDGES, 0.04), material);
    patch.position.y = pick.face === "water"
      ? WATER_LEVEL + 0.055
      : BUILDING_BASE + pick.level * LEVEL_HEIGHT + 0.06;
    this.hoverRoot.add(patch);
  }

  beginPointer(clientX: number, clientY: number): void {
    this.pointerActive = true;
    this.pointerMoved = false;
    this.pointerStart.set(clientX, clientY);
    this.pointerLast.copy(this.pointerStart);
    this.panGesture = this.pointerButton !== 0 || this.shiftPressed || this.activePointers > 1;
  }

  movePointer(clientX: number, clientY: number): { dragged: boolean } {
    if (!this.pointerActive) return { dragged: false };
    const dx = clientX - this.pointerLast.x;
    const dy = clientY - this.pointerLast.y;
    this.pointerLast.set(clientX, clientY);
    if (!this.pointerMoved && this.pointerLast.distanceToSquared(this.pointerStart) > 64) this.pointerMoved = true;
    if (this.pointerMoved) {
      if (this.panGesture) {
        const scale = 0.014 / this.viewZoom;
        const forward = new THREE.Vector3(-Math.sin(this.azimuth), 0, -Math.cos(this.azimuth));
        const right = new THREE.Vector3().crossVectors(forward, UP).normalize();
        this.target.addScaledVector(right, -dx * scale).addScaledVector(forward, dy * scale);
      } else {
        this.azimuth -= dx * 0.007;
        this.elevation = THREE.MathUtils.clamp(this.elevation + dy * 0.005, 0.28, 1.25);
      }
      this.updateCamera();
    }
    return { dragged: this.pointerMoved };
  }

  endPointer(): void {
    this.pointerActive = false;
    this.panGesture = false;
  }

  zoom(delta: number): void {
    this.viewZoom = THREE.MathUtils.clamp(this.viewZoom * Math.exp(-delta * 0.0012), 0.25, 2.8);
    this.resize();
  }

  private renderReflectionTarget(): void {
    const currentTarget = this.renderer.getRenderTarget();
    const previousBackground = this.scene.background;
    const previousClippingPlanes = this.renderer.clippingPlanes;
    const previousClearColor = this.renderer.getClearColor(this.reflectionClearColor);
    const previousClearAlpha = this.renderer.getClearAlpha();
    const previousShadowAutoUpdate = this.renderer.shadowMap.autoUpdate;
    const waterWasVisible = this.water.visible;
    const overlayWasVisible = this.reflectionOverlay.visible;
    const hoverWasVisible = this.hoverRoot.visible;
    const ambientWaterWasVisible = this.ambientWaterRoot.visible;
    const constructionEffectsWereVisible = this.constructionEffectsRoot.visible;
    const foundationWasVisible = this.islandFoundationRoot.visible;
    const birdsWereVisible = this.birds.visible;
    const gridWasVisible = this.grid.visible;
    this.scene.background = null;
    this.water.visible = false;
    this.reflectionOverlay.visible = false;
    this.hoverRoot.visible = false;
    this.ambientWaterRoot.visible = false;
    this.islandFoundationRoot.visible = false;
    this.constructionEffectsRoot.visible = false;
    this.birds.visible = false;
    this.grid.visible = false;
    this.renderer.shadowMap.autoUpdate = false;
    try {
      this.renderer.setRenderTarget(this.reflectionRenderTarget);
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.clear(true, true, true);
      this.renderer.render(this.scene, this.camera);
    } finally {
      this.renderer.setRenderTarget(currentTarget);
      this.renderer.setClearColor(previousClearColor, previousClearAlpha);
      this.renderer.clippingPlanes = previousClippingPlanes;
      this.renderer.shadowMap.autoUpdate = previousShadowAutoUpdate;
      this.scene.background = previousBackground;
      this.water.visible = waterWasVisible;
      this.reflectionOverlay.visible = overlayWasVisible;
      this.hoverRoot.visible = hoverWasVisible;
      this.ambientWaterRoot.visible = ambientWaterWasVisible;
      this.islandFoundationRoot.visible = foundationWasVisible;
      this.constructionEffectsRoot.visible = constructionEffectsWereVisible;
      this.birds.visible = birdsWereVisible;
      this.grid.visible = gridWasVisible;
    }
  }

  update(time: number): void {
    const seconds = time * 0.001;
    this.waterMaterial.uniforms.time!.value = this.reducedMotion ? 0 : seconds * WATER_EFFECT_TUNING.waveSpeed;
    this.reflectionOverlayMaterial.uniforms.time!.value = this.reducedMotion ? 0 : seconds;
    const revealNow = performance.now() / 1000;
    if (this.activeRevealGroups.size > 0) this.reflectionDirty = true;
    for (const group of this.activeRevealGroups) {
      const reveal = Number(group.userData.reveal ?? 0);
      const progress = THREE.MathUtils.clamp((revealNow - reveal) * 3.8, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      group.scale.y = Math.max(0.001, eased);
      if (progress >= 1) {
        group.userData.reveal = 0;
        this.activeRevealGroups.delete(group);
      }
    }
    for (const tree of this.swayingTrees) {
      if (this.reducedMotion) {
        tree.rotation.x = 0;
        tree.rotation.z = 0;
        continue;
      }
      const phase = Number(tree.userData.windPhase);
      const strength = Number(tree.userData.windStrength);
      const breeze = Math.sin(seconds * 0.72 + phase);
      const gust = Math.sin(seconds * 1.31 + phase * 0.73) * 0.28;
      tree.rotation.z = (breeze + gust) * strength;
      tree.rotation.x = Math.sin(seconds * 0.61 + phase * 1.17) * strength * 0.55;
    }
    for (const effect of this.activeWaterEffects) {
      const mesh = effect as THREE.Mesh;
      const material = mesh.material as THREE.MeshBasicMaterial;
      const phase = Number(effect.userData.waterPhase ?? 0);
      const kind = String(effect.userData.waterEffect ?? "");
      if (kind === "shoreCrest") {
        const progress = this.reducedMotion
          ? 0.55
          : (seconds / WATER_EFFECT_TUNING.shorelineCycle + phase) % 1;
        const crest = Math.sin(progress * Math.PI) ** 1.5;
        const travel = progress * WATER_EFFECT_TUNING.shorelineTravel;
        effect.position.x = Number(effect.userData.waterBaseX) - Number(effect.userData.waterOutwardX) * travel;
        effect.position.z = Number(effect.userData.waterBaseZ) - Number(effect.userData.waterOutwardZ) * travel;
        material.opacity = Number(effect.userData.waterOpacity) * (0.12 + crest * 0.88);
        effect.scale.y = 0.72 + crest * 0.42;
        continue;
      }
      if (kind === "outlineCrest") {
        const progress = this.reducedMotion
          ? 0.48
          : (seconds / WATER_EFFECT_TUNING.shorelineCycle + phase) % 1;
        const crest = Math.sin(progress * Math.PI) ** 1.35;
        material.opacity = Number(effect.userData.waterOpacity) * (0.34 + crest * 0.66);
        continue;
      }
      const drainProgress = this.reducedMotion
        ? 0.36
        : (seconds / WATER_EFFECT_TUNING.drainCycle + phase) % 1;
      if (kind === "drainStream") {
        const streamPulse = 0.5 + Math.sin(drainProgress * Math.PI * 2) * 0.5;
        const streamLength = Number(
          effect.userData.waterLength ?? WATER_EFFECT_TUNING.drainStreamLength,
        ) * (0.82 + streamPulse * 0.18);
        effect.visible = true;
        effect.scale.y = streamLength;
        effect.position.y = Number(effect.userData.waterTop) - streamLength * 0.5;
        material.opacity = Number(effect.userData.waterOpacity ?? 0.62) * (0.74 + streamPulse * 0.26);
        continue;
      }
      if (kind === "drainRipple") {
        const rippleProgress = drainProgress;
        effect.visible = true;
        const rippleScale = 0.72 + rippleProgress * WATER_EFFECT_TUNING.drainRippleGrowth;
        material.opacity = (1 - rippleProgress) * Number(effect.userData.waterOpacity ?? 0.52);
        effect.scale.set(rippleScale, rippleScale, 1);
        continue;
      }
      if (kind === "drainSplash") {
        const splashProgress = (drainProgress - 0.46) / 0.22;
        effect.visible = splashProgress >= 0 && splashProgress < 1;
        const clampedSplash = THREE.MathUtils.clamp(splashProgress, 0, 1);
        const splashArc = Math.sin(clampedSplash * Math.PI);
        effect.position.x = Number(effect.userData.waterBaseX) + (phase > 0.5 ? 1 : -1) * clampedSplash * 0.06;
        effect.position.y = 0.06 + splashArc * 0.13;
        effect.position.z = Number(effect.userData.waterBaseZ) - clampedSplash * 0.09;
        effect.scale.setScalar(1 - clampedSplash * 0.55);
        material.opacity = splashArc * Number(effect.userData.waterOpacity ?? 0.72);
        continue;
      }
    }
    for (const ripple of this.activeRipples) {
      const rippleStart = Number(ripple.userData.rippleStart);
      const age = Math.max(0, seconds - rippleStart - Number(ripple.userData.ripplePhase));
      const duration = Number(ripple.userData.rippleDuration ?? 1.45);
      const progress = THREE.MathUtils.clamp(age / duration, 0, 1);
      const growth = Number(ripple.userData.rippleGrowth ?? 0.25);
      ripple.scale.setScalar(1 + progress * growth);
      const material = ripple.material as THREE.MeshBasicMaterial;
      material.opacity = (1 - progress) * Number(ripple.userData.rippleOpacity ?? 0.3);
      ripple.visible = progress < 1;
      if (progress >= 1) {
        this.activeRipples.delete(ripple);
        ripple.removeFromParent();
        ripple.geometry.dispose();
        material.dispose();
      }
    }
    for (const drop of this.activeSplashDrops) {
      const start = Number(drop.userData.splashStart);
      const age = seconds - start;
      drop.visible = age >= 0;
      if (age >= 0) {
        const velocity = drop.userData.splashVelocity as THREE.Vector3;
        drop.position.set(
          Number(drop.userData.splashOriginX) + velocity.x * age,
          WATER_LEVEL + 0.05 + velocity.y * age - 2.8 * age * age,
          Number(drop.userData.splashOriginZ) + velocity.z * age,
        );
        const material = drop.material as THREE.MeshBasicMaterial;
        material.opacity = THREE.MathUtils.clamp((0.72 - age) * 1.35, 0, 0.82);
      }
      if (age > 0.72) {
        this.activeSplashDrops.delete(drop);
        drop.removeFromParent();
        drop.geometry.dispose();
        (drop.material as THREE.Material).dispose();
      }
    }
    this.ambientWaterRoot.children.forEach((ring) => {
      const phase = Number(ring.userData.wavePhase ?? 0);
      const progress = this.reducedMotion ? 0 : (seconds * 0.18 + phase) % 1;
      const expansion = 1 + progress * 0.075;
      ring.scale.set(
        Number(ring.userData.waveBaseX ?? 1) * expansion,
        Number(ring.userData.waveBaseZ ?? 1) * expansion,
        1,
      );
      const material = (ring as THREE.Mesh).material as THREE.MeshBasicMaterial;
      material.opacity = Number(ring.userData.waveOpacity ?? 0.1) * (0.18 + (1 - progress) * 0.82);
    });
    if (!this.reducedMotion) {
      this.hoverRoot.position.y = Math.sin(seconds * 3.2) * 0.035;
      this.birds.children.forEach((bird, index) => {
        const leftWing = bird.userData.leftWing as THREE.Mesh;
        const rightWing = bird.userData.rightWing as THREE.Mesh;
        const baseScale = Number(bird.userData.baseScale);
        const phase = Number(bird.userData.phase);
        const mode = String(bird.userData.mode ?? "flight");
        const perchIndex = Number(bird.userData.perchIndex ?? 0);
        const anchor = this.perchAnchors.length > 0
          ? this.perchAnchors[perchIndex % this.perchAnchors.length]
          : undefined;
        if (mode === "perched" && anchor) {
          bird.visible = true;
          bird.position.set(anchor.x, anchor.y + Math.sin(seconds * 1.3 + phase) * 0.012, anchor.z);
          bird.rotation.y = phase + Math.PI * 0.5;
          bird.rotation.z = 0;
          bird.scale.setScalar(baseScale * 0.58);
          leftWing.scale.set(0.38, 1, 0.65);
          rightWing.scale.set(0.38, 1, 0.65);
          leftWing.rotation.z = 0.24;
          bird.scale.setScalar(baseScale * 0.82);
          return;
        }
        if (mode === "landing" && anchor) {
          bird.visible = true;
          bird.position.lerp(anchor, 0.055);
          const distance = bird.position.distanceTo(anchor);
          bird.scale.setScalar(baseScale * 0.68);
          bird.rotation.y = Math.atan2(anchor.x - bird.position.x, anchor.z - bird.position.z);
          const flap = Math.sin(seconds * 9 + phase) * 0.34;
          leftWing.scale.set(0.8, 1, 0.86);
          rightWing.scale.set(0.8, 1, 0.86);
          leftWing.rotation.z = 0.08 + flap;
          rightWing.rotation.z = -0.08 - flap;
          if (distance < 0.09) bird.userData.mode = "perched";
          return;
        }
        const flightStart = Number(bird.userData.flightStart ?? 0);
        const flightAge = Math.max(0, seconds - flightStart);
        if (anchor && seconds >= Number(bird.userData.flightUntil ?? Infinity)) {
          bird.userData.mode = "landing";
        }
        const centerX = Number(bird.userData.flightCenterX ?? 0);
        const centerZ = Number(bird.userData.flightCenterZ ?? 0);
        const startRadius = Number(bird.userData.flightStartRadius ?? bird.userData.radius);
        const targetRadius = Number(bird.userData.flightTargetRadius ?? bird.userData.radius);
        const lift = THREE.MathUtils.smoothstep(flightAge, 0, 1.35);
        const radius = THREE.MathUtils.lerp(startRadius, targetRadius, lift);
        const angle = Number(bird.userData.flightStartAngle ?? phase) + flightAge * (0.88 + index * 0.035);
        const x = centerX + Math.cos(angle) * radius;
        const z = centerZ + Math.sin(angle) * radius * 0.58;
        const cruiseY = BUILDING_BASE + 5.2 + (index % 3) * 0.42;
        const altitude = THREE.MathUtils.lerp(
          Number(bird.userData.flightStartY ?? cruiseY),
          cruiseY,
          lift,
        ) + Math.sin(seconds * 0.72 + phase * 1.7) * 0.16;
        bird.position.set(x, altitude, z);
        bird.visible = true;
        bird.scale.setScalar(baseScale * 0.84);
        bird.rotation.y = Math.atan2(-Math.sin(angle) * radius, Math.cos(angle) * radius * 0.58);
        bird.rotation.z = Math.sin(seconds * 0.48 + phase) * 0.08;
        leftWing.scale.set(1, 1, 1);
        rightWing.scale.set(1, 1, 1);
        const flap = Math.sin(seconds * 7.2 + phase * 2.3) * 0.5;
        leftWing.rotation.z = 0.08 + flap;
        rightWing.rotation.z = -0.08 - flap;
      });
    }
    if (this.reflectionDirty) {
      this.renderReflectionTarget();
      this.reflectionDirty = false;
    }
    if (this.postProcessingEnabled) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
  }

  resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));
    const viewportChanged = width !== this.viewportWidth || height !== this.viewportHeight;
    this.viewportWidth = width;
    this.viewportHeight = height;
    const mobilePixelRatio = Math.min(width, height) < 600 ? 1.5 : 2;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, mobilePixelRatio);
    this.postProcessingEnabled = Math.min(width, height) >= 600;
    this.ssaoPass.enabled = this.postProcessingEnabled;
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(width, height, false);
    this.waterMaterial.uniforms.harborViewportHeight!.value = Math.max(1, this.canvas.height);
    this.reflectionOverlayMaterial.uniforms.viewportHeight!.value = Math.max(1, this.canvas.height);
    this.reflectionOverlayMaterial.uniforms.viewportWidth!.value = Math.max(1, this.canvas.width);
    const reflectionScale = Math.min(
      1,
      1024 / Math.max(1, this.canvas.width),
      1024 / Math.max(1, this.canvas.height),
    );
    const reflectionWidth = Math.max(1, Math.round(this.canvas.width * reflectionScale));
    const reflectionHeight = Math.max(1, Math.round(this.canvas.height * reflectionScale));
    this.reflectionRenderTarget.setSize(reflectionWidth, reflectionHeight);
    this.reflectionOverlayMaterial.uniforms.texelSize!.value.set(
      1 / reflectionWidth,
      1 / reflectionHeight,
    );
    const aspect = width / height;
    const portraitFit = aspect < 0.68 ? 0.68 / aspect : 1;
    const horizontalFit = aspect < 0.68 ? 1.5 : 1;
    const span = (12 * portraitFit) / this.viewZoom;
    this.camera.left = -span * aspect * horizontalFit;
    this.camera.right = span * aspect * horizontalFit;
    this.camera.top = span;
    this.camera.bottom = -span;
    this.camera.updateProjectionMatrix();
    this.updateCamera();
    if (this.postProcessingEnabled) {
      this.composer.setPixelRatio(pixelRatio);
      this.composer.setSize(width, height);
    }
    if (!this.fittingTown && viewportChanged && this.fittedBounds) {
      const zoomMultiplier = this.viewZoom / Math.max(0.001, this.fittedZoom);
      this.refitTown(this.fittedBounds, zoomMultiplier);
    }
  }

  capture(): void {
    this.renderReflectionTarget();
    this.reflectionDirty = false;
    if (this.postProcessingEnabled) this.composer.render();
    else this.renderer.render(this.scene, this.camera);
    const link = document.createElement("a");
    link.download = `harborlight-${new Date().toISOString().slice(0, 10)}.png`;
    link.href = this.canvas.toDataURL("image/png");
    link.click();
  }

  dispose(): void {
    this.canvas.removeEventListener("pointerdown", this.notePointerDown, true);
    this.canvas.removeEventListener("pointerup", this.notePointerUp, true);
    this.canvas.removeEventListener("pointercancel", this.notePointerUp, true);
    this.canvas.removeEventListener("contextmenu", this.preventContextMenu);
    disposeTree(this.townRoot);
    disposeTree(this.islandFoundationRoot);
    disposeTree(this.hoverRoot);
    disposeTree(this.birds);
    disposeTree(this.ambientWaterRoot);
    disposeTree(this.constructionEffectsRoot);
    this.activeSplashDrops.clear();
    this.perchAnchors = [];
    this.cellGroups.clear();
    this.cellLevels.clear();
    this.cellKinds.clear();
    this.cellSignatures.clear();
    this.activeRevealGroups.clear();
    this.activeRipples.clear();
    this.activeWaterEffects.clear();
    this.swayingTrees.clear();
    this.reflectionOverlayMaterial.dispose();
    this.ssaoPass.dispose();
    this.outputPass.dispose();
    this.composer.dispose();
    this.reflectionRenderTarget.dispose();
    this.skyGradientTexture.dispose();
    this.noiseTexture.dispose();
    this.foamTexture.dispose();
    this.waterMaterial.dispose();
    this.waterNormals.dispose();
    this.waterGeometry.dispose();
    this.gridGeometry.dispose();
    this.gridMaterial.dispose();
    this.renderer.dispose();
  }

  private fitTownToView(snapshot: WorldSnapshot): void {
    const bounds = new THREE.Box3();
    for (const cell of snapshot.cells) {
      if (!cell.foundation) continue;
      const feature = snapshot.features.find((candidate) => candidate.id === cell.id);
      const top = feature?.kind === "bridge"
        ? BUILDING_BASE
          + FEATURE_TUNING.bridgeClearance
          + FEATURE_TUNING.bridgeDeckThickness
          + FEATURE_TUNING.bridgeRailHeight
        : BUILDING_BASE + Math.max(0, feature?.level ?? cell.level) * LEVEL_HEIGHT + 0.9;
      for (const [x, z] of insetPolygon(
        cellPolygon(cell.x, cell.z, false),
        -FEATURE_TUNING.shorelineOverhang,
      )) {
        bounds.expandByPoint(new THREE.Vector3(x, -FEATURE_TUNING.foundationDepth, z));
        bounds.expandByPoint(new THREE.Vector3(x, top, z));
      }
    }
    const foundationBounds = new THREE.Box3().setFromObject(this.islandFoundationRoot, true);
    if (!foundationBounds.isEmpty()) bounds.union(foundationBounds);
    bounds.expandByScalar(0.3);
    if (bounds.isEmpty()) return;
    const center = bounds.getCenter(new THREE.Vector3());
    this.target.set(center.x, center.y - 0.4, center.z);
    this.fittedBounds = bounds.clone();
    this.fittedZoom = 1;
    this.viewZoom = 1;
    this.refitTown(this.fittedBounds, 1);
  }

  private refitTown(bounds: THREE.Box3, zoomMultiplier: number): void {
    this.fittingTown = true;
    try {
      this.viewZoom = 1;
      this.resize();

      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;
      for (const x of [bounds.min.x, bounds.max.x]) {
        for (const y of [bounds.min.y, bounds.max.y]) {
          for (const z of [bounds.min.z, bounds.max.z]) {
            const projected = new THREE.Vector3(x, y, z).project(this.camera);
            minX = Math.min(minX, projected.x);
            maxX = Math.max(maxX, projected.x);
            minY = Math.min(minY, projected.y);
            maxY = Math.max(maxY, projected.y);
          }
        }
      }
      const widthFraction = Math.max(0.001, Math.abs(minX), Math.abs(maxX));
      const heightFraction = Math.max(0.001, Math.abs(minY), Math.abs(maxY));
      const rect = this.canvas.getBoundingClientRect();
      const portrait = rect.width / Math.max(1, rect.height) < 0.8;
      const compactLandscape = !portrait && rect.width < 1000 && rect.height < 500;
      const minimumScale = Math.max(
        (portrait ? 0.3 : compactLandscape ? 0.24 : 0.2) / widthFraction,
        0.35 / heightFraction,
      );
      const maximumScale = Math.min(
        (portrait ? 0.9 : compactLandscape ? 0.92 : 0.98) / widthFraction,
        (portrait ? 0.9 : compactLandscape ? 0.94 : 0.98) / heightFraction,
      );
      const preferredScale = Math.min(
        (portrait ? 0.84 : compactLandscape ? 0.86 : 0.94) / widthFraction,
        (portrait ? 0.86 : compactLandscape ? 0.9 : 0.94) / heightFraction,
      );
      const scale = minimumScale <= maximumScale
        ? THREE.MathUtils.clamp(preferredScale, minimumScale, maximumScale)
        : maximumScale;
      this.fittedZoom = THREE.MathUtils.clamp(Math.min(scale, maximumScale), 0.25, 2.8);
      this.viewZoom = THREE.MathUtils.clamp(this.fittedZoom * zoomMultiplier, 0.25, 2.8);
      this.resize();
    } finally {
      this.fittingTown = false;
    }
  }

  private updateCamera(): void {
    const span = Math.max(Math.abs(this.camera.top), Math.abs(this.camera.bottom));
    const sine = Math.max(0.1, Math.sin(this.elevation));
    const safeDistance = (
      span * Math.cos(this.elevation) + WATER_LEVEL - this.target.y + 0.75
    ) / sine;
    const distance = Math.max(30, safeDistance);
    if (this.scene.fog instanceof THREE.FogExp2) {
      this.scene.fog.density = 0.0062 * Math.min(1, 30 / distance);
    }
    const horizontal = Math.cos(this.elevation) * distance;
    this.camera.position.set(
      this.target.x + Math.sin(this.azimuth) * horizontal,
      this.target.y + Math.sin(this.elevation) * distance,
      this.target.z + Math.cos(this.azimuth) * horizontal,
    );
    this.camera.lookAt(this.target);
    this.camera.updateMatrixWorld();
    const waterline = this.reflectionFadePoint
      .set(this.target.x, WATER_LEVEL, this.target.z)
      .project(this.camera);
    const fadeNear = THREE.MathUtils.clamp((waterline.y + 1) * 0.5 - 0.075, 0.12, 0.9);
    const fadeSpan = THREE.MathUtils.clamp(
      (this.viewportWidth < 600 ? 210 : 285) / Math.max(1, this.viewportHeight),
      0.2,
      this.viewportWidth < 600 ? 0.26 : 0.34,
    );
    this.reflectionOverlayMaterial.uniforms.fadeNear!.value = fadeNear;
    this.reflectionOverlayMaterial.uniforms.fadeFar!.value = Math.max(0.02, fadeNear - fadeSpan);
    this.reflectionDirty = true;
  }
}
