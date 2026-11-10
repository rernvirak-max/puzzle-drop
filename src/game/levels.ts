import type { LevelDef, LevelPicture } from "./types";

function pics(entries: [string, number, number][]): LevelPicture[] {
  return entries.map(([photoId, rows, cols]) => ({ photoId, rows, cols }));
}

/**
 * Hand-authored level templates. Add another object to extend the game.
 * Tile counts are always at least a full 4×4 board; the rest sit in the stacks.
 */
export const LEVELS: readonly LevelDef[] = [
  {
    level: 1,
    pictures: pics([
      ["angkor-wat", 2, 2],
      ["rice-fields", 2, 2],
      ["khmer-amok", 2, 2],
      ["kep-beach", 2, 2],
      ["coffee", 2, 2],
      ["flowers", 2, 2]
    ])
  },
  {
    level: 2,
    pictures: pics([
      ["bayon", 2, 2],
      ["tonle-sap", 2, 2],
      ["palm-beach", 2, 2],
      ["fruit-market", 2, 2],
      ["forest", 2, 2],
      ["monks", 2, 2],
      ["kampot", 2, 2],
      ["central-market", 2, 2]
    ])
  },
  {
    level: 3,
    pictures: pics([
      ["angkor-wat", 2, 2],
      ["bayon", 2, 2],
      ["victory-gate", 2, 2],
      ["phnom-penh", 2, 2],
      ["monks", 2, 2],
      ["tonle-sap", 2, 2],
      ["kampot", 2, 2],
      ["rice-fields", 2, 2]
    ])
  },
  {
    level: 4,
    pictures: pics([
      ["palm-beach", 2, 3],
      ["himalaya", 2, 3],
      ["flowers", 2, 2],
      ["coffee", 2, 2],
      ["fruit-market", 2, 2],
      ["forest", 2, 2]
    ])
  },
  {
    level: 5,
    pictures: pics([
      ["angkor-wat", 3, 3],
      ["kep-beach", 2, 2],
      ["khmer-amok", 2, 2],
      ["central-market", 2, 2],
      ["rice-fields", 2, 2]
    ])
  },
  {
    level: 6,
    pictures: pics([
      ["bayon", 3, 3],
      ["tonle-sap", 2, 3],
      ["flowers", 2, 3],
      ["coffee", 2, 2],
      ["monks", 2, 2]
    ])
  },
  {
    level: 7,
    pictures: pics([
      ["angkor-wat", 2, 2],
      ["phnom-penh", 2, 2],
      ["khmer-amok", 2, 2],
      ["rice-fields", 2, 2],
      ["bayon", 2, 2],
      ["victory-gate", 2, 2],
      ["kep-beach", 2, 2],
      ["flowers", 2, 2],
      ["himalaya", 2, 2],
      ["forest", 2, 2]
    ])
  },
  {
    level: 8,
    pictures: pics([
      ["angkor-wat", 3, 3],
      ["phnom-penh", 3, 3],
      ["himalaya", 2, 3],
      ["palm-beach", 2, 3],
      ["coffee", 2, 2],
      ["fruit-market", 2, 2],
      ["kampot", 2, 2],
      ["central-market", 2, 2]
    ])
  }
];

export function levelDef(level: number): LevelDef {
  const index = (Math.max(1, level) - 1) % LEVELS.length;
  return LEVELS[index] ?? LEVELS[0]!;
}
