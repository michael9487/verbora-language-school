"use client";

import type { Liff } from "@line/liff";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export type LiffProfile = { userId: string; displayName: string; pictureUrl?: string; statusMessage?: string };

type LiffState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "unconfigured" }
  | { status: "error"; message: string }
  | { status: "ready"; liff: Liff; loggedIn: boolean; inClient: boolean };

type LiffContextValue = {
  state: LiffState;
  /** 第一次呼叫時才下載 SDK、執行 liff.init()，之後重複呼叫拿到同一個結果 */
  init: () => Promise<Liff | null>;
};

const LiffContext = createContext<LiffContextValue | null>(null);
const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID;

// 放在 layout，但不會一進站就載入 LIFF SDK（約 200KB）：
// 只有用到 useLiff() 的元件（會員專區、分享按鈕）掛上去時才初始化，其他頁面的效能不受影響
export function LiffProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LiffState>({ status: "idle" });
  const promiseRef = useRef<Promise<Liff | null> | null>(null);

  const init = useCallback(() => {
    if (promiseRef.current) return promiseRef.current;
    if (!LIFF_ID) {
      setState({ status: "unconfigured" });
      return (promiseRef.current = Promise.resolve(null));
    }
    setState({ status: "loading" });
    promiseRef.current = import("@line/liff")
      .then(async ({ default: liff }) => {
        await liff.init({ liffId: LIFF_ID });
        setState({ status: "ready", liff, loggedIn: liff.isLoggedIn(), inClient: liff.isInClient() });
        return liff;
      })
      .catch((err: unknown) => {
        setState({ status: "error", message: err instanceof Error ? err.message : String(err) });
        promiseRef.current = null; // 允許重試
        return null;
      });
    return promiseRef.current;
  }, []);

  const value = useMemo(() => ({ state, init }), [state, init]);
  return <LiffContext.Provider value={value}>{children}</LiffContext.Provider>;
}

/** 不自動初始化，等使用者按下按鈕才呼叫 init()（例如活動消息的分享按鈕） */
export function useLiffContext() {
  const ctx = useContext(LiffContext);
  if (!ctx) throw new Error("useLiff 必須放在 <LiffProvider> 裡");
  return ctx;
}

/** 元件一掛上就初始化 LIFF（會員專區） */
export function useLiff() {
  const ctx = useLiffContext();
  const { init } = ctx;
  useEffect(() => {
    init();
  }, [init]);
  return ctx;
}

/** 登入後取得 LINE 頭像、名字 */
export function useLiffProfile() {
  const { state } = useLiff();
  const [profile, setProfile] = useState<LiffProfile | null>(null);
  const liff = state.status === "ready" && state.loggedIn ? state.liff : null;

  useEffect(() => {
    if (!liff) return;
    let cancelled = false;
    liff.getProfile().then((p) => !cancelled && setProfile(p), () => {});
    return () => {
      cancelled = true;
    };
  }, [liff]);

  return liff ? profile : null;
}
