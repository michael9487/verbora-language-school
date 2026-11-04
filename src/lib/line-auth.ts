import "server-only";

// 不能相信前端送來的 userId，所以先向 LINE 驗證 ID Token，從 LINE 回傳的結果取得使用者身分
// Token 無效或已過期回傳 null；連不上 LINE 時會丟出錯誤
export async function verifyLineIdToken(idToken: string): Promise<{ sub: string; name?: string } | null> {
  const channelId = process.env.LINE_LOGIN_CHANNEL_ID;
  if (!channelId) return null;

  const res = await fetch("https://api.line.me/oauth2/v2.1/verify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ id_token: idToken, client_id: channelId }),
  });
  if (!res.ok) return null;
  const { sub, name } = (await res.json()) as { sub: string; name?: string };
  return { sub, name };
}
