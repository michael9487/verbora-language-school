"use server";

import { normalizeContact, validateContact, type ContactErrors, type ContactFields } from "@/lib/contact";
import { publicClient } from "@/lib/supabase/clients";

export type ContactState =
  | { status: "idle" }
  | { status: "invalid"; errors: ContactErrors; values: ContactFields }
  | { status: "error"; message: string; values: ContactFields }
  | { status: "success" };

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values: ContactFields = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    branch: String(formData.get("branch") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // 機器人會把隱藏欄位也填上，填了就假裝成功、不存
  if (formData.get("website")) return { status: "success" };

  // 瀏覽器端檢查可以被繞過，伺服器一定要再檢查一次
  const errors = validateContact(values);
  if (Object.keys(errors).length) return { status: "invalid", errors, values };

  const supabase = publicClient();
  if (!supabase) return { status: "error", message: "表單服務尚未設定，請改用電話或 Email 聯絡我們。", values };

  const row = normalizeContact(values);
  // anon key + RLS：這張表只允許新增，不能讀
  const { error } = await supabase.from("contact_messages").insert({ ...row, branch: row.branch || null });
  if (error) {
    console.error("contact_messages insert failed:", error.message);
    return { status: "error", message: "送出失敗，請稍後再試，或直接來電洽詢。", values };
  }
  return { status: "success" };
}
