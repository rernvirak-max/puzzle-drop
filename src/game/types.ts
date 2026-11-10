export const BOARD_ROWS = 4;
export const BOARD_COLS = 4;

export interface Tile {
  id: string;
  pictureId: string;
  photoId: string;
  localRow: number;
  localCol: number;
  pictureRows: number;
  pictureCols: number;
}

export type Board = (Tile | null)[][];

export interface GameState {
  level: number;
  board: Board;
  stacks: Tile[][];
}

export interface CellPos {
  row: number;
  col: number;
}

export interface Completion {
  pictureId: string;
  photoId: string;
  originRow: number;
  originCol: number;
  rows: number;
  cols: number;
}

export interface FallMove {
  tileId: string;
  to: CellPos;
  from: CellPos | { stack: number };
}

export interface MergeStep {
  kind: "merge";
  completions: Completion[];
  board: Board;
}

export interface RefillStep {
  kind: "refill";
  board: Board;
  stacks: Tile[][];
  falls: FallMove[];
}

export interface WinStep {
  kind: "win";
}

export type SettleStep = MergeStep | RefillStep | WinStep;

export interface LevelPicture {
  photoId: string;
  rows: number;
  cols: number;
}

export interface LevelDef {
  level: number;
  pictures: LevelPicture[];
}
