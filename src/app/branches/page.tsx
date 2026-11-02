import type { Metadata } from "next";
import { SectionTabs, TabPanel } from "@/components/SectionTabs";
import { REGIONS } from "@/data/branches";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "校區資訊", description: "沃語台北、新竹、台中與海外校區資訊（虛構示範）。" });

export default function Page() {
  return (
    <>
      {/* 校區按鈕 icon（inline SVG，顏色跟隨 currentColor） */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <symbol id="icon-map" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.500a2.500 2.500 0 0 1 0 5Z" />
        </symbol>
      </svg>

      {/* HERO */}
      <section className="hero" style={{ backgroundImage: "url('/images/branches/banner.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="hero-inner">
          <h1 className="hero-page-title">校區資訊</h1>
        </div>
      </section>

      <SectionTabs
        tabs={REGIONS.map((r) => ({ id: r.id, label: `${r.name}（${r.branches.length}所）` }))}
        navClassName="region-nav"
        innerClassName="region-nav-inner"
        tabClassName="region-tab"
        dropdownId="region-dropdown"
        dropdownCaption="選擇地區"
      >
        {REGIONS.map((region) => (
          <TabPanel key={region.id} id={region.id} className="region-section">
            {region.deco.map((d) => (
              <img key={d.className} loading="lazy" className={d.className} src={d.src} alt="" />
            ))}
            <div className="region-container">
              <div className="region-header">
                <h2 className="region-title">{region.name}</h2>
                <span className="region-count">共 {region.branches.length} 所</span>
              </div>
              <div className="branch-grid">
                {region.branches.map((branch) => (
                  <article className="branch-item" key={branch.name}>
                    <div className="branch-info">
                      <h3 className="branch-name">{branch.name}</h3>
                      <div className="branch-details">
                        <div className="branch-detail">
                          <img loading="lazy" className="branch-detail-icon" src="/images/ui/icon-pin.svg" alt="" />
                          <span>{branch.address}</span>
                        </div>
                        <div className="branch-detail">
                          <img loading="lazy" className="branch-detail-icon" src="/images/ui/icon-phone.svg" alt="" />
                          <span>{branch.phone}</span>
                        </div>
                      </div>
                      <div className="branch-btns">
                        <a className="branch-btn branch-btn--nav" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(branch.address)}`} target="_blank" rel="noopener" aria-label={`在 Google 地圖查看 ${branch.name}`}>
                          <svg>
                            <use href="#icon-map" />
                          </svg>
                          <span className="branch-btn-text">導航</span>
                        </a>
                        <a className="branch-btn branch-btn--call" href={`tel:${branch.tel}`}>
                          撥打
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </TabPanel>
        ))}
      </SectionTabs>
    </>
  );
}
