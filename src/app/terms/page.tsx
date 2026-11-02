import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "服務條款", description: "沃語國際語言學校服務條款（示範內容）。" });

export default function Page() {
  return (
    <section className="policy-body">
      <div className="policy-container">
        <nav className="policy-breadcrumb" aria-label="麵包屑">
          <Link href="/">首頁</Link>
          <span aria-hidden="true">{">"}</span>
          <span className="policy-breadcrumb-current">服務條款</span>
        </nav>
        <h1 className="policy-title">服務條款</h1>
        <p className="policy-text">本網站為作品集示範，品牌、校區、課程與活動皆為虛構，不提供實際服務。網站使用的圖片與音檔為公有領域或 CC0 授權素材。</p>
      </div>
    </section>
  );
}
