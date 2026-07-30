import { describe, expect, it } from "vitest";
import {
  findTerminalSupportIds,
  hasImmediateUpperStorey,
  neighborRenderSignature,
} from "./renderer";
import type { CellFeature, CellState, Direction } from "./types";

const directions: readonly [Direction, number, number][] = [
  ["north", 0, -1],
  ["east", 1, 0],
  ["south", 0, 1],
  ["west", -1, 0],
];

function houseFeatures(
  coords: readonly [number, number][],
  level = 1,
): ReadonlyMap<string, CellFeature> {
  const occupied = new Set(coords.map(([x, z]) => `${x},${z}`));
  const features = coords.map(([x, z]) => {
    const neighbors: Record<Direction, string | undefined> = {
      north: undefined,
      east: undefined,
      south: undefined,
      west: undefined,
    };
    for (const [direction, dx, dz] of directions) {
      const neighborId = `${x + dx},${z + dz}`;
      if (occupied.has(neighborId)) {
        neighbors[direction] = neighborId;
      }
    }
    const id = `${x},${z}`;
    return [id, {
      id,
      kind: "house",
      level,
      color: 0,
      storeys: Array.from({ length: level }, (_, index) => ({ level: index + 1, color: 0 })),
      neighbors,
      exposed: { north: true, east: true, south: true, west: true },
    } satisfies CellFeature] as const;
  });
  return new Map(features);
}

describe("findTerminalSupportIds", () => {
  it("does not select the endpoints of a one-storey row", () => {
    const features = houseFeatures([[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0]]);

    expect(findTerminalSupportIds(features)).toEqual(new Set());
  });

  it("selects only the two endpoints of a two-storey row", () => {
    const features = houseFeatures([[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0]], 2);

    expect([...findTerminalSupportIds(features)].sort()).toEqual(["-2,0", "2,0"]);
  });

  it("does not turn a dense block perimeter into timber supports", () => {
    const coords: [number, number][] = [];
    for (let z = -2; z <= 1; z += 1) {
      for (let x = -2; x <= 1; x += 1) coords.push([x, z]);
    }

    expect(findTerminalSupportIds(houseFeatures(coords, 2))).toEqual(new Set());
  });
});

describe("sparse storey topology", () => {
  const cell = (
    storeys: CellState["storeys"],
    foundation = false,
  ): CellState => ({
    id: "1,0",
    x: 1,
    z: 0,
    foundation,
    level: Math.max(0, ...storeys.map(({ level }) => level)),
    color: storeys.at(-1)?.color ?? 0,
    storeys,
  });

  it("invalidates a neighbor signature when an intermediate storey is removed", () => {
    const feature = houseFeatures([[1, 0]]).get("1,0");
    const before = cell([{ level: 1, color: 2 }, { level: 2, color: 3 }], true);
    const after = cell([{ level: 2, color: 3 }], true);

    expect(neighborRenderSignature("1,0", feature, before))
      .not.toBe(neighborRenderSignature("1,0", feature, after));
  });

  it("joins a roof only to an immediately occupied upper storey", () => {
    expect(hasImmediateUpperStorey(cell([{ level: 4, color: 3 }]), 1)).toBe(false);
    expect(hasImmediateUpperStorey(cell([
      { level: 2, color: 2 },
      { level: 4, color: 3 },
    ]), 1)).toBe(true);
  });
});
