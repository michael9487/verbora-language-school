// 校區資料（全部虛構）。地址都在不存在的「示範路」，電話是 0000 開頭的不存在號碼
export type Branch = { name: string; address: string; phone: string; tel: string };

export type Region = {
  id: string;
  name: string;
  deco: { src: string; className: string }[];
  branches: Branch[];
};

export const REGIONS: Region[] = [
  {
    id: "taipei",
    name: "台北校區",
    deco: [
      { src: "/images/deco/region-a.png", className: "region-deco" },
      { src: "/images/deco/region-b.png", className: "region-deco region-deco--taipei2" },
    ],
    branches: [
      { name: "沃語信義校", address: "台北市虛構區示範路 101 號 5 樓", phone: "(02) 0000-0101", tel: "0200000101" },
      { name: "沃語大安校", address: "台北市虛構區示範路 102 號 3 樓", phone: "(02) 0000-0102", tel: "0200000102" },
      { name: "沃語內湖校", address: "台北市虛構區示範路 103 號 8 樓", phone: "(02) 0000-0103", tel: "0200000103" },
      { name: "沃語士林校", address: "台北市虛構區示範路 104 號 2 樓", phone: "(02) 0000-0104", tel: "0200000104" },
    ],
  },
  {
    id: "hsinchu",
    name: "新竹校區",
    deco: [
      { src: "/images/deco/region-c.png", className: "region-deco region-deco--hsinchu" },
      { src: "/images/deco/region-d.png", className: "region-deco region-deco--hsinchu-b" },
      { src: "/images/deco/region-c.png", className: "region-deco region-deco--hsinchu-c" },
    ],
    branches: [
      { name: "沃語竹科校", address: "新竹市虛構區示範路 201 號 6 樓", phone: "(03) 0000-0201", tel: "0300000201" },
      { name: "沃語竹北校", address: "新竹縣虛構市示範路 202 號 4 樓", phone: "(03) 0000-0202", tel: "0300000202" },
    ],
  },
  {
    id: "taichung",
    name: "台中校區",
    deco: [
      { src: "/images/deco/region-e.png", className: "region-deco region-deco--taichung" },
      { src: "/images/deco/region-f.png", className: "region-deco region-deco--taichung-b" },
    ],
    branches: [
      { name: "沃語西屯校", address: "台中市虛構區示範路 301 號 9 樓", phone: "(04) 0000-0301", tel: "0400000301" },
      { name: "沃語北屯校", address: "台中市虛構區示範路 302 號 2 樓", phone: "(04) 0000-0302", tel: "0400000302" },
    ],
  },
  {
    id: "overseas",
    name: "海外校區",
    deco: [
      { src: "/images/deco/region-g.png", className: "region-deco region-deco--overseas" },
      { src: "/images/deco/region-h.png", className: "region-deco region-deco--overseas-b" },
    ],
    branches: [
      { name: "Verbora Tokyo", address: "Sample-dori 1-1, Fictional City, Tokyo", phone: "+81 00-0000-0401", tel: "+810000000401" },
      { name: "Verbora Seoul", address: "402 Sample-ro, Fictional-gu, Seoul", phone: "+82 00-0000-0402", tel: "+820000000402" },
    ],
  },
];
