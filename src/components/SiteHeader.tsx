"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV_ITEMS, isActive } from "@/lib/site";

// 平板、手機版的漢堡選單
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // 換頁後收合（SPA 換頁不會重新載入頁面）
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    // 點到選單以外的地方就收合；點到 header 本身代表點在半透明遮罩上
    const onClick = (e: MouseEvent) => {
      const header = headerRef.current;
      if (header && (!header.contains(e.target as Node) || e.target === header)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    // 視窗拉回桌機寬度時收合，避免殘留展開狀態
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header ref={headerRef} className={`site-header${open ? " is-open" : ""}`}>
      <div className="header-inner">
        <Link href="/" className="header-logo">
          <img src="/images/logo.png" alt="Verbora 沃語國際語言學校" />
        </Link>
        <nav className="header-nav" id="site-nav">
          <ul>
            {NAV_ITEMS.map((item) => {
              const active = isActive(item, pathname);
              return (
                <li key={item.href}>
                  <Link href={item.href} className={active ? "active" : undefined} aria-current={active ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? "關閉選單" : "開啟選單"}
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
