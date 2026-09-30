"use client";

import { useEffect, useLayoutEffect, useRef, type PointerEvent } from "react";
import { gsap, MQ, WIDTH_AND_MOTION, prefersReducedMotion, type WidthAndMotion } from "@/lib/motion";
import { Notification } from "@/components/vertlo";
import { PortalOverview } from "@/components/landing/portal/PortalOverview";
import { PORTAL_W, PORTAL_H, PORTAL_REGIONS, type PortalData } from "@/components/landing/portal/types";

/* The product band: the portal on a tilted stage, toured by scroll. The band pins; scrolling
   moves the camera (.vt-cam, inside the tilted screen) from the full portal to the KPIs, the
   volume and routing charts, Attention required and Payment health, then back out. Each stop
   shows its caption; the tilt flattens while zoomed (--tour-rx, so the pointer only steers the
   sideways lean). Same stage markup (vt-stage-*) as the design system's PortalStage, with the
   site's own Overview inside. Reduced motion: no pin, no zoom. */

type Props = { data: PortalData; clipH?: number; clipHMobile?: number };
type Cam = { x: number; y: number; scale: number };

/* the design system's stage staggers its three notification slots by class (vt-stage-pop--a/b/c) */
const POP_SLOTS = ["a", "b", "c"] as const;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Scales the 1240-wide portal to its container; shows `clip` px of its height (all of it on phones by default). */
function Fit({ clipH, clipHMobile, children }: { clipH: number; clipHMobile: number; children: React.ReactNode }) {
  const outer = useRef<HTMLDivElement>(null), inner = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const o = outer.current, i = inner.current;
    if (!o || !i) return;
    const fit = () => {
      const s = o.offsetWidth / PORTAL_W;
      if (!s) return;
      const clip = window.matchMedia(MQ.phone).matches ? clipHMobile : clipH;
      i.style.transform = `scale(${s})`;
      o.style.height = `${clip * s}px`;
      o.style.visibility = "visible";
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(o);
    return () => ro.disconnect();
  }, [clipH, clipHMobile]);
  return (
    <div ref={outer} style={{ position: "relative", width: "100%", aspectRatio: `${PORTAL_W} / ${clipH}`, visibility: "hidden" }}>
      <div ref={inner} data-fit-layer style={{ position: "absolute", left: 0, top: 0, width: PORTAL_W, height: PORTAL_H, transformOrigin: "0 0" }}>{children}</div>
    </div>
  );
}

export function PortalTour({ data, clipH = 640, clipHMobile = PORTAL_H }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const section = root?.closest("section");
    const stage = root?.querySelector<HTMLElement>(".vt-stage");
    const cam = root?.querySelector<HTMLElement>(".vt-cam");
    const screen = cam?.parentElement;
    if (!root || !section || !stage || !cam || !screen) return;
    const stops = data.tour.map((t) => PORTAL_REGIONS[t.region]);

    /* pause CSS loops off-screen, like the design system's stage */
    const io = new IntersectionObserver(([e]) => stage.setAttribute("data-paused", e.isIntersecting ? "false" : "true"));
    io.observe(stage);

    const mm = gsap.matchMedia();
    mm.add(
      WIDTH_AND_MOTION,
      (ctx) => {
        const { phone, reduce } = ctx.conditions as WidthAndMotion;
        if (reduce) return;
        root.setAttribute("data-tour", "");
        const caps = [...root.querySelectorAll<HTMLElement>(".vt-stage-cap")];
        const pops = root.querySelector(".vt-stage-pops");

        /* camera for a stop, from layout offsets (unaffected by the tilt or the current zoom);
           the portal is laid out at PORTAL_W and scaled to the camera's width */
        const camFor = (i: number): Cam => {
          const el = root.querySelector<HTMLElement>(stops[i]);
          const inner = cam.querySelector<HTMLElement>("[data-fit-layer]");
          if (!el || !inner) return { x: 0, y: 0, scale: 1 };
          const s = cam.offsetWidth / PORTAL_W;
          let ox = 0, oy = 0, n: HTMLElement | null = el;
          while (n && n !== inner) { ox += n.offsetLeft; oy += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
          const r = { x: ox * s, y: oy * s, w: el.offsetWidth * s, h: el.offsetHeight * s };
          const sw = screen.clientWidth, sh = screen.clientHeight;
          /* desktop: the screen fades out towards the bottom, so frame the stop a little high */
          const focusY = phone ? 0.5 : 0.42;
          /* at least a noticeable push-in, even for the full-width rows */
          const scale = clamp(Math.min(sw / (r.w * 1.1), sh / (r.h * 1.3)), phone ? 1.5 : 1.18, phone ? 2.6 : 1.8);
          const cw = PORTAL_W * s, ch = PORTAL_H * s;
          return {
            scale,
            x: clamp(sw / 2 - (r.x + r.w / 2) * scale, sw - cw * scale, 0),
            y: clamp(sh * focusY - (r.y + r.h / 2) * scale, sh - ch * scale, 0),
          };
        };

        gsap.set(caps, { autoAlpha: 0, y: 10 });
        const tl = gsap.timeline({
          defaults: { ease: "sine.inOut" },
          scrollTrigger: {
            trigger: section,
            start: phone ? "top top+=64" : "center center",
            end: phone ? "+=1900" : "+=2800",
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        if (pops) tl.to(pops, { autoAlpha: 0, duration: 0.3 }, 0.1);
        if (!phone) tl.fromTo(stage, { "--tour-rx": "14deg" }, { "--tour-rx": "4deg", duration: 1.2 }, 0.1);
        stops.forEach((_, i) => {
          const at = 0.3 + i * 2;
          tl.to(cam, { x: () => camFor(i).x, y: () => camFor(i).y, scale: () => camFor(i).scale, duration: 1.2 }, at);
          if (i) tl.to(caps[i - 1], { autoAlpha: 0, y: -8, duration: 0.3, ease: "power2.out" }, at);
          if (caps[i]) tl.to(caps[i], { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }, at + 0.75);
        });
        const out = 0.3 + stops.length * 2;
        tl.to(cam, { x: 0, y: 0, scale: 1, duration: 1.2 }, out);
        if (caps.at(-1)) tl.to(caps.at(-1)!, { autoAlpha: 0, y: -8, duration: 0.3, ease: "power2.out" }, out);
        if (!phone) tl.to(stage, { "--tour-rx": "14deg", duration: 1.2 }, out);
        if (pops) tl.to(pops, { autoAlpha: 1, duration: 0.3 }, out + 0.8);
        tl.to({}, { duration: 0.3 }); // a beat on the full view before the band unpins

        return () => root.removeAttribute("data-tour");
      },
    );
    return () => { io.disconnect(); mm.revert(); };
  }, [data.tour]);

  /* pointer lean, as in the design system's stage */
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const r = e.currentTarget.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    e.currentTarget.style.setProperty("--ry", `${(x * 6).toFixed(2)}deg`);
    e.currentTarget.style.setProperty("--rx", `${(14 - y * 4).toFixed(2)}deg`);
  };
  const leave = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--ry", "0deg");
    e.currentTarget.style.setProperty("--rx", "14deg");
  };

  return (
    <div ref={rootRef} className="lp-tour">
      <div className="vt-stage" onPointerMove={move} onPointerLeave={leave}>
        <div className="vt-stage-tilt">
          <div className="vt-stage-screen">
            <div className="vt-cam">
              <Fit clipH={clipH} clipHMobile={clipHMobile}><PortalOverview data={data} /></Fit>
            </div>
          </div>
        </div>
        <div className="vt-stage-caps" aria-hidden="true">
          {data.tour.map((t, i) => (
            <span key={t.region} className={`vt-stage-cap vt-stage-cap--${i + 1}`}>
              <b>{String(i + 1).padStart(2, "0")} / {String(data.tour.length).padStart(2, "0")}</b>{t.caption}
            </span>
          ))}
        </div>
        <div className="vt-stage-pops">
          {POP_SLOTS.map((slot, i) => data.pops[i] && (
            <div key={slot} className={`vt-stage-pop vt-stage-pop--${slot}`}><Notification animate={false} {...data.pops[i]} /></div>
          ))}
        </div>
        <span className="vt-stage-label">Vertlo portal · illustrative data</span>
      </div>
    </div>
  );
}
