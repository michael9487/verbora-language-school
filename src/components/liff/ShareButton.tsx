"use client";

import { useState } from "react";
import { buildShareMessage, absoluteUrl, type ShareCard } from "@/lib/line-flex";
import { useLiffContext } from "./LiffProvider";

type Status = { kind: "idle" | "busy" } | { kind: "done" | "error"; text: string };

// 分享給 LINE 好友：
// 1. 有 LIFF 且支援 shareTargetPicker → 選好友/群組，送出 Flex 卡片（要先登入 LINE）
// 2. 沒有 → 手機用系統分享選單（navigator.share）
// 3. 都沒有 → 複製連結
export function ShareButton({ card, className = "" }: { card: ShareCard; className?: string }) {
  const { init } = useLiffContext();
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function share() {
    setStatus({ kind: "busy" });
    const origin = window.location.origin;
    const url = absoluteUrl(card.url, origin);
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
      if (navigator.share) {
        await navigator.share({ title: card.title, text: card.subtitle, url });
        setStatus({ kind: "idle" });
        return;
      }
      await navigator.clipboard.writeText(url);
      setStatus({ kind: "done", text: "已複製連結" });
    } catch (err) {
      // 使用者自己關掉分享選單不算錯誤
      if (err instanceof DOMException && err.name === "AbortError") return setStatus({ kind: "idle" });
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
