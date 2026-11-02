-- 沃語語言學校網站資料庫結構
-- 用法：Supabase Dashboard → SQL Editor 貼上執行
-- 權限原則：所有表都開 RLS；瀏覽器端（anon key）只能送出聯絡表單；
--          其他寫入都在伺服器端驗證身分後用 service role 執行
-- （活動消息不在資料庫：可接 Google 試算表，見 src/lib/news.ts）

-- ── 聯絡表單 ─────────────────────────────────────────────
create table public.contact_messages (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 1 and 50),
  phone text not null check (phone ~ '^0\d{1,2}-?\d{6,8}$|^09\d{2}-?\d{3}-?\d{3}$'),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  branch text,
  message text not null check (char_length(message) between 10 and 1000),
  created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;
-- 只能新增，不能讀：送出的留言只有後台（Dashboard / service role）看得到
create policy "任何人都能送出聯絡表單" on public.contact_messages for insert to anon with check (true);

-- ── 活動報到（LINE 掃 QR Code）──────────────────────────
create table public.checkin_events (
  code text primary key,             -- 印在 QR Code 上的代碼，例如 2026-halloween
  name text not null,
  location text,
  starts_at timestamptz,
  ends_at timestamptz,               -- 超過就不能再報到；留空代表不限
  created_at timestamptz not null default now()
);

create table public.event_checkins (
  id bigint generated always as identity primary key,
  event_code text not null references public.checkin_events (code) on delete cascade,
  line_user_id text not null,        -- 伺服器驗證過 LIFF ID Token 後才寫入
  display_name text,
  checked_in_at timestamptz not null default now(),
  unique (event_code, line_user_id)  -- 同一人同一活動只算一次
);
alter table public.checkin_events enable row level security;
alter table public.event_checkins enable row level security;
-- 不開任何 policy：只有伺服器（service role）能讀寫

-- ── 學員語音教材 ─────────────────────────────────────────
-- 選用：沒有資料時網站使用 public/audio 的示範音檔。
-- 要放私有教材時，音檔放進私有 bucket「audio」，路徑為 {book_key}/{檔名}，顯示名稱存在這張表，
-- 播放時由伺服器產生限時簽名網址
create table public.audio_tracks (
  id bigint generated always as identity primary key,
  book_key text not null,            -- 對應 src/lib/audio-catalog.ts 的教材代碼
  position int not null,
  title text not null,               -- 顯示名稱（原始中文檔名，不含副檔名）
  storage_path text not null unique,
  unique (book_key, position)
);
alter table public.audio_tracks enable row level security;
-- 不開 policy：學員登入狀態由網站伺服器判斷

insert into storage.buckets (id, name, public) values ('audio', 'audio', false)
on conflict (id) do nothing;

-- 範例報到活動（可刪）
insert into public.checkin_events (code, name, location) values
  ('demo-open-house', '沃語校園開放日', '虛構示範校區');
