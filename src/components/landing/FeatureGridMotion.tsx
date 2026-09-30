"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, MQ } from "@/lib/motion";
import { FeatureGrid, type FeatureGridProps } from "@/components/vertlo";

/* What you get, in motion. Each cell plays its story once when it scrolls into view:
   routing → the split fills and approval climbs; failover → a MID pauses and traffic reroutes;
   disputes → alerts arrive and the chargeback is struck out; stores → payouts count up.
   Works on the generated FeatureGrid markup (vt-fg-*) without touching it; every text or class
   it changes is put back on cleanup. Once a cell has played (data-anim="done") its live bits
   ping in CSS, paused off-screen. Reduced motion: nothing moves, the final state shows. */

type Art = FeatureGridProps["items"][number]["art"];
type Tl = gsap.core.Timeline;

const POP = { duration: 0.9, ease: "expo.out" };

export function FeatureGridMotion(props: FeatureGridProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const arts = props.items.map((it) => it.art).join(",");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const artList = arts.split(",") as Art[];

    const mm = gsap.matchMedia();
    /* pause the CSS pings while the grid is off-screen (global [data-paused] rule) */
    const io = new IntersectionObserver(([e]) => root.setAttribute("data-paused", e.isIntersecting ? "false" : "true"));
    io.observe(root);
    mm.add(MQ.motionOk, () => {
      const texts = new Map<Node, string>(), classes = new Map<Element, string>();
      const setText = (el: Element | null, s: string) => {
        const node = el && [...el.childNodes].find((n) => n.nodeType === 3 && n.textContent?.trim());
        if (!node) return;
        if (!texts.has(node)) texts.set(node, node.textContent ?? "");
        node.textContent = s;
      };
      const setClass = (el: Element | null, cls: string, on: boolean) => {
        if (!el) return;
        if (!classes.has(el)) classes.set(el, el.className);
        el.classList.toggle(cls, on);
      };
      const count = (tl: Tl, el: Element | null, from: number, to: number, fmt: (v: number) => string, at: number, duration = 1) => {
        if (!el) return;
        const o = { v: from };
        setText(el, fmt(from));
        tl.to(o, { v: to, duration, ease: "power3.out", onUpdate: () => setText(el, fmt(o.v)) }, at);
      };
      const pop = (tl: Tl, el: Element | null, at: number, from: gsap.TweenVars = {}) => {
        if (el) tl.fromTo(el, { autoAlpha: 0, y: 28, scale: 0.96, ...from }, { autoAlpha: 1, x: 0, y: 0, scale: 1, ...POP }, at);
      };
      const flip = (tl: Tl, el: Element | null, at: number, change: () => void) => {
        if (!el) return;
        tl.to(el, { autoAlpha: 0, y: -6, duration: 0.16, ease: "power2.out" }, at)
          .call(change, [], at + 0.16)
          .fromTo(el, { y: 6 }, { autoAlpha: 1, y: 0, duration: 0.3, ease: "back.out(2)" }, at + 0.16);
      };
      const pct = (v: number) => Math.round(v) + "%";
      const money = (v: number) => "$" + Math.round(v).toLocaleString("en-US");
      /* the element's own number, ignoring child badges like "+0.4pt" */
      const num = (el: Element | null) => {
        const node = el && [...el.childNodes].find((n) => n.nodeType === 3 && n.textContent?.trim());
        return Number((node?.textContent ?? "").replace(/[^0-9.]/g, "")) || 0;
      };

      const stories: Record<Art, (cell: HTMLElement, tl: Tl) => void> = {
        routing(cell, tl) {
          const [rule, rate] = cell.querySelectorAll(".vt-fg-card");
          pop(tl, rule, 0.1);
          tl.fromTo(rule.querySelectorAll(".vt-fg-split span"), { flexGrow: 0 }, { flexGrow: (_i: number, el: HTMLElement) => Number(el.style.flexGrow) || 1, duration: 1.2, ease: "expo.out", stagger: 0.12 }, 0.4);
          rule.querySelectorAll(".vt-fg-row").forEach((row, i) => {
            tl.fromTo(row, { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out" }, 0.45 + i * 0.1);
            const n = row.querySelector(".vt-fg-num");
            count(tl, n, 0, num(n), pct, 0.45 + i * 0.1, 1.1);
          });
          pop(tl, rate, 1.15, { y: 36 });
          const big = rate?.querySelector(".vt-fg-big") ?? null, target = num(big);
          count(tl, big, target - 2.2, target, (v) => v.toFixed(1) + "%", 1.25, 1.4);
          const up = rate?.querySelector(".vt-fg-up");
          if (up) tl.fromTo(up, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(3)" }, 2.3);
        },

        failover(cell, tl) {
          const [card, toast] = cell.querySelectorAll(".vt-fg-card");
          const rows = card.querySelectorAll(".vt-fg-row");
          const dot = rows[0]?.querySelector(".vt-fg-dot") ?? null, status = rows[0]?.querySelector(".vt-fg-num") ?? null;
          const tag = card.querySelector(".vt-fg-tag"), sub = card.querySelector(".vt-fg-sub");
          const rings = [...cell.querySelectorAll("svg circle")], alert = cell.querySelector('svg rect[fill="#e5484d"]');
          const finalTag = tag?.textContent?.trim() ?? "", finalSub = sub?.textContent ?? "", finalStatus = status?.textContent ?? "";

          /* start healthy: every MID live */
          setClass(dot, "vt-fg-dot--red", false);
          setClass(status, "vt-fg-red", false);
          setText(status, "Live");
          setText(tag, finalTag.replace(/^\d+/, (n) => String(Number(n) + 1)));
          setText(sub, "All accounts live");

          pop(tl, card, 0.1);
          tl.fromTo(rows, { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out", stagger: 0.1 }, 0.4);
          /* the incident */
          if (alert) tl.fromTo(alert, { opacity: 0 }, { opacity: 1, duration: 0.12, repeat: 4, yoyo: true, ease: "none" }, 1.4);
          rings.forEach((c, i) => {
            const r = Number(c.getAttribute("r")) || 30;
            tl.fromTo(c, { attr: { r: 4 }, opacity: 0 }, { attr: { r }, opacity: 1, duration: 0.9, ease: "expo.out" }, 1.4 + i * 0.12);
          });
          tl.to(card, { x: 4, duration: 0.05, repeat: 5, yoyo: true, ease: "sine.inOut" }, 1.5).to(card, { x: 0, duration: 0.1 }, 1.8);
          flip(tl, status, 1.6, () => { setClass(status, "vt-fg-red", true); setText(status, finalStatus); });
          tl.call(() => setClass(dot, "vt-fg-dot--red", true), [], 1.6);
          if (dot) tl.fromTo(dot, { scale: 0.4 }, { scale: 1, duration: 0.6, ease: "elastic.out(1.2, 0.4)" }, 1.6);
          flip(tl, tag, 2.0, () => setText(tag, finalTag));
          flip(tl, sub, 2.05, () => setText(sub, finalSub));
          /* the rest take the traffic */
          rows.forEach((row, i) => {
            if (i === 0) return;
            const s = row.querySelector(".vt-fg-num");
            if (s) tl.fromTo(s, { color: "#0a7a3b" }, { color: "#0b1410", duration: 1, ease: "power2.out" }, 2.25 + i * 0.08);
          });
          pop(tl, toast, 2.45, { y: 24, scale: 0.9 });
          const check = toast?.querySelector(".vt-fg-check");
          if (check) tl.fromTo(check, { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2.5)" }, 2.65);
        },

        disputes(cell, tl) {
          const [inbox, alertCard] = cell.querySelectorAll(".vt-fg-card");
          const rows = inbox.querySelectorAll(".vt-fg-row"), tag = inbox.querySelector(".vt-fg-tag");
          const finalTag = tag?.textContent?.trim() ?? "";
          setText(tag, "0 items");

          pop(tl, inbox, 0.1);
          rows.forEach((row, i) => {
            const at = 0.5 + i * 0.45;
            tl.fromTo(row, { autoAlpha: 0, x: 32 }, { autoAlpha: 1, x: 0, duration: 0.7, ease: "back.out(1.4)" }, at);
            const d = row.querySelector(".vt-fg-dot");
            if (d) tl.fromTo(d, { scale: 0 }, { scale: 1, duration: 0.7, ease: "elastic.out(1.2, 0.35)" }, at + 0.1);
            flip(tl, tag, at + 0.05, () => setText(tag, i === rows.length - 1 ? finalTag : `${i + 1} item${i ? "s" : ""}`));
          });

          const caught = alertCard.querySelector(".vt-fg-tag");
          const [order, alert, cb] = alertCard.querySelectorAll(".vt-fg-tn");
          const [l1, l2] = alertCard.querySelectorAll(".vt-fg-tline");
          const x = cb?.querySelector(".vt-fg-tx"), foot = alertCard.querySelector(".vt-fg-foot");
          setClass(cb, "vt-fg-tn--off", false);

          pop(tl, alertCard, 1.4);
          gsap.set([order, alert, cb, caught, x].filter(Boolean), { autoAlpha: 0 });
          gsap.set([l1, l2], { scaleX: 0, transformOrigin: "0 50%" });

          tl.to(order, { autoAlpha: 1, duration: 0.4 }, 1.75)
            .to(l1, { scaleX: 1, duration: 0.5, ease: "power2.inOut" }, 1.9)
            .to(alert, { autoAlpha: 1, duration: 0.3 }, 2.3);
          const dia = alert?.querySelector(".vt-fg-tdia");
          if (dia) tl.fromTo(dia, { scale: 0 }, { scale: 1, duration: 0.7, ease: "back.out(4)" }, 2.3);
          tl.to(l2, { scaleX: 1, duration: 0.55, ease: "power2.inOut" }, 2.5)
            .to(cb, { autoAlpha: 1, duration: 0.3 }, 2.95)
            .call(() => setClass(cb, "vt-fg-tn--off", true), [], 3.35);
          if (x) tl.fromTo(x, { autoAlpha: 0, scale: 0, rotation: 90 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.5, ease: "back.out(3)" }, 3.35);
          if (foot) tl.fromTo(foot, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, 3.65);
          const check = foot?.querySelector(".vt-fg-check");
          if (check) tl.fromTo(check, { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2.5)" }, 3.75);
          if (caught) tl.fromTo(caught, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(3)" }, 3.8);
        },

        stores(cell, tl) {
          const [back, front, pill] = cell.querySelectorAll(".vt-fg-card");
          pop(tl, back, 0.05, { y: 44, scale: 0.92 });
          pop(tl, front, 0.2);
          const rows = front.querySelectorAll(".vt-fg-row:not(.vt-fg-total)");
          rows.forEach((row, i) => {
            const at = 0.5 + i * 0.14;
            tl.fromTo(row, { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.6, ease: "power3.out" }, at);
            const n = row.querySelector(".vt-fg-num");
            count(tl, n, 0, num(n), money, at, 1.2);
          });
          const total = front.querySelector(".vt-fg-total .vt-fg-num");
          count(tl, total, 0, num(total), money, 0.9, 1.6);
          pop(tl, pill, 2.1, { x: 28, y: 0, scale: 0.9 });
          const d = pill?.querySelector("svg");
          if (d) tl.fromTo(d, { rotation: -180, scale: 0 }, { rotation: 0, scale: 1, duration: 0.8, ease: "back.out(2)" }, 2.2);
        },
      };

      root.querySelectorAll<HTMLElement>(".vt-fg-cell").forEach((cell, i) => {
        const art = artList[i];
        const wrap = cell.querySelector(".vt-fg-artwrap");
        if (!art || !wrap) return;
        const cards = cell.querySelectorAll(".vt-fg-card");
        const tl = gsap.timeline({
          paused: true,
          onStart: () => cell.setAttribute("data-anim", "run"),
          onComplete: () => {
            gsap.set(cards, { clearProps: "transform,opacity,visibility" });
            cell.setAttribute("data-anim", "done");
          },
        });
        const grid = cell.querySelector(".vt-fg-artwrap svg");
        if (grid) tl.fromTo(grid, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: "power1.out" }, 0);
        stories[art](cell, tl);
        ScrollTrigger.create({ trigger: wrap, start: "top 78%", once: true, onEnter: () => tl.play() });
      });

      return () => {
        texts.forEach((s, n) => { n.textContent = s; });
        classes.forEach((c, el) => { el.className = c; });
        root.querySelectorAll(".vt-fg-cell").forEach((c) => c.removeAttribute("data-anim"));
      };
    });
    return () => { io.disconnect(); mm.revert(); };
  }, [arts]);

  return (
    <div ref={rootRef} className="lp-fg-motion">
      <FeatureGrid {...props} />
    </div>
  );
}
