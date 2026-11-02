import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  description: "沃語國際語言學校（Verbora）：英語、日語、韓語、法語、德語、西班牙語、華語七種語言課程，小班制陪你開口說。本站為作品集示範。",
};

const VERBA = [
  { letter: "V", color: "var(--verba-1)", title: "Voice：大膽開口", desc: "語言是溝通的工具，不是背誦的科目。小班制確保每個人都有足夠的開口時間，同學之間互相對話，比聽老師講更有效。" },
  { letter: "E", color: "var(--verba-2)", title: "Ear：先聽再說", desc: "嬰兒學語言是從聽開始的，成人也一樣。每堂課先讓耳朵熟悉語音和節奏，理解了再開口，說出來的句子才自然。" },
  { letter: "R", color: "var(--verba-3)", title: "Reflect：回饋修正", desc: "進步來自注意到自己和母語者的差距。老師會在對話後回饋發音與用字，讓學員知道下一次可以怎麼說得更好。" },
  { letter: "B", color: "var(--verba-4)", title: "Bridge：接上生活", desc: "學到的句子要馬上用。課堂任務模擬點餐、面試和簡報，語言交換活動則讓學員把課本內容帶進真實生活。" },
  { letter: "A", color: "var(--verba-5)", title: "Aim：瞄準目標", desc: "為了旅行、工作還是檢定，需要的語言能力都不同。開課前先做程度分析與目標訪談，之後再依定期評量調整教材和班級。" },
];

export default function Page() {
  return (
    <>
      {/* HERO：next/image 優先載入、自動轉 AVIF/WebP、依螢幕寬度給適當尺寸（LCP 元素） */}
      <section className="hero hero--home isolate">
        <Image src="/images/home/hero.jpg" alt="" fill priority sizes="(max-width: 1440px) 100vw, 1440px" className="-z-10 object-cover" />
        <div className="hero-inner">
          <div className="hero-logo">
            <img className="hero-logo-word" src="/images/hero-word.png" alt="Verbora" />
            <p className="hero-logo-name">沃語國際語言學校</p>
            <p className="hero-logo-tagline">Verbora Language School</p>
          </div>
        </div>
      </section>

      {/* 品牌故事 */}
      <section className="story">
        <div className="story-container">
          <div className="story-text">
            <img loading="lazy" className="story-icon" src="/images/deco/story.png" alt="" />
            <h2>我們的故事</h2>
            <p className="story-sub">OUR STORY</p>
            <p className="story-quote">{'"Every Language Opens a New World"'}</p>
            <p className="story-quote-zh">每一種語言，都是通往新世界的門</p>
          </div>
          <div className="story-image">
            <picture>
              <source media="(max-width: 767px)" srcSet="/images/home/story-mobile.jpg" />
              <source media="(min-width: 768px) and (max-width: 1023px)" srcSet="/images/home/story-tablet.jpg" />
              <img loading="lazy" src="/images/home/story.jpg" alt="咖啡桌上的書本與手機" />
            </picture>
          </div>
        </div>
      </section>

      {/* VERBA 學習法 */}
      <section className="meaning">
        <img loading="lazy" className="meaning-bg-illust" src="/images/deco/meaning.png" alt="" />
        <div className="meaning-container">
          <div className="meaning-inner">
            <div className="meaning-title-block">
              <div className="title-illust-row">
                <h2 className="meaning-title">
                  {VERBA.map((item) => (
                    <span key={item.title} style={{ color: item.color }}>
                      {item.letter}
                    </span>
                  ))}{" "}
                  學習法
                </h2>
              </div>
              <p className="meaning-subtitle">學語言，從這五件事開始</p>
            </div>
            <div className="meaning-body">
              <div className="verba-list">
                {VERBA.map((item) => (
                  <div className="verba-item" key={item.title}>
                    <p className="verba-letter" style={{ color: item.color }}>
                      {item.letter}
                    </p>
                    <p className="verba-title" style={{ color: item.color }}>
                      {item.title}
                    </p>
                    <p className="verba-desc">{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="meaning-closing">學語言沒有捷徑，但有更好走的路。當聽、說、回饋與運用形成循環，你會在某一天發現，自己已經不用先翻譯，就能直接開口了。</p>
            </div>
          </div>
        </div>
      </section>

      {/* 教學目標 */}
      <section className="philosophy">
        <div className="philosophy-inner">
          <div className="philosophy-illust">
            <img loading="lazy" src="/images/home/goals.jpg" alt="筆記本與便利貼" />
          </div>
          <div className="philosophy-text">
            <h2 className="philosophy-title">教學目標</h2>
            <p>我們希望學員離開教室時，帶走的不只是分數，而是敢開口的自信。課程以 CEFR 語言能力指標規劃，從生活會話、職場溝通到學術應用，逐步建立聽、說、讀、寫四項能力。</p>
            <p>同時，我們重視跨文化理解。了解一個語言背後的習慣與思考方式，才能真正用對語氣、說對話，與世界各地的人建立連結。</p>
          </div>
        </div>
      </section>

      {/* 教學方法 */}
      <section className="methods">
        <div className="methods-container">
          <div className="methods-illust">
            <img loading="lazy" src="/images/home/methods.jpg" alt="正在書寫的手" />
          </div>
          <h2 className="methods-title">教學方法</h2>
          <div className="methods-text">
            <p>語言是在使用中學會的。每堂課以任務為中心，透過情境對話、角色扮演與小組討論，讓學員在真實的溝通需求裡學習文法和單字，再用課後聽力和線上練習把內容記牢。</p>
          </div>
        </div>
      </section>

      {/* 教學原則 */}
      <section className="principles">
        <picture className="principles-illust-picture">
          <source media="(min-width: 768px) and (max-width: 1023px)" srcSet="/images/home/principles-tablet.jpg" />
          <img loading="lazy" className="principles-illust" src="/images/home/principles.jpg" alt="書架上的語言書籍" />
        </picture>
        <div className="principles-container">
          <div className="principles-title-row">
            <h2 className="principles-title">教學原則</h2>
          </div>
          <div className="principles-text">
            <p>以學員為中心：學員是課堂的主角，老師負責設計任務、引導對話與給予回饋。每班人數不超過 8 位，確保每個人都被看見。</p>
            <p>錯誤是學習的一部分：我們鼓勵大膽開口，在安全的氛圍裡犯錯、修正，再試一次。自信就是這樣一點一滴累積起來的。</p>
            <p>語言與文化並重：課程融入各地生活、節慶與職場文化，讓學員不只學會怎麼說，也知道什麼時候該這樣說。</p>
            <p>持續才有成果：我們用定期評量追蹤進度，搭配聽力教材與語言活動，把學習延伸到教室之外，讓每週一點點的累積，變成看得見的改變。</p>
          </div>
        </div>
      </section>
    </>
  );
}
