import type { Metadata } from "next";
import { PostHeader, PostHero } from "@/components/gallery/PostHeader";
import { pageMetadata } from "@/lib/site";

const TITLE = "AI 時代，還需要學語言嗎";

export const metadata: Metadata = pageMetadata({ title: `${TITLE} - 學習專欄` });

export default function Page() {
  return (
    <>
      <PostHero image="/images/journal/banner-3.jpg" />
      {/* 文章內文 */}
      <section className="post-body">
        <img loading="lazy" className="post-deco post2-deco--left-illust" src="/images/deco/post2.png" alt="" />
        <img loading="lazy" className="post-deco post2-deco--right-photo" src="/images/journal/post2-right.jpg" alt="" />
        <article className="post-main">
          <PostHeader title={TITLE} role="英語老師" />
          <div className="post-text">
            <p>即時翻譯越來越好用，為什麼還要花時間學外語？我常跟學員說，翻譯工具能傳達意思，但傳達不了你這個人。當你用對方的語言說一句笑話、問候一聲，那份心意是任何工具都無法代勞的。</p>
            <p>學語言的過程，其實也在訓練思考。你會開始注意別人怎麼表達、換個角度理解世界，也更能體會不同文化的差異。這些能力，在 AI 能處理更多事情的時代，反而更加珍貴。</p>
            <p>最好的做法不是選邊站，而是讓 AI 成為學習夥伴：用它練對話、改作文、整理單字，再把省下來的時間，留給真人之間的交流。工具會一直進步，而願意開口的人，永遠走得更遠。</p>
          </div>
        </article>
      </section>
    </>
  );
}
