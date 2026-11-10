export const GRID_SIZES = [3, 4, 5] as const;

export type GridSize = (typeof GRID_SIZES)[number];

export interface CatalogPicture {
  id: string;
  title: string;
  place: string;
  file: string;
  photographer: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
}

/**
 * Photographs shipped with the game. Full credit lines live in CREDITS.md.
 * Files are real photos, resized so the long edge is about 1080px.
 */
export const CATALOG: readonly CatalogPicture[] = [
  {
    id: "angkor-wat",
    title: "Angkor Wat",
    place: "Siem Reap",
    file: "angkor-wat.jpg",
    photographer: "Uwe Aranas (CEphoto)",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Angkor_SiemReap_Cambodia_Ankor-Wat-01.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    id: "phnom-penh",
    title: "Royal Palace",
    place: "Phnom Penh",
    file: "phnom-penh.jpg",
    photographer: "Marcin Konsek",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2016_Phnom_Penh,_Pa%C5%82ac_Kr%C3%B3lewski,_Pawilon_Chanchhaya_(02).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "khmer-amok",
    title: "Fish amok",
    place: "Khmer kitchen",
    file: "khmer-amok.jpg",
    photographer: "Stefan Fussan",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cambodian_Fish_Amok.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    id: "rice-fields",
    title: "Rice fields",
    place: "Siem Reap countryside",
    file: "rice-fields.jpg",
    photographer: "Gary Todd",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cambodia_Rice_Fields_(9728048741).jpg",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    id: "bayon",
    title: "Bayon",
    place: "Angkor Thom",
    file: "bayon.jpg",
    photographer: "McKay Savage",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cambodia_08_-_136_-_Angkor_Thom_-_Bayon_(3228100401).jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/"
  }
];

export function publicPhoto(file: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const prefix = base.endsWith("/") ? base : `${base}/`;
  return `${prefix}photos/${file}`;
}
