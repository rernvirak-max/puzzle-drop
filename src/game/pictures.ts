export type PhotoPack =
  | "temples"
  | "city"
  | "food"
  | "culture"
  | "countryside"
  | "coast";

export interface CatalogPicture {
  id: string;
  title: string;
  pack: PhotoPack;
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
    pack: "temples",
    file: "angkor-wat.webp",
    photographer: "Pierre André Leclercq",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2014-Cambodge_Angkor_Wat_(21).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "angkor-wat-towers",
    title: "Angkor Wat towers",
    pack: "temples",
    file: "angkor-wat-towers.webp",
    photographer: "Jakub Hałun",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:20171126_Angkor_Wat_4712_DxO.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "bayon",
    title: "Bayon",
    pack: "temples",
    file: "bayon.webp",
    photographer: "Jakub Hałun",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:20171127_Bayon_Temple_Angkor_Thom_4754_DxO.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "ta-prohm",
    title: "Ta Prohm",
    pack: "temples",
    file: "ta-prohm.webp",
    photographer: "Marcin Konsek",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2016_Angkor,_Ta_Prohm_(07).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "banteay-srei",
    title: "Banteay Srei",
    pack: "temples",
    file: "banteay-srei.webp",
    photographer: "Olaf Tausch",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Banteay_Srei_32a.jpg",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/"
  },
  {
    id: "preah-vihear",
    title: "Preah Vihear",
    pack: "temples",
    file: "preah-vihear.webp",
    photographer: "PsamatheM",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:03_Prasat_Preah_Vihear-nX-06471.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "angkor-thom-gate",
    title: "Angkor Thom gate",
    pack: "temples",
    file: "angkor-thom-gate.webp",
    photographer: "Marcin Konsek",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2016_Angkor,_Angkor_Thom,_Brama_po%C5%82udniowa_(21).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "banteay-kdei",
    title: "Banteay Kdei",
    pack: "temples",
    file: "banteay-kdei.webp",
    photographer: "Marcin Konsek",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2016_Angkor,_Banteay_Kdei_(07).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "neak-pean",
    title: "Neak Pean",
    pack: "temples",
    file: "neak-pean.webp",
    photographer: "Marcin Konsek",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2016_Angkor,_Neak_Pean_(01).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "neak-pean-water",
    title: "Neak Pean pond",
    pack: "temples",
    file: "neak-pean-water.webp",
    photographer: "Diego Delso",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Neak_Pean,_Angkor,_Camboya,_2013-08-17,_DD_01.JPG",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    id: "wat-preah-prom-rath",
    title: "Wat Preah Prom Rath",
    pack: "temples",
    file: "wat-preah-prom-rath.webp",
    photographer: "Jakub Hałun",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:20171129_Wat_Preah_Prom_Rath_Siem_Reap_6207_DxO.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "royal-palace",
    title: "Royal Palace",
    pack: "city",
    file: "royal-palace.webp",
    photographer: "Marcin Konsek",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2016_Phnom_Penh,_Pa%C5%82ac_Kr%C3%B3lewski,_Pawilon_Chanchhaya_(02).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "independence-monument",
    title: "Independence Monument",
    pack: "city",
    file: "independence-monument.webp",
    photographer: "PsamatheM",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:02-Independence_Monument_Phnom_Penh-nX-3.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "riverside",
    title: "Phnom Penh riverside",
    pack: "city",
    file: "riverside.webp",
    photographer: "Chris Combe",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Phnom_Penh_Boat_(7251109192).jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/"
  },
  {
    id: "wat-phnom",
    title: "Wat Phnom",
    pack: "city",
    file: "wat-phnom.webp",
    photographer: "Marcin Konsek",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2016_Phnom_Penh,_Wat_Phnom_(02).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "central-market",
    title: "Central Market",
    pack: "city",
    file: "central-market.webp",
    photographer: "Jakub Hałun",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:20171125_Central_Market,_Phnom_Penh_4368_DxO.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "silver-pagoda",
    title: "Silver Pagoda",
    pack: "city",
    file: "silver-pagoda.webp",
    photographer: "Marcin Konsek",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2016_Phnom_Penh,_Pa%C5%82ac_Kr%C3%B3lewski,_Srebrna_Pagoda_(02).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "royal-palace-hall",
    title: "Royal Palace hall",
    pack: "city",
    file: "royal-palace-hall.webp",
    photographer: "Hanay",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Royal_Palace,_Phnom_Penh_Cambodia_1.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    id: "throne-hall",
    title: "Throne Hall",
    pack: "city",
    file: "throne-hall.webp",
    photographer: "Nikin Kovilakath",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Throne_Hall,_Royal_Palace,_Phnom_Penh,_Cambodia.jpg",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/"
  },
  {
    id: "fish-amok",
    title: "Fish amok",
    pack: "food",
    file: "fish-amok.webp",
    photographer: "Marcin Konsek",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2016_Phnom_Penh,_Amok_trey_(02).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "lok-lak-rolls",
    title: "Lok lak and spring rolls",
    pack: "food",
    file: "lok-lak-rolls.webp",
    photographer: "JIP",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Khmer_spring_rolls_and_Sach_Ko_Lok_Lak_in_Lauttasaari.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "lok-lak",
    title: "Lok lak",
    pack: "food",
    file: "lok-lak.webp",
    photographer: "Turaids",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Lok_lak_at_Khmer_Cuisine.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "num-banh-chok",
    title: "Num banh chok",
    pack: "food",
    file: "num-banh-chok.webp",
    photographer: "Stefan Fussan",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cambodian_Num_Pachok.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    id: "kuy-teav",
    title: "Kuy teav",
    pack: "food",
    file: "kuy-teav.webp",
    photographer: "Ik T",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cambodia_noodles_with_beef_(3340470241).jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/"
  },
  {
    id: "kep-crab-market",
    title: "Kep crab market",
    pack: "food",
    file: "kep-crab-market.webp",
    photographer: "PsamatheM",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:06-Kep_Crab_Market_Cambodia-nX-12.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "fruit-market",
    title: "Fruit market",
    pack: "food",
    file: "fruit-market.webp",
    photographer: "McKay Savage",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cambodia_08_-_038_-_fruit_at_the_market_(3198828515).jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/"
  },
  {
    id: "kampot-pepper-prawns",
    title: "Kampot pepper prawns",
    pack: "food",
    file: "kampot-pepper-prawns.webp",
    photographer: "Stefan Fussan",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cambodian_Prawns_with_Kampot_Pepper.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    id: "night-market",
    title: "Phnom Penh night market",
    pack: "food",
    file: "night-market.webp",
    photographer: "Mx. Granger",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Kabobs_at_Phnom_Penh_Night_Market.jpg",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    id: "phnom-penh-market",
    title: "Phnom Penh market",
    pack: "food",
    file: "phnom-penh-market.webp",
    photographer: "Radosław Botev",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Market_in_Phnom_Penh.jpg",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/"
  },
  {
    id: "apsara",
    title: "Apsara dance",
    pack: "culture",
    file: "apsara.webp",
    photographer: "shankar s., https://www.flickr.com/photos/shankaronline/",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Apsara_Dance,_Siem_Reap,_Cambodia,_Oct._2008.jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/"
  },
  {
    id: "khmer-new-year",
    title: "Khmer New Year",
    pack: "culture",
    file: "khmer-new-year.webp",
    photographer: "Sam Sith",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Khmer_New_Year_GA2010-128.jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/"
  },
  {
    id: "monk-phnom-penh",
    title: "Monk in Phnom Penh",
    pack: "culture",
    file: "monk-phnom-penh.webp",
    photographer: "Adam Jones Adam63",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Buddhist_Monk_-_Phnom_Penh_-_Cambodia_02.JPG",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    id: "classical-dance",
    title: "Khmer classical dance",
    pack: "culture",
    file: "classical-dance.webp",
    photographer: "SamodyPicture",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Khmer_classic_dance.jpg",
    license: "Public domain",
    licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  {
    id: "classical-dance-stage",
    title: "Classical dance",
    pack: "culture",
    file: "classical-dance-stage.webp",
    photographer: "Jadamta",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Khmer_classical_dance_01.JPG",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    id: "kun-khmer",
    title: "Kun Khmer",
    pack: "culture",
    file: "kun-khmer.webp",
    photographer: "Ian Taylor",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cambodia_Kun_Khmer_Battambang_2006_Ian_Taylor_01.jpg",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/"
  },
  {
    id: "rice-fields",
    title: "Rice fields",
    pack: "countryside",
    file: "rice-fields.webp",
    photographer: "Gary Todd",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cambodia_Rice_Fields_(9728044881).jpg",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    id: "sugar-palms",
    title: "Sugar palms",
    pack: "countryside",
    file: "sugar-palms.webp",
    photographer: "Gerd Eichmann",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cambodia-Palm_sugar-14-2007-gje.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "tonle-sap-village",
    title: "Tonlé Sap village",
    pack: "countryside",
    file: "tonle-sap-village.webp",
    photographer: "Anandajoti",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:046_Tonle_Sap_Village_Scene.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    id: "floating-school",
    title: "Floating school",
    pack: "countryside",
    file: "floating-school.webp",
    photographer: "RoadTripWarrior",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Floating_school_at_Tonle_Sap.jpg",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    id: "kep-countryside",
    title: "Kep countryside",
    pack: "countryside",
    file: "kep-countryside.webp",
    photographer: "Adam Jones",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Countryside_around_Kep_-_Cambodia_(48543318551).jpg",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/"
  },
  {
    id: "cheung-prey",
    title: "Cheung Prey countryside",
    pack: "countryside",
    file: "cheung-prey.webp",
    photographer: "Mx. Granger",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Countryside_in_Cheung_Prey_District.jpg",
    license: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/"
  },
  {
    id: "oudong",
    title: "Oudong",
    pack: "countryside",
    file: "oudong.webp",
    photographer: "Don Christie",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Oudong_Cambodia_November_1964_01.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "bamboo-train",
    title: "Bamboo train",
    pack: "countryside",
    file: "bamboo-train.webp",
    photographer: "Christophe95",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Bamboo_Train_Banan.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "pepper-farm",
    title: "Kampot pepper farm",
    pack: "countryside",
    file: "pepper-farm.webp",
    photographer: "PsamatheM",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:02-Pepper_Farm,_Kampot-nX-8.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "kep-beach",
    title: "Kep beach",
    pack: "coast",
    file: "kep-beach.webp",
    photographer: "PsamatheM",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:06-Kep_Beach_Cambodia-nX-19.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "koh-rong",
    title: "Koh Rong Sanloem",
    pack: "coast",
    file: "koh-rong.webp",
    photographer: "Wikirictor",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cambodia_island_paradise_koh_rong_sanloem.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    id: "koh-rong-estuary",
    title: "Koh Rong estuary",
    pack: "coast",
    file: "koh-rong-estuary.webp",
    photographer: "Wikirictor",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Koh_Rong_Sanloem_estuary.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/"
  },
  {
    id: "kampot",
    title: "Kampot",
    pack: "coast",
    file: "kampot.webp",
    photographer: "Marcin Konsek",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2016_Kampot,_Muzeum_Prowincji_Kampot_(05).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/"
  },
  {
    id: "bokor",
    title: "Bokor hill",
    pack: "coast",
    file: "bokor.webp",
    photographer: "Adam Jones",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Scenic_View_from_Bokor_Hill_Station_-_Near_Kampot_-_Cambodia_-_01_(48529019777).jpg",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0/"
  }
];

const byId = new Map(CATALOG.map(picture => [picture.id, picture]));

export function catalogPicture(id: string): CatalogPicture | undefined {
  return byId.get(id);
}

export function photosInPack(pack: PhotoPack): readonly CatalogPicture[] {
  return CATALOG.filter(picture => picture.pack === pack);
}

export function publicPhoto(file: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const prefix = base.endsWith("/") ? base : `${base}/`;
  return `${prefix}photos/${file}`;
}
