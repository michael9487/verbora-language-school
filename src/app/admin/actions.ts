"use server";

import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin";
import { MESSAGE_STATUSES, type MessageStatus } from "@/lib/admin-data";
import { adminClient } from "@/lib/supabase/clients";

export async function setMessageStatus(formData: FormData) {
  if (!(await isAdmin())) return;

  const id = Number(formData.get("id"));
  const status = formData.get("status") as MessageStatus;
  if (!Number.isSafeInteger(id) || !MESSAGE_STATUSES.includes(status)) return;

  const { error } = (await adminClient()?.from("contact_messages").update({ status }).eq("id", id)) ?? {};
  if (error) console.error("更新留言狀態失敗：", error.message);
  revalidatePath("/admin");
}
