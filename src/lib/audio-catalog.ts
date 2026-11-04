// 聽力教材清單（虛構示範資料）
// 這個檔案不 import 任何東西，scripts/upload-audio.ts 也直接讀它

export type Book = { key: string; language: string; title: string; cover: string };

export const BOOKS: Book[] = [
  { key: "english", language: "英語", title: "English Listening\n英語聽力入門", cover: "/images/audio/cover-english.jpg" },
  { key: "japanese", language: "日語", title: "日本語リスニング\n日語聽力入門", cover: "/images/audio/cover-japanese.jpg" },
  { key: "korean", language: "韓語", title: "한국어 듣기\n韓語聽力入門", cover: "/images/audio/cover-korean.jpg" },
  { key: "french", language: "法語", title: "Écoute du français\n法語聽力入門", cover: "/images/audio/cover-french.jpg" },
  { key: "german", language: "德語", title: "Deutsch Hören\n德語聽力入門", cover: "/images/audio/cover-german.jpg" },
  { key: "spanish", language: "西語", title: "Escucha en español\n西語聽力入門", cover: "/images/audio/cover-spanish.jpg" },
  { key: "chinese", language: "華語", title: "中文聽力\nChinese Listening", cover: "/images/audio/cover-chinese.jpg" },
];

// 私有音檔的簽名網址有效天數（手機播放器不帶 cookie 也能抓音檔）
export const AUDIO_LINK_DAYS = 7;
