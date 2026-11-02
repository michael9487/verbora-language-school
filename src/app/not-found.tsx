import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "找不到這個頁面",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="notfound-body">
      <div className="notfound-container">
        <p className="notfound-code">404</p>
        <h1 className="notfound-title">找不到這個頁面</h1>
        <p className="notfound-text">
          您要找的頁面可能已被移除，<span className="notfound-text-line">或網址輸入有誤。</span>
        </p>
        <Link className="notfound-btn" href="/">
          回到首頁
        </Link>
      </div>
    </div>
  );
}
