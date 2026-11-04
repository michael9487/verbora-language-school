"use server";

import { redirect } from "next/navigation";
import { verifyLineIdToken } from "@/lib/line-auth";
import { clearSession, getSession, startDemoSession, startLineSession } from "@/lib/session";

export async function lineLogin(idToken: string): Promise<{ error: string }> {
  if (typeof idToken !== "string" || !idToken) return { error: "LINE 登入已過期，請重新登入" };

  let user;
  try {
    user = await verifyLineIdToken(idToken);
  } catch (err) {
    console.error("LINE ID Token 驗證失敗：", err);
    return { error: "暫時無法連線 LINE，請稍後再試" };
  }
  if (!user) return { error: "LINE 登入已過期，請重新登入" };
  if (!(await startLineSession(user))) return { error: "登入服務尚未設定" };
  redirect("/audio");
}

export async function demoLogin() {
  await startDemoSession();
  redirect("/audio");
}

/** 語音教材頁的登出：LINE 使用者回會員專區，順便登出瀏覽器裡的 LINE 登入 */
export async function logout() {
  const session = await getSession();
  await clearSession();
  redirect(session?.kind === "line" ? "/member?logout=1" : "/login");
}

/** 會員專區的登出按鈕：頁面自己會重新載入，不用導頁 */
export async function endSession() {
  await clearSession();
}
