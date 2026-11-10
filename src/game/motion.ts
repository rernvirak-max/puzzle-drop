export function motionScale(): number {
  if (typeof matchMedia !== "function") return 1;
  return matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.4 : 1;
}

export function scaled(ms: number): number {
  return Math.max(70, Math.round(ms * motionScale()));
}
