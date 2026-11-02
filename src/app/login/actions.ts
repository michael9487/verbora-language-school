"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUDIO_COOKIE, AUDIO_COOKIE_DAYS, findAccount } from "@/lib/audio-catalog";

export type LoginState = { error?: string; username?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  // 只需輸入帳號（不分大小寫、忽略前後空白），不用密碼
  const account = findAccount(username);
  if (!account) return { error: "查無此帳號，請重新輸入", username };

  (await cookies()).set(AUDIO_COOKIE, account, {
    maxAge: AUDIO_COOKIE_DAYS * 86400,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  redirect("/audio");
}

export async function logout() {
  (await cookies()).delete(AUDIO_COOKIE);
  redirect("/login");
}
