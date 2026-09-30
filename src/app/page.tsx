import { SmoothScroll } from "@/components/site/SmoothScroll";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Day, Hero, SiteFooter, Trust } from "@/components/landing/Sections";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <SiteHeader />
      <main>
        <Hero />
        <Trust />
        <Day />
      </main>
      <SiteFooter />
    </>
  );
}
