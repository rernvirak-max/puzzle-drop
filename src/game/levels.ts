import { CATALOG, type PhotoPack } from "./pictures";
import type { LevelDef, LevelPicture } from "./types";

interface LevelSpec {
  level: number;
  name: string;
  pack: string;
  count: number;
  pools: PhotoPack[];
}

const SPECS: readonly LevelSpec[] = [
  {
    level: 1,
    name: "Temple Court",
    pack: "Temples",
    count: 6,
    pools: ["temples"]
  },
  { level: 2, name: "The Table", pack: "Food", count: 6, pools: ["food"] },
  {
    level: 3,
    name: "Open Country",
    pack: "Countryside",
    count: 6,
    pools: ["countryside"]
  },
  { level: 4, name: "Capital", pack: "Phnom Penh", count: 6, pools: ["city"] },
  {
    level: 5,
    name: "Coast and Dance",
    pack: "Coast and culture",
    count: 6,
    pools: ["coast", "culture"]
  },
  {
    level: 6,
    name: "Quiet Shrines",
    pack: "Temples",
    count: 7,
    pools: ["temples"]
  },
  { level: 7, name: "Supper", pack: "Food", count: 7, pools: ["food"] },
  {
    level: 8,
    name: "Stage Light",
    pack: "Culture",
    count: 7,
    pools: ["culture"]
  },
  {
    level: 9,
    name: "Tonle Sap",
    pack: "Floating villages",
    count: 7,
    pools: ["countryside"]
  },
  {
    level: 10,
    name: "Mekong Morning",
    pack: "River",
    count: 7,
    pools: ["countryside", "coast"]
  },
  {
    level: 11,
    name: "Royal Kilometres",
    pack: "Phnom Penh",
    count: 8,
    pools: ["city"]
  },
  {
    level: 12,
    name: "Bayon Faces",
    pack: "Temples",
    count: 8,
    pools: ["temples"]
  },
  {
    level: 13,
    name: "Pepper and Crab",
    pack: "Food",
    count: 8,
    pools: ["food", "coast"]
  },
  {
    level: 14,
    name: "Island Light",
    pack: "Coast",
    count: 8,
    pools: ["coast"]
  },
  { level: 15, name: "Apsara", pack: "Culture", count: 8, pools: ["culture"] },
  {
    level: 16,
    name: "Rice Season",
    pack: "Countryside",
    count: 8,
    pools: ["countryside"]
  },
  {
    level: 17,
    name: "Phnom Penh Walk",
    pack: "City",
    count: 9,
    pools: ["city", "food"]
  },
  {
    level: 18,
    name: "Outer Temples",
    pack: "Temples",
    count: 9,
    pools: ["temples"]
  },
  {
    level: 19,
    name: "Market Day",
    pack: "Markets",
    count: 9,
    pools: ["food", "city"]
  },
  {
    level: 20,
    name: "Festival",
    pack: "Culture",
    count: 9,
    pools: ["culture", "food"]
  },
  {
    level: 21,
    name: "Highlands",
    pack: "Mondulkiri and Ratanakiri",
    count: 9,
    pools: ["countryside", "wildlife"]
  },
  {
    level: 22,
    name: "Battambang Road",
    pack: "Mixed",
    count: 10,
    pools: ["city", "countryside"]
  },
  {
    level: 23,
    name: "Kampot and Kep",
    pack: "Coast",
    count: 10,
    pools: ["coast", "food"]
  },
  {
    level: 24,
    name: "Wild Water",
    pack: "Wildlife",
    count: 10,
    pools: ["wildlife", "countryside"]
  },
  {
    level: 25,
    name: "Siem Reap",
    pack: "Temples and town",
    count: 10,
    pools: ["temples", "city"]
  },
  {
    level: 26,
    name: "River Roads",
    pack: "Mixed",
    count: 10,
    pools: ["countryside", "coast", "city"]
  },
  {
    level: 27,
    name: "Night and Day",
    pack: "Mixed",
    count: 11,
    pools: ["city", "culture", "food"]
  },
  {
    level: 28,
    name: "Kingdom Table",
    pack: "Food and culture",
    count: 11,
    pools: ["food", "culture"]
  },
  {
    level: 29,
    name: "Far Provinces",
    pack: "Mixed",
    count: 12,
    pools: ["countryside", "wildlife", "coast"]
  },
  {
    level: 30,
    name: "The Long Gallery",
    pack: "Finale",
    count: 12,
    pools: [
      "temples",
      "city",
      "food",
      "culture",
      "countryside",
      "coast",
      "wildlife"
    ]
  }
];

const cursor = new Map<string, number>();

function takePhotos(
  pools: readonly PhotoPack[],
  count: number,
  recent: Set<string>
): string[] {
  const pool = CATALOG.filter(picture => pools.includes(picture.pack));
  const chosen: string[] = [];
  const pick = (skipRecent: boolean) => {
    if (pool.length === 0) return;
    const key = pools.join(",");
    let index = cursor.get(key) ?? 0;
    for (let step = 0; step < pool.length && chosen.length < count; step += 1) {
      const picture = pool[(index + step) % pool.length];
      if (!picture || chosen.includes(picture.id)) continue;
      if (skipRecent && recent.has(picture.id)) continue;
      chosen.push(picture.id);
    }
    cursor.set(key, (index + chosen.length) % pool.length);
  };
  pick(true);
  if (chosen.length < count) pick(false);
  return chosen;
}

let previous = new Set<string>();

export const LEVELS: readonly LevelDef[] = SPECS.map(spec => {
  const ids = takePhotos(spec.pools, spec.count, previous);
  previous = new Set(ids);
  const pictures: LevelPicture[] = ids.map(photoId => ({
    photoId,
    rows: 2,
    cols: 2
  }));
  return {
    level: spec.level,
    name: spec.name,
    pack: spec.pack,
    pictures
  };
});

export function levelDef(level: number): LevelDef {
  const index = (Math.max(1, level) - 1) % LEVELS.length;
  return LEVELS[index] ?? LEVELS[0]!;
}
