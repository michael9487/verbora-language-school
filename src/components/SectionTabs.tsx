"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

// 校區資訊（地區）、語言課程共用：桌機是分頁列，平板、手機是下拉選單，兩邊同步，一次只顯示一個區塊。
// 舊版用 querySelectorAll 找 tab、切換 hidden；這裡改成一個 active state，由 TabPanel 讀取決定要不要顯示。
type Tab = { id: string; label: string };

const ActiveTabContext = createContext<string | null>(null);

export function SectionTabs({
  tabs,
  navClassName,
  innerClassName,
  tabClassName,
  dropdownId,
  dropdownCaption,
  scrollToNav = false,
  children,
}: {
  tabs: Tab[];
  navClassName: string;
  innerClassName: string;
  tabClassName: string;
  dropdownId: string;
  dropdownCaption: string;
  scrollToNav?: boolean;
  children: ReactNode;
}) {
  const [active, setActive] = useState(tabs[0].id);
  const navRef = useRef<HTMLElement>(null);
  const index = tabs.findIndex((t) => t.id === active);

  // 網址帶 #english 這類錨點時直接打開那一區（分享連結用）
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 只在掛載時讀一次網址，SSR 拿不到 hash
    if (tabs.some((t) => t.id === id)) setActive(id);
  }, [tabs]);

  function show(id: string) {
    setActive(id);
    history.replaceState(null, "", `#${id}`);
  }

  return (
    <ActiveTabContext.Provider value={active}>
      <nav ref={navRef} className={navClassName}>
        <div className={innerClassName}>
          {tabs.map((tab) => (
            <a
              key={tab.id}
              className={`${tabClassName}${tab.id === active ? " is-active" : ""}`}
              href={`#${tab.id}`}
              aria-current={tab.id === active ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                show(tab.id);
                if (scrollToNav) navRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {tab.label}
            </a>
          ))}
        </div>
      </nav>

      {/* 平板、手機版：下拉選單 */}
      <div className="region-dropdown" id={dropdownId}>
        <span className="region-dropdown-caption">{dropdownCaption}</span>
        <div className="region-dropdown-field">
          <span className="region-dropdown-label">{tabs[index].label}</span>
          <span className="region-dropdown-index">
            {index + 1} / {tabs.length}
          </span>
          <span className="region-dropdown-chevron" aria-hidden="true"></span>
          <select className="region-dropdown-select" aria-label={dropdownCaption} value={active} onChange={(e) => show(e.target.value)}>
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {children}
    </ActiveTabContext.Provider>
  );
}

export function TabPanel({ id, className, children }: { id: string; className: string; children: ReactNode }) {
  const active = useContext(ActiveTabContext);
  return (
    <section id={id} className={className} hidden={active !== id}>
      {children}
    </section>
  );
}
