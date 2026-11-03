"use client";

import { useEffect, useTransition } from "react";
import { refreshNews } from "@/app/news/actions";

// 切回這個視窗或分頁時重新抓活動消息，不用手動重新整理；已展開的活動不會被收起來
const MIN_INTERVAL_MS = 10_000;

export function RefreshOnFocus() {
  const [, startTransition] = useTransition();

  useEffect(() => {
    let last = Date.now();
    function onFocus() {
      if (document.visibilityState !== "visible" || Date.now() - last < MIN_INTERVAL_MS) return;
      last = Date.now();
      startTransition(() => refreshNews());
    }
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  return null;
}
