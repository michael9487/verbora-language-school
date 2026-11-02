import { SectionTabs, TabPanel } from "@/components/SectionTabs";
import { CLASS_STEPS, COURSES, type Course } from "@/data/courses";
import { TeachingGallery } from "./TeachingGallery";

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

function CourseSection({ course }: { course: Course }) {
  const { id, name } = course;
  return (
    <TabPanel id={id} className="teaching-system-section">
      <div className="teaching-system-main">
        <div className="teaching-system-title">
          <h2>{name}</h2>
          <img loading="lazy" className="teaching-system-title-decoration" src="/images/deco/course.png" alt="" />
        </div>
        <div className="teaching-system-content">
          <div className="teaching-main-grid">
            <div className="teaching-images">
              <img loading="lazy" src={`/images/courses/${id}-1.jpg`} alt="" />
              <img loading="lazy" src={`/images/courses/${id}-2.jpg`} alt="" />
            </div>
            <div className="teaching-info">
              <div className="teaching-info-section">
                <p className="teaching-info-section-title">適用程度 ／ 教材配置</p>
                <p className="teaching-info-section-body">{course.summary}</p>
              </div>
              <div className="teaching-info-list">
                <div className="teaching-content-block is-relative">
                  <img loading="lazy" className="teaching-media-decoration is-mobile" src="/images/deco/course.png" alt="" />
                  <h3 className="teaching-content-block-title">課程概述</h3>
                  <p className="teaching-content-block-body">{course.overview}</p>
                </div>
                <Block title="各級課程重點" items={course.levels} />
                <Block title="四大上課步驟" items={CLASS_STEPS} />
                <Block title="教學特色" items={course.features} />
                <Block title="課程內容" items={course.topics} />
              </div>
            </div>
          </div>
          <TeachingGallery slides={[1, 2].map((n) => ({ src: `/images/courses/${id}-slide-${n}.jpg`, alt: "", width: "376px" }))} />
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
