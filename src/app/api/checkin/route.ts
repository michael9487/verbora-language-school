import { NextResponse } from "next/server";
import { verifyLineIdToken } from "@/lib/line-auth";
import { adminClient } from "@/lib/supabase/clients";

// 活動報到：前端送來 LIFF ID Token + 活動代碼
// 先向 LINE 驗證 ID Token 確認身分，再寫入資料庫

export async function POST(req: Request) {
  const { idToken, code } = (await req.json().catch(() => ({}))) as { idToken?: string; code?: string };
  if (!idToken || !code || !/^[\w-]{1,64}$/.test(code)) {
    return NextResponse.json({ error: "缺少登入資訊或活動代碼格式不正確" }, { status: 400 });
  }

  const supabase = adminClient();
  if (!process.env.LINE_LOGIN_CHANNEL_ID || !supabase) return NextResponse.json({ error: "報到服務尚未設定" }, { status: 503 });

  const user = await verifyLineIdToken(idToken);
  if (!user) return NextResponse.json({ error: "LINE 登入已過期，請重新登入" }, { status: 401 });

  const { data: event } = await supabase.from("checkin_events").select("code, name, location, ends_at").eq("code", code).maybeSingle();
  if (!event) return NextResponse.json({ error: "找不到這個活動，請確認 QR Code" }, { status: 404 });
  if (event.ends_at && new Date(event.ends_at) < new Date()) {
    return NextResponse.json({ error: `「${event.name}」已結束報到` }, { status: 410 });
  }

  const { error } = await supabase.from("event_checkins").insert({ event_code: code, line_user_id: user.sub, display_name: user.name ?? null });
  // 23505 = unique violation：同一人重複掃碼，回報「已報到」而不是錯誤
  if (error && error.code !== "23505") {
    console.error("event_checkins insert failed:", error.message);
    return NextResponse.json({ error: "報到失敗，請稍後再試" }, { status: 500 });
  }

  return NextResponse.json({ status: error ? "already" : "ok", event: { name: event.name, location: event.location } });
}
