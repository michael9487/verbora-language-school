import "server-only";
import { AUDIO_LINK_DAYS, BOOKS } from "@/lib/audio-catalog";
import type { Session } from "@/lib/session";
import { adminClient } from "@/lib/supabase/clients";

export type AudioBook = {
  key: string;
  title: string;
  cover: string;
  tracks: { id: number; title: string; url: string }[];
};

// 每種語言兩段示範音檔，放在 public/audio（來源見 MEDIA_CREDITS.md）
const DEMO_TITLES: Record<string, string> = {
  "english-1": "世界人權宣言第一條",
  "chinese-2": "〈南國山河〉朗讀",
  "english-2": "吉卜林〈If〉節選",
  "french-1": "世界人權宣言第一條",
  "spanish-1": "世界人權宣言第一條",
  "german-2": "里爾克〈豹〉",
  "japanese-2": "日本國憲法前文節選",
  "korean-2": "玄鎮健〈鋼琴〉節選",
};

function demoBooks(): AudioBook[] {
  return BOOKS.map((book, i) => ({
    key: book.key,
    title: book.title,
    cover: book.cover,
    tracks: [1, 2].map((n) => ({ id: i * 10 + n, title: DEMO_TITLES[`${book.key}-${n}`] ?? `${book.language}發音練習 ${String(n).padStart(2, "0")}`, url: `/audio/${book.key}-${n}.mp3` })),
  }));
}

/**
 * 取得登入者可以聽的教材與音檔。示範模式一律只拿公開示範音檔，私有教材要 LINE 登入。
 * Supabase 的 audio_tracks 有資料時，用私有 bucket 的限時簽名網址播放，Range（拖曳進度條）由 Storage 處理；
 * 沒有設定或沒有資料就用公開的示範音檔，作品集不用任何設定也能體驗播放器
 */
export async function getAudioBooks(session: Session): Promise<AudioBook[]> {
  const supabase = session.kind === "line" ? adminClient() : null;
  if (!supabase) return demoBooks();

  const { data: tracks, error } = await supabase
    .from("audio_tracks")
    .select("id, book_key, position, title, storage_path")
    .order("position");
  if (error) throw new Error(`讀取音檔清單失敗：${error.message}`);
  if (!tracks.length) return demoBooks();

  const { data: signed, error: signError } = await supabase.storage
    .from("audio")
    .createSignedUrls(
      tracks.map((t) => t.storage_path),
      AUDIO_LINK_DAYS * 86400,
    );
  if (signError) throw new Error(`產生播放網址失敗：${signError.message}`);
  const urlByPath = new Map(signed.map((s) => [s.path, s.signedUrl]));

  return BOOKS.map((book) => ({
    key: book.key,
    title: book.title,
    cover: book.cover,
    tracks: tracks
      .filter((t) => t.book_key === book.key && urlByPath.get(t.storage_path))
      .map((t) => ({ id: t.id, title: t.title, url: urlByPath.get(t.storage_path)! })),
  })).filter((b) => b.tracks.length > 0);
}
