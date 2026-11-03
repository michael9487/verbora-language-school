# Verbora 沃語國際語言學校

語言學校官方網站作品集。將純 HTML + PHP 的多頁網站重構為 Next.js 應用，並串接 LINE LIFF 會員功能與 Google 試算表活動消息。

線上網站：<https://verbora-language-school.vercel.app/>

## 重點功能

- **LINE LIFF 串接**：在 LINE 內開啟網站，可分享卡片、掃碼報到；LIFF SDK 延遲載入，不影響其他頁面。
- **LINE 會員專區**：以 LINE 帳號登入，伺服器先向 LINE 驗證 ID Token 才寫入資料，並提醒加入官方帳號好友。
- **Google 試算表更新活動消息**：非工程人員改試算表就能更新網站，不需 API 金鑰，每 60 秒自動同步。

## 技術棧

| 類別 | 技術 |
| --- | --- |
| 框架 | Next.js 16（App Router）、React 19 |
| 語言 | TypeScript 6 |
| 樣式 | Tailwind CSS v4、CSS Layers |
| 後端服務 | Supabase（PostgreSQL、RLS、Storage） |
| LINE | LINE LIFF SDK、LIFF ID Token 驗證 |
| 內容管理 | Google 試算表（CSV） |
| 部署 | Vercel |

## 開發進度

### 網站功能

- [x] 首頁、關於我們、語言課程、校區資訊、學習專欄、活動消息
- [x] 隱私權政策、服務條款、聯絡我們
- [x] 響應式版面（桌機、平板、手機）
- [x] Banner 與頁首滿版，大螢幕使用高解析度圖片
- [x] 深色模式，記住使用者選擇且不閃白
- [x] 右下角「回到最上方」按鈕，捲動後才出現
- [x] 頁籤、下拉選單、手風琴、漢堡選單
- [x] 首頁 VERBA 學習法
- [x] 首頁照片改用對話框形狀，照片不壓文字
- [x] 首頁區塊標題改寫（帶得走的能力、在使用中學會、堅持的四件事）
- [x] 頁尾改版：LINE 加好友 CTA、導覽、校區與聯絡資訊
- [x] 關於我們改版：課程重點卡片、報名七步時間軸、「沃語的一天」可依語言篩選、企業培訓
- [x] 語言課程頁區塊標題改寫（程度與教材、這門課怎麼學、每一階學會什麼、一堂課的節奏、加分安排、主題班別）
- [x] 語言課程頁移除小圖輪播與燈箱，照片改用對話框形狀
- [x] 語言課程標題旁的對話泡泡依語言顯示對應文字
- [x] 校區資訊改版：11 間分校卡片，可依地區和語言篩選，「預約參觀」自動帶入聯絡表單
- [x] SEO：每頁分享預覽、sitemap、robots

### 會員與資料

- [x] 學員登入（Server Action + httpOnly cookie）
- [x] 聽力教材播放器，播完自動接下一集
- [x] 活動消息串接 Google 試算表（ISR 每 60 秒更新）
- [x] 活動消息切回視窗時自動更新，不用重新整理
- [x] 聯絡表單即時驗證，前後端共用規則，並有 honeypot 防機器人
- [x] Supabase 資料表與 RLS 設定（`supabase/schema.sql`）
- [x] 私有音檔使用限時簽名網址

### LINE LIFF

- [x] 會員專區
- [x] 分享卡片（shareTargetPicker）
- [x] 掃碼活動報到
- [x] 加好友提醒
- [x] 伺服器向 LINE 驗證 ID Token
- [x] LIFF SDK 延遲載入

### 專案整理

- [x] Production build、lint、型別檢查通過
- [x] 程式註解整理
- [x] Git 歷史整理成單一乾淨 commit
- [x] README 與開發交接文件

### 上線

- [x] 建立 GitHub public repo 並推上程式碼
- [ ] 在 GitHub 設定 Description 和 Topics
- [x] Vercel 匯入專案並完成第一次部署
- [x] 正式站讀到 Google 試算表的活動消息
- [ ] 正式站改試算表，確認活動消息有更新
- [ ] Vercel 設定 `NEXT_PUBLIC_SITE_URL`，填入正式網址後重新部署
- [x] 把正式網址補到這份 README
- [ ] 建立 Supabase 專案並執行 `supabase/schema.sql`
- [ ] Vercel 設定 Supabase 環境變數
- [ ] 建立 LINE Login channel 和 LIFF，Endpoint URL 填 `https://你的網域/member`
- [ ] Vercel 設定 LINE 環境變數
- [ ] 真實手機測試 LIFF：登入、分享卡片、掃碼報到、加好友提醒
- [ ] 真實環境測試聯絡表單和私有音檔

### 手機開發

- [ ] 在 claude.ai/code 連接 GitHub 並授權這個 repo
- [ ] 用手機 Claude App 改一項小功能，確認 Vercel 預覽網址可以開啟

## 功能

| 類別 | 功能 | 實作重點 |
| --- | --- | --- |
| 網站 | 語言課程、校區、專欄等頁面，頁籤／下拉選單、手風琴、漢堡選單、依語言篩選時段 | 課程與校區由資料檔產生；互動全部用 React state |
| 學員專區 | 帳號登入、聽力教材播放器 | Server Action + httpOnly cookie；自製播放控制列，播完自動接下一集 |
| 活動消息 | 可接 Google 試算表，非工程人員也能更新 | 伺服器下載 CSV，不需 API 金鑰；ISR 每 60 秒更新，切回視窗時立刻更新，依日期自動排序 |
| Supabase | 聯絡表單、活動報到、私有音檔 | 全部資料表開 RLS；私有音檔用限時簽名網址 |
| LINE | 會員專區、分享卡片、掃碼報到、加好友提醒 | LIFF SDK 延遲載入；報到 API 先向 LINE 驗證 ID Token 再寫入 |
| 體驗 | 深色模式、表單即時驗證、RWD、每頁分享預覽 | 記住使用者選擇且不閃白；前後端共用同一份驗證規則 |

## 免設定體驗

不用任何金鑰就能跑起來，沒設定的服務會使用內建示範資料或顯示「尚未設定」：

- **學員專區**：到 `/login` 輸入示範帳號 `DEMO`，可以試用聽力播放器
- **活動消息**：顯示內建示範消息
- **聯絡表單**：可以試即時驗證；要設定 Supabase 才能實際送出
- **LINE 會員專區**：要設定 LIFF 才能使用

## 架構重點

- **圖層式 CSS 遷移**：既有樣式放在 `@layer site`，排在 Tailwind utilities 前面，加上 Tailwind class 一定會蓋過舊樣式，可以逐頁替換，不用一次重寫。
- **深色模式自動產生**：`scripts/gen-dark-css.mjs` 用 postcss 掃過 `site.css`，把白底、灰字、淺色框線產生成 `:root.dark` 的覆寫規則，`@media` 條件也會保留。
- **SDK 延遲載入**：LIFF SDK 只有用到 LINE 功能時才 `import()`，其他頁面不受影響。
- **安全性**：Service role key 只在伺服器端使用（`server-only` 保護）。報到 API 不相信前端送來的 userId，而是向 LINE 驗證 ID Token。聯絡表單有 honeypot 防機器人。

## 本機開發

需要 Node.js 20.9 以上。

```bash
npm install
npm run dev       # http://localhost:3000
```

其他指令：`npm run build`、`npm run start`、`npm run lint`、`npm run typecheck`。

## 選用設定

複製 `.env.example` 成 `.env.local` 後填入。

- **Supabase**：建立專案，在 SQL Editor 執行 [`supabase/schema.sql`](supabase/schema.sql)，再填入 URL 和金鑰。要放私有音檔可以用 `scripts/upload-audio.ts`（需要 Node 22.18 以上）。
- **活動報到**：在 `checkin_events` 新增活動，把 `https://你的網域/member?checkin=活動代碼` 做成 QR Code。
- **LINE**：在 LINE Developers 建立 LIFF，Endpoint URL 填 `https://你的網域/member`，Scope 勾選 `profile`、`openid`，開啟 shareTargetPicker 和 Scan QR，Bot link 選 On (Aggressive) 並連結官方帳號。
- **Google 試算表**：A 欄標題、B 欄內文、C 欄日期，開啟「知道連結的任何人都能檢視」，再填入 `NEWS_SHEET_ID`。

## 聲明

本專案為個人作品集，不提供實際服務；網站中的學校、校區、電話、課程與活動皆非真實資訊。

## 素材授權

圖片與音檔來自 Wikimedia Commons，只使用 CC0 或公有領域授權，逐一列在 [MEDIA_CREDITS.md](MEDIA_CREDITS.md)。Logo、標題字圖和裝飾插圖為本專案自行繪製。
