import type { Metadata } from "next";
import { NewsAccordion } from "@/components/news/NewsAccordion";
import { RefreshOnFocus } from "@/components/news/RefreshOnFocus";
import { getNews } from "@/lib/news";
import { CONTACT, pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "活動消息", description: "掌握沃語各校區最新活動：語言交換、講座、檢定考情報與報名資訊。" });

// 有設定 Google 試算表時最多每 60 秒重新抓一次（ISR），編輯者改完不用重新部署
// （segment config 必須是字面值，跟 lib/news.ts 的 NEWS_REVALIDATE_SECONDS 保持一致）
export const revalidate = 60;

export default async function Page() {
  const { items, ok } = await getNews();
  return (
    <>
      <RefreshOnFocus />
      {/* HERO */}
      <section className="hero" style={{ backgroundImage: "url('/images/news/banner.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="hero-inner">
          <h1 className="hero-page-title">活動消息</h1>
        </div>
      </section>

      {/* 最新消息列表 */}
      <section className="news-body">
        <img loading="lazy" className="news-deco news-deco--left" src="/images/deco/news-left.png" alt="" />
        <img loading="lazy" className="news-deco news-deco--right" src="/images/deco/news-right.png" alt="" />
        <div className="news-main">
          <div className="news-list-header">
            <h2 className="news-list-title">掌握各校區最新動態</h2>
          </div>
          {items.length > 0 ? (
            <NewsAccordion items={items} />
          ) : (
            <p className="relative rounded-lg bg-[#F8F9FA] px-6 py-10 text-center text-ink-muted dark:bg-[#171e27] dark:text-[#9aa5b3]">
              {ok ? "目前沒有最新消息，敬請期待。" : `最新消息暫時無法載入，請稍後再試，或來電 ${CONTACT.phone} 洽詢。`}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
