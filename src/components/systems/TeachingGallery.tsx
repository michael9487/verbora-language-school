"use client";

import { useEffect, useRef, useState } from "react";
import { useLightbox } from "./Lightbox";

type Slide = { src: string; alt: string; width?: string };

// 各語言課程底部的圖片輪播：左右箭頭、圓點、手動滑動同步圓點、點圖放大
export function TeachingGallery({ slides }: { slides: Slide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [current, setCurrent] = useState(0);
  const [spacer, setSpacer] = useState(0);
  const openLightbox = useLightbox();

  // 補一段空白墊高區，讓最後幾張也能真正貼齊最左邊（不會被捲動範圍卡住提前停住）。
  // 舊版要等區塊顯示出來才量；這裡用 ResizeObserver，區塊從 hidden 變成顯示時會自動重量
  useEffect(() => {
    const track = trackRef.current;
    const last = slideRefs.current[slides.length - 1];
    if (!track || !last) return;
    const ro = new ResizeObserver(() => {
      if (track.clientWidth) setSpacer(Math.max(0, track.clientWidth - last.offsetWidth + 4));
    });
    ro.observe(track);
    return () => ro.disconnect();
  }, [slides.length]);

  function goTo(index: number) {
    const track = trackRef.current;
    const i = Math.max(0, Math.min(slides.length - 1, index));
    const slide = slideRefs.current[i];
    if (!track || !slide) return;
    setCurrent(i);
    // 每張卡片相對於 track 左邊界的位置（支援寬度不一致的圖片）
    const left = slide.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    track.scrollTo({ left, behavior: "smooth" });
  }

  // 使用者直接手動拖曳/滑動時，同步更新目前的圓點
  function onScroll() {
    clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      const track = trackRef.current;
      if (!track) return;
      const trackLeft = track.getBoundingClientRect().left;
      let closest = 0;
      let closestDist = Infinity;
      slideRefs.current.forEach((slide, i) => {
        const dist = Math.abs((slide?.getBoundingClientRect().left ?? Infinity) - trackLeft);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setCurrent(closest);
    }, 100);
  }

  return (
    <div className="teaching-gallery">
      <div className="teaching-gallery-track" ref={trackRef} onScroll={onScroll}>
        {slides.map((s, i) => (
          <div
            key={s.src}
            className="gallery-slide"
            style={s.width ? { width: s.width } : undefined}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
          >
            <img loading="lazy" src={s.src} alt={s.alt} onClick={() => openLightbox({ src: s.src, alt: s.alt })} />
          </div>
        ))}
        {spacer > 0 && <div style={{ flex: `0 0 ${spacer}px`, width: spacer }} aria-hidden="true" />}
      </div>
      <div className="teaching-gallery-nav">
        <button className="gallery-arrow gallery-arrow-prev" aria-label="上一張" onClick={() => goTo(current - 1)}>
          <img loading="lazy" src="/images/ui/arrow-right.svg" alt="" />
        </button>
        <div className="gallery-indicators">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              className={`gallery-dot${i === current ? " is-active" : ""}`}
              aria-label={`前往第 ${i + 1} 張圖片`}
              aria-current={i === current ? "true" : undefined}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
        <button className="gallery-arrow gallery-arrow-next" aria-label="下一張" onClick={() => goTo(current + 1)}>
          <img loading="lazy" src="/images/ui/arrow-left.svg" alt="" />
        </button>
      </div>
    </div>
  );
}
