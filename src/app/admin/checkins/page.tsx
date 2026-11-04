import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminForbidden, AdminLoadError, AdminShell, adminCard, formatTime } from "@/components/admin/AdminShell";
import { isAdminSession } from "@/lib/admin";
import { getCheckinEvents } from "@/lib/admin-data";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "報到名單｜管理後台", robots: { index: false } };

const muted = "text-ink-muted dark:text-[#9aa5b3]";

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!isAdminSession(session)) return <AdminForbidden />;

  const events = await getCheckinEvents();

  return (
    <AdminShell active="/admin/checkins">
      {!events ? (
        <AdminLoadError />
      ) : events.length === 0 ? (
        <div className={adminCard}>
          <p className={muted}>目前沒有活動。</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <section key={event.code} className={adminCard}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-lg font-bold text-ink dark:text-[#e8ebef]">{event.name}</h2>
                <span className="font-bold text-brand dark:text-(--dk-link)">{event.checkins.length} 人報到</span>
              </div>
              <p className={`mt-1 text-sm wrap-anywhere ${muted}`}>
                {event.code}
                {event.location && ` ・ ${event.location}`}
                {event.ends_at && ` ・ 報到截止 ${formatTime(event.ends_at)}`}
              </p>
              {event.checkins.length > 0 ? (
                <ul className="mt-4 mb-0 list-none divide-y divide-[#E8ECF0] p-0 dark:divide-[#2c3644]">
                  {event.checkins.map((checkin) => (
                    <li key={checkin.id} className="flex flex-wrap justify-between gap-x-4 py-2">
                      <span className="text-ink dark:text-[#e8ebef]">{checkin.display_name || "（未提供名稱）"}</span>
                      <time dateTime={checkin.checked_in_at} className={`text-sm ${muted}`}>
                        {formatTime(checkin.checked_in_at)}
                      </time>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={`mt-4 ${muted}`}>還沒有人報到。</p>
              )}
            </section>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
