export type QuarterTurns = 0 | 1 | 2 | 3;

export type GamePhase = "playing" | "paused" | "won" | "lost";

export interface Piece {
  id: string;
  row: number;
  col: number;
}

export interface ActivePiece {
  id: string;
  row: number;
  col: number;
  rotation: QuarterTurns;
}

export interface GameSnapshot {
  rows: number;
  cols: number;
  phase: GamePhase;
  lives: number;
  maxLives: number;
  score: number;
  combo: number;
  bestCombo: number;
  locked: (string | null)[][];
  queue: string[];
  active: ActivePiece | null;
  pieces: Piece[];
  fallIntervalMs: number;
  lockedCount: number;
  total: number;
}

export type GameEvent =
  | { type: "spawn"; pieceId: string }
  | {
      type: "lock";
      pieceId: string;
      row: number;
      col: number;
      fromRow: number;
      rotation: QuarterTurns;
      combo: number;
      score: number;
    }
  | {
      type: "miss";
      pieceId: string;
      row: number;
      col: number;
      fromRow: number;
      rotation: QuarterTurns;
      lives: number;
    }
  | { type: "win"; score: number }
  | { type: "lose"; score: number };

export interface CreateGameOptions {
  rows: number;
  cols: number;
  lives?: number;
  rng?: () => number;
  queue?: readonly string[];
  rotationRoll?: () => number;
  columnRoll?: (openColumns: readonly number[]) => number;
}
