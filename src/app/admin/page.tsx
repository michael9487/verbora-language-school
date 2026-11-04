import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminForbidden, AdminLoadError, AdminShell, adminCard, formatTime } from "@/components/admin/AdminShell";
import { isAdminSession } from "@/lib/admin";
import { getContactMessages, type MessageStatus } from "@/lib/admin-data";
import { getSession } from "@/lib/session";
import { setMessageStatus } from "./actions";

export const metadata: Metadata = { title: "留言列表｜管理後台", robots: { index: false } };

const FILTERS: { value: MessageStatus | "all"; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "new", label: "未處理" },
  { value: "contacted", label: "已聯絡" },
];

const muted = "text-ink-muted dark:text-[#9aa5b3]";

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  // 資料讀取前就先由伺服器判斷身分
  const session = await getSession();
  if (!session) redirect("/login");
  if (!isAdminSession(session)) return <AdminForbidden />;

  const messages = await getContactMessages();
  const { status } = await searchParams;
  const filter = FILTERS.find((f) => f.value === status)?.value ?? "all";

  return (
    <AdminShell active="/admin">
      {!messages ? (
        <AdminLoadError />
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="篩選留言">
            {FILTERS.map((f) => (
              <Link
                key={f.value}
                href={f.value === "all" ? "/admin" : `/admin?status=${f.value}`}
                aria-current={filter === f.value ? "true" : undefined}
                className={`rounded-full border px-3 py-1 text-sm no-underline ${filter === f.value ? "border-brand font-bold text-brand dark:border-(--dk-link) dark:text-(--dk-link)" : `border-[#DDE3EC] dark:border-[#2c3644] ${muted}`}`}
              >
                {f.label}（{f.value === "all" ? messages.length : messages.filter((m) => m.status === f.value).length}）
              </Link>
            ))}
          </div>

          {messages.filter((m) => filter === "all" || m.status === filter).length === 0 ? (
            <div className={adminCard}>
              <p className={muted}>目前沒有留言。</p>
            </div>
          ) : (
            <ul className="m-0 grid list-none gap-4 p-0">
              {messages
                .filter((m) => filter === "all" || m.status === filter)
                .map((m) => {
                  const contacted = m.status === "contacted";
                  return (
                    <li key={m.id} className={adminCard}>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-bold text-ink dark:text-[#e8ebef]">{m.name}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${contacted ? "bg-[#E9F9EF] text-[#0B7A3B] dark:bg-[#12291b] dark:text-[#6ee39b]" : "bg-[#FFF3DC] text-[#8A5A00] dark:bg-[#33270f] dark:text-[#ffc15e]"}`}>
                          {contacted ? "已聯絡" : "未處理"}
                        </span>
                        <time dateTime={m.created_at} className={`text-sm md:ml-auto ${muted}`}>
                          {formatTime(m.created_at)}
                        </time>
                      </div>
                      <p className={`mt-2 text-sm wrap-anywhere ${muted}`}>
                        <a href={`tel:${m.phone}`} className="text-brand dark:text-(--dk-link)">
                          {m.phone}
                        </a>
                        {" ・ "}
                        <a href={`mailto:${m.email}`} className="text-brand dark:text-(--dk-link)">
                          {m.email}
                        </a>
                        {m.branch && ` ・ ${m.branch}`}
                      </p>
                      <p className="mt-3 whitespace-pre-wrap wrap-anywhere text-ink dark:text-[#e8ebef]">{m.message}</p>
                      <form action={setMessageStatus} className="mt-4">
                        <input type="hidden" name="id" value={m.id} />
                        <input type="hidden" name="status" value={contacted ? "new" : "contacted"} />
                        <button type="submit" className="cursor-pointer rounded-full border border-brand bg-transparent px-4 py-2 font-[inherit] text-sm font-bold text-brand hover:bg-brand-tint/60 dark:border-(--dk-link) dark:text-(--dk-link) dark:hover:bg-(--dk-surface-2)">
                          {contacted ? "改回未處理" : "標記為已聯絡"}
                        </button>
                      </form>
                    </li>
                  );
                })}
            </ul>
          )}
        </>
      )}
    </AdminShell>
  );
}
