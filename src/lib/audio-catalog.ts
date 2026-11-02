// 學員帳號與聽力教材清單（虛構示範資料）
// 這個檔案不 import 任何東西，scripts/upload-audio.ts 也直接讀它

export type Book = { key: string; language: string; title: string; cover: string };
export type Account = { label: string; books: string[] };

export const BOOKS: Book[] = [
  { key: "english", language: "英語", title: "English Listening\n英語聽力入門", cover: "/images/audio/cover-english.jpg" },
  { key: "japanese", language: "日語", title: "日本語リスニング\n日語聽力入門", cover: "/images/audio/cover-japanese.jpg" },
  { key: "korean", language: "韓語", title: "한국어 듣기\n韓語聽力入門", cover: "/images/audio/cover-korean.jpg" },
  { key: "french", language: "法語", title: "Écoute du français\n法語聽力入門", cover: "/images/audio/cover-french.jpg" },
  { key: "german", language: "德語", title: "Deutsch Hören\n德語聽力入門", cover: "/images/audio/cover-german.jpg" },
  { key: "spanish", language: "西語", title: "Escucha en español\n西語聽力入門", cover: "/images/audio/cover-spanish.jpg" },
  { key: "chinese", language: "華語", title: "中文聽力\nChinese Listening", cover: "/images/audio/cover-chinese.jpg" },
];

// 只需輸入帳號就能登入，方便作品集訪客體驗；真實上線時應該換成有密碼的登入
export const ACCOUNTS: Record<string, Account> = {
  DEMO: { label: "全語言示範學員", books: BOOKS.map((b) => b.key) },
  EU2026: { label: "歐語學程", books: ["french", "german", "spanish"] },
  ASIA2026: { label: "亞洲語言學程", books: ["japanese", "korean", "chinese"] },
};

// 保持登入：cookie 只存帳號，半年內再進來直接看到音檔，按「登出」才會清掉
export const AUDIO_COOKIE = "verbora_audio_account";
export const AUDIO_COOKIE_DAYS = 180;
// 私有音檔的簽名網址有效天數（手機播放器不帶 cookie 也能抓音檔）
export const AUDIO_LINK_DAYS = 7;

export function findAccount(raw: string | undefined | null): string | null {
  const code = (raw ?? "").trim().toUpperCase();
  return code in ACCOUNTS ? code : null;
}
