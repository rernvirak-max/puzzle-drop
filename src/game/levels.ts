import type { LevelDef, LevelPicture } from "./types";

function pics(entries: [string, number, number][]): LevelPicture[] {
  return entries.map(([photoId, rows, cols]) => ({ photoId, rows, cols }));
}

/**
 * Themed packs. Most photos appear once; a later level may cut a familiar
 * photo into a larger grid. Add a level by appending to this list.
 */
export const LEVELS: readonly LevelDef[] = [
  {
    level: 1,
    name: "Temple Court",
    pack: "Temples",
    pictures: pics([
      ["angkor-wat", 2, 2],
      ["bayon", 2, 2],
      ["ta-prohm", 2, 2],
      ["banteay-srei", 2, 2],
      ["preah-vihear", 2, 2],
      ["neak-pean", 2, 2]
    ])
  },
  {
    level: 2,
    name: "The Table",
    pack: "Food",
    pictures: pics([
      ["fish-amok", 2, 2],
      ["lok-lak", 2, 2],
      ["num-banh-chok", 2, 2],
      ["kuy-teav", 2, 2],
      ["fruit-market", 2, 2],
      ["night-market", 2, 2]
    ])
  },
  {
    level: 3,
    name: "Open Country",
    pack: "Countryside",
    pictures: pics([
      ["rice-fields", 2, 2],
      ["sugar-palms", 2, 2],
      ["tonle-sap-village", 2, 2],
      ["floating-school", 2, 2],
      ["kep-countryside", 2, 2],
      ["cheung-prey", 2, 2],
      ["oudong", 2, 2],
      ["bamboo-train", 2, 2]
    ])
  },
  {
    level: 4,
    name: "Capital",
    pack: "Phnom Penh",
    pictures: pics([
      ["royal-palace", 2, 2],
      ["independence-monument", 2, 2],
      ["riverside", 2, 2],
      ["wat-phnom", 2, 2],
      ["central-market", 2, 2],
      ["silver-pagoda", 2, 2],
      ["royal-palace-hall", 2, 2],
      ["throne-hall", 2, 2]
    ])
  },
  {
    level: 5,
    name: "Coast and Dance",
    pack: "Coast and culture",
    pictures: pics([
      ["kep-beach", 2, 2],
      ["koh-rong", 2, 2],
      ["koh-rong-estuary", 2, 2],
      ["kampot", 2, 2],
      ["bokor", 2, 2],
      ["apsara", 2, 2],
      ["classical-dance", 2, 2],
      ["khmer-new-year", 2, 2]
    ])
  },
  {
    level: 6,
    name: "Quiet Shrines",
    pack: "Temples",
    pictures: pics([
      ["angkor-wat-towers", 2, 3],
      ["banteay-kdei", 2, 3],
      ["angkor-thom-gate", 2, 2],
      ["neak-pean-water", 2, 2],
      ["wat-preah-prom-rath", 2, 2],
      ["pepper-farm", 2, 2]
    ])
  },
  {
    level: 7,
    name: "Supper",
    pack: "Food",
    pictures: pics([
      ["lok-lak-rolls", 3, 3],
      ["kep-crab-market", 2, 2],
      ["kampot-pepper-prawns", 2, 2],
      ["phnom-penh-market", 2, 2],
      ["kun-khmer", 2, 2]
    ])
  },
  {
    level: 8,
    name: "Stage Light",
    pack: "Culture",
    pictures: pics([
      ["monk-phnom-penh", 3, 3],
      ["classical-dance-stage", 2, 3],
      ["koh-rong", 2, 2],
      ["sugar-palms", 2, 2]
    ])
  },
  {
    level: 9,
    name: "Across the Kingdom",
    pack: "Mixed",
    pictures: pics([
      ["banteay-srei", 2, 3],
      ["ta-prohm", 2, 3],
      ["independence-monument", 2, 2],
      ["fish-amok", 2, 2],
      ["tonle-sap-village", 2, 2],
      ["bokor", 2, 2]
    ])
  },
  {
    level: 10,
    name: "The Long Gallery",
    pack: "Finale",
    pictures: pics([
      ["bayon", 3, 3],
      ["royal-palace", 3, 3],
      ["night-market", 2, 2],
      ["kep-beach", 2, 2],
      ["bamboo-train", 2, 2],
      ["wat-phnom", 2, 2]
    ])
  }
];

export function levelDef(level: number): LevelDef {
  const index = (Math.max(1, level) - 1) % LEVELS.length;
  return LEVELS[index] ?? LEVELS[0]!;
}
