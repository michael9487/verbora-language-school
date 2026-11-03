import { SectionTabs, TabPanel } from "@/components/SectionTabs";
import { CLASS_STEPS, COURSES, type Course } from "@/data/courses";

function Block({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="teaching-content-block">
      <h3 className="teaching-content-block-title">{title}</h3>
      <ul className="teaching-content-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

// 標題旁的兩個對話泡泡，字依語言不同；位置沿用 .teaching-system-title-decoration，但不整組旋轉，字才好讀
function LangBubbles({ chars: [big, small] }: { chars: [string, string] }) {
  return (
    <span className="teaching-system-title-decoration h-[128px] transform-none" aria-hidden="true">
      <span className="absolute top-0 right-0 flex size-[76px] rotate-[8deg] items-center justify-center rounded-[50%_50%_50%_14%] bg-[#C9E3F8] text-[28px] font-bold text-[#4A82CF]">
        {big}
      </span>
      <span className="absolute bottom-1 left-3 flex size-[62px] -rotate-[6deg] items-center justify-center rounded-[50%_50%_14%_50%] bg-[#F9CDD8] text-[24px] font-bold text-[#C2577A]">
        {small}
      </span>
    </span>
  );
}

function CourseSection({ course }: { course: Course }) {
  const { id, name } = course;
  return (
    <TabPanel id={id} className="teaching-system-section">
      <div className="teaching-system-main">
        <div className="teaching-system-title">
          <h2>{name}</h2>
          <LangBubbles chars={course.bubbles} />
        </div>
        <div className="teaching-system-content">
          <div className="teaching-main-grid">
            <div className="teaching-images">
              <img loading="lazy" src={`/images/courses/${id}-1.jpg`} alt="" />
              <img loading="lazy" src={`/images/courses/${id}-2.jpg`} alt="" />
            </div>
            <div className="teaching-info">
              <div className="teaching-info-section">
                <p className="teaching-info-section-title">程度與教材</p>
                <p className="teaching-info-section-body">{course.summary}</p>
              </div>
              <div className="teaching-info-list">
                <div className="teaching-content-block is-relative">
                  <h3 className="teaching-content-block-title">這門課怎麼學</h3>
                  <p className="teaching-content-block-body">{course.overview}</p>
                </div>
                <Block title="每一階學會什麼" items={course.levels} />
                <Block title="一堂課的節奏" items={CLASS_STEPS} />
                <Block title="加分安排" items={course.features} />
                <Block title="主題班別" items={course.topics} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </TabPanel>
  );
}

export function CourseTabs() {
  return (
    <SectionTabs
      tabs={COURSES.map((c) => ({ id: c.id, label: c.name }))}
      navClassName="teaching-nav"
      innerClassName="teaching-nav-inner"
      tabClassName="teaching-nav-tab"
      dropdownId="teaching-dropdown"
      dropdownCaption="選擇語言"
      scrollToNav
    >
      {COURSES.map((course) => (
        <CourseSection key={course.id} course={course} />
      ))}
    </SectionTabs>
  );
}
