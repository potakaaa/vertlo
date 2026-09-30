import { SmoothScroll } from "@/components/site/SmoothScroll";
import { SiteHeader } from "@/components/site/SiteHeader";
import {
  FAQSection,
  FinalCTA,
  ForBrands,
  Hero,
  How,
  Industries,
  ProductBand,
  Problem,
  Providers,
  SiteFooter,
  Testimonials,
  Trust,
  WhatYouGet,
} from "@/components/landing/Sections";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <SiteHeader />
      <main>
        <Hero />
        <ProductBand />
        <Trust />
        <Problem />
        <How />
        <WhatYouGet />
        <ForBrands />
        <Providers />
        <Industries />
        <Testimonials />
        <FAQSection />
        <FinalCTA />
      </main>
      <SiteFooter />
    </>
  );
}
