export type PhotoPack =
  | "temples"
  | "city"
  | "food"
  | "culture"
  | "countryside"
  | "coast"
  | "wildlife";

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
  },
  {
    id: "angkor-wat-camboya-2013-08-16-dd-107",
    title: "Angkor Wat, Camboya, 2013-08-16, DD 107",
    pack: "temples",
    file: "angkor-wat-camboya-2013-08-16-dd-107.webp",
    photographer: "Diego Delso",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Angkor_Wat,_Camboya,_2013-08-16,_DD_107.JPG",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0"
  },
  {
    id: "angkor-siemreap-cambodia-ankor-wat-01",
    title: "Angkor SiemReap Cambodia Ankor-Wat-01",
    pack: "temples",
    file: "angkor-siemreap-cambodia-ankor-wat-01.webp",
    photographer: "CEphoto, Uwe Aranas",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Angkor_SiemReap_Cambodia_Ankor-Wat-01.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0"
  },
  {
    id: "20171126-angkor-wat-4727-dxo",
    title: "20171126 Angkor Wat 4727 DxO",
    pack: "temples",
    file: "20171126-angkor-wat-4727-dxo.webp",
    photographer: "Jakub Hałun",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:20171126_Angkor_Wat_4727_DxO.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "20171126-angkor-wat-4714-dxo",
    title: "20171126 Angkor Wat 4714 DxO",
    pack: "temples",
    file: "20171126-angkor-wat-4714-dxo.webp",
    photographer: "Jakub Hałun",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:20171126_Angkor_Wat_4714_DxO.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "20171128-angkor-wat-5551-dxo",
    title: "20171128 Angkor Wat 5551 DxO",
    pack: "temples",
    file: "20171128-angkor-wat-5551-dxo.webp",
    photographer: "Jakub Hałun",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:20171128_Angkor_Wat_5551_DxO.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "20171128-angkor-wat-5765-dxo",
    title: "20171128 Angkor Wat 5765 DxO",
    pack: "temples",
    file: "20171128-angkor-wat-5765-dxo.webp",
    photographer: "Jakub Hałun",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:20171128_Angkor_Wat_5765_DxO.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "angkor-wat-099",
    title: "Angkor Wat 099",
    pack: "temples",
    file: "angkor-wat-099.webp",
    photographer: "Krzysztof Golik",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Angkor_Wat_099.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "angkor-wat-112",
    title: "Angkor Wat 112",
    pack: "temples",
    file: "angkor-wat-112.webp",
    photographer: "Krzysztof Golik",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Angkor_Wat_112.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "angkor-wat-with-its-reflection-cropped",
    title: "Angkor Wat With Its Reflection (Cropped)",
    pack: "temples",
    file: "angkor-wat-with-its-reflection-cropped.webp",
    photographer: "Satdeep Gill",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Angkor_Wat_with_its_reflection_(cropped).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "bayon-angkor-thom-camboya-2013-08-16-dd-09",
    title: "Bayon, Angkor Thom, Camboya, 2013-08-16, DD 09",
    pack: "temples",
    file: "bayon-angkor-thom-camboya-2013-08-16-dd-09.webp",
    photographer: "Diego Delso",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Bayon,_Angkor_Thom,_Camboya,_2013-08-16,_DD_09.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0"
  },
  {
    id: "bayon-angkor-thom-camboya-2013-08-16-dd-32",
    title: "Bayon, Angkor Thom, Camboya, 2013-08-16, DD 32",
    pack: "temples",
    file: "bayon-angkor-thom-camboya-2013-08-16-dd-32.webp",
    photographer: "Diego Delso",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Bayon,_Angkor_Thom,_Camboya,_2013-08-16,_DD_32.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0"
  },
  {
    id: "bayon-angkor-thom-camboya-2013-08-17-dd-37",
    title: "Bayon, Angkor Thom, Camboya, 2013-08-17, DD 37",
    pack: "temples",
    file: "bayon-angkor-thom-camboya-2013-08-17-dd-37.webp",
    photographer: "Diego Delso",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Bayon,_Angkor_Thom,_Camboya,_2013-08-17,_DD_37.JPG",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0"
  },
  {
    id: "angkor-thom-bayon-relief-of-the-battle-of-tonl-s",
    title: "Angkor Thom Bayon Relief Of The Battle Of Tonlé Sap",
    pack: "temples",
    file: "angkor-thom-bayon-relief-of-the-battle-of-tonl-s.webp",
    photographer: "Pierre André Leclercq",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Angkor_Thom_Bayon_relief_of_the_Battle_of_Tonl%C3%A9_Sap.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "riverside-boulevard-1503402084",
    title: "Riverside Boulevard (1503402084)",
    pack: "city",
    file: "riverside-boulevard-1503402084.webp",
    photographer: "Francisco Anzola",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Riverside_Boulevard_(1503402084).jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0"
  },
  {
    id: "waik-riverside-preah-sisowath-quay-sangkat-phsar",
    title:
      "Waik Riverside,Preah Sisowath Quay,Sangkat Phsar Kandal Ti Muoy, Phnom P",
    pack: "city",
    file: "waik-riverside-preah-sisowath-quay-sangkat-phsar.webp",
    photographer: "trungydang",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Waik_riverside,Preah_Sisowath_Quay,Sangkat_Phsar_Kandal_Ti_Muoy,_Phnom_Penh_12204,_Campuchia,26-06-16-Dyt_-_panoramio.jpg",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    id: "yellow-noodle-with-chicken-non-crispy-riverside-",
    title:
      "Yellow Noodle With Chicken (Non Crispy) @ Riverside Bistro (8654768078)",
    pack: "city",
    file: "yellow-noodle-with-chicken-non-crispy-riverside-.webp",
    photographer: "Dion Hinchcliffe",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Yellow_Noodle_with_Chicken_(non_crispy)_@_Riverside_Bistro_(8654768078).jpg",
    license: "CC BY-SA 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0"
  },
  {
    id: "riverside-park-phnom-penh",
    title: "Riverside Park, Phnom Penh",
    pack: "city",
    file: "riverside-park-phnom-penh.webp",
    photographer: "Christophe95",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Riverside_Park,_Phnom_Penh.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "2016-phnom-penh-pa-ac-kr-lewski-wschodnia-cz-mur",
    title: "2016 Phnom Penh, PałAc KróLewski, Wschodnia Część Muru (01)",
    pack: "city",
    file: "2016-phnom-penh-pa-ac-kr-lewski-wschodnia-cz-mur.webp",
    photographer: "Marcin Konsek",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2016_Phnom_Penh,_Pa%C5%82ac_Kr%C3%B3lewski,_Wschodnia_cz%C4%99%C5%9B%C4%87_muru_(01).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "2016-phnom-penh-pa-ac-kr-lewski-preah-tineang-ph",
    title: "2016 Phnom Penh, PałAc KróLewski, Preah Tineang Phhochani (14)",
    pack: "city",
    file: "2016-phnom-penh-pa-ac-kr-lewski-preah-tineang-ph.webp",
    photographer: "Marcin Konsek",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2016_Phnom_Penh,_Pa%C5%82ac_Kr%C3%B3lewski,_Preah_Tineang_Phhochani_(14).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "2016-phnom-penh-pa-ac-kr-lewski-mandapa-satry-i-",
    title: "2016 Phnom Penh, PałAc KróLewski, Mandapa Satry I Tripitaki (04)",
    pack: "city",
    file: "2016-phnom-penh-pa-ac-kr-lewski-mandapa-satry-i-.webp",
    photographer: "Marcin Konsek",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2016_Phnom_Penh,_Pa%C5%82ac_Kr%C3%B3lewski,_Mandapa_Satry_i_Tripitaki_(04).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "2016-phnom-penh-pa-ac-kr-lewski-buddyjska-ma-a-k",
    title: "2016 Phnom Penh, PałAc KróLewski, Buddyjska MałA Kapliczka (01)",
    pack: "city",
    file: "2016-phnom-penh-pa-ac-kr-lewski-buddyjska-ma-a-k.webp",
    photographer: "Marcin Konsek",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2016_Phnom_Penh,_Pa%C5%82ac_Kr%C3%B3lewski,_Buddyjska_ma%C5%82a_kapliczka_(01).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "20171124-pos-g-buddy-w-ogrodzie-pa-acu-kr-lewski",
    title:
      "20171124 PosąG Buddy W Ogrodzie PałAcu KróLewskiego W Phnom Penh 4045 Dx",
    pack: "city",
    file: "20171124-pos-g-buddy-w-ogrodzie-pa-acu-kr-lewski.webp",
    photographer: "Jakub Hałun",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:20171124_Pos%C4%85g_Buddy_w_ogrodzie_Pa%C5%82acu_Kr%C3%B3lewskiego_w_Phnom_Penh_4045_DxO.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "052-tonle-sap-village-scene",
    title: "052 Tonle Sap Village Scene",
    pack: "countryside",
    file: "052-tonle-sap-village-scene.webp",
    photographer: "Anandajoti",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:052_Tonle_Sap_Village_Scene.jpg",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0"
  },
  {
    id: "the-floating-village-tonle-sap-lake",
    title: "The Floating Village-Tonle Sap Lake",
    pack: "countryside",
    file: "the-floating-village-tonle-sap-lake.webp",
    photographer: "David Sim",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:The_floating_village-Tonle_Sap_lake.jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0"
  },
  {
    id: "tonl-sap-floating-village-6202037541",
    title: "Tonlé Sap Floating Village (6202037541)",
    pack: "countryside",
    file: "tonl-sap-floating-village-6202037541.webp",
    photographer: "Jorge Láscar from Australia",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Tonl%C3%A9_Sap_Floating_Village_(6202037541).jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0"
  },
  {
    id: "cambodia-tonle-sap-001-village-scene-8584675656",
    title: "Cambodia - Tonle Sap - 001 Village Scene (8584675656)",
    pack: "countryside",
    file: "cambodia-tonle-sap-001-village-scene-8584675656.webp",
    photographer: "Photo Dharma from Penang, Malaysia",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cambodia_-_Tonle_Sap_-_001_Village_Scene_(8584675656).jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0"
  },
  {
    id: "cambodia-tonle-sap-018-village-scene-8584702672",
    title: "Cambodia - Tonle Sap - 018 Village Scene (8584702672)",
    pack: "countryside",
    file: "cambodia-tonle-sap-018-village-scene-8584702672.webp",
    photographer: "Photo Dharma from Penang, Malaysia",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cambodia_-_Tonle_Sap_-_018_Village_Scene_(8584702672).jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0"
  },
  {
    id: "floating-village-centre-tonle-sap-panoramio",
    title: "Floating Village Centre. Tonle Sap - Panoramio",
    pack: "countryside",
    file: "floating-village-centre-tonle-sap-panoramio.webp",
    photographer: "jokertrekker",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Floating_Village_centre._Tonle_Sap_-_panoramio.jpg",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    id: "floating-village-on-the-tonl-sap",
    title: "Floating Village On The Tonlé Sap",
    pack: "countryside",
    file: "floating-village-on-the-tonl-sap.webp",
    photographer: "Christophe95",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Floating_village_on_the_Tonl%C3%A9_Sap.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "tonle-sap-floating-church",
    title: "Tonle Sap Floating Church",
    pack: "countryside",
    file: "tonle-sap-floating-church.webp",
    photographer: "Dmitry A. Mottl",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Tonle_Sap_floating_church.JPG",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "along-the-siem-reap-river-near-tonle-sap-lake-pa",
    title: "Along The Siem Reap River Near Tonle Sap Lake - Panoramio",
    pack: "countryside",
    file: "along-the-siem-reap-river-near-tonle-sap-lake-pa.webp",
    photographer: "jokertrekker",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Along_the_Siem_Reap_river_near_Tonle_Sap_lake_-_panoramio.jpg",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    id: "floating-village-chong-khneas-on-tonle-sap-panor",
    title: "Floating Village, Chong Khneas, On Tonle Sap - Panoramio",
    pack: "countryside",
    file: "floating-village-chong-khneas-on-tonle-sap-panor.webp",
    photographer: "jokertrekker",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Floating_village,_Chong_Khneas,_on_Tonle_Sap_-_panoramio.jpg",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0"
  },
  {
    id: "06-kep-beach-cambodia-nx-22",
    title: "06-Kep Beach Cambodia-NX-22",
    pack: "coast",
    file: "06-kep-beach-cambodia-nx-22.webp",
    photographer: "PsamatheM",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:06-Kep_Beach_Cambodia-nX-22.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "fishing-boat-off-kep-cambodia",
    title: "Fishing Boat Off Kep, Cambodia",
    pack: "coast",
    file: "fishing-boat-off-kep-cambodia.webp",
    photographer: "PsamatheM",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Fishing_Boat_off_Kep,_Cambodia.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "06-kep-cambodia-nx-18",
    title: "06-Kep Cambodia-NX-18",
    pack: "coast",
    file: "06-kep-cambodia-nx-18.webp",
    photographer: "PsamatheM",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:06-Kep_Cambodia-nX-18.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "06-kep-crab-market-cambodia-nx-7",
    title: "06-Kep Crab Market Cambodia-NX-7",
    pack: "coast",
    file: "06-kep-crab-market-cambodia-nx-7.webp",
    photographer: "PsamatheM",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:06-Kep_Crab_Market_Cambodia-nX-7.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "06-kep-crab-market-cambodia-nx-8",
    title: "06-Kep Crab Market Cambodia-NX-8",
    pack: "coast",
    file: "06-kep-crab-market-cambodia-nx-8.webp",
    photographer: "PsamatheM",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:06-Kep_Crab_Market_Cambodia-nX-8.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "salt-fields-in-kep-province-50447129562",
    title: "Salt Fields In Kep Province (50447129562)",
    pack: "coast",
    file: "salt-fields-in-kep-province-50447129562.webp",
    photographer: "Nina R from Africa",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Salt_fields_in_Kep_Province_(50447129562).jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0"
  },
  {
    id: "fishing-boats-on-the-kampot-river-2012",
    title: "Fishing Boats On The Kampot River - 2012",
    pack: "coast",
    file: "fishing-boats-on-the-kampot-river-2012.webp",
    photographer: "Bolt9",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Fishing_Boats_on_the_Kampot_River_-_2012.JPG",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0"
  },
  {
    id: "2016-kampot-deptak-nad-rzek-praek-tuek-chhu-02",
    title: "2016 Kampot, Deptak Nad Rzeką Praek Tuek Chhu (02)",
    pack: "coast",
    file: "2016-kampot-deptak-nad-rzek-praek-tuek-chhu-02.webp",
    photographer: "Marcin Konsek",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2016_Kampot,_Deptak_nad_rzek%C4%85_Praek_Tuek_Chhu_(02).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "2016-kampot-zach-d-s-o-ca-nad-rzek-praek-tuek-ch",
    title: "2016 Kampot, ZachóD SłOńCa Nad Rzeką Praek Tuek Chhu (03)",
    pack: "coast",
    file: "2016-kampot-zach-d-s-o-ca-nad-rzek-praek-tuek-ch.webp",
    photographer: "Marcin Konsek",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:2016_Kampot,_Zach%C3%B3d_s%C5%82o%C5%84ca_nad_rzek%C4%85_Praek_Tuek_Chhu_(03).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "neary-khmer-2018-01-02-002",
    title: "Neary Khmer, 2018-01-02 (002)",
    pack: "food",
    file: "neary-khmer-2018-01-02-002.webp",
    photographer: "Saphabodi",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Neary_Khmer,_2018-01-02_(002).jpg",
    license: "CC0",
    licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
  },
  {
    id: "beef-cambodian-cuisine",
    title: "Beef Cambodian Cuisine",
    pack: "food",
    file: "beef-cambodian-cuisine.webp",
    photographer: "Sopheaktra23",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Beef_Cambodian_cuisine.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "cr-ation-et-conception-des-feuilles-et-nouilles-",
    title:
      "CréAtion Et Conception Des Feuilles Et Nouilles De Riz. Cambodge 01",
    pack: "food",
    file: "cr-ation-et-conception-des-feuilles-et-nouilles-.webp",
    photographer: "Les cordonsbleus",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cr%C3%A9ation_et_conception_des_feuilles_et_nouilles_de_riz._Cambodge_01.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "khmer-food-cuisine-cambodian-soup-cropped",
    title: "Khmer Food Cuisine Cambodian Soup (Cropped)",
    pack: "food",
    file: "khmer-food-cuisine-cambodian-soup-cropped.webp",
    photographer: "MoonsMoon",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Khmer_food_cuisine_Cambodian_soup_(cropped).jpg",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0"
  },
  {
    id: "cold-cambodian-dessert-khmer-dessert-khmer-food-",
    title: "Cold Cambodian Dessert Khmer Dessert Khmer Food Cambodian Food",
    pack: "food",
    file: "cold-cambodian-dessert-khmer-dessert-khmer-food-.webp",
    photographer: "MoonsMoon",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cold_Cambodian_dessert_Khmer_dessert_Khmer_food_Cambodian_food.jpg",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0"
  },
  {
    id: "cambodian-khmer-food-desserts-num-kom",
    title: "Cambodian Khmer Food Desserts Num Kom នំគម",
    pack: "food",
    file: "cambodian-khmer-food-desserts-num-kom.webp",
    photographer: "MoonsMoon",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cambodian_Khmer_food_desserts_num_kom_%E1%9E%93%E1%9F%86%E1%9E%82%E1%9E%98.jpg",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0"
  },
  {
    id: "cambodian-khmer-dessert-jelly-nom-lort-num-lort",
    title: "Cambodian Khmer Dessert Jelly Nom Lort Num Lort",
    pack: "food",
    file: "cambodian-khmer-dessert-jelly-nom-lort-num-lort.webp",
    photographer: "MoonsMoon",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cambodian_Khmer_dessert_jelly_nom_lort_num_lort.jpg",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0"
  },
  {
    id: "khmer-cambodian-dessert-cha-huoy-teuk",
    title: "Khmer Cambodian Dessert Cha Huoy Teuk",
    pack: "food",
    file: "khmer-cambodian-dessert-cha-huoy-teuk.webp",
    photographer: "MoonsMoon",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Khmer_Cambodian_dessert_cha_huoy_teuk.jpg",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0"
  },
  {
    id: "mobilemarket-phnompenh-2005-1",
    title: "MobileMarket PhnomPenh 2005 1",
    pack: "food",
    file: "mobilemarket-phnompenh-2005-1.webp",
    photographer: "Sundgauvien38",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:MobileMarket_PhnomPenh_2005_1.JPG",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0"
  },
  {
    id: "cambodia-08-034-insects-for-snacks-at-the-market",
    title: "Cambodia 08 - 034 - Insects For Snacks At The Market (3198811659)",
    pack: "food",
    file: "cambodia-08-034-insects-for-snacks-at-the-market.webp",
    photographer: "McKay Savage from London, UK",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cambodia_08_-_034_-_insects_for_snacks_at_the_market_(3198811659).jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0"
  },
  {
    id: "cambodia-24019902340",
    title: "Cambodia (24019902340)",
    pack: "food",
    file: "cambodia-24019902340.webp",
    photographer: "Luca Nebuloni",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cambodia_(24019902340).jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0"
  },
  {
    id: "khmer-new-year-ga2010-223",
    title: "Khmer New Year GA2010-223",
    pack: "culture",
    file: "khmer-new-year-ga2010-223.webp",
    photographer: "Sam Sith",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Khmer_New_Year_GA2010-223.jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0"
  },
  {
    id: "khmer-new-year-ga2010-146",
    title: "Khmer New Year GA2010-146",
    pack: "culture",
    file: "khmer-new-year-ga2010-146.webp",
    photographer: "Sam Sith",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Khmer_New_Year_GA2010-146.jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0"
  },
  {
    id: "khmer-new-year-ga2010-183",
    title: "Khmer New Year GA2010-183",
    pack: "culture",
    file: "khmer-new-year-ga2010-183.webp",
    photographer: "Sam Sith",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Khmer_New_Year_GA2010-183.jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0"
  },
  {
    id: "cambodge-khmer-new-year-1",
    title: "Cambodge Khmer New Year 1",
    pack: "culture",
    file: "cambodge-khmer-new-year-1.webp",
    photographer: "Rdghalayini",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cambodge_khmer_new_year_1.JPG",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0"
  },
  {
    id: "cambodge-khmer-new-year-2",
    title: "Cambodge Khmer New Year 2",
    pack: "culture",
    file: "cambodge-khmer-new-year-2.webp",
    photographer: "Rdghalayini",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Cambodge_Khmer_new_year_2.JPG",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0"
  },
  {
    id: "khmer-new-year-2011-instruments-1",
    title: "Khmer New Year 2011 - Instruments 1",
    pack: "culture",
    file: "khmer-new-year-2011-instruments-1.webp",
    photographer: "Sam Sith",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Khmer_New_Year_2011_-_Instruments_1.jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0"
  },
  {
    id: "khmer-new-year-2011-instruments-4",
    title: "Khmer New Year 2011 - Instruments 4",
    pack: "culture",
    file: "khmer-new-year-2011-instruments-4.webp",
    photographer: "Sam Sith",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Khmer_New_Year_2011_-_Instruments_4.jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0"
  },
  {
    id: "pidan-sacred-banner-from-cambodia-khmer-c-1900-s",
    title:
      "'Pidan' (Sacred Banner) From Cambodia, Khmer, C. 1900, Silk Twill Weave ",
    pack: "culture",
    file: "pidan-sacred-banner-from-cambodia-khmer-c-1900-s.webp",
    photographer: "anonymous",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%27Pidan%27_(sacred_banner)_from_Cambodia,_Khmer,_c._1900,_silk_twill_weave_with_weft_ikat.jpg",
    license: "Public domain",
    licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/"
  },
  {
    id: "angkor-silk-farm",
    title: "Angkor Silk Farm",
    pack: "culture",
    file: "angkor-silk-farm.webp",
    photographer: "Piseth1",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Angkor_Silk_Farm.JPG",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0"
  },
  {
    id: "artisans-angkor-2018-21",
    title: "Artisans Angkor, 2018 (21)",
    pack: "culture",
    file: "artisans-angkor-2018-21.webp",
    photographer: "Bahnfrend",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Artisans_Angkor,_2018_(21).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "tonle-sap-biosphere-reserve-5",
    title: "Tonle Sap Biosphere Reserve (5)",
    pack: "wildlife",
    file: "tonle-sap-biosphere-reserve-5.webp",
    photographer: "PIERRE ANDRE LECLERCQ",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Tonle_Sap_Biosphere_Reserve_(5).jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "bengal-florican-houbaropsis-bengalensis-blandini",
    title:
      "Bengal Florican (Houbaropsis Bengalensis Blandini) Male In Flight Tonle ",
    pack: "wildlife",
    file: "bengal-florican-houbaropsis-bengalensis-blandini.webp",
    photographer: "Charles J. Sharp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Bengal_florican_(Houbaropsis_bengalensis_blandini)_male_in_flight_Tonle_Sap.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "whiskered-tern-chilidonias-hybrida-non-breeding-",
    title: "Whiskered Tern (Chilidonias Hybrida) Non Breeding Tonle Sap",
    pack: "wildlife",
    file: "whiskered-tern-chilidonias-hybrida-non-breeding-.webp",
    photographer: "Charles J. Sharp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Whiskered_tern_(Chilidonias_hybrida)_non_breeding_Tonle_Sap.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "yellow-bellied-prinia-prinia-flaviventris-tonle-",
    title: "Yellow-Bellied Prinia (Prinia Flaviventris) Tonle Sap",
    pack: "wildlife",
    file: "yellow-bellied-prinia-prinia-flaviventris-tonle-.webp",
    photographer: "Charles J. Sharp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Yellow-bellied_prinia_(Prinia_flaviventris)_Tonle_Sap.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "asian-green-bee-eater-merops-orientalis-ferrugei",
    title: "Asian Green Bee-Eater (Merops Orientalis Ferrugeiceps) Tonle Sap 2",
    pack: "wildlife",
    file: "asian-green-bee-eater-merops-orientalis-ferrugei.webp",
    photographer: "Charles J. Sharp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Asian_green_bee-eater_(Merops_orientalis_ferrugeiceps)_Tonle_Sap_2.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "plaintive-cuckoo-cacomantis-merulinus-querulus-m",
    title: "Plaintive Cuckoo (Cacomantis Merulinus Querulus) Male Tonle Sap",
    pack: "wildlife",
    file: "plaintive-cuckoo-cacomantis-merulinus-querulus-m.webp",
    photographer: "Charles J. Sharp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Plaintive_cuckoo_(Cacomantis_merulinus_querulus)_male_Tonle_Sap.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "brown-shrike-lanius-cristatus-tonle-sap",
    title: "Brown Shrike (Lanius Cristatus) Tonle Sap",
    pack: "wildlife",
    file: "brown-shrike-lanius-cristatus-tonle-sap.webp",
    photographer: "Charles J. Sharp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Brown_shrike_(Lanius_cristatus)_Tonle_Sap.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "painted-stork-mycteria-leucocephala-in-flight-to",
    title: "Painted Stork (Mycteria Leucocephala) In Flight Tonle Sap",
    pack: "wildlife",
    file: "painted-stork-mycteria-leucocephala-in-flight-to.webp",
    photographer: "Charles J. Sharp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Painted_stork_(Mycteria_leucocephala)_in_flight_Tonle_Sap.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "plain-prinia-prinia-inornata-herberti-tonle-sap",
    title: "Plain Prinia (Prinia Inornata Herberti) Tonle Sap",
    pack: "wildlife",
    file: "plain-prinia-prinia-inornata-herberti-tonle-sap.webp",
    photographer: "Charles J. Sharp",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Plain_prinia_(Prinia_inornata_herberti)_Tonle_Sap.jpg",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0"
  },
  {
    id: "tonle-sap-lake-tonle1116",
    title: "Tonle Sap Lake - Tonle1116",
    pack: "wildlife",
    file: "tonle-sap-lake-tonle1116.webp",
    photographer: "lumoplank",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Tonle_Sap_Lake_-_Tonle1116.jpg",
    license: "CC0",
    licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en"
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
