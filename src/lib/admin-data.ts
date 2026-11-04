import "server-only";
import { adminClient } from "@/lib/supabase/clients";

export const MESSAGE_STATUSES = ["new", "contacted"] as const;
export type MessageStatus = (typeof MESSAGE_STATUSES)[number];

export type ContactMessage = {
  id: number;
  name: string;
  phone: string;
  email: string;
  branch: string | null;
  message: string;
  status: MessageStatus;
  created_at: string;
};

export type CheckinEvent = {
  code: string;
  name: string;
  location: string | null;
  ends_at: string | null;
  checkins: { id: number; display_name: string | null; checked_in_at: string }[];
};

// 後台只列最近的資料，作品集的資料量用不到分頁
const LIST_LIMIT = 200;

export async function getContactMessages(): Promise<ContactMessage[] | null> {
  const supabase = adminClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("contact_messages").select("id, name, phone, email, branch, message, status, created_at").order("created_at", { ascending: false }).limit(LIST_LIMIT);
  if (error) {
    console.error("讀取聯絡表單失敗：", error.message);
    return null;
  }
  return data;
}

export async function getCheckinEvents(): Promise<CheckinEvent[] | null> {
  const supabase = adminClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("checkin_events").select("code, name, location, ends_at, created_at, event_checkins(id, display_name, checked_in_at)").order("created_at", { ascending: false }).limit(LIST_LIMIT);
  if (error) {
    console.error("讀取報到名單失敗：", error.message);
    return null;
  }
  return data.map(({ event_checkins, ...event }) => ({
    code: event.code,
    name: event.name,
    location: event.location,
    ends_at: event.ends_at,
    checkins: [...event_checkins].sort((a, b) => b.checked_in_at.localeCompare(a.checked_in_at)),
  }));
}
