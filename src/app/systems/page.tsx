import type { Metadata } from "next";
import { CourseTabs } from "@/components/systems/CourseSection";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({ title: "語言課程", description: "英語、日語、韓語、法語、德語、西班牙語、華語七種語言課程介紹。" });

export default function Page() {
  return (
    <>
      {/* HERO */}
      <section className="hero" style={{ backgroundImage: "url('/images/courses/banner.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="hero-inner">
          <h1 className="hero-page-title">七大語言課程</h1>
          <p className="hero-page-eyebrow">VERBORA LANGUAGE PROGRAMS</p>
        </div>
      </section>
      <CourseTabs />
    </>
  );
}
