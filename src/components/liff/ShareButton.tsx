"use client";

import { useState } from "react";
import { buildShareMessage, absoluteUrl, type ShareCard } from "@/lib/line-flex";
import { useLiffContext } from "./LiffProvider";

type Status = { kind: "idle" | "busy" } | { kind: "done" | "error"; text: string };

// LIFF 只保證在 Endpoint URL（/member）底下能用
const LIFF_PATH = "/member";

// LINE 官方的網站分享頁，電腦和手機瀏覽器都走這裡
function openLineShare(url: string, text: string) {
  const shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  // 加 noopener 參數時 window.open 一律回傳 null，就分不出有沒有被擋，所以開好再切斷 opener
  const opened = window.open(shareUrl, "_blank");
  if (opened) opened.opener = null;
  else window.location.href = shareUrl;
}

// 分享給 LINE 好友：
// 1. 在會員專區且支援 shareTargetPicker → 選好友/群組，送出 Flex 卡片（要先登入 LINE）
// 2. 其他情況 → 開 LINE 官方的分享頁，分享連結
export function ShareButton({ card, className = "" }: { card: ShareCard; className?: string }) {
  const { init } = useLiffContext();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function share() {
    const origin = window.location.origin;
    const url = absoluteUrl(card.url, origin);
    // 要在點擊當下直接開新分頁，先 await 會被瀏覽器當成彈出視窗擋掉
    if (!window.location.pathname.startsWith(LIFF_PATH)) return openLineShare(url, card.title);

    setStatus({ kind: "busy" });
    try {
      const liff = await init();
      if (liff && liff.isApiAvailable("shareTargetPicker")) {
        if (!liff.isLoggedIn()) {
          liff.login({ redirectUri: window.location.href });
          return;
        }
        // 型別上 Flex 的 contents 是很深的聯集型別，這裡的結構已依 Flex Message 規格組好
        const res = await liff.shareTargetPicker([buildShareMessage(card, origin) as never], { isMultiple: true });
        setStatus(res ? { kind: "done", text: "已分享到 LINE" } : { kind: "idle" });
        return;
      }
      openLineShare(url, card.title);
      setStatus({ kind: "idle" });
    } catch {
      setStatus({ kind: "error", text: "分享失敗，請稍後再試" });
    }
  }

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <button
        type="button"
        onClick={share}
        disabled={status.kind === "busy"}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full border-0 bg-line px-4 py-2 text-sm font-bold text-white transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line disabled:cursor-wait disabled:opacity-70"
      >
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
          <path d="M12 3C6.5 3 2 6.6 2 11c0 3.9 3.5 7.2 8.3 7.9.3.1.8.2.9.5.1.3.1.7 0 1l-.1.9c0 .3-.2 1 .9.5s5.8-3.4 7.9-5.9C21.3 14.3 22 12.7 22 11c0-4.4-4.5-8-10-8Z" />
        </svg>
        {status.kind === "busy" ? "處理中…" : "分享給 LINE 好友"}
      </button>
      {(status.kind === "done" || status.kind === "error") && (
        <span role="status" className={`text-sm ${status.kind === "error" ? "text-red-600" : "text-ink-muted dark:text-[#9aa5b3]"}`}>
          {status.text}
        </span>
      )}
    </span>
  );
}
