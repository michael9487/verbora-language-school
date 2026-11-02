// 選用：把自己的聽力教材上傳到 Supabase Storage（私有 bucket「audio」）並寫入 audio_tracks
// 資料夾結構：{來源資料夾}/{教材代碼，例如 english}/*.mp3（或 .m4a），檔名就是顯示名稱
// 用法（需要 Node 22.18 以上，可以直接執行 .ts）：node scripts/upload-audio.ts ./my-audio
// 讀取 .env.local 的 NEXT_PUBLIC_SUPABASE_URL、SUPABASE_SERVICE_ROLE_KEY；重複執行會覆蓋同名檔案
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { BOOKS } from "../src/lib/audio-catalog.ts";

process.loadEnvFile(".env.local");
const src = process.argv[2];
if (!src || !fs.existsSync(src)) {
  console.error("請指定音檔資料夾，例如：node scripts/upload-audio.ts ./my-audio");
  process.exit(1);
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});
const collator = new Intl.Collator("zh-Hant", { numeric: true });

for (const { key } of BOOKS) {
  const dir = path.join(src, key);
  if (!fs.existsSync(dir)) {
    console.log(`- ${key}：沒有資料夾，略過`);
    continue;
  }
  // 數字照大小排（_2 在 _10 前面）
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(mp3|m4a)$/i.test(f))
    .sort(collator.compare);

  const rows = [];
  for (const [i, file] of files.entries()) {
    const ext = path.extname(file).slice(1).toLowerCase();
    // Storage 路徑只能用英數字，顯示名稱存在資料表的 title
    const storagePath = `${key}/${String(i + 1).padStart(3, "0")}.${ext}`;
    const { error } = await supabase.storage.from("audio").upload(storagePath, fs.readFileSync(path.join(dir, file)), {
      contentType: ext === "m4a" ? "audio/mp4" : "audio/mpeg",
      cacheControl: "86400",
      upsert: true,
    });
    if (error) throw new Error(`${key}/${file} 上傳失敗：${error.message}`);
    rows.push({ book_key: key, position: i + 1, title: path.parse(file).name, storage_path: storagePath });
  }

  // 先清掉這本教材舊的紀錄再寫入，檔案變少時才不會留下幽靈曲目
  await supabase.from("audio_tracks").delete().eq("book_key", key);
  const { error } = await supabase.from("audio_tracks").insert(rows);
  if (error) throw new Error(`${key} 寫入 audio_tracks 失敗：${error.message}`);
  console.log(`✓ ${key}（${rows.length} 個音檔）`);
}
