import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { DaySchedule } from "@/components/about/DaySchedule";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "關於我們", description: "認識沃語：語言課程資訊、每日時段與企業語言培訓。" });

// 跟首頁照片同一套對話框形狀：直角在左下
const BUBBLE = "rounded-[28px_28px_28px_0]";

const ICON_PATHS = {
  people: "M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm13 9v-1a4 4 0 0 0-3-3.87M16 4.13a3 3 0 0 1 0 5.74",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-15v5l3 2",
  wallet: "M3 7a2 2 0 0 1 2-2h13v4M3 7v10a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2Zm14 7h.01",
};

const FACTS: { icon: keyof typeof ICON_PATHS; label: string; lines: string[] }[] = [
  { icon: "people", label: "招生對象", lines: ["高中生以上、成人學習者"] },
  { icon: "clock", label: "上課時間", lines: ["平日班 10:00–12:00、19:00–21:00", "週末班 09:30–16:30"] },
  { icon: "wallet", label: "收費及退費", lines: ["依各課程公告為準", "開課前可全額退費"] },
];

const STEPS = [
  { title: "預約諮詢", desc: "線上或電話預約" },
  { title: "程度分析", desc: "免費分析與目標訪談" },
  { title: "建議班級", desc: "老師建議學習路線" },
  { title: "試聽一堂", desc: "先體驗再決定" },
  { title: "完成報名", desc: "領取教材" },
  { title: "收到說明信", desc: "開課前寄出" },
  { title: "開課！", desc: "開始開口說" },
];

const TOPICS = [
  { title: "商務 Email 與電話溝通", desc: "寫得清楚、講得得體，減少來回確認。" },
  { title: "英語簡報與會議主持", desc: "從開場、提問到收尾，練到敢上台。" },
  { title: "跨文化溝通與客戶接待", desc: "了解對方的習慣，接待和談判更順利。" },
];

const CORPORATE_FLOW = ["需求訪談", "程度檢測", "客製課程", "開課", "成效報告"];

function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-bold tracking-[0.2em] text-brand dark:text-(--dk-link)">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold text-ink md:text-4xl dark:text-(--dk-text-strong)">{title}</h2>
      {children && <p className="mt-4 leading-relaxed text-ink-muted dark:text-(--dk-text-muted)">{children}</p>}
    </div>
  );
}

function Icon({ name }: { name: keyof typeof ICON_PATHS }) {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}

export default function Page() {
  return (
    <>
      {/* HERO */}
      <section className="hero" style={{ backgroundImage: "url('/images/about/hero.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="hero-inner">
          <h1 className="hero-page-title">關於我們</h1>
        </div>
      </section>

      {/* 語言課程：重點卡片＋報名流程 */}
      <section className="bg-white dark:bg-(--dk-bg)">
        <div className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 md:py-24">
          <SectionHeading eyebrow="COURSES" title="語言課程">
            小班制、依程度分班。第一次來不用先決定班級，程度分析之後老師會幫你安排。
          </SectionHeading>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {FACTS.map((fact) => (
              <div key={fact.label} className={`${BUBBLE} bg-brand-tint/60 p-6 dark:bg-(--dk-surface)`}>
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-white text-brand dark:bg-(--dk-surface-2) dark:text-(--dk-link)">
                  <Icon name={fact.icon} />
                </span>
                <p className="mt-4 font-bold text-ink dark:text-(--dk-text-strong)">{fact.label}</p>
                {fact.lines.map((line) => (
                  <p key={line} className="mt-1 text-sm text-ink-muted dark:text-(--dk-text-muted)">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <h3 className="mt-16 text-2xl font-bold text-ink dark:text-(--dk-text-strong)">報名只要七步</h3>
          {/* 桌機橫向，平板和手機直向（平板橫排七欄太擠）；連接線是 ol 的 before */}
          <ol className="relative mt-8 grid list-none gap-6 before:absolute before:top-0 before:bottom-0 before:left-5 before:w-0.5 before:bg-brand-tint lg:grid-cols-7 lg:gap-3 lg:before:top-5 lg:before:right-[7%] lg:before:bottom-auto lg:before:left-[7%] lg:before:h-0.5 lg:before:w-auto dark:before:bg-(--dk-border)">
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative flex items-start gap-4 lg:flex-col lg:items-center lg:gap-3 lg:text-center">
                <span className="relative z-10 inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-brand font-bold text-white">{i + 1}</span>
                <span>
                  <span className="block font-bold text-ink dark:text-(--dk-text-strong)">{step.title}</span>
                  <span className="mt-1 block text-sm text-ink-muted dark:text-(--dk-text-muted)">{step.desc}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 沃語的一天 */}
      <section className="bg-[#F8F9FA] dark:bg-(--dk-surface)">
        <div className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 md:py-24">
          <SectionHeading eyebrow="A DAY AT VERBORA" title="沃語的一天">
            週一到週五的固定時段。選一個語言，看看你的班級排在什麼時候。
          </SectionHeading>
          <div className="mt-8">
            <DaySchedule />
          </div>
          <p className="mt-8 text-sm text-ink-muted dark:text-(--dk-text-muted)">※ 以上為示範內容，實際課表以各校區公告為準。</p>
        </div>
      </section>

      {/* 企業培訓 */}
      <section className="bg-white dark:bg-(--dk-bg)">
        <div className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 md:py-24">
          <div className="grid gap-12 md:grid-cols-[1fr_1.3fr] md:items-start">
            <div>
              <SectionHeading eyebrow="FOR TEAMS" title="企業培訓">
                給需要外語溝通的團隊、新進人員和外派人員。可以在企業內訓、沃語校區或線上上課，時間依部門排班彈性安排。
              </SectionHeading>
              <Link href="/contact" className="mt-8 inline-block rounded-full bg-brand px-7 py-3 font-bold text-white transition-colors hover:bg-brand-dark">
                聯絡企業方案
              </Link>
            </div>
            <div className="grid gap-4">
              {TOPICS.map((topic, i) => (
                <div key={topic.title} className={`${BUBBLE} flex gap-4 border border-(--neutral-border) p-5 dark:bg-(--dk-surface)`}>
                  <span className="text-3xl leading-none font-bold text-brand/40 dark:text-(--dk-link)/50">0{i + 1}</span>
                  <span>
                    <span className="block font-bold text-ink dark:text-(--dk-text-strong)">{topic.title}</span>
                    <span className="mt-1 block text-sm text-ink-muted dark:text-(--dk-text-muted)">{topic.desc}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 rounded-3xl bg-[#F8F9FA] p-6 dark:bg-(--dk-surface)">
            <p className="text-sm font-bold text-ink dark:text-(--dk-text-strong)">合作流程</p>
            <ol className="mt-4 flex list-none flex-wrap items-center gap-2">
              {CORPORATE_FLOW.map((step, i) => (
                <li key={step} className="flex items-center gap-2">
                  <span className="rounded-full bg-white px-4 py-1.5 text-sm text-ink shadow-sm dark:bg-(--dk-surface-2) dark:text-(--dk-text)">{step}</span>
                  {i < CORPORATE_FLOW.length - 1 && (
                    <span className="text-brand dark:text-(--dk-link)" aria-hidden="true">
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
