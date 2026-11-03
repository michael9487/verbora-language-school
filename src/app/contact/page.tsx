import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ContactForm, ContactFormWithPreset } from "@/components/ContactForm";
import { CONTACT, pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "聯絡我們", description: "沃語國際語言學校聯絡資訊與線上聯絡表單。" });

export default function Page() {
  return (
    <>
      {/* 聯絡我們 */}
      <section className="policy-body">
        <div className="policy-container">
          <nav className="policy-breadcrumb" aria-label="麵包屑">
            <Link href="/">首頁</Link>
            <span aria-hidden="true">{">"}</span>
            <span className="policy-breadcrumb-current">聯絡我們</span>
          </nav>
          <h1 className="policy-title">聯絡我們</h1>
          <p className="policy-text policy-text--boxed">{`沃語國際語言學校（虛構示範）\n地址：${CONTACT.address}\n電話：${CONTACT.phone}\nE-mail： ${CONTACT.email}`}</p>

          {/* 新增：線上聯絡表單（Tailwind + Server Action，送出後存進 Supabase） */}
          <section aria-labelledby="contact-form-title" className="mt-14">
            <h2 id="contact-form-title" className="mb-2 text-center text-2xl font-bold text-ink dark:text-[#e8ebef]">
              線上留言
            </h2>
            <p className="mb-8 text-center text-ink-muted dark:text-[#9aa5b3]">留下您的聯絡方式與問題，我們會盡快回覆。</p>
            {/* 表單維持預先渲染；瀏覽器讀到網址參數後再換成帶入分校的版本 */}
            <Suspense fallback={<ContactForm />}>
              <ContactFormWithPreset />
            </Suspense>
          </section>
        </div>
      </section>
    </>
  );
}
