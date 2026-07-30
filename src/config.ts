import type { Direction, PaletteColor } from "./types";

export const CELL_SIZE = 2.08;
export const LEVEL_HEIGHT = 1.72;
export const MIN_LEVEL = 0;
export const MAX_LEVELS = 6;
export const WORLD_RADIUS = 8;
export const WORLD_DIAMETER = WORLD_RADIUS * 2 + 1;

export const WORLD_BOUNDS = {
  minX: -WORLD_RADIUS,
  maxX: WORLD_RADIUS,
  minZ: -WORLD_RADIUS,
  maxZ: WORLD_RADIUS,
} as const;

export interface DirectionMetadata {
  readonly direction: Direction;
  readonly dx: -1 | 0 | 1;
  readonly dz: -1 | 0 | 1;
  readonly opposite: Direction;
  readonly axis: "x" | "z";
}

export const DIRECTIONS = [
  { direction: "north", dx: 0, dz: -1, opposite: "south", axis: "z" },
  { direction: "east", dx: 1, dz: 0, opposite: "west", axis: "x" },
  { direction: "south", dx: 0, dz: 1, opposite: "north", axis: "z" },
  { direction: "west", dx: -1, dz: 0, opposite: "east", axis: "x" },
] as const satisfies readonly DirectionMetadata[];

export const DIRECTION_NAMES = ["north", "east", "south", "west"] as const satisfies readonly Direction[];

export const FEATURE_TUNING = {
  foundationHeight: 0.38,
  foundationDepth: 1.15,
  shorelineOverhang: 0.38,
  foundationInset: 0.1,
  wallInset: 0.15,
  wallBevel: 0.055,
  roofHeight: 0.72,
  roofOverhang: 0.14,
  bridgeDeckThickness: 0.14,
  bridgeClearance: 0,
  bridgeRailHeight: 0.38,
  courtyardInset: 0.24,
  footprintJitter: 0.08,
} as const;

export const WATER_LEVEL = -0.08;

export const WATER_EFFECT_TUNING = {
  waveSpeed: 0.72,
  shorelineCycle: 3.8,
  shorelineTravel: 0.18,
  drainCycle: 4.6,
  drainStreamLength: 0.34,
  drainRippleGrowth: 1.9,
} as const;

export const MATERIAL_COLORS = {
  ink: 0x31484c,
  sky: 0x83bec0,
  skyZenith: 0x68aeb5,
  skyHorizon: 0xd6dfca,
  fog: 0xb8d3cc,
  water: 0x3e858e,
  foam: 0xd7eee5,
  foundation: 0x899994,
  foundationShadow: 0x647b78,
  roofAccent: 0x8a4e48,
  vegetation: 0x668c68,
} as const;

export const MATERIAL_TUNING = {
  plasterRoughness: 0.84,
  trimRoughness: 0.62,
  roofRoughness: 0.72,
  stoneRoughness: 0.9,
  waterOpacity: 0.88,
  inkOpacity: 0.68,
} as const;

export const SERIALIZATION_MAGIC: readonly [number, number] = [0x48, 0x4c];
export const SERIALIZATION_VERSION = 3;

export const PALETTE: readonly PaletteColor[] = [
  { name: "Poppy", wall: 0xe95f59, wallShadow: 0xb94347, trim: 0xffd8a8, roof: 0xd07052 },
  { name: "Tangerine", wall: 0xf28b54, wallShadow: 0xc35d3f, trim: 0xffe1b4, roof: 0xb24f42 },
  { name: "Butter", wall: 0xf3d76b, wallShadow: 0xc6a64b, trim: 0xfff1c1, roof: 0xd17052 },
  { name: "Citron", wall: 0xc8d96d, wallShadow: 0x98ab4d, trim: 0xf4ecc3, roof: 0x9b7354 },
  { name: "Sage", wall: 0x8dc980, wallShadow: 0x5d9f70, trim: 0xe6ebbd, roof: 0x637f65 },
  { name: "Jade", wall: 0x52bd8b, wallShadow: 0x328c73, trim: 0xd7ebbc, roof: 0x477973 },
  { name: "Lagoon", wall: 0x53b7ad, wallShadow: 0x32878a, trim: 0xd7eac5, roof: 0x477686 },
  { name: "Sky", wall: 0x55add1, wallShadow: 0x387da9, trim: 0xd8e9d2, roof: 0x596d94 },
  { name: "Periwinkle", wall: 0x718ed2, wallShadow: 0x586daf, trim: 0xe1e4d5, roof: 0x655f91 },
  { name: "Heather", wall: 0x9a7fc3, wallShadow: 0x715c9e, trim: 0xe8dfd1, roof: 0x705773 },
  { name: "Rose", wall: 0xc4779e, wallShadow: 0x994f78, trim: 0xf0ddce, roof: 0x805162 },
  { name: "Clay", wall: 0xd08b75, wallShadow: 0xa25d52, trim: 0xefe0c8, roof: 0x86544d },
  { name: "Shell", wall: 0xe2aaa0, wallShadow: 0xb97972, trim: 0xf7e7d5, roof: 0x925d58 },
  { name: "Limestone", wall: 0xcfc5ab, wallShadow: 0x9d9584, trim: 0xf3ead6, roof: 0x7a6f64 },
  { name: "Chalk", wall: 0xe6e4d4, wallShadow: 0xb7b5a7, trim: 0xfff8df, roof: 0x817b72 },
] as const;

export interface DefaultCell {
  readonly x: number;
  readonly z: number;
  readonly foundation: boolean;
  readonly level: number;
  readonly color: number;
}

export const DEFAULT_CELLS = [
  { x: -3, z: -1, foundation: true, level: 1, color: 4 },
  { x: -2, z: -1, foundation: true, level: 1, color: 3 },
  { x: -3, z: 0, foundation: true, level: 1, color: 2 },
  { x: -2, z: 0, foundation: true, level: 2, color: 2 },
  { x: -1, z: 1, foundation: true, level: 0, color: 1 },
  { x: 0, z: -1, foundation: true, level: 1, color: 8 },
  { x: 1, z: -1, foundation: true, level: 0, color: 13 },
  { x: 2, z: -1, foundation: true, level: 2, color: 8 },
  { x: 0, z: 0, foundation: true, level: 2, color: 1 },
  { x: 1, z: 0, foundation: true, level: 3, color: 0 },
  { x: 2, z: 0, foundation: true, level: 1, color: 11 },
  { x: -3, z: 1, foundation: true, level: 1, color: 3 },
  { x: -2, z: 1, foundation: true, level: 0, color: 13 },
  { x: 0, z: 1, foundation: true, level: 0, color: 1 },
  { x: 1, z: 1, foundation: true, level: 2, color: 1 },
  { x: 2, z: 1, foundation: true, level: 1, color: 11 },
] as const satisfies readonly DefaultCell[];
