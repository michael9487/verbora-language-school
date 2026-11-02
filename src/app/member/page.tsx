import type { Metadata } from "next";
import { MemberArea } from "@/components/liff/MemberArea";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "會員專區", description: "使用 LINE 登入沃語會員專區：活動掃碼報到、分享活動給好友。" });

// LIFF 的 Endpoint URL 設成這一頁（https://你的網域/member）
export default function Page() {
  return (
    <>
      <section className="hero hero--login" style={{ backgroundImage: "url('/images/login/banner.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="hero-inner">
          <h1 className="hero-page-title">會員專區</h1>
        </div>
      </section>
      <section className="bg-white px-4 py-12 md:py-20 dark:bg-[#11161d]">
        <div className="mx-auto max-w-3xl">
          <MemberArea />
        </div>
      </section>
    </>
  );
}
