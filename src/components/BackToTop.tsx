"use client";

import { useEffect, useState } from "react";

// 右下角「回到最上方」：疊在深色模式按鈕上方，往下捲超過 400px 才出現
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="回到最上方"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`fixed right-4 bottom-20 z-[400] flex size-12 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white text-ink shadow-lg transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:right-6 md:bottom-[84px] dark:border-white/10 dark:bg-[#1d2530] dark:text-[#e8ebef] [.has-audio-player_&]:bottom-[172px] ${
        visible ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
