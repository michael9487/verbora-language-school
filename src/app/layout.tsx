import type { Metadata, Viewport } from "next";
import { Noto_Sans_TC } from "next/font/google";
import Script from "next/script";
import { BackToTop } from "@/components/BackToTop";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ThemeToggle, themeInitScript } from "@/components/ThemeToggle";
import { LiffProvider } from "@/components/liff/LiffProvider";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

// next/font 會在 build 時下載並自己托管字型，不會擋住畫面渲染
// 不指定 weight 就會用可變字型（一組檔案涵蓋 400/500/700），@font-face 從 325 個減到約 1/3
const notoSansTC = Noto_Sans_TC({
  display: "swap",
  preload: false, // 中文字型檔很大，依實際用到的字分段載入，不預先下載
  variable: "--font-noto-sans-tc",
});

const description = "沃語國際語言學校（Verbora）：英語、日語、韓語、法語、德語、西班牙語、華語七種語言課程，小班制陪你開口說。本站為作品集示範。";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s - ${SITE_NAME}` },
  description,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description,
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#11161d" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 深色模式的 class 由 themeInitScript 在 hydration 前加上，跟伺服器輸出不同是預期的
    <html lang="zh-TW" className={notoSansTC.variable} suppressHydrationWarning>
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <LiffProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <BackToTop />
          <ThemeToggle />
        </LiffProvider>
      </body>
    </html>
  );
}
