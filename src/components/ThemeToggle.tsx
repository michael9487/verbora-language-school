"use client";

import { useSyncExternalStore } from "react";

export const THEME_KEY = "verbora-theme";

// 在 <head> 裡最先執行：頁面畫出來之前就套用深色，避免先閃一下白底
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}})()`;

// 以 <html> 上的 class 為唯一來源，訂閱 class 變化
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}
const getSnapshot = () => document.documentElement.classList.contains("dark");
const getServerSnapshot = () => false;

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
      // 無痕模式等情況存不了，就只在這次瀏覽有效
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "切換成淺色模式" : "切換成深色模式"}
      aria-pressed={dark}
      className="fixed right-4 bottom-4 z-[400] flex size-12 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white text-ink shadow-lg transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand md:right-6 md:bottom-6 dark:border-white/10 dark:bg-[#1d2530] dark:text-[#e8ebef] [.has-audio-player_&]:bottom-28"
    >
      {dark ? (
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      )}
    </button>
  );
}
