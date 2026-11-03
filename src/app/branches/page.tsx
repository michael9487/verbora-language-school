import type { Metadata } from "next";
import { BranchFinder } from "@/components/branches/BranchFinder";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "校區資訊", description: "沃語北部、中部、南部與東部的分校資訊，可依地區和語言篩選（虛構示範）。" });

export default function Page() {
  return (
    <>
      {/* HERO */}
      <section className="hero" style={{ backgroundImage: "url('/images/branches/banner.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="hero-inner">
          <h1 className="hero-page-title">校區資訊</h1>
        </div>
      </section>

      <section className="bg-white dark:bg-(--dk-bg)">
        <div className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 md:py-24">
          <p className="max-w-2xl leading-relaxed text-ink-muted dark:text-(--dk-text-muted)">選擇地區或想學的語言，找到最適合你的分校。每間分校都可以預約參觀，先來看看環境、認識老師。</p>
          <div className="mt-8">
            <BranchFinder />
          </div>
        </div>
      </section>
    </>
  );
}
