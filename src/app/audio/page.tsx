import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AudioLibrary } from "@/components/audio/AudioLibrary";
import { isAdminSession } from "@/lib/admin";
import { getAudioBooks } from "@/lib/audio";
import { getSession } from "@/lib/session";
import { logout } from "../login/actions";

export const metadata: Metadata = {
  title: "語音教學",
  robots: { index: false },
};

export default async function Page() {
  // 頁面由伺服器判斷登入狀態：沒登入、cookie 被改過或已過期，一律請重新登入
  const session = await getSession();
  if (!session) redirect("/login");

  const books = await getAudioBooks(session);
  const heading = session.kind === "demo" ? "示範模式教材" : session.name ? `${session.name} 的教材` : "我的教材";

  return (
    <>
      {/* HERO */}
      <section className="hero hero--login" style={{ backgroundImage: "url('/images/login/banner.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="hero-inner">
          <h1 className="hero-page-title">學員登入</h1>
        </div>
      </section>

      {/* 音檔列表 */}
      <section className="audio-body">
        <div className="audio-container">
          <div className="audio-header">
            <h2 className="audio-semester-title">{heading}</h2>
            {isAdminSession(session) && (
              <Link href="/admin" className="font-bold text-brand underline dark:text-(--dk-link)">
                管理後台
              </Link>
            )}
            <form action={logout}>
              <button type="submit" className="audio-logout cursor-pointer bg-transparent font-[inherit] hover:bg-brand hover:text-white">
                登出
              </button>
            </form>
          </div>

          {!books?.length ? <p className="audio-empty">音檔尚未上傳，請稍後。</p> : <AudioLibrary books={books} />}
        </div>
      </section>
    </>
  );
}
