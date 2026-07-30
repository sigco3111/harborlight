export interface PaletteColor {
  readonly name: string;
  readonly wall: number;
  readonly wallShadow: number;
  readonly trim: number;
  readonly roof: number;
}

export type Direction = "north" | "east" | "south" | "west";
export type CellKind = "water" | "foundation" | "house" | "bridge" | "courtyard";

export interface StoreyState {
  /** User-facing, one-based storey number. */
  readonly level: number;
  readonly color: number;
}

export interface CellState {
  readonly id: string;
  readonly x: number;
  readonly z: number;
  readonly foundation: boolean;
  readonly level: number;
  readonly color: number;
  /** Occupied storeys only; gaps are significant. */
  readonly storeys: readonly StoreyState[];
}

export interface CellNeighbors {
  readonly north?: string;
  readonly east?: string;
  readonly south?: string;
  readonly west?: string;
}

export interface CellFeature {
  readonly id: string;
  readonly kind: Exclude<CellKind, "water">;
  readonly level: number;
  readonly color: number;
  readonly storeys: readonly StoreyState[];
  readonly neighbors: CellNeighbors;
  readonly exposed: Readonly<Record<Direction, boolean>>;
  readonly bridgeSpan?: readonly [Direction, Direction];
}

export interface WorldSnapshot {
  readonly cells: readonly CellState[];
  readonly features: readonly CellFeature[];
  readonly revision: number;
}

export interface CellPick {
  readonly id: string;
  readonly x: number;
  readonly z: number;
  /** Exact one-based storey addressed by a building face. */
  readonly level: number;
  readonly placementLevel?: number;
  readonly kind: CellKind;
  readonly face?: "water" | "top" | "side";
  readonly direction?: Direction;
  /** Source surface, when an add-side pick targets the adjacent cell. */
  readonly surfaceX?: number;
  readonly surfaceZ?: number;
}

export interface ViewState {
  readonly azimuth: number;
  readonly elevation: number;
  readonly zoom: number;
  readonly targetX: number;
  readonly targetZ: number;
}

export interface HudCallbacks {
  onColor(index: number): void;
  onUndo(): void;
  onRedo(): void;
  onClear(): void;
  onRandomTown(): void;
  onSaveImage(): void;
  onToggleSound(enabled: boolean): void;
  onToggleHelp(): void;
}

export interface HudController {
  setColor(index: number): void;
  setHistory(canUndo: boolean, canRedo: boolean): void;
  setStatus(message: string): void;
  showHint(message: string): void;
  hideLoading(): void;
  dispose(): void;
}
