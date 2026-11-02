"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

// 點輪播圖片放大。舊版在 document 上監聽 click 再找 .gallery-slide img；
// 這裡改成 context：輪播呼叫 open()，燈箱只看 state 決定要不要顯示
type LightboxImage = { src: string; alt: string };
const LightboxContext = createContext<(img: LightboxImage) => void>(() => {});

export const useLightbox = () => useContext(LightboxContext);

export function LightboxProvider({ children }: { children: ReactNode }) {
  const [image, setImage] = useState<LightboxImage | null>(null);
  const open = useCallback((img: LightboxImage) => setImage(img), []);

  useEffect(() => {
    if (!image) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setImage(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [image]);

  return (
    <LightboxContext.Provider value={open}>
      {children}
      <div
        className="lightbox"
        hidden={!image}
        role="dialog"
        aria-modal="true"
        aria-label="圖片放大檢視"
        onClick={(e) => e.target === e.currentTarget && setImage(null)}
      >
        <button className="lightbox-close" type="button" aria-label="關閉" onClick={() => setImage(null)}>
          ×
        </button>
        {image && <img className="lightbox-image" src={image.src} alt={image.alt} />}
      </div>
    </LightboxContext.Provider>
  );
}
