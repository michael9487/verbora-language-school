import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { pageMetadata } from "@/lib/site";
import { demoLogin } from "./actions";

export const metadata: Metadata = pageMetadata({ title: "學員登入", description: "使用 LINE 登入沃語語言學校，收聽各語言聽力教材。" });

const button = "flex w-full cursor-pointer items-center justify-center rounded-full px-6 py-3 text-base font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2";

export default async function Page() {
  // 保持登入：之前登入過、還沒登出，就直接進音檔頁
  if (await getSession()) redirect("/audio");

  return (
    <>
      {/* HERO */}
      <section className="hero hero--login" style={{ backgroundImage: "url('/images/login/banner.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="hero-inner">
          <h1 className="hero-page-title">學員登入</h1>
        </div>
      </section>

      {/* 登入方式 */}
      <section className="login-body">
        <div className="login-box">
          <h2 className="login-title">學員登入</h2>
          <p className="text-center text-ink-muted dark:text-[#9aa5b3]">使用 LINE 帳號登入，收聽七種語言的聽力教材。</p>
          <Link href="/member?to=audio" className={`${button} mt-6 bg-line text-white no-underline hover:brightness-95 focus-visible:outline-line`}>
            使用 LINE 登入
          </Link>
          <form action={demoLogin} className="mt-3">
            <button
              type="submit"
              className={`${button} border border-brand bg-transparent font-[inherit] text-brand hover:bg-brand-tint/60 focus-visible:outline-brand dark:border-(--dk-link) dark:text-(--dk-link) dark:hover:bg-(--dk-surface-2)`}
            >
              以示範模式瀏覽
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-ink-muted dark:text-[#9aa5b3]">示範模式不需要帳號，只能使用公開的示範內容。</p>
        </div>
      </section>
    </>
  );
}
