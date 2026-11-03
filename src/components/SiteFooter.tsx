import Link from "next/link";
import { REGIONS } from "@/data/branches";
import { CONTACT, NAV_ITEMS } from "@/lib/site";

// 有設定 LINE 官方帳號就顯示加好友按鈕，沒有就導到聯絡表單
const OA_ID = process.env.NEXT_PUBLIC_LINE_OA_ID;

const LEGAL_LINKS = [
  { href: "/privacy", label: "隱私權政策" },
  { href: "/terms", label: "服務條款" },
];

const linkClass = "transition-colors hover:text-white";

export function SiteFooter() {
  return (
    <footer className="bg-brand-dark text-white/75 dark:bg-[#0b1018]">
      <div className="mx-auto max-w-[1100px] px-5 pt-14 sm:px-8">
        {/* 對話框形狀的 CTA，跟首頁照片同一套形狀 */}
        <div className="flex flex-col items-start gap-5 rounded-[32px_32px_32px_0] bg-white/10 p-7 sm:p-9 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-2xl font-bold text-white">想先聊聊再決定？</p>
            <p className="mt-2">
              {OA_ID ? "加入 LINE 好友，課程、活動和體驗課消息第一時間通知你。" : "留下聯絡方式，我們幫你安排程度分析和體驗課。"}
            </p>
          </div>
          {OA_ID ? (
            <a
              href={`https://line.me/R/ti/p/${encodeURIComponent(OA_ID)}`}
              className="shrink-0 rounded-full bg-line px-7 py-3 font-bold text-white transition-opacity hover:opacity-90"
            >
              加入 LINE 好友
            </a>
          ) : (
            <Link href="/contact" className="shrink-0 rounded-full bg-white px-7 py-3 font-bold text-brand-dark transition-opacity hover:opacity-90">
              預約課程諮詢
            </Link>
          )}
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 text-white">
              <img src="/favicon.svg" alt="" className="size-10" />
              <span>
                <span className="block text-xl font-bold leading-tight">Verbora</span>
                <span className="block text-sm">沃語國際語言學校</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed">每一種語言，都是通往新世界的門。</p>
          </div>

          <nav aria-label="頁尾導覽">
            <p className="mb-3 font-bold text-white">探索</p>
            <ul className="list-none space-y-2 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/member" className={linkClass}>
                  會員專區
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="mb-3 font-bold text-white">校區</p>
            <ul className="list-none space-y-2 text-sm">
              {REGIONS.map((region) => (
                <li key={region.id}>
                  <Link href="/branches" className={linkClass}>
                    {region.name}（{region.branches.length}）
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-1">
            <p className="mb-3 font-bold text-white">聯絡我們</p>
            <ul className="list-none space-y-2 text-sm">
              <li>{CONTACT.address}</li>
              <li>
                <a href={`tel:${CONTACT.phone.replace(/\D/g, "")}`} className={linkClass}>
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`} className={`${linkClass} break-all`}>
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <Link href="/contact" className={`${linkClass} underline underline-offset-4`}>
                  填寫聯絡表單
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 py-6 text-xs md:flex-row md:items-center md:justify-between">
          <p>© 2026 Verbora 沃語國際語言學校。本站為作品集示範，品牌、地址、電話與活動皆為虛構。</p>
          <ul className="flex list-none gap-5">
            {LEGAL_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
