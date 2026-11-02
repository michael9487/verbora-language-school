import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "關於我們", description: "認識沃語：語言課程資訊、每週課表與企業語言培訓。" });

const COURSE_INFO = [
  { label: "招生對象", lines: ["高中生以上、成人學習者"] },
  { label: "上課時間", lines: ["1. 平日班 10:00-12:00、19:00-21:00", "2. 週末班 09:30-16:30"] },
  {
    label: ["報名流程", "須知"],
    lines: ["1. 線上或電話預約諮詢", "2. 免費程度分析與目標訪談", "3. 老師建議適合的班級與學習路線", "4. 體驗一堂試聽課", "5. 完成報名並領取教材", "6. 開課前收到學習說明信", "7. 開課~"],
  },
  { label: "收費及退費", lines: ["依各課程公告為準，開課前可全額退費"] },
];

const SCHEDULE = [
  ["09:30-10:00", "語言咖啡時間"],
  ["10:00-12:00", "英語、日語平日班"],
  ["12:00-13:30", "午間線上會話"],
  ["13:30-15:30", "韓語、法語平日班"],
  ["15:30-16:00", "老師諮詢時段"],
  ["16:00-18:00", "德語、西語平日班"],
  ["18:00-19:00", "自習與聽力教室開放"],
  ["19:00-21:00", "在職進修夜間班"],
];

const CORPORATE_INFO = [
  { label: "適合對象", lines: ["需要外語溝通的企業團隊、新進人員、外派人員"] },
  { label: "上課地點", lines: ["企業內訓、沃語校區或線上皆可", "（時間可依部門排班彈性安排）"] },
  { label: "合作流程", lines: ["需求訪談 → 員工程度檢測 → 客製課程規劃 → 開課 → 學習成效報告"] },
  { label: "課程主題", lines: ["1. 商務 Email 與電話溝通", "2. 英語簡報與會議主持", "3. 跨文化溝通與客戶接待"] },
];

export default function Page() {
  return (
    <>
      {/* HERO */}
      <section className="hero" style={{ backgroundImage: "url('/images/about/hero.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="hero-inner">
          <h1 className="hero-page-title">關於我們</h1>
        </div>
      </section>

      {/* 語言課程 */}
      <section className="campus">
        <img loading="lazy" className="campus-decoration" src="/images/deco/campus.png" alt="" aria-hidden="true" />
        <div className="campus-container">
          <img loading="lazy" className="campus-title-image" src="/images/about/title-courses.png" alt="語言課程" />
          <div className="school-info-table">
            {COURSE_INFO.map((row) => (
              <div className="school-info-row" key={String(row.label)}>
                <div className="school-info-label">
                  {Array.isArray(row.label) ? (
                    <>
                      {row.label[0]}
                      <br />
                      {row.label[1]}
                    </>
                  ) : (
                    row.label
                  )}
                </div>
                <div className="info-content">
                  {row.lines.map((line) => (
                    <div className="school-info-content-text" key={line}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 每週課表 */}
      <section className="schedule">
        <div className="schedule-container">
          <div className="schedule-title-row">
            <img loading="lazy" className="schedule-title" src="/images/about/title-schedule.png" alt="每週課表" />
            <img loading="lazy" className="schedule-title-decoration" src="/images/deco/schedule-tall.png" alt="" aria-hidden="true" />
          </div>
          <div className="schedule-table">
            <div className="schedule-head">
              <div className="schedule-head-time"></div>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
                <div className="schedule-day" key={day}>
                  {day}
                </div>
              ))}
            </div>
            {SCHEDULE.map(([time, activity]) => (
              <div className="schedule-row" key={time}>
                <div className="schedule-time">{time}</div>
                <div className="schedule-activity">{activity}</div>
              </div>
            ))}
          </div>
          <div className="schedule-note">※以上資訊為示範內容，實際課表以各校區公告為準。</div>
        </div>
      </section>

      {/* 企業培訓 */}
      <section className="corporate-section">
        <img loading="lazy" className="corporate-decoration" src="/images/deco/corporate.png" alt="" aria-hidden="true" />
        <div className="corporate-container">
          <img loading="lazy" className="corporate-title" src="/images/about/title-corporate.png" alt="企業培訓" />
          <div className="corporate-info-table">
            {CORPORATE_INFO.map((row) => (
              <div className="corporate-info-row" key={row.label}>
                <div className="corporate-info-label">{row.label}</div>
                <div className="corporate-info-content">
                  {row.lines.map((line) => (
                    <div className="corporate-info-text" key={line}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
