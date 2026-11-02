import type { Metadata } from "next";
import { PostPhotoClearance } from "@/components/gallery/PostLayoutFixes";
import { PostHeader, PostHero } from "@/components/gallery/PostHeader";
import { pageMetadata } from "@/lib/site";

const TITLE = "為什麼背了單字，還是說不出口";

export const metadata: Metadata = pageMetadata({ title: `${TITLE} - 學習專欄` });

export default function Page() {
  return (
    <>
      <PostHero image="/images/journal/banner-2.jpg" />
      {/* 文章內文 */}
      <section className="post-body">
        <img loading="lazy" className="post-deco post-deco--right-photo" src="/images/journal/post1-right.jpg" alt="" />
        <img loading="lazy" className="post-deco post-deco--right-illust" src="/images/deco/post1.png" alt="" />
        <img loading="lazy" className="post-deco post-deco--left-photo" src="/images/journal/post1-left.jpg" alt="" />
        <article className="post-main">
          <PostHeader title={TITLE} role="教學總監" />
          <div className="post-text">
            <p>很多學員都有過同樣的經驗：單字書背完一本，考試也拿到不錯的分數，真的遇到外國朋友時，腦袋卻一片空白。問題通常不是單字量不夠，而是這些字從來沒有被「用」過。</p>
            <p>想讓單字從「認得」變成「說得出來」，可以試試四個方法：</p>
            <ol className="post-list">
              <li>
                <span className="post-list-head">整句一起記：</span>
                {" 不要只背單字和中文意思，把它放進一句你真的會說的話裡，開口時才不用臨時組句子。 "}
              </li>
              <li>
                <span className="post-list-head">先聽再跟讀：</span>
                {" 跟著音檔模仿語調和節奏。耳朵聽慣了，嘴巴才會自然跟上。 "}
              </li>
              <li>
                <span className="post-list-head">馬上用一次：</span>
                {" 學到新字的當天，就用它寫一則短訊或跟同學說一句。用過的字，記憶最深刻。 "}
              </li>
              <li>
                <span className="post-list-head">隔天再複習：</span>
                {" 間隔複習比一次背很久更有效，每天五分鐘，勝過週末熬夜兩小時。 "}
              </li>
            </ol>
          </div>
          <div className="post-section">
            <h2 className="post-section-title">開口，才是最好的練習</h2>
            <p>語言不是知識，而是技能。就像游泳不能只看教學影片，學語言也一定要下水。不用等到準備好才開口，說錯了也沒關係，每一次修正，都讓你離流利更近一步。</p>
          </div>
        </article>
      </section>
      <PostPhotoClearance />
    </>
  );
}
