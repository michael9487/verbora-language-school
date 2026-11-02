import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "隱私權政策", description: "沃語國際語言學校隱私權政策（示範內容）。" });

export default function Page() {
  return (
    <section className="policy-body">
      <div className="policy-container">
        <nav className="policy-breadcrumb" aria-label="麵包屑">
          <Link href="/">首頁</Link>
          <span aria-hidden="true">{">"}</span>
          <span className="policy-breadcrumb-current">隱私權政策</span>
        </nav>
        <h1 className="policy-title">隱私權政策</h1>
        <p className="policy-text">本網站為作品集示範，不收集刷卡與財務資料。線上留言僅用於展示表單功能，請勿填寫真實個人資料。深色模式等偏好設定只儲存在您的瀏覽器中。</p>
      </div>
    </section>
  );
}
