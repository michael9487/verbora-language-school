import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/data/journal";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "學習專欄", description: "學習專欄：沃語老師與學員分享的語言學習觀點。" });

export default function Page() {
  return (
    <>
      {/* HERO */}
      <section className="hero hero--gallery" style={{ backgroundImage: "url('/images/journal/banner-1.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="hero-inner">
          <h1 className="hero-page-title">學習專欄</h1>
        </div>
      </section>

      {/* 文章列表 */}
      <section className="gallery-body">
        <div className="gallery-container">
          <p className="gallery-subtitle">
            記錄學習路上的每一步
            <span className="gallery-subtitle-comma">，</span>
            <span className="gallery-subtitle-line">讓語言帶你走得更遠</span>
          </p>
          <div className="gallery-list">
            {ARTICLES.map((article) => (
              <Link className="gallery-article" href={`/gallery/${article.id}`} key={article.id}>
                <div className="gallery-article-text">
                  <div className="gallery-article-author">
                    <img loading="lazy" className="gallery-article-avatar" src="/images/deco/avatar.png" alt="" />
                    <span className="gallery-article-role">{article.role}</span>
                  </div>
                  <div className="gallery-article-content">
                    <h3 className="gallery-article-title">{article.title}</h3>
                    <div className="gallery-article-desc">
                      {article.excerpt.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                    </div>
                  </div>
                </div>
                <picture className="gallery-article-picture">
                  <img loading="lazy" className="gallery-article-photo" src={`/images/journal/article-${article.id}.jpg`} alt={article.title} />
                </picture>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
