/** Milliseconds per row when the board is empty. */
export const SLOW_FALL_MS = 980;

/** Milliseconds per row when the board is full. */
export const FAST_FALL_MS = 260;

/** Added once, when the last piece locks. */
export const WIN_BONUS = 500;

export const MAX_LIVES = 3;

/**
 * Points for a correct lock.
 * `combo` is the streak after this lock, so 1 pays the base and each
 * extra correct drop in a row adds half the base again.
 */
export function pointsForLock(gridSize: number, combo: number): number {
  const size = Math.max(1, gridSize);
  const streak = Math.max(1, combo);
  return size * 100 + (streak - 1) * size * 50;
}

/** Fall speed ramps with how much of the picture is already locked. */
export function fallIntervalMs(lockedCount: number, total: number): number {
  if (total <= 0) return SLOW_FALL_MS;
  const fill = Math.min(1, Math.max(0, lockedCount / total));
  return Math.round(SLOW_FALL_MS - (SLOW_FALL_MS - FAST_FALL_MS) * fill);
}
