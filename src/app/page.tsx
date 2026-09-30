import { SmoothScroll } from "@/components/site/SmoothScroll";
import { SiteHeader } from "@/components/site/SiteHeader";
import { RouteLine } from "@/components/landing/Route";
import { order, providers } from "@/content/landing";
import {
  Approved,
  Book,
  Faq,
  Hero,
  Industries,
  Paused,
  Portal,
  Rerouted,
  Settled,
  SiteFooter,
  Stories,
  Underwritten,
} from "@/components/landing/Sections";

/* nodes whose drawing hangs off them by a leader line (the Figure with the same `leader` in Sections.tsx) */
const LEADERS = ["rerouted", "cp0", "cp1", "cp2", "cp3", "us04", "ind1", "ind2", "ind3"];

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <SiteHeader />
      <main>
        {/* one line from the top of the hero to the last button; every section is a stop on it */}
        <div className="rt">
          <RouteLine order={order} feeders={providers.items.length} leaders={LEADERS} />
          <Hero />
          <Portal />
          <Paused />
          <Rerouted />
          <Approved />
          <Underwritten />
          <Settled />
          <Industries />
          <Stories />
          <Faq />
          <Book />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
