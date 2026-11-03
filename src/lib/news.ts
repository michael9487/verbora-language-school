import "server-only";
import { DEMO_NEWS_ROWS } from "@/data/news-demo";
import { parseCsv } from "@/lib/csv";

// 活動消息來源：有設定 NEWS_SHEET_ID 就讀 Google 試算表（編輯者自己改，不用進資料庫），沒有就用內建示範資料
//   A 欄：標題
//   B 欄：內文（點開才看到；儲存格內換行按 Alt+Enter）
//   C 欄：日期，例如 2026/10/01（2026/10/1、2026-10-01 也可以）
//   第 1 列的 C 欄不是日期時，視為欄位名稱不顯示
// 試算表要開「知道連結的任何人都能檢視」，伺服器直接下載 CSV，不需要 API 金鑰
const SHEET_ID = process.env.NEWS_SHEET_ID;
const SHEET_GID = process.env.NEWS_SHEET_GID ?? "0";

/** 試算表更新後，網站最多隔幾秒會更新 */
export const NEWS_REVALIDATE_SECONDS = 60;

/** 切回視窗時用這個 tag 讓快取立刻失效（app/news/actions.ts） */
export const NEWS_CACHE_TAG = "news";

export type NewsItem = {
  id: string;
  /** YYYY-MM-DD；C 欄空白或看不懂時是 null */
  date: string | null;
  title: string;
  body: string;
  /** 標題開頭是《台北》這種格式時，顯示對應顏色的校區標籤 */
  tag: { label: string; key: string } | null;
};

// 標題開頭的城市對應到分區顏色（site.css 的 news-tag--{key}）
const TAG_KEYS: Record<string, string> = {
  台北: "north",
  新北: "north",
  基隆: "north",
  桃園: "north",
  新竹: "north",
  台中: "central",
  彰化: "central",
  台南: "south",
  高雄: "south",
  花蓮: "east",
  台東: "east",
};

export function parseDate(raw: string): string | null {
  const m = raw.trim().match(/^(\d{4})\D(\d{1,2})\D(\d{1,2})/);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  if (date.getUTCMonth() !== mo - 1 || date.getUTCDate() !== d) return null; // 2026/02/30 這種不存在的日期
  return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

// 用標題和日期產生固定的 id（分享連結 /news#news-xxx 用）；插入新的一列也不會讓舊連結跑掉
function stableId(title: string, date: string | null) {
  let h = 5381;
  for (const ch of `${date}|${title}`) h = ((h << 5) + h + ch.codePointAt(0)!) >>> 0;
  return h.toString(36);
}

export function rowsToNews(rows: string[][]): NewsItem[] {
  const dataRows = parseDate(rows[0]?.[2] ?? "") ? rows : rows.slice(1);
  const items = dataRows.flatMap(([rawTitle = "", rawBody = "", rawDate = ""]) => {
    const title = rawTitle.replace(/\s+/g, " ").trim();
    if (!title) return [];
    const date = parseDate(rawDate);
    const tagLabel = title.match(/^《(.+?)》/)?.[1];
    return [
      {
        id: stableId(title, date),
        date,
        title,
        body: rawBody.replace(/\r\n?/g, "\n").trim(),
        tag: tagLabel ? { label: tagLabel, key: TAG_KEYS[tagLabel] ?? "" } : null,
      },
    ];
  });
  // 新的在上面；沒填日期的放最後。sort 是穩定排序，同一天的照原本順序
  return items.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

export async function getNews(): Promise<{ items: NewsItem[]; ok: boolean }> {
  // NEWS_SHEET_CSV_URL：改讀其他 CSV 網址（例如試算表「發布到網路」的網址，或本機測試用）
  const url = process.env.NEWS_SHEET_CSV_URL ?? (SHEET_ID && `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`);
  if (!url) return { items: rowsToNews(DEMO_NEWS_ROWS), ok: true };
  try {
    const res = await fetch(url, { next: { revalidate: NEWS_REVALIDATE_SECONDS, tags: [NEWS_CACHE_TAG] } });
    // 試算表沒公開時 Google 會導到登入頁（HTML），不是 CSV
    if (!res.ok || !res.headers.get("content-type")?.includes("text/csv")) {
      throw new Error(`HTTP ${res.status} ${res.headers.get("content-type")}`);
    }
    return { items: rowsToNews(parseCsv(await res.text())), ok: true };
  } catch (err) {
    console.error("讀取活動消息試算表失敗（請確認已開啟「知道連結的任何人都能檢視」）：", err);
    return { items: [], ok: false };
  }
}
