import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// 學員登入狀態。LINE 身分由伺服器向 LINE 驗證後才簽章寫入 cookie，使用者自己改內容簽章就會失效
// 示範模式沒有身分，所以不用簽章，也只能看公開的示範內容（見 lib/audio.ts）
export type Session = { kind: "line"; sub: string; name: string } | { kind: "demo" };

const SESSION_COOKIE = "verbora_session";
const SESSION_DAYS = 30;
const DEMO_VALUE = "demo";
const MIN_SECRET_LENGTH = 32;

function secret() {
  const value = process.env.SESSION_SECRET;
  return value && value.length >= MIN_SECRET_LENGTH ? value : null;
}

const sign = (payload: string, key: string) => createHmac("sha256", key).update(payload).digest("base64url");

function decode(value: string): Session | null {
  if (value === DEMO_VALUE) return { kind: "demo" };
  const key = secret();
  const [payload, signature] = value.split(".");
  if (!key || !payload || !signature) return null;

  const expected = Buffer.from(sign(payload, key));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const { sub, name, exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof sub === "string" && typeof exp === "number" && exp > Date.now() ? { kind: "line", sub, name: typeof name === "string" ? name : "" } : null;
  } catch {
    return null;
  }
}

async function write(value: string) {
  (await cookies()).set(SESSION_COOKIE, value, {
    maxAge: SESSION_DAYS * 86400,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}

/** 目前的登入狀態；沒登入、簽章不符或已過期都回傳 null */
export async function getSession(): Promise<Session | null> {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  return value ? decode(value) : null;
}

/** 回傳 false 代表伺服器沒有設定 SESSION_SECRET，無法發出 LINE 登入狀態 */
export async function startLineSession(user: { sub: string; name?: string }) {
  const key = secret();
  if (!key) return false;
  const payload = Buffer.from(JSON.stringify({ sub: user.sub, name: user.name ?? "", exp: Date.now() + SESSION_DAYS * 86400_000 })).toString("base64url");
  await write(`${payload}.${sign(payload, key)}`);
  return true;
}

export const startDemoSession = () => write(DEMO_VALUE);

export async function clearSession() {
  (await cookies()).delete(SESSION_COOKIE);
}
