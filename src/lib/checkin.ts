// 報到 QR Code 內容：https://{網域}/member?checkin={活動代碼}
// 用 LINE 掃碼（liff.scanCodeV2）或手機相機掃都可以；相機掃會直接打開會員專區並自動報到
export function parseCheckinCode(text: string): string | null {
  try {
    const url = new URL(text);
    const code = url.searchParams.get("checkin");
    return code && /^[\w-]{1,64}$/.test(code) ? code : null;
  } catch {
    return null;
  }
}

export function checkinUrl(origin: string, code: string) {
  return `${origin}/member?checkin=${encodeURIComponent(code)}`;
}
