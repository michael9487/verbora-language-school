import Link from "next/link";

// 文章頁共用：麵包屑、作者
export function PostHeader({ title, role, bold = false }: { title: string; role: string; bold?: boolean }) {
  return (
    <>
      <nav className="post-breadcrumb" aria-label="麵包屑">
        <Link href="/">首頁</Link>
        <span aria-hidden="true">{">"}</span>
        <Link href="/gallery">學習專欄</Link>
        <span aria-hidden="true">{">"}</span>
        <span className="post-breadcrumb-current">{title}</span>
      </nav>
      <div className="post-author">
        <img loading="lazy" className="post-author-avatar" src="/images/deco/avatar.png" alt="" />
        <span className="post-author-role">{role}</span>
      </div>
      <h1 className={`post-title${bold ? " post-title--bold" : ""}`}>{title}</h1>
    </>
  );
}

export function PostHero({ image, className = "" }: { image: string; className?: string }) {
  return (
    <section className={`hero hero--article ${className}`} style={{ backgroundImage: `url('${image}')`, backgroundSize: "cover", backgroundPosition: "center" }}>
      <div className="hero-inner">
        <h1 className="hero-page-title">學習專欄</h1>
      </div>
    </section>
  );
}
