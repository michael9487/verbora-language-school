import type { Metadata } from "next";

export const SITE_NAME = "沃語國際語言學校 Verbora";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// 網址貼到 LINE / Facebook 時的預覽圖（1200×630）
export const OG_IMAGE = { url: "/og-image.jpg", width: 1200, height: 630, alt: "沃語國際語言學校 Verbora" };

// header、footer 共用的導覽項目；match 決定哪些路徑要把這一項標成目前頁面
export const NAV_ITEMS = [
  { href: "/", label: "首頁", match: (p: string) => p === "/" },
  { href: "/about", label: "關於我們" },
  { href: "/systems", label: "語言課程" },
  { href: "/branches", label: "校區資訊" },
  { href: "/news", label: "活動消息" },
  { href: "/gallery", label: "學習專欄" },
  { href: "/login", label: "學員登入", match: (p: string) => p === "/login" || p === "/audio" },
] as const;

export function isActive(item: (typeof NAV_ITEMS)[number], pathname: string) {
  if ("match" in item) return item.match(pathname);
  return pathname === item.href || pathname.startsWith(item.href + "/");
}

// 全部是虛構資料：電話用 0000 開頭的不存在號碼，Email 用保留網域 example.com
export const CONTACT = {
  company: "沃語國際語言學校",
  address: "100 臺北市虛構區示範路 1 號 7 樓",
  phone: "(02) 0000-0100",
  email: "hello@verbora.example.com",
};

/** 每頁的 metadata：同時設定 <title>、description 和分享預覽（og/twitter），貼到 LINE 時每頁顯示自己的標題 */
export function pageMetadata({ title, description }: { title: string; description?: string }): Metadata {
  const full = `${title} - ${SITE_NAME}`;
  return {
    title,
    ...(description && { description }),
    openGraph: { type: "website", locale: "zh_TW", siteName: SITE_NAME, title: full, images: [OG_IMAGE], ...(description && { description }) },
    twitter: { card: "summary_large_image", title: full, images: [OG_IMAGE.url], ...(description && { description }) },
  };
}
