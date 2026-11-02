import Link from "next/link";
import { CONTACT } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <img className="footer-logo" src="/images/footer-logo.png" alt="Verbora 沃語國際語言學校" />
            <div className="footer-contact">
              <div>地址：{CONTACT.address}</div>
              <div>電話：{CONTACT.phone}</div>
              <div>Email：{CONTACT.email}</div>
            </div>
          </div>
          <nav className="footer-nav" aria-label="頁尾導覽">
            <div className="footer-nav-primary">
              <Link href="/">首頁</Link>
              <Link href="/systems">語言課程</Link>
              <Link href="/branches">校區資訊</Link>
              <Link href="/news">活動消息</Link>
              <Link href="/gallery">學習專欄</Link>
              <Link href="/login">學員登入</Link>
              <Link href="/member">會員專區</Link>
            </div>
            <div className="footer-nav-secondary">
              <Link href="/privacy">隱私權政策</Link>
              <Link href="/terms">服務條款</Link>
              <Link href="/contact">聯絡我們</Link>
            </div>
          </nav>
        </div>
        <div className="footer-bottom">
          <div className="footer-copyright">© 2026 Verbora。本站為作品集示範，品牌、地址、電話與活動皆為虛構。</div>
        </div>
      </div>
    </footer>
  );
}
