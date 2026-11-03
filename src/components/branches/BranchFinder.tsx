"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { FilterChip } from "@/components/FilterChip";
import { LANGUAGES, REGIONS, type Branch } from "@/data/branches";

const ICON_PATHS = {
  pin: "M12 22s7-7.1 7-13a7 7 0 1 0-14 0c0 5.900 7 13 7 13Zm0-10.500a2.500 2.500 0 1 0 0-5 2.500 2.500 0 0 0 0 5Z",
  train: "M8 19l-2 3m10-3 2 3M7 3h10a2 2 0 0 1 2 2v10a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V5a2 2 0 0 1 2-2Zm-2 8h14M9 15h.01M15 15h.01",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-15v5l3 2",
  phone: "M22 16.900v3a2 2 0 0 1-2.200 2 19.800 19.800 0 0 1-8.600-3.100 19.500 19.500 0 0 1-6-6A19.800 19.800 0 0 1 2.100 4.200 2 2 0 0 1 4.100 2h3a2 2 0 0 1 2 1.700c.1 1 .4 1.900.7 2.800a2 2 0 0 1-.5 2.100L8.100 9.900a16 16 0 0 0 6 6l1.300-1.300a2 2 0 0 1 2.100-.4c.9.3 1.800.6 2.800.7a2 2 0 0 1 1.700 2Z",
};

function InfoRow({ icon, children }: { icon: keyof typeof ICON_PATHS; children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <svg viewBox="0 0 24 24" className="mt-0.5 size-5 shrink-0 text-brand dark:text-(--dk-link)" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={ICON_PATHS[icon]} />
      </svg>
      <span>{children}</span>
    </li>
  );
}

function BranchCard({ branch, lang }: { branch: Branch; lang: string | null }) {
  return (
    <article className="flex flex-col rounded-[28px_28px_28px_0] border border-(--neutral-border) bg-white p-6 md:p-7 dark:bg-(--dk-surface)">
      <h3 className="text-xl font-bold text-ink dark:text-(--dk-text-strong)">{branch.name}</h3>
      <p className="mt-2 leading-relaxed text-ink-muted dark:text-(--dk-text-muted)">{branch.feature}</p>

      <ul className="mt-4 flex list-none flex-wrap gap-2" aria-label="開設語言">
        {branch.langs.map((l) => (
          <li
            key={l}
            className={`rounded-full px-3 py-0.5 text-sm ${
              l === lang ? "bg-brand text-white" : "bg-brand-tint/60 text-brand-dark dark:bg-(--dk-surface-2) dark:text-(--dk-link)"
            }`}
          >
            {l}
          </li>
        ))}
      </ul>

      <ul className="mt-5 mb-6 list-none space-y-2.5 text-sm text-ink dark:text-(--dk-text)">
        <InfoRow icon="pin">{branch.address}</InfoRow>
        <InfoRow icon="train">{branch.transit}</InfoRow>
        <InfoRow icon="clock">{branch.hours}</InfoRow>
        <InfoRow icon="phone">{branch.phone}</InfoRow>
      </ul>

      <div className="mt-auto grid grid-cols-2 gap-3">
        <Link href={`/contact?branch=${encodeURIComponent(branch.name)}`} className="rounded-full bg-brand px-4 py-2.5 text-center font-bold text-white transition-colors hover:bg-brand-dark">
          預約參觀
        </Link>
        <a href={`tel:${branch.tel}`} className="rounded-full border border-brand px-4 py-2.5 text-center font-bold text-brand transition-colors hover:bg-brand-tint/60 dark:border-(--dk-link) dark:text-(--dk-link) dark:hover:bg-(--dk-surface-2)">
          撥打電話
        </a>
      </div>
    </article>
  );
}

export function BranchFinder() {
  const [regionId, setRegionId] = useState<string | null>(null);
  const [lang, setLang] = useState<string | null>(null);

  const groups = REGIONS.filter((r) => regionId === null || r.id === regionId)
    .map((r) => ({ ...r, branches: r.branches.filter((b) => lang === null || b.langs.includes(lang)) }))
    .filter((r) => r.branches.length > 0);
  const total = groups.reduce((sum, r) => sum + r.branches.length, 0);

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="依地區篩選分校">
          <span className="mr-1 w-full text-sm font-bold text-ink sm:w-12 dark:text-(--dk-text-strong)">地區</span>
          <FilterChip label="全部" active={regionId === null} onClick={() => setRegionId(null)} />
          {REGIONS.map((r) => (
            <FilterChip key={r.id} label={r.name.replace("校區", "")} active={regionId === r.id} onClick={() => setRegionId(r.id)} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="依語言篩選分校">
          <span className="mr-1 w-full text-sm font-bold text-ink sm:w-12 dark:text-(--dk-text-strong)">語言</span>
          <FilterChip label="全部" active={lang === null} onClick={() => setLang(null)} />
          {LANGUAGES.map((l) => (
            <FilterChip key={l} label={l} active={lang === l} onClick={() => setLang(l)} />
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-ink-muted dark:text-(--dk-text-muted)" aria-live="polite">
        共 {total} 間分校
      </p>

      {groups.map((region) => (
        <section key={region.id} className="mt-8">
          <h2 className="text-2xl font-bold text-ink dark:text-(--dk-text-strong)">{region.name}</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {region.branches.map((branch) => (
              <BranchCard key={branch.name} branch={branch} lang={lang} />
            ))}
          </div>
        </section>
      ))}

      {total === 0 && (
        <div className="mt-8 rounded-[28px_28px_28px_0] bg-brand-tint/60 p-7 dark:bg-(--dk-surface)">
          <p className="font-bold text-ink dark:text-(--dk-text-strong)">這個地區目前沒有開{lang}課程</p>
          <p className="mt-2 text-ink-muted dark:text-(--dk-text-muted)">
            可以換個地區看看，或
            <Link href="/contact" className="text-brand underline underline-offset-4 dark:text-(--dk-link)">
              留言詢問線上課程
            </Link>
            。
          </p>
        </div>
      )}
    </>
  );
}
