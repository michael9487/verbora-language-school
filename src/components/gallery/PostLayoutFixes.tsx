"use client";

import { useEffect } from "react";

// 探索視角文章的手機版排版修正：都要看文字實際排到哪裡才能決定，只能量 DOM，所以寫成不輸出畫面的 effect

function useLayoutCheck(check: () => void) {
  useEffect(() => {
    check();
    window.addEventListener("load", check);
    window.addEventListener("resize", check);
    // 字型載入完成後行寬會變，再量一次
    document.fonts?.ready.then(check);
    return () => {
      window.removeEventListener("load", check);
      window.removeEventListener("resize", check);
    };
  }, [check]);
}

// 文章 1：結尾右下的地球照片從區塊底部定位，最後一行字排得比較長時會壓到字。
// 偵測最後一行的右端有沒有碰到照片，有的話把文章下方留白加大，讓照片往下移到字的下面
function checkPhotoClearance() {
  const photo = document.querySelector<HTMLElement>(".post-deco--left-photo");
  const main = document.querySelector<HTMLElement>(".post-main");
  if (!photo || !main) return;
  main.style.removeProperty("padding-bottom");
  if (window.innerWidth >= 768) return;
  const blocks = main.querySelectorAll("p, li");
  const last = blocks[blocks.length - 1];
  if (!last) return;
  const range = document.createRange();
  range.selectNodeContents(last);
  const rects = range.getClientRects();
  const line = rects[rects.length - 1];
  if (!line) return;
  const p = photo.getBoundingClientRect();
  const overlapX = line.right > p.left + 8;
  const push = line.bottom + 6 - p.top;
  if (overlapX && push > 0) {
    const base = parseFloat(getComputedStyle(main).paddingBottom) || 0;
    main.style.paddingBottom = `${base + push}px`;
  }
}

export function PostPhotoClearance() {
  useLayoutCheck(checkPhotoClearance);
  return null;
}

// 文章 3：漢堡插圖接在第一段最後一個字後面。最後一行剛好排滿時，插圖會被擠到下一行的最左邊，
// 這時加上 is-wrapped，由 CSS 改放到段落結尾的右下（只有手機版有對應樣式）
function checkInlineIllust() {
  const illust = document.querySelector<HTMLElement>(".post3-inline-illust");
  const text = illust?.previousSibling;
  if (!illust || !text || text.nodeType !== Node.TEXT_NODE) return;
  illust.classList.remove("is-wrapped");
  const len = text.textContent?.length ?? 0;
  if (!len) return;
  const range = document.createRange();
  range.setStart(text, len - 1);
  range.setEnd(text, len);
  if (illust.getBoundingClientRect().left < range.getBoundingClientRect().left) {
    illust.classList.add("is-wrapped");
  }
}

export function InlineIllustWrap() {
  useLayoutCheck(checkInlineIllust);
  return null;
}
