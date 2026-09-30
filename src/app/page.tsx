import { SmoothScroll } from "@/components/site/SmoothScroll";
import { SiteHeader } from "@/components/site/SiteHeader";
import { PaperMotion } from "@/components/landing/PaperMotion";
import {
  Approval,
  FinalCTA,
  Hero,
  Notice,
  Register,
  Schedule,
  SiteFooter,
  Statement,
  Terms,
  Trust,
} from "@/components/landing/Sections";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <SiteHeader />
      <main>
        <Hero />
        <Trust />
        {/* the stack of documents, one sheet per section (Concept A's structure) */}
        <div className="pp-stack">
          <Notice />
          <Statement />
          <Schedule />
          <Approval />
          <Register />
          <Terms />
          <FinalCTA />
        </div>
      </main>
      <SiteFooter />
      <PaperMotion />
    </>
  );
}
