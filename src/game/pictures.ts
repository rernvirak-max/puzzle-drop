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

/** Real photographs. Full credit lines live in CREDITS.md. */
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
  },
  {
    id: "victory-gate",
    title: "Victory Gate",
    place: "Angkor Thom",
    file: "victory-gate.jpg",
    photographer: "Diego Delso",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Puerta_de_la_Victoria,_Angkor_Thom,_Camboya,_2013-08-16,_DD_02.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    id: "tonle-sap",
    title: "Tonlé Sap",
    place: "Siem Reap",
    file: "tonle-sap.jpg",
    photographer: "Jakub Hałun",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:20171129_Tonle_Sap_Cambodia_6072_DxO.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "kep-beach",
    title: "Kep beach",
    place: "Kep",
    file: "kep-beach.jpg",
    photographer: "PsamatheM",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:06-Kep_Beach_Cambodia-nX-19.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "monks",
    title: "Monks",
    place: "Preah Pithu, Siem Reap",
    file: "monks.jpg",
    photographer: "JJ Harrison",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Preah_Pithu_T_Monks_-_Siem_Reap.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    id: "central-market",
    title: "Central Market",
    place: "Phnom Penh",
    file: "central-market.jpg",
    photographer: "Mx. Granger",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Phnom_Penh_Central_Market_-_January_2020_-_2.jpg",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    id: "kampot",
    title: "Kampot river",
    place: "Kampot",
    file: "kampot.jpg",
    photographer: "Adam Jones",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Kampot_Riverfront_Scene_-_Kampot_-_Cambodia_(48501740381).jpg",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/"
  },
  {
    id: "flowers",
    title: "Flower market",
    place: "Koyambedu",
    file: "flowers.jpg",
    photographer: "Kaartic",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Flowers_in_Koyambedu_Flower_market_(53769).jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    id: "himalaya",
    title: "Mountain lake",
    place: "Chola Valley, Nepal",
    file: "himalaya.jpg",
    photographer: "Vyacheslav Argenberg",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Mountains_in_snow,_Mountain_lake,_Chola_Valley,_Nepal,_Himalayas.jpg",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/"
  },
  {
    id: "palm-beach",
    title: "Palm beach",
    place: "Koh Mak, Thailand",
    file: "palm-beach.jpg",
    photographer: "Vyacheslav Argenberg",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Koh_Mak_(island),_Thailand,_Palm_trees_on_the_beach.jpg",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/"
  },
  {
    id: "forest",
    title: "Forest path",
    place: "Finland",
    file: "forest.jpg",
    photographer: "Sanzzu",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Forest_path_through_a_deciduous_forest_in_spring,_Finland.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "coffee",
    title: "Coffee",
    place: "Café table",
    file: "coffee.jpg",
    photographer: "Ssu",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cup_of_coffee_on_caf%C3%A9_table.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "fruit-market",
    title: "Fruit market",
    place: "Night market",
    file: "fruit-market.jpg",
    photographer: "QueenSaysay",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Fruit_market_at_night.jpg",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/"
  }
];

const byId = new Map(CATALOG.map(picture => [picture.id, picture]));

export function catalogPicture(id: string): CatalogPicture | undefined {
  return byId.get(id);
}

export function publicPhoto(file: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const prefix = base.endsWith("/") ? base : `${base}/`;
  return `${prefix}photos/${file}`;
}
