import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AudioLibrary } from "@/components/audio/AudioLibrary";
import { currentAccount, getAudioBooks } from "@/lib/audio";
import { ACCOUNTS } from "@/lib/audio-catalog";
import { logout } from "../login/actions";

export const metadata: Metadata = {
  title: "語音教學",
  robots: { index: false },
};

export default async function Page() {
  // 沒登入或帳號已不在清單裡，一律請重新登入
  const account = await currentAccount();
  if (!account) redirect("/login");

  const books = await getAudioBooks(account);

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
            <h2 className="audio-semester-title">{ACCOUNTS[account].label}教材</h2>
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
