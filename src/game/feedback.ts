export type Praise = "Good" | "Great" | "Perfect";

/** First clear in a chain is Good, then Great, then Perfect. */
export function praiseWord(index: number): Praise {
  if (index <= 0) return "Good";
  if (index === 1) return "Great";
  return "Perfect";
}

/** Three stars if neither power was used, one fewer for each. */
export function starsFor(usedHint: boolean, usedMagic: boolean): number {
  return 3 - Number(usedHint) - Number(usedMagic);
}
