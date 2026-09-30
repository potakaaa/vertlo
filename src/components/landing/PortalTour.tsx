"use client";

import { useEffect, useLayoutEffect, useRef, type PointerEvent } from "react";
import { gsap, MQ, WIDTH_AND_MOTION, prefersReducedMotion, type WidthAndMotion } from "@/lib/motion";
import { Notification } from "@/components/vertlo";
import { PortalOverview } from "@/components/landing/portal/PortalOverview";
import { PORTAL_W, PORTAL_H, PORTAL_REGIONS, type PortalData } from "@/components/landing/portal/types";

/* The product: the portal on a laptop under the hero copy, toured by scroll. The hero pins;
   on desktop scrolling first zooms into the laptop (the copy lifts away, the lid flattens and the
   screen grows to fill the view), then moves the camera (.vt-cam, inside the screen) from the full
   portal to the KPIs, the volume and routing charts, Attention required and Payment health, and
   back out, and the laptop settles back under the copy before the hero unpins. Each stop shows its caption. On phones only the stage pins (centred, clear of the header) and the camera tour runs.
   Same stage markup (vt-stage-*) as the design system's PortalStage, with a laptop lid and base
   around the screen and the site's own Overview inside. Reduced motion: no pin, no zoom. */

type Props = { data: PortalData; clipH?: number; clipHMobile?: number };
type Cam = { x: number; y: number; scale: number };

/* the design system's stage staggers its three notification slots by class (vt-stage-pop--a/b/c) */
const POP_SLOTS = ["a", "b", "c"] as const;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Layout offset of `el` inside `anc` (ignores transforms, so it holds mid-zoom); `anc` must be positioned. */
function offsetIn(el: HTMLElement, anc: HTMLElement) {
  let x = 0, y = 0, n: HTMLElement | null = el;
  while (n && n !== anc) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent as HTMLElement | null; }
  return { x, y };
}

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
        const copy = section.querySelector<HTMLElement>(".lp-hero");
        const base = root.querySelector<HTMLElement>(".lp-laptop-base");

        /* desktop zoom-in: scale and move the whole laptop (origin top-left) so the screen sits
           centred in the viewport, as large as fits; measured flat, which is where the zoom ends */
        const zoom = () => {
          const s0 = offsetIn(screen, root), r0 = offsetIn(root, section);
          const sw = screen.offsetWidth, sh = screen.offsetHeight;
          const vw = document.documentElement.clientWidth, vh = window.innerHeight;
          const scale = Math.min((vw * 0.94) / sw, (vh * 0.86) / sh);
          return {
            scale,
            x: vw / 2 - r0.x - (s0.x + sw / 2) * scale,
            y: vh * 0.52 - r0.y - (s0.y + sh / 2) * scale,
          };
        };

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
        /* refreshPriority: this pin adds its scroll length to everything below it, so it must be
           measured first on every refresh, or the triggers further down land short by that length */
        const tl = gsap.timeline({
          defaults: { ease: "sine.inOut" },
          scrollTrigger: phone
            ? { trigger: root, start: "center center+=24", end: "+=1100", pin: root.parentElement, scrub: 1, invalidateOnRefresh: true, refreshPriority: 1 }
            : { trigger: section, start: "top top", end: "+=2800", pin: true, scrub: 1, invalidateOnRefresh: true, refreshPriority: 1 },
        });
        if (pops) tl.to(pops, { autoAlpha: 0, duration: 0.3 }, 0.1);
        /* the zoom-in takes the first 1.6 of the timeline on desktop; the camera tour follows */
        const lead = phone ? 0 : 1.6;
        if (!phone) {
          gsap.set(root, { transformOrigin: "0 0" });
          tl.fromTo(stage, { "--tour-rx": "14deg" }, { "--tour-rx": "0deg", duration: 1.4, ease: "power2.inOut" }, 0.1);
          tl.to(root, { x: () => zoom().x, y: () => zoom().y, scale: () => zoom().scale, duration: 1.5, ease: "power2.inOut" }, 0.1);
          if (copy) tl.to(copy, { autoAlpha: 0, y: -80, duration: 0.9, ease: "power1.in" }, 0.1);
          if (base) tl.to(base, { autoAlpha: 0, duration: 0.6 }, 0.9);
        }
        stops.forEach((_, i) => {
          const at = lead + 0.3 + i * 2;
          tl.to(cam, { x: () => camFor(i).x, y: () => camFor(i).y, scale: () => camFor(i).scale, duration: 1.2 }, at);
          if (i) tl.to(caps[i - 1], { autoAlpha: 0, y: -8, duration: 0.3, ease: "power2.out" }, at);
          if (caps[i]) tl.to(caps[i], { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }, at + 0.75);
        });
        const out = lead + 0.3 + stops.length * 2;
        tl.to(cam, { x: 0, y: 0, scale: 1, duration: 1.2 }, out);
        if (caps.at(-1)) tl.to(caps.at(-1)!, { autoAlpha: 0, y: -8, duration: 0.3, ease: "power2.out" }, out);
        /* desktop: zoom back out to the laptop under the copy, so the hero leaves as it arrived */
        if (!phone) {
          tl.to(root, { x: 0, y: 0, scale: 1, duration: 1.5, ease: "power2.inOut" }, out + 0.4);
          tl.to(stage, { "--tour-rx": "14deg", duration: 1.4, ease: "power2.inOut" }, out + 0.5);
          if (base) tl.to(base, { autoAlpha: 1, duration: 0.6 }, out + 0.6);
          if (copy) tl.to(copy, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power1.out" }, out + 1);
        }
        if (pops) tl.to(pops, { autoAlpha: 1, duration: 0.3 }, out + (phone ? 0.8 : 1.6));
        tl.to({}, { duration: 0.3 }); // a beat on the full view before the hero unpins

        return () => {
          root.removeAttribute("data-tour");
          gsap.set([root, copy, base].filter(Boolean), { clearProps: "all" });
        };
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
          <div className="lp-laptop-lid">
            <span className="lp-laptop-cam" aria-hidden="true" />
            <div className="vt-stage-screen">
              <div className="vt-cam">
                <Fit clipH={clipH} clipHMobile={clipHMobile}><PortalOverview data={data} /></Fit>
              </div>
            </div>
          </div>
        </div>
        <div className="lp-laptop-base" aria-hidden="true"><i /></div>
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
