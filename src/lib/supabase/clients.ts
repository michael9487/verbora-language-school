import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// 這個網站沒有用 Supabase Auth（身分由 LINE / 學員帳號 cookie 處理），
// 所以不需要 @supabase/ssr 的 cookie 同步，直接用 supabase-js 建兩種 client

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const options = { auth: { persistSession: false, autoRefreshToken: false } };

export const isSupabaseConfigured = Boolean(url && anonKey);

/** 公開資料、匿名可寫入的表單：權限完全交給 RLS policy */
export function publicClient(): SupabaseClient | null {
  return url && anonKey ? createClient(url, anonKey, options) : null;
}

/** 伺服器專用：會略過 RLS（私有音檔、驗證過 LINE 身分後才寫入的報到紀錄），絕不能傳到瀏覽器 */
export function adminClient(): SupabaseClient | null {
  return url && serviceKey ? createClient(url, serviceKey, options) : null;
}
