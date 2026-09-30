import { SmoothScroll } from "@/components/site/SmoothScroll";
import { InkIn } from "@/components/landing/Press";
import { BackSection, CentreSpread, FrontSection, Head, SiteFooter } from "@/components/landing/Sections";

/* The edition: a front section that turns sideways, a centre spread that scrolls down, a back section
   that turns sideways again (see components/landing/Sections.tsx). */
export default function Home() {
  return (
    <>
      <SmoothScroll />
      <InkIn />
      <Head />
      <main>
        <FrontSection />
        <CentreSpread />
        <BackSection />
      </main>
      <SiteFooter />
    </>
  );
}
