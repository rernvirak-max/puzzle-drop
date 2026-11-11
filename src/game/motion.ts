export const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
export const EASE_SPRING = "cubic-bezier(0.2, 1.2, 0.3, 1)";
export const EASE_GRAVITY = "cubic-bezier(0.45, 0, 0.9, 0.55)";

export function motionScale(): number {
  if (typeof matchMedia !== "function") return 1;
  return matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.4 : 1;
}

export function scaled(ms: number): number {
  return Math.max(70, Math.round(ms * motionScale()));
}

/** Short offset between staggered drops. Not floored, so reduced motion stays tighter. */
export function scaledDelay(ms: number): number {
  return Math.round(ms * motionScale());
}
