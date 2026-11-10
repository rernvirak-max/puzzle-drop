import { BOARD_COLS, BOARD_ROWS } from "./types";
import type { CellPos } from "./types";

/**
 * Slot whose centre is nearest to a point in board coordinates.
 * The point is the dragged tile's centre, not the raw pointer.
 */
export function cellUnderCenter(
  localX: number,
  localY: number,
  cellW: number,
  cellH: number,
  gap: number,
  rows = BOARD_ROWS,
  cols = BOARD_COLS
): CellPos | null {
  if (cellW <= 0 || cellH <= 0) return null;
  const col = Math.round((localX - cellW / 2) / (cellW + gap));
  const row = Math.round((localY - cellH / 2) / (cellH + gap));
  if (row < 0 || col < 0 || row >= rows || col >= cols) return null;
  return { row, col };
}

/**
 * Where the grabbed tile should land so the whole group stays on the board.
 * Returns null when the group would not move or would leave the board.
 */
export function landingCell(
  anchor: CellPos,
  hit: CellPos,
  members: CellPos[],
  rows = BOARD_ROWS,
  cols = BOARD_COLS
): CellPos | null {
  const dRow = hit.row - anchor.row;
  const dCol = hit.col - anchor.col;
  if (dRow === 0 && dCol === 0) return null;
  const fits = members.every(member => {
    const row = member.row + dRow;
    const col = member.col + dCol;
    return row >= 0 && col >= 0 && row < rows && col < cols;
  });
  return fits ? hit : null;
}
