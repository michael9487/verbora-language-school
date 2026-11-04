import "server-only";
import { getSession, type Session } from "@/lib/session";

// 管理者名單放在環境變數（LINE 使用者 ID，逗號分隔）。沒設定就沒有人是管理者
function adminIds() {
  return (process.env.ADMIN_LINE_USER_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

export const isAdminSession = (session: Session | null) => session?.kind === "line" && adminIds().includes(session.sub);

/** Server Action 也是公開端點，每個寫入動作都要自己檢查，不能只靠頁面沒顯示按鈕 */
export async function isAdmin() {
  return isAdminSession(await getSession());
}
