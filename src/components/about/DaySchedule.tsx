"use client";

import { useState } from "react";
import { FilterChip } from "@/components/FilterChip";

// 「沃語的一天」：週一到週五每天的時段都一樣，所以只列一天，分上午、下午、晚上三欄。
// 選了語言之後，不相關的時段淡化而不是隱藏，還看得出一整天的安排。
type Slot = { time: string; title: string; langs?: string[] };

const PERIODS: { name: string; slots: Slot[] }[] = [
  {
    name: "上午",
    slots: [
      { time: "09:30–10:00", title: "語言咖啡時間" },
      { time: "10:00–12:00", title: "英語、日語平日班", langs: ["英語", "日語"] },
    ],
  },
  {
    name: "下午",
    slots: [
      { time: "12:00–13:30", title: "午間線上會話" },
      { time: "13:30–15:30", title: "韓語、法語平日班", langs: ["韓語", "法語"] },
      { time: "15:30–16:00", title: "老師諮詢時段" },
      { time: "16:00–18:00", title: "德語、西語平日班", langs: ["德語", "西語"] },
    ],
  },
  {
    name: "晚上",
    slots: [
      { time: "18:00–19:00", title: "自習與聽力教室開放" },
      { time: "19:00–21:00", title: "在職進修夜間班" },
    ],
  },
];

const LANGS = ["英語", "日語", "韓語", "法語", "德語", "西語"];

export function DaySchedule() {
  const [lang, setLang] = useState<string | null>(null);

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label="依語言篩選時段">
        {[null, ...LANGS].map((l) => (
          <FilterChip key={l ?? "all"} label={l ?? "全部"} active={lang === l} onClick={() => setLang(l)} />
        ))}
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-3 md:gap-6">
        {PERIODS.map((period) => (
          <div key={period.name}>
            <p className="mb-3 text-sm font-bold tracking-widest text-brand dark:text-(--dk-link)">{period.name}</p>
            <ol className="list-none space-y-3 border-l-2 border-brand-tint pl-5 dark:border-(--dk-border)">
              {period.slots.map((slot) => {
                const dimmed = lang !== null && !!slot.langs && !slot.langs.includes(lang);
                const highlighted = lang !== null && !!slot.langs?.includes(lang);
                return (
                  <li
                    key={slot.time}
                    className={`relative rounded-2xl bg-white p-4 shadow-sm transition-opacity dark:bg-(--dk-surface-2) ${dimmed ? "opacity-35" : ""} ${
                      highlighted ? "ring-2 ring-brand" : ""
                    }`}
                  >
                    <span className="absolute top-5 -left-[27px] size-3 rounded-full border-2 border-white bg-brand dark:border-(--dk-surface)" aria-hidden="true" />
                    <p className="text-sm text-ink-muted dark:text-(--dk-text-muted)">{slot.time}</p>
                    <p className="mt-1 font-bold text-ink dark:text-(--dk-text-strong)">{slot.title}</p>
                    {!slot.langs && <p className="mt-1 text-xs text-ink-muted dark:text-(--dk-text-muted)">所有學員都可參加</p>}
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </>
  );
}
