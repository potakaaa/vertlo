import { SmoothScroll } from "@/components/site/SmoothScroll";
import { SiteHeader } from "@/components/site/SiteHeader";
import { PaperMotion } from "@/components/landing/PaperMotion";
import {
  Approval,
  FinalCTA,
  Hero,
  Notice,
  Questions,
  Register,
  SiteFooter,
  Statement,
  WorksWith,
} from "@/components/landing/Sections";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <SiteHeader />
      <main>
        <Hero />
        <WorksWith />
        {/* the stack of documents, one sheet per section (Concept A's structure) */}
        <div className="pp-stack">
          <Notice />
          <Statement />
          <Approval />
          <Register />
          <Questions />
          <FinalCTA />
        </div>
      </main>
      <SiteFooter />
      <PaperMotion />
    </>
  );
}
