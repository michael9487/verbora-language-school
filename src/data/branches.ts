// 校區資料（全部虛構）。地址都在不存在的「示範路」，電話是 0000 開頭的不存在號碼，車站也是虛構的「示範站」
export type Branch = {
  name: string;
  /** 一句話說出這間分校的特色 */
  feature: string;
  langs: string[];
  address: string;
  transit: string;
  hours: string;
  phone: string;
  tel: string;
};

export type Region = {
  id: string;
  name: string;
  branches: Branch[];
};

export const LANGUAGES = ["英語", "日語", "韓語", "法語", "德語", "西語", "華語"];

const WEEKDAY_FULL = "週一至五 09:30–21:00、週六 09:30–17:00";

export const REGIONS: Region[] = [
  {
    id: "north",
    name: "北部校區",
    branches: [
      {
        name: "沃語台北分校",
        feature: "七種語言都有開班，附自習室與聽力教室",
        langs: LANGUAGES,
        address: "台北市虛構區示範路 101 號 5 樓",
        transit: "示範站 2 號出口，步行 5 分鐘",
        hours: WEEKDAY_FULL,
        phone: "(02) 0000-0101",
        tel: "0200000101",
      },
      {
        name: "沃語新北分校",
        feature: "平日夜間班最多，適合下班後進修",
        langs: ["英語", "日語", "韓語", "西語"],
        address: "新北市虛構區示範路 102 號 3 樓",
        transit: "示範站 1 號出口，步行 3 分鐘",
        hours: "週一至五 13:00–21:30、週六 09:30–17:00",
        phone: "(02) 0000-0102",
        tel: "0200000102",
      },
      {
        name: "沃語基隆分校",
        feature: "每班最多 6 人，老師最能照顧到每位學員",
        langs: ["英語", "日語"],
        address: "基隆市虛構區示範路 103 號 4 樓",
        transit: "示範火車站步行 8 分鐘",
        hours: "週二至六 10:00–20:00",
        phone: "(02) 0000-0103",
        tel: "0200000103",
      },
      {
        name: "沃語桃園分校",
        feature: "企業培訓據點，職場英語班次最多",
        langs: ["英語", "日語", "韓語", "德語"],
        address: "桃園市虛構區示範路 104 號 6 樓",
        transit: "示範站 3 號出口，步行 6 分鐘",
        hours: WEEKDAY_FULL,
        phone: "(03) 0000-0104",
        tel: "0300000104",
      },
      {
        name: "沃語新竹分校",
        feature: "科技業學員多，技術簡報與德語班是特色",
        langs: ["英語", "日語", "德語"],
        address: "新竹市虛構區示範路 105 號 6 樓",
        transit: "示範火車站步行 10 分鐘，附停車場",
        hours: "週一至五 13:00–21:30、週六 09:30–17:00",
        phone: "(03) 0000-0105",
        tel: "0300000105",
      },
    ],
  },
  {
    id: "central",
    name: "中部校區",
    branches: [
      {
        name: "沃語台中分校",
        feature: "中部最大的分校，有語言交換空間",
        langs: ["英語", "日語", "韓語", "法語", "西語", "華語"],
        address: "台中市虛構區示範路 301 號 9 樓",
        transit: "示範站 4 號出口，步行 4 分鐘",
        hours: WEEKDAY_FULL,
        phone: "(04) 0000-0301",
        tel: "0400000301",
      },
      {
        name: "沃語彰化分校",
        feature: "以週末班為主，適合外縣市通勤的學員",
        langs: ["英語", "日語"],
        address: "彰化縣虛構市示範路 302 號 2 樓",
        transit: "示範火車站步行 7 分鐘",
        hours: "週三至五 15:00–21:00、週末 09:30–17:00",
        phone: "(04) 0000-0302",
        tel: "0400000302",
      },
    ],
  },
  {
    id: "south",
    name: "南部校區",
    branches: [
      {
        name: "沃語台南分校",
        feature: "老屋改建的校舍，每月舉辦日語與法語文化沙龍",
        langs: ["英語", "日語", "韓語", "法語"],
        address: "台南市虛構區示範路 401 號 3 樓",
        transit: "示範火車站步行 12 分鐘",
        hours: "週二至六 10:00–21:00",
        phone: "(06) 0000-0401",
        tel: "0600000401",
      },
      {
        name: "沃語高雄分校",
        feature: "南部的華語據點，外籍學員多，語言交換最方便",
        langs: ["英語", "日語", "韓語", "西語", "華語"],
        address: "高雄市虛構區示範路 402 號 7 樓",
        transit: "示範站 2 號出口，步行 5 分鐘",
        hours: WEEKDAY_FULL,
        phone: "(07) 0000-0402",
        tel: "0700000402",
      },
    ],
  },
  {
    id: "east",
    name: "東部校區",
    branches: [
      {
        name: "沃語花蓮分校",
        feature: "外籍學員的華語課，搭配在地文化走讀",
        langs: ["英語", "日語", "華語"],
        address: "花蓮縣虛構市示範路 501 號 2 樓",
        transit: "示範火車站有接駁車，車程 10 分鐘",
        hours: "週二至六 10:00–20:00",
        phone: "(03) 0000-0501",
        tel: "0300000501",
      },
      {
        name: "沃語台東分校",
        feature: "實體與線上混合上課，住得遠也能持續學",
        langs: ["英語", "日語"],
        address: "台東縣虛構市示範路 502 號 3 樓",
        transit: "示範火車站有接駁車，車程 15 分鐘",
        hours: "週三至六 13:00–20:00",
        phone: "(089) 000-502",
        tel: "089000502",
      },
    ],
  },
];
