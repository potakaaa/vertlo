import { SmoothScroll } from "@/components/site/SmoothScroll";
import { InkIn } from "@/components/landing/Press";
import {
  FAQSection,
  FinalCTA,
  ForBrands,
  Front,
  Hero,
  How,
  Industries,
  Portal,
  Problem,
  SiteFooter,
  Testimonials,
  Trust,
  WhatYouGet,
} from "@/components/landing/Sections";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <InkIn />
      <Front />
      <main>
        <Hero />
        <Portal />
        <Trust />
        <Problem />
        <How />
        <WhatYouGet />
        <ForBrands />
        <Industries />
        <Testimonials />
        <FAQSection />
        <FinalCTA />
      </main>
      <SiteFooter />
    </>
  );
}
