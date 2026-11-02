"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { ShareButton } from "@/components/liff/ShareButton";
import type { NewsItem } from "@/lib/news";

const INITIAL_COUNT = 6;
const URL_PATTERN = /(https?:\/\/[^\s，。、）)]+)/g;

const displayDate = (iso: string) => iso.replace(/-/g, "/");

// 內文裡的網址自動變成連結
function Linkified({ text }: { text: string }) {
  return text.split(URL_PATTERN).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={part} target="_blank" rel="noopener" className="break-all text-brand underline underline-offset-2 dark:text-[#6fb1f5]">
        {part}
      </a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

// 最新消息：同一時間只展開一則；預設只顯示最新六則，按「查看更多」才展開全部
// 舊版監聽 <details> 的 toggle 事件再去關掉其他則；這裡改成只記一個 openId
export function NewsAccordion({ items }: { items: NewsItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);
  const [expanded, setExpanded] = useState(false);
  const itemRefs = useRef(new Map<string, HTMLDetailsElement>());
  const userOpened = useRef(false);

  // 網址帶 #news-xxx 時直接打開那一則（從 LINE 分享卡片點進來）
  useEffect(() => {
    const id = window.location.hash.match(/^#news-(\w+)$/)?.[1];
    const index = items.findIndex((p) => p.id === id);
    if (!id || index < 0) return;
    userOpened.current = true;
    /* eslint-disable react-hooks/set-state-in-effect -- 只在掛載時讀一次網址，SSR 拿不到 hash */
    setOpenId(id);
    if (index >= INITIAL_COUNT) setExpanded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [items]);

  // 上面那則收起來後版面會往上縮，所以把剛點開的那則捲回畫面上方（避開固定的 header）
  useEffect(() => {
    if (openId == null || !userOpened.current) return;
    const item = itemRefs.current.get(openId);
    if (!item) return;
    const header = document.querySelector<HTMLElement>(".site-header");
    const offset = (header?.offsetHeight ?? 0) + 12;
    const top = item.getBoundingClientRect().top;
    if (top < offset || window.location.hash === `#news-${openId}`) {
      window.scrollTo({ top: window.scrollY + top - offset, behavior: "smooth" });
    }
  }, [openId]);

  return (
    <>
      <div className={`news-accordion${expanded ? " is-expanded" : ""}`}>
        {items.map((item) => (
          <details
            key={item.id}
            id={`news-${item.id}`}
            className="news-acc-item"
            open={openId === item.id}
            ref={(el) => {
              if (el) itemRefs.current.set(item.id, el);
              else itemRefs.current.delete(item.id);
            }}
          >
            <summary
              className="news-acc-head"
              onClick={(e) => {
                // 由 React 決定開關，不讓瀏覽器自己切換 <details>
                e.preventDefault();
                userOpened.current = true;
                setOpenId((cur) => (cur === item.id ? null : item.id));
              }}
            >
              <span className="news-date">{item.date && <time dateTime={item.date}>{displayDate(item.date)}</time>}</span>
              {item.tag && <span className={`news-tag news-tag--${item.tag.key}`}>{item.tag.label}</span>}
              <span className="news-title">{item.title}</span>
              <span className="news-chevron" aria-hidden="true">
                ▼
              </span>
            </summary>
            <div className="news-acc-body">
              {item.body && (
                <article className="news-event">
                  <p className="news-event-desc news-event-raw">
                    <Linkified text={item.body} />
                  </p>
                </article>
              )}
              <div className="flex justify-end">
                <ShareButton
                  card={{
                    title: item.title,
                    subtitle: [item.date && displayDate(item.date), item.body.split("\n")[0]].filter(Boolean).join("・").slice(0, 120),
                    url: `/news#news-${item.id}`,
                    image: "/images/news/banner.jpg",
                    buttonLabel: "查看消息",
                  }}
                />
              </div>
            </div>
          </details>
        ))}
      </div>
      {items.length > INITIAL_COUNT && (
        <button type="button" className="news-more-btn" aria-expanded={expanded} hidden={expanded} onClick={() => setExpanded(true)}>
          查看更多
        </button>
      )}
    </>
  );
}
