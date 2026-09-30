"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";
import { buildPath, lenAtY, pointAt, type Path, type Pt } from "@/components/landing/route/geometry";
import type { OrderStage } from "@/content/landing";

/* The line, and the order that rides it. The page's sections only place points (`data-rt`
   anchors, positioned in route.css, so the layout stays CSS); this measures them, draws one path
   through them and keeps its drawn length in step with the scroll, with the order at its head.
   Side lines hang off the same points: the stub to the paused account (never travelled), the
   branch to UK-02, the branch that issues US-04, and the providers feeding in.
   Anything marked `data-at="point"` gets `data-on` once the line has passed that point, and loses it
   on the way back up: that is every state change on the page (route.css styles them).
   The order is a card where it starts and where it settles, a small tag in between, and out of
   sight while it is inside the portal (`data-rt-zone`).
   Reduced motion: the whole line is drawn, every point is on, and the order sits settled. */

type Order = { id: string; amount: string; card: string; merchant: string; label: string; stages: OrderStage[] };
type Mode = "card" | "tag" | "hidden";
type Branch = {
  mode: "dead" | "fork" | "feed";
  path: Path;
  drawn: SVGPathElement | null;
  /** the stretch of the main line (by height) over which this branch draws */
  y0: number; y1: number;
  at: Record<string, number>;
  cur: number;
};

/* the main line's points, top to bottom; `name*` takes every numbered point of that name */
const MAIN = ["start", "checkout", "router", "pause", "junction", "us03", "rejoin", "rerouted", "approved", "cp*", "feed", "uw", "split", "join", "home", "payout", "ind*", "end"];
const FORKS = ["dead", "uk02", "us04"];
const R = 14;
/* how far ahead of a provider's merge the order is when that feeder starts to draw */
const FEED_LEAD = 180;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function RouteLine({ order, feeders }: { order: Order; feeders: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const [mode, setMode] = useState<Mode>("card");
  const stages = order.stages;

  useEffect(() => {
    const line = ref.current, root = line?.parentElement;
    if (!line || !root) return;
    const path = (id: string, kind: "track" | "drawn") => line.querySelector<SVGPathElement>(`.rt-${kind}[data-path="${id}"]`);
    const drawnEl = path("main", "drawn"), trackEl = path("main", "track");
    const orderEl = line.querySelector<HTMLElement>(".rt-order"), headEl = line.querySelector<HTMLElement>(".rt-head");
    if (!drawnEl || !trackEl || !orderEl || !headEl) return;
    const reduce = prefersReducedMotion();

    let main: Path | null = null;
    let at: Record<string, number> = {};
    let branches: Branch[] = [];
    let reactive: { el: Element; on: boolean; thr: number; b?: Branch }[] = [];
    let top = 0, maxScroll = 1, zone: [number, number] | null = null;
    let cur = 0, built = false, lastStage = -1, lastMode = "";
    let intro: gsap.core.Tween | null = null;

    const setPath = (id: string, p: Path) => {
      path(id, "track")?.setAttribute("d", p.d);
      const d = path(id, "drawn");
      d?.setAttribute("d", p.d);
      if (d) d.style.strokeDasharray = `${p.len} ${p.len}`;
      return d;
    };

    const measure = () => {
      const rr = root.getBoundingClientRect();
      top = rr.top + window.scrollY;
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const pos: Record<string, Pt> = {};
      root.querySelectorAll<HTMLElement>("[data-rt]").forEach((el) => {
        if (!el.getClientRects().length) return;
        const r = el.getBoundingClientRect();
        pos[el.dataset.rt ?? ""] = { x: Math.round((r.left + r.width / 2 - rr.left) * 2) / 2, y: Math.round(r.top + r.height / 2 - rr.top), via: el.dataset.via };
      });
      if (!pos.checkout) return;
      pos.start = { x: pos.checkout.x, y: 0 };

      const names = MAIN.flatMap((n) => {
        if (!n.endsWith("*")) return pos[n] ? [n] : [];
        const stem = n.slice(0, -1);
        return Object.keys(pos).filter((k) => k.startsWith(stem) && /^\d+$/.test(k.slice(stem.length))).sort((a, b) => Number(a.slice(stem.length)) - Number(b.slice(stem.length)));
      });
      main = buildPath(names.map((n) => pos[n]), R);
      at = {};
      names.forEach((n, i) => { at[n] = main!.at[i]; });
      setPath("main", main);

      branches = [];
      const add = (id: string, mode: Branch["mode"], pts: Pt[], y0: number, y1: number, marks: (p: Path) => Record<string, number>) => {
        const p = buildPath(pts, R);
        branches.push({ mode, path: p, drawn: setPath(id, p), y0, y1, at: marks(p), cur: 0 });
      };
      const { pause, us01, junction, us03, uk02, split, us04, join, feed } = pos;
      /* the account the order was meant for: straight on from the pause, never travelled */
      if (pause && us01) add("dead", "dead", [pause, us01], 0, 0, () => ({}));
      /* UK-02 leaves where the main line turns down to US-03 */
      if (junction && us03 && uk02) {
        const from = { x: us03.x - R * Math.sign(us03.x - junction.x), y: junction.y };
        add("uk02", "fork", [from, { ...uk02, via: "hv" }], junction.y, uk02.y, (p) => ({ uk02: p.len }));
      }
      /* US-04 peels off the main line, lights up, and joins it again */
      if (split && us04 && join) {
        const pts = [{ x: split.x, y: split.y - R }, { x: us04.x, y: split.y, via: "vh" }, us04, { x: us04.x, y: join.y }, { x: join.x, y: join.y + R, via: "hv" }];
        add("us04", "fork", pts, split.y - R, join.y + R, (p) => ({ us04: p.at[2] }));
      }
      /* providers run in from the side and turn down into the line */
      for (let i = 0; i < feeders; i++) {
        const p = pos[`prov${i}`];
        if (p && feed) add(`prov${i}`, "feed", [p, { x: feed.x, y: p.y + R * 2, via: "hv" }], p.y + R * 2 - FEED_LEAD, p.y + R * 2, (b) => ({ [`prov${i}`]: b.len }));
      }

      reactive = [...root.querySelectorAll("[data-at]")].map((el) => {
        const name = el.getAttribute("data-at") ?? "";
        const b = name in at ? undefined : branches.find((x) => name in x.at);
        return { el, on: el.hasAttribute("data-on"), thr: b ? b.at[name] : at[name] ?? Infinity, b };
      });

      const z = root.querySelector<HTMLElement>("[data-rt-zone]");
      if (z) {
        const zr = z.getBoundingClientRect();
        zone = [zr.top - rr.top + Number(z.dataset.in ?? 0), zr.bottom - rr.top - Number(z.dataset.out ?? 0)];
      } else zone = null;
    };

    /* Where the head of the line should be for this scroll position: at the height of a reading
       line that starts on the checkout card, settles at mid-screen, and drops towards the bottom
       of the screen at the very end so the line can reach its last point. */
    const target = () => {
      if (!main) return 0;
      const vh = window.innerHeight, sy = window.scrollY, max = maxScroll;
      const f0 = clamp((pointAt(main, at.checkout).y + top) / vh, 0.12, 0.8);
      const a = clamp(sy / 520, 0, 1), b = clamp((sy - (max - 640)) / 640, 0, 1);
      let fr = f0 + (0.5 - f0) * a * a * (3 - 2 * a);
      fr += (0.94 - fr) * b * b;
      return Math.max(at.checkout, lenAtY(main, sy + vh * fr - top));
    };

    const render = () => {
      if (!main) return;
      drawnEl.style.strokeDashoffset = String(main.len - cur);
      const hp = pointAt(main, cur);
      for (const b of branches) {
        if (b.mode === "dead") continue;
        b.cur = b.path.len * clamp((hp.y - b.y0) / Math.max(1, b.y1 - b.y0), 0, 1);
        if (b.drawn) b.drawn.style.strokeDashoffset = String(b.path.len - b.cur);
      }
      for (const r of reactive) {
        const on = (r.b ? r.b.cur : cur) >= r.thr - 1;
        if (on !== r.on) { r.on = on; r.el.toggleAttribute("data-on", on); }
      }
      /* the order stops where it settles; the line goes on without it */
      const dock = at.payout ?? main.len;
      const op = cur > dock ? pointAt(main, dock) : hp;
      orderEl.style.transform = `translate3d(${op.x}px, ${op.y}px, 0)`;
      headEl.style.transform = `translate3d(${hp.x}px, ${hp.y}px, 0)`;
      headEl.toggleAttribute("data-on", cur > dock + 6 && cur < main.len - 6);

      let s = 0;
      stages.forEach((st, i) => { if (at[st.at] != null && cur >= at[st.at] - 1) s = i; });
      if (s !== lastStage) { lastStage = s; setStage(s); }
      const hidden = zone && hp.y > zone[0] && hp.y < zone[1];
      const m: Mode = hidden ? "hidden" : cur <= at.checkout + 10 || cur >= dock - 1 ? "card" : "tag";
      if (m !== lastMode) { lastMode = m; setMode(m); }
    };

    const rebuild = () => {
      measure();
      if (!main) return;
      if (reduce) cur = main.len;
      else if (!built) {
        /* on load the line is drawn down to the order, then scroll takes over */
        const o = { l: 0 };
        intro = gsap.to(o, { l: target(), duration: 0.9, delay: 0.15, ease: "power2.out", onUpdate: () => { cur = o.l; render(); }, onComplete: () => { intro = null; } });
      } else if (!intro) cur = target();
      built = true;
      line.setAttribute("data-ready", "");
      render();
    };

    /* scrub: follow the target closely on a straight run, glide along a run across the page */
    const tick = () => {
      if (!main || intro || reduce) return;
      const t = target(), d = t - cur;
      if (Math.abs(d) < 0.05) return;
      const dt = Math.min(0.05, gsap.ticker.deltaRatio(60) / 60);
      const cap = Math.max(1500, Math.abs(d) * 5) * dt;
      cur = Math.abs(d) < 0.4 ? t : cur + clamp(d * (1 - Math.exp(-dt / 0.1)), -cap, cap);
      render();
    };

    let raf = 0;
    const ro = new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(rebuild); });
    ro.observe(root);
    ScrollTrigger.addEventListener("refresh", rebuild);
    let alive = true;
    document.fonts?.ready.then(() => alive && rebuild());
    gsap.ticker.add(tick);
    rebuild();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      ScrollTrigger.removeEventListener("refresh", rebuild);
      gsap.ticker.remove(tick);
      intro?.kill();
    };
  }, [stages, feeders]);

  const st = stages[stage] ?? stages[0];
  const sides = [...FORKS, ...Array.from({ length: feeders }, (_, i) => `prov${i}`)];

  return (
    <div ref={ref} className="rt-line" aria-hidden="true">
      <svg className="rt-svg">
        {sides.map((id) => (
          <path key={id} className="rt-track" data-path={id} data-at={id === "dead" ? "pause" : undefined} />
        ))}
        <path className="rt-track" data-path="main" />
        {sides.slice(1).map((id) => (
          <path key={id} className="rt-drawn rt-drawn--side" data-path={id} />
        ))}
        <path className="rt-drawn" data-path="main" />
      </svg>
      <i className="rt-head" />
      <div className="rt-order" data-mode={mode} data-tone={st.tone ?? "live"}>
        <i className="rt-order-pip" />
        <div className="rt-card">
          <div className="rt-card-top">
            <span>Order {order.id}</span>
            <span className="rt-card-status">
              <i />
              {st.status}
            </span>
          </div>
          <div className="rt-card-amount">{order.amount}</div>
          <div className="rt-card-row">
            <span>{order.card}</span>
            <span>{st.time}</span>
          </div>
          <div className="rt-card-row rt-card-row--faint">
            <span>{order.merchant}</span>
            <span>{order.label}</span>
          </div>
        </div>
        <div className="rt-tag">
          <b>{order.id}</b>
          <span>{st.status}</span>
        </div>
      </div>
    </div>
  );
}
