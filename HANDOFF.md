# Verbora 開發交接

給接手開發的 Claude 看的專案說明。開始工作前先讀完這份和 `README.md`。

## 專案是什麼

Verbora 沃語國際語言學校，是虛構品牌的作品集示範網站，不提供實際服務。品牌、校區、電話、課程和活動都是虛構的。

- 技術：Next.js 16（App Router）、TypeScript、Tailwind CSS v4、Supabase、LINE LIFF
- 部署：Vercel，由 GitHub `main` 自動部署
- 對話語言：繁體中文

## 開工前

- 確認 repo 裡有 `src/app/page.tsx` 的 `VERBA` 陣列。沒有的話，代表最新修改還沒推上 GitHub，先停下來告訴使用者。
- 這版 Next.js 和訓練資料可能不同，寫程式前先看 `AGENTS.md` 和 `node_modules/next/dist/docs/` 的相關文件。
- 雲端環境沒有 `.env.local`，網站會改用內建示範資料，這是正常的。

## 工作方式

- 開新分支修改，不要直接改 `main`，使用者看過 Vercel 預覽網址後才合併。
- 使用者在上班時間用手機看成果，回報要簡短，並附上預覽網址讓他們點開確認。
- 完成前依序執行：`npm run typecheck`、`npm run lint`、`npm run build`。
- 改視覺時要看實際畫面，桌機、平板、手機和深色模式都要確認。

## 程式結構

- 頁面：`src/app/`
- 共用元件：`src/components/`
- 網站資料：`src/data/`、`src/lib/site.ts`
- 主要樣式：`src/app/site.css`，放在 `@layer site`
- 深色模式樣式：`src/app/site-dark.css`，由腳本自動產生，不要手改
- 其他深色模式細節和主題變數：`src/app/globals.css`

## CSS 規則

- 改完 `site.css` 一定要執行 `node scripts/gen-dark-css.mjs`，並一起 commit `site-dark.css`。
- 斷點：桌機 1024px 以上、平板 768 到 1023px、手機 767px 以下。
- 新的 `@media` 規則要寫在基礎規則後面。選擇器權重相同時，後寫的會蓋掉先寫的。
- 深色模式產生器會處理白底、灰字、淺色框線和 `#1E6EC8`。其他顏色用 CSS 變數，並在 `globals.css` 的 `:root.dark` 覆寫。
- `site.css` 裡提到設計稿或插圖的註解可能已過時，以實際畫面為準。

## 不能違反的設計決定

- 網站內容必須全部虛構，**不要使用真實學校的品牌、校區、人名、電話或照片。**
- 首頁學習法固定用 VERBA 五個字母：Voice、Ear、Reflect、Bridge、Aim。
- VERBA 配色用 `--verba-1` 到 `--verba-5`，定義在 `site.css`，深色版在 `globals.css`。
- VERBA 維持單欄橫列。不要改回六宮格卡片，也不要改回彩虹配色。
- 首頁「在使用中學會」和「堅持的四件事」的照片不能壓在文字上，也不要用半透明框墊文字。
- 首頁照片用對話框形狀（`--bubble-r`），直角朝向旁邊的文字。不要改回旋轉、菱形或拼貼。
- 頁尾（`src/components/SiteFooter.tsx`）、關於我們頁（`src/app/about/page.tsx`）和校區資訊頁（`src/components/branches/BranchFinder.tsx`）已改用 Tailwind，不要把樣式加回 `site.css`，也不要改回左右兩欄的表格或地區分頁。
- 不要嵌入 Google 地圖：網站地址是虛構的，地圖會標到真實地點。
- 新素材只用 CC0 或公有領域，並記錄到 `MEDIA_CREDITS.md`。

## 本機與示範資料

- `npm run dev`，預設 port 3000
- 學員登入：`/login` 用 LINE 登入，或選示範模式；LINE 登入需要 `SESSION_SECRET`
- 所有環境變數都是選填，清單在 `.env.example`

## 進度

待辦和完成狀態看 `README.md` 的「開發進度」，完成項目後順手打勾。

## 備註（2026-11-05 更新）

這個專案是面試用的作品，使用者接下來主要用手機 Claude 開發。

**重點功能，優先確保正常：**

1. LINE LIFF 串接
2. LINE 會員專區
3. Google 試算表更新活動消息

**目前狀態：**

- 網站和上述功能的程式都已完成，production build、lint、型別檢查通過。
- GitHub repo：`michael9487/verbora-language-school`（public）。
- 正式網站：<https://verbora-language-school.vercel.app/>，推到 `main` 會自動部署。
- Google 試算表活動消息已在正式站顯示。
- LIFF 已設定並用 iPhone 實測：LINE 登入、分享卡片、掃描 QR Code 都正常。入口：<https://liff.line.me/2012358470-MrC07YH9>。
- `NEXT_PUBLIC_LIFF_ID`、`LINE_LOGIN_CHANNEL_ID`、`NEXT_PUBLIC_SITE_URL` 已設到 Vercel。
- 官方帳號還沒建立，加好友提醒沒測過；`NEXT_PUBLIC_LINE_OA_ID` 還沒設。
- Supabase 已接上（Vercel 三個變數已設），掃碼報到和聯絡表單都已實測寫入資料庫。聯絡表單目前只存資料，不會通知管理者。
- LINE 學員登入已上線並實測：伺服器驗證 ID Token 後發出簽章 cookie，`SESSION_SECRET` 已設到 Vercel。
- 示範音檔放在 `public/audio`，來源見 `MEDIA_CREDITS.md`；私有音檔不需要，Supabase 的 `audio_tracks` 保持空的。

**接下來的順序：**

1. 請使用者建立官方帳號：Messaging API 要選和 channel 相同的 Provider，再到 channel 的 Linked LINE Official Account 連結；LIFF 的 Add friend option 改成 On (aggressive)，Vercel 加 `NEXT_PUBLIC_LINE_OA_ID` 後 Redeploy，測試加好友提醒。
2. 視需要加上聯絡表單通知（例如 Email 或 LINE）。
3. 小型管理後台：留言列表和報到名單，管理者權限由伺服器檢查 LINE 使用者 ID。
5. 完整待辦看 `README.md` 的「上線」和「手機開發」，開始前先問使用者哪些已經做了。

**之後可考慮的新功能：** 預約體驗課加 LINE 通知，並用圖文選單當入口。等現有功能實機測過再做。

**手機開發注意事項：**

- 使用者在手機上無法跑本機環境，改動要靠 Vercel 預覽網址確認。
- 接 LINE、Supabase 或 Vercel 後台的步驟只有使用者能做，請給簡短、照著點就能完成的步驟。
- 不要把金鑰或 `.env.local` 的內容寫進 repo，這個 repo 是公開的。
- 貼環境變數時要注意前後的空白。之前 `NEXT_PUBLIC_LIFF_ID` 多了一個 Tab，LIFF 就回報 Invalid LIFF ID。
