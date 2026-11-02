import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/audio/LoginForm";
import { currentAccount } from "@/lib/audio";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "學員登入", description: "沃語語言學校學員登入，收聽各語言聽力教材。" });

export default async function Page() {
  // 保持登入：之前登入過、還沒登出，就直接進音檔頁
  if (await currentAccount()) redirect("/audio");

  return (
    <>
      {/* HERO */}
      <section className="hero hero--login" style={{ backgroundImage: "url('/images/login/banner.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="hero-inner">
          <h1 className="hero-page-title">學員登入</h1>
        </div>
      </section>

      {/* 登入表單 */}
      <section className="login-body">
        <div className="login-box">
          <h2 className="login-title">學員登入</h2>
          <LoginForm />
          <p className="mt-4 text-center text-sm text-ink-muted dark:text-[#9aa5b3]">
            示範帳號：<code className="font-bold">DEMO</code>
          </p>
          <p className="mt-6 text-center text-sm text-ink-muted dark:text-[#9aa5b3]">
            也可以用 LINE 登入{" "}
            <Link href="/member" className="font-bold text-line underline underline-offset-4">
              會員專區
            </Link>
            ，掃碼報到、分享活動給好友。
          </p>
        </div>
      </section>
    </>
  );
}
