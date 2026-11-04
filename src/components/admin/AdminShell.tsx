import Link from "next/link";
import type { ReactNode } from "react";

export const adminCard = "rounded-2xl border border-[#E8ECF0] bg-white p-5 shadow-sm md:p-6 dark:border-[#2c3644] dark:bg-[#171e27]";

const TABS = [
  { href: "/admin", label: "留言列表" },
  { href: "/admin/checkins", label: "報到名單" },
];

const dateTime = new Intl.DateTimeFormat("zh-TW", { timeZone: "Asia/Taipei", dateStyle: "short", timeStyle: "short", hour12: false });
export const formatTime = (iso: string) => dateTime.format(new Date(iso));

export function AdminShell({ active, children }: { active?: string; children: ReactNode }) {
  return (
    <section className="min-h-[60vh] bg-[#F8F9FA] px-4 py-10 md:py-16 dark:bg-[#11161d]">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-ink md:text-3xl dark:text-[#e8ebef]">管理後台</h1>
        {active && (
          <nav aria-label="後台分頁" className="mt-5 flex gap-2">
            {TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                aria-current={active === tab.href ? "page" : undefined}
                className={`rounded-full px-4 py-2 font-bold no-underline ${active === tab.href ? "bg-brand text-white" : "bg-white text-ink-muted dark:bg-[#171e27] dark:text-[#9aa5b3]"}`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        )}
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

/** 已登入但不是管理者。不顯示任何資料，也不提示名單怎麼設定 */
export function AdminForbidden() {
  return (
    <AdminShell>
      <div className={adminCard} role="alert">
        <p className="font-bold text-ink dark:text-[#e8ebef]">你沒有權限查看這個頁面</p>
        <p className="mt-2 text-ink-muted dark:text-[#9aa5b3]">管理後台只開放管理者使用。</p>
      </div>
    </AdminShell>
  );
}

export function AdminLoadError() {
  return (
    <div className={adminCard} role="alert">
      <p className="font-bold text-[#D91E33] dark:text-[#ff8a95]">資料暫時無法載入</p>
      <p className="mt-2 text-ink-muted dark:text-[#9aa5b3]">請確認資料庫設定，或稍後再試。</p>
    </div>
  );
}
