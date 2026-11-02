"use client";

import type { Liff } from "@line/liff";
import { useCallback, useEffect, useRef, useState } from "react";
import { parseCheckinCode } from "@/lib/checkin";
import { useLiff, useLiffProfile } from "./LiffProvider";
import { ShareButton } from "./ShareButton";

const OA_ID = process.env.NEXT_PUBLIC_LINE_OA_ID;
const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID;

type CheckinResult = { kind: "ok" | "already" | "error"; text: string } | null;

const card = "rounded-2xl border border-[#E8ECF0] bg-white p-6 shadow-sm dark:border-[#2c3644] dark:bg-[#171e27]";
const btn =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border-0 px-6 py-3 text-base font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export function MemberArea() {
  const { state } = useLiff();

  if (state.status === "idle" || state.status === "loading") {
    return (
      <div className={`${card} flex animate-pulse items-center gap-4`} aria-busy="true">
        <div className="size-16 rounded-full bg-[#E8ECF0] dark:bg-[#2c3644]" />
        <div className="h-6 w-48 rounded bg-[#E8ECF0] dark:bg-[#2c3644]" />
        <span className="sr-only">正在連線 LINE…</span>
      </div>
    );
  }
  if (state.status === "unconfigured") {
    return (
      <div className={card}>
        <p className="font-bold">LINE 會員功能尚未設定</p>
        <p className="mt-2 text-ink-muted dark:text-[#9aa5b3]">
          請在環境變數設定 <code>NEXT_PUBLIC_LIFF_ID</code>（設定方式見 README）。
        </p>
      </div>
    );
  }
  if (state.status === "error") {
    return (
      <div className={card} role="alert">
        <p className="font-bold text-[#D91E33]">無法連線 LINE</p>
        <p className="mt-2 text-ink-muted dark:text-[#9aa5b3]">{state.message}</p>
      </div>
    );
  }
  if (!state.loggedIn) {
    return (
      <div className={`${card} text-center`}>
        <p className="text-lg font-bold text-ink dark:text-[#e8ebef]">用 LINE 帳號登入會員專區</p>
        <p className="mt-2 text-ink-muted dark:text-[#9aa5b3]">登入後可以掃碼報到活動、把活動分享給 LINE 好友。</p>
        <button
          type="button"
          onClick={() => state.liff.login({ redirectUri: window.location.href })}
          className={`${btn} mt-6 bg-line text-white hover:brightness-95 focus-visible:outline-line`}
        >
          使用 LINE 登入
        </button>
      </div>
    );
  }
  return <LoggedIn liff={state.liff} inClient={state.inClient} />;
}

function LoggedIn({ liff, inClient }: { liff: Liff; inClient: boolean }) {
  const profile = useLiffProfile();
  const [friend, setFriend] = useState<boolean | null>(null);
  const [checkin, setCheckin] = useState<CheckinResult>(null);
  const [busy, setBusy] = useState(false);
  const autoChecked = useRef(false);
  const canScan = liff.isApiAvailable("scanCodeV2");

  // 加好友提醒：需要在 LINE Developers 把 LIFF 連結到官方帳號
  useEffect(() => {
    liff.getFriendship().then(
      (r) => setFriend(r.friendFlag),
      () => setFriend(null),
    );
  }, [liff]);

  const submitCheckin = useCallback(
    async (code: string) => {
      setBusy(true);
      setCheckin(null);
      try {
        const idToken = liff.getIDToken();
        if (!idToken) throw new Error("請在 LIFF 設定勾選 openid 權限");
        const res = await fetch("/api/checkin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken, code }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "報到失敗");
        setCheckin({
          kind: data.status,
          text: data.status === "already" ? `您已經報到過「${data.event.name}」囉！` : `報到成功！歡迎參加「${data.event.name}」`,
        });
      } catch (err) {
        setCheckin({ kind: "error", text: err instanceof Error ? err.message : "報到失敗" });
      } finally {
        setBusy(false);
      }
    },
    [liff],
  );

  // 用手機相機掃 QR Code 進來（網址帶 ?checkin=代碼），登入後自動報到
  useEffect(() => {
    if (autoChecked.current) return;
    autoChecked.current = true;
    const code = parseCheckinCode(window.location.href);
    if (!code) return;
    history.replaceState(null, "", window.location.pathname);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 網址參數只有瀏覽器讀得到，掛載時觸發一次報到請求
    submitCheckin(code);
  }, [submitCheckin]);

  async function scan() {
    try {
      const { value } = await liff.scanCodeV2();
      if (!value) return;
      const code = parseCheckinCode(value);
      if (code) return submitCheckin(code);
      // 不是報到碼：如果是網址（例如教室資訊頁）就打開，其他直接顯示內容
      if (/^https?:\/\//.test(value)) liff.openWindow({ url: value, external: false });
      else setCheckin({ kind: "error", text: `這不是報到 QR Code：${value}` });
    } catch {
      // 使用者取消掃描
    }
  }

  return (
    <div className="grid gap-6">
      {/* 會員資訊 */}
      <div className={`${card} flex items-center gap-4`}>
        {profile?.pictureUrl ? (
          <img src={profile.pictureUrl} alt="" width={64} height={64} className="size-16 rounded-full object-cover" />
        ) : (
          <div className="size-16 rounded-full bg-[#E8ECF0] dark:bg-[#2c3644]" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xl font-bold text-ink dark:text-[#e8ebef]">{profile ? `歡迎回來，${profile.displayName}` : "歡迎回來"}</p>
          {profile?.statusMessage && <p className="truncate text-sm text-ink-muted dark:text-[#9aa5b3]">{profile.statusMessage}</p>}
        </div>
        {!inClient && (
          <button
            type="button"
            onClick={() => {
              liff.logout();
              window.location.reload();
            }}
            className="shrink-0 cursor-pointer rounded-full border border-[#DDE3EC] bg-transparent px-4 py-2 text-sm text-ink-muted dark:border-[#2c3644] dark:text-[#9aa5b3]"
          >
            登出
          </button>
        )}
      </div>

      {/* 加好友提醒 */}
      {friend === false && OA_ID && (
        <div className="flex flex-col items-start gap-3 rounded-2xl bg-[#E9F9EF] p-6 sm:flex-row sm:items-center dark:bg-[#12291b]">
          <p className="flex-1 text-ink dark:text-[#e8ebef]">
            <span className="font-bold">還沒加入 Verbora 官方帳號嗎？</span>
            <br className="sm:hidden" />
            加入好友就能收到最新活動通知。
          </p>
          <a
            href={`https://line.me/R/ti/p/${encodeURIComponent(OA_ID)}`}
            target="_blank"
            rel="noopener"
            className={`${btn} bg-line text-white hover:brightness-95 focus-visible:outline-line`}
          >
            加入好友
          </a>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* 掃碼報到 */}
        <div className={card}>
          <h2 className="text-lg font-bold text-ink dark:text-[#e8ebef]">活動報到</h2>
          <p className="mt-2 text-ink-muted dark:text-[#9aa5b3]">到達活動現場後，掃描報到處的 QR Code 完成報到。</p>
          {canScan ? (
            <button type="button" onClick={scan} disabled={busy} className={`${btn} mt-4 bg-brand text-white hover:bg-[#185CA8] focus-visible:outline-brand`}>
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M3 7V4h3M21 7V4h-3M3 17v3h3M21 17v3h-3M7 12h10" />
              </svg>
              {busy ? "報到中…" : "掃描 QR Code"}
            </button>
          ) : (
            <p className="mt-4 rounded-lg bg-[#F8F9FA] p-3 text-sm text-ink-muted dark:bg-[#1d2530] dark:text-[#9aa5b3]">
              掃碼功能需要在 LINE App 裡開啟
              {LIFF_ID && (
                <>
                  ：
                  <a href={`https://liff.line.me/${LIFF_ID}`} className="font-bold text-line underline">
                    用 LINE 開啟
                  </a>
                </>
              )}
              。也可以直接用手機相機掃報到 QR Code。
            </p>
          )}
          {checkin && (
            <p
              role="status"
              className={`mt-4 rounded-lg p-3 font-bold ${
                checkin.kind === "error" ? "bg-[#FDECEE] text-[#D91E33] dark:bg-[#3a1418] dark:text-[#ff8a95]" : "bg-[#E9F9EF] text-[#0B7A3B] dark:bg-[#12291b] dark:text-[#6ee39b]"
              }`}
            >
              {checkin.text}
            </p>
          )}
        </div>

        {/* 分享給好友 */}
        <div className={card}>
          <h2 className="text-lg font-bold text-ink dark:text-[#e8ebef]">推薦給朋友</h2>
          <p className="mt-2 mb-4 text-ink-muted dark:text-[#9aa5b3]">把沃語語言學校做成精美卡片，分享給 LINE 好友或群組。</p>
          <ShareButton
            card={{
              title: "沃語國際語言學校 Verbora",
              subtitle: "每一種語言，都是通往新世界的門。七種語言課程，陪你開口說。",
              url: "/",
              buttonLabel: "認識沃語",
            }}
          />
        </div>
      </div>
    </div>
  );
}
