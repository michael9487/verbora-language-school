import type { Metadata } from "next";
import { PostHeader, PostHero } from "@/components/gallery/PostHeader";
import { InlineIllustWrap } from "@/components/gallery/PostLayoutFixes";
import { pageMetadata } from "@/lib/site";

const TITLE = "三十五歲才開始學日語";

export const metadata: Metadata = pageMetadata({ title: `${TITLE} - 學習專欄` });

export default function Page() {
  return (
    <>
      <PostHero image="/images/journal/banner-4.jpg" className="hero--post3" />
      {/* 文章內文 */}
      <section className="post-body">
        <picture className="post-deco-picture">
          <source media="(max-width: 767px)" srcSet="/images/journal/post3-left-mobile.jpg" />
          <img loading="lazy" className="post-deco post3-deco--left-photo" src="/images/journal/post3-left.jpg" alt="" />
        </picture>
        <img loading="lazy" className="post-deco post3-deco--right-photo" src="/images/journal/post3-right.jpg" alt="" />
        <img loading="lazy" className="post-deco post3-deco--right-illust" src="/images/deco/post3.png" alt="" />
        <article className="post-main">
          <PostHeader title={TITLE} role="學員分享" bold />
          <div className="post-text">
            <p>
              三十五歲那年，我因為一趟東京出差，在車站看著時刻表完全不知所措。那天晚上回到飯店，我下載了五十音表，決定給自己一年的時間。
              <img loading="lazy" className="post3-inline-illust" src="/images/deco/post3.png" alt="" />
            </p>
            <p>剛開始真的很挫折。下班後坐在教室，旁邊都是比我年輕十歲的同學，連最簡單的自我介紹都結結巴巴。幸好老師告訴我，成人學語言的優勢不是記憶力，而是知道自己為什麼要學。</p>
            <p>一年後，我第一次用日語跟客戶談完整場會議，雖然句子不算漂亮，但對方笑著說「日本語、上手ですね」。那一刻我知道，開始永遠不嫌晚。謝謝一路陪伴我的老師和同學。</p>
          </div>
        </article>
      </section>
      <InlineIllustWrap />
    </>
  );
}
