"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Button, Diamond } from "@/components/vertlo";
import { MQ, gsap, prefersReducedMotion } from "@/lib/motion";
import { ArrowPicto } from "@/components/landing/board/Signage";

/* The closing call as a boarding pass, printed out of a kiosk slot: scrolling feeds the pass out of the
   slot, then tears its stub a little along the perforation. The pass carries the pitch and the one CTA;
   the stub repeats the flight details over a barcode. Styles in app/board.css (bd-kiosk, bd-pass). */

export type PassData = {
  label: string;
  no: string;
  passenger: string;
  from: string;
  to: string;
  flight: string;
  date: string;
  boarding: string;
  gate: string;
  seat: string;
  /** Printed under the barcode, and the pattern the barcode is drawn from. */
  code: string;
  /** Printed on the kiosk slot the pass comes out of. */
  printer: string;
};

/** A barcode drawn from `code`: guard bars, then three bars and three spaces per character, widths from its code point. */
function Barcode({ code }: { code: string }) {
  const runs = [2, 1, 1, 1];
  for (const ch of code) {
    const c = ch.charCodeAt(0);
    runs.push(1 + (c % 3), 1 + ((c >> 2) % 2), 1 + ((c >> 3) % 3), 1 + ((c >> 1) % 2), 1 + ((c >> 4) % 3), 1 + ((c >> 5) % 2));
  }
  runs.push(2, 1, 1, 2);
  let x = 0;
  const bars: [number, number][] = [];
  runs.forEach((w, i) => {
    if (i % 2 === 0) bars.push([x, w]);
    x += w;
  });
  return (
    <svg className="bd-barcode" viewBox={`0 0 ${x} 40`} preserveAspectRatio="none" aria-hidden="true">
      {bars.map(([bx, w]) => (
        <rect key={bx} x={bx} width={w} height={40} />
      ))}
    </svg>
  );
}

function Field({ k, v, className }: { k: string; v: ReactNode; className?: string }) {
  return (
    <div className={className ? `bd-pf ${className}` : "bd-pf"}>
      <dt>{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}

export function BoardingPass({ pass, title, blurb, points }: { pass: PassData; title: ReactNode; blurb: string; points: string[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const kiosk = ref.current;
    const sheet = kiosk?.querySelector<HTMLElement>(".bd-pass");
    const stub = kiosk?.querySelector<HTMLElement>(".bd-pass-stub");
    if (!kiosk || !sheet || !stub || prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add({ desktop: MQ.desktop, phone: MQ.phone }, (ctx) => {
      const { desktop } = ctx.conditions as { desktop: boolean };
      gsap
        .timeline({ scrollTrigger: { trigger: kiosk, start: "top 82%", end: "top 12%", scrub: 0.6, refreshPriority: -1 } })
        .fromTo(sheet, { yPercent: desktop ? -78 : -44 }, { yPercent: 0, ease: "none", duration: 1 })
        .fromTo(
          stub,
          { x: 0, y: 0, rotate: 0 },
          { ...(desktop ? { x: 16, rotate: 1.6 } : { y: 14, rotate: 1 }), transformOrigin: desktop ? "0% 100%" : "0% 0%", ease: "power1.out", duration: 0.35 },
        );
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className="bd-kiosk">
      <div className="bd-kiosk-slot" aria-hidden="true">
        <span>{pass.printer}</span>
        <i className="bd-lamp" data-tone="ok" />
      </div>
      <div className="bd-kiosk-out">
        <div className="bd-pass">
          <div className="bd-pass-main">
            <div className="bd-pass-strip">
              <span className="bd-pass-brand">
                <Diamond size={10} />
                Vertlo
              </span>
              <span className="bd-pass-label">{pass.label}</span>
              <span className="bd-pass-no">{pass.no}</span>
            </div>
            <div className="bd-pass-body">
              <div className="bd-pass-copy">
                <h2 className="lp-h2">{title}</h2>
                <p className="lp-blurb">{blurb}</p>
              </div>
              <dl className="bd-pass-route">
                <Field k="From" v={pass.from} />
                <ArrowPicto className="bd-pass-arrow" />
                <Field k="To" v={pass.to} />
              </dl>
              <dl className="bd-pass-fields">
                <Field k="Passenger" v={pass.passenger} />
                <Field k="Flight" v={pass.flight} />
                <Field k="Date" v={pass.date} />
                <Field k="Boarding" v={pass.boarding} />
                <Field k="Gate" v={pass.gate} />
                <Field k="Seat" v={pass.seat} />
              </dl>
              <div className="bd-pass-foot">
                <div className="bd-pass-incl">
                  <span>Includes</span>
                  <ul>
                    {points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
                <Button size="lg" href="#book">
                  Book a call
                </Button>
              </div>
            </div>
          </div>
          <div className="bd-pass-stub" aria-hidden="true">
            <div className="bd-pass-strip">
              <span className="bd-pass-label">{pass.label}</span>
            </div>
            <dl className="bd-pass-stub-fields">
              <Field k="Passenger" v={pass.passenger} className="bd-pf--wide" />
              <Field k="Flight" v={pass.flight} />
              <Field k="Boarding" v={pass.boarding} />
              <Field k="Gate" v={pass.gate} className="bd-pf--big" />
              <Field k="Seat" v={pass.seat} className="bd-pf--big" />
            </dl>
            <div className="bd-pass-code">
              <Barcode code={pass.code} />
              <span>{pass.code}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
