import { describe, expect, it } from "vitest";
import { MAX_LEVELS } from "./config";
import { WorldModel } from "./world";

function emptyWorld(): WorldModel {
  const world = new WorldModel();
  world.clear();
  return world;
}

describe("WorldModel", () => {
  it("preserves an explicit level-zero foundation after the first click", () => {
    const world = emptyWorld();

    expect(world.add(2, -1, 4)).toBe(true);
    expect(world.getHeight(2, -1)).toBe(0);
    expect(world.getCell(2, -1)).toEqual({
      id: "2,-1",
      x: 2,
      z: -1,
      foundation: true,
      level: 0,
      color: 4,
      storeys: [],
    });
    expect(world.snapshot().features).toContainEqual(expect.objectContaining({
      id: "2,-1",
      kind: "foundation",
      level: 0,
    }));
  });

  it("grows from the top and removes levels before removing the foundation", () => {
    const world = emptyWorld();

    expect(world.add(0, 0, 1)).toBe(true);
    expect(world.add(0, 0, 2)).toBe(true);
    expect(world.add(0, 0, 3)).toBe(true);
    expect(world.getCell(0, 0)?.level).toBe(2);
    expect(world.getCell(0, 0)?.color).toBe(3);

    expect(world.remove(0, 0)).toBe(true);
    expect(world.getCell(0, 0)?.level).toBe(1);
    expect(world.remove(0, 0)).toBe(true);
    expect(world.getCell(0, 0)).toEqual(expect.objectContaining({ foundation: true, level: 0 }));
    expect(world.remove(0, 0)).toBe(true);
    expect(world.getCell(0, 0)).toBeUndefined();
    expect(world.remove(0, 0)).toBe(false);
  });

  it("transitions a partial gap into a complete bridge with an explicit span", () => {
    const world = emptyWorld();
    world.add(-1, 0, 2);
    world.add(0, 0, 3);

    expect(world.snapshot().features.find(({ id }) => id === "0,0")).toEqual(
      expect.objectContaining({ kind: "foundation", bridgeSpan: undefined }),
    );

    world.add(1, 0, 4);
    const bridge = world.snapshot().features.find(({ id }) => id === "0,0");
    expect(bridge).toEqual(expect.objectContaining({
      kind: "bridge",
      bridgeSpan: ["east", "west"],
      neighbors: { east: "1,0", west: "-1,0" },
      exposed: { north: true, east: false, south: true, west: false },
    }));
  });

  it("does not derive a level-zero bridge from unsupported sparse storeys", () => {
    const world = emptyWorld();
    world.add(0, 0, 1);
    world.add(0, -1, 2, 2);
    world.add(0, 1, 3, 2);

    expect(world.snapshot().features.find(({ id }) => id === "0,0")).toEqual(
      expect.objectContaining({
        kind: "foundation",
        exposed: { north: true, east: true, south: true, west: true },
      }),
    );
  });

  it("keeps an elevated bridge cell renderable as a house", () => {
    const world = emptyWorld();
    world.add(0, -1, 1);
    world.add(0, 1, 2);
    world.add(0, 0, 3);
    expect(world.snapshot().features.find(({ id }) => id === "0,0")).toEqual(
      expect.objectContaining({ kind: "bridge", level: 0 }),
    );

    world.add(0, 0, 4);
    expect(world.snapshot().features.find(({ id }) => id === "0,0")).toEqual(
      expect.objectContaining({ kind: "house", level: 1, bridgeSpan: undefined }),
    );
  });

  it("recognizes an open three-sided level-zero courtyard", () => {
    const world = emptyWorld();
    world.add(0, -1, 2);
    world.add(-1, 0, 3);
    world.add(1, 0, 4);
    world.add(0, 0, 5);

    expect(world.snapshot().features.find(({ id }) => id === "0,0")).toEqual(
      expect.objectContaining({
        kind: "courtyard",
        level: 0,
        neighbors: { north: "0,-1", east: "1,0", west: "-1,0" },
        exposed: { north: false, east: false, south: true, west: false },
      }),
    );
  });

  it("keeps an elevated courtyard cell renderable as a house", () => {
    const world = emptyWorld();
    world.add(0, -1, 1);
    world.add(0, 1, 2);
    world.add(-1, 0, 3);
    world.add(1, 0, 4);
    world.add(0, 0, 5);
    expect(world.snapshot().features.find(({ id }) => id === "0,0")).toEqual(
      expect.objectContaining({ kind: "courtyard", level: 0 }),
    );

    world.add(0, 0, 6);
    expect(world.snapshot().features.find(({ id }) => id === "0,0")).toEqual(
      expect.objectContaining({ kind: "house", level: 1, bridgeSpan: undefined }),
    );
  });

  it("places and removes an exact sparse upper storey atomically", () => {
    const world = emptyWorld();

    expect(world.add(1, 0, 3, 2)).toBe(true);
    expect(world.getCell(1, 0)).toEqual(expect.objectContaining({
      foundation: false,
      level: 2,
      color: 3,
      storeys: [{ level: 2, color: 3 }],
    }));
    expect(world.remove(1, 0, 1)).toBe(false);
    expect(world.remove(1, 0, 2)).toBe(true);
    expect(world.getCell(1, 0)).toBeUndefined();

    expect(world.undo()).toBe(true);
    expect(world.getCell(1, 0)?.storeys).toEqual([{ level: 2, color: 3 }]);
    expect(world.undo()).toBe(true);
    expect(world.getCell(1, 0)).toBeUndefined();
  });

  it("rejects a side target that cannot grow the selected cell", () => {
    const world = emptyWorld();
    expect(world.add(0, 0, 1)).toBe(true);
    expect(world.add(0, 0, 1, 0)).toBe(false);
    expect(world.add(0, 0, 1, MAX_LEVELS + 1)).toBe(false);
  });

  it("recomputes only the changed cell and its deterministic cardinal neighborhood", () => {
    const world = emptyWorld();
    world.add(0, 0, 1);
    const originalCenter = world.snapshot().features.find(({ id }) => id === "0,0");

    world.add(3, 3, 2);

    expect(world.getDirtyCellIds()).toEqual(["2,3", "3,2", "3,3", "3,4", "4,3"]);
    expect(world.snapshot().features.find(({ id }) => id === "0,0")).toBe(originalCenter);

    world.add(1, 0, 3);
    expect(world.getDirtyCellIds()).toEqual(["0,0", "1,-1", "1,0", "1,1", "2,0"]);
    expect(world.snapshot().features.find(({ id }) => id === "0,0")).toEqual(
      expect.objectContaining({ neighbors: expect.objectContaining({ east: "1,0" }) }),
    );
  });

  it("keeps foundation creation atomic across undo and redo", () => {
    const world = emptyWorld();
    const revision = world.snapshot().revision;

    expect(world.add(0, 0, 7)).toBe(true);
    expect(world.undo()).toBe(true);
    expect(world.getCell(0, 0)).toBeUndefined();
    expect(world.redo()).toBe(true);
    expect(world.getCell(0, 0)).toEqual(expect.objectContaining({ foundation: true, level: 0 }));
    expect(world.snapshot().revision).toBe(revision + 3);
  });

  it("round-trips foundation state and derived topology in the versioned encoding", () => {
    const source = emptyWorld();
    source.add(-1, 0, 2);
    source.add(0, 0, 3);
    source.add(0, 0, 5);
    source.add(1, 0, 4);
    const encoded = source.serialize();

    const restored = new WorldModel();
    expect(restored.deserialize(encoded, false)).toBe(true);
    expect(restored.snapshot().cells).toEqual(source.snapshot().cells);
    expect(restored.snapshot().features).toEqual(source.snapshot().features);
    expect(restored.getCell(-1, 0)).toEqual(expect.objectContaining({ foundation: true, level: 0 }));
    expect(restored.canUndo()).toBe(false);
    expect(restored.canRedo()).toBe(false);
    expect(restored.serialize()).toBe(encoded);
  });

  it("round-trips sparse storeys with their independent colors", () => {
    const source = emptyWorld();
    expect(source.add(2, 0, 1, 2)).toBe(true);
    expect(source.add(2, 0, 5, 4)).toBe(true);

    const restored = new WorldModel();
    expect(restored.deserialize(source.serialize(), false)).toBe(true);
    expect(restored.getCell(2, 0)).toEqual(expect.objectContaining({
      foundation: false,
      level: 4,
      color: 5,
      storeys: [{ level: 2, color: 1 }, { level: 4, color: 5 }],
    }));
  });

  it("migrates a v2 continuous stack into occupied storeys", () => {
    const restored = emptyWorld();

    expect(restored.deserialize("SEwCAAEICAECAw", false)).toBe(true);
    expect(restored.getCell(0, 0)).toEqual(expect.objectContaining({
      foundation: true,
      level: 2,
      color: 3,
      storeys: [{ level: 1, color: 3 }, { level: 2, color: 3 }],
    }));
  });

  it("rejects malformed serialization without mutating state or history", () => {
    const world = emptyWorld();
    world.add(0, 0, 6);
    const before = world.serialize();
    const beforeRevision = world.snapshot().revision;
    const couldUndo = world.canUndo();

    expect(world.deserialize("not-a-harborlight-town")).toBe(false);
    expect(world.deserialize(`${before}A`)).toBe(false);
    expect(world.serialize()).toBe(before);
    expect(world.snapshot().revision).toBe(beforeRevision);
    expect(world.canUndo()).toBe(couldUndo);
  });

  it("enforces bounds, palette indices, and the maximum house level", () => {
    const world = emptyWorld();

    expect(world.add(8, 8, 0)).toBe(false);
    expect(world.add(0, 0, -1)).toBe(false);
    expect(world.add(0, 0, 0)).toBe(true);
    for (let level = 1; level <= MAX_LEVELS; level += 1) {
      expect(world.add(0, 0, level % 3)).toBe(true);
    }
    expect(world.getCell(0, 0)?.level).toBe(MAX_LEVELS);
    expect(world.add(0, 0, 0)).toBe(false);
  });
});
