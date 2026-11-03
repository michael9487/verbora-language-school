"use server";

import { updateTag } from "next/cache";
import { NEWS_CACHE_TAG } from "@/lib/news";

// 切回視窗時讓活動消息的快取立刻失效，下一次渲染會等新資料，不會先給舊的。
// 同一個伺服器實例 10 秒內只做一次，訪客反覆切換視窗也不會一直向 Google 抓資料。
const MIN_INTERVAL_MS = 10_000;
let last = 0;

export async function refreshNews() {
  if (Date.now() - last < MIN_INTERVAL_MS) return;
  last = Date.now();
  updateTag(NEWS_CACHE_TAG);
}
