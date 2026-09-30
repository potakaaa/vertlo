/* eslint-disable */
// @ts-nocheck — generated from the Vertlo design-system bundle (h() = React.createElement).
// Public props are typed in ./types.ts and applied in ./index.ts. Regenerate instead of hand-editing
// when the design system changes; site-only additions (real hrefs, clipHMobile) are marked "site:".
"use client";

import * as ReactNS from "react";

var R = function () { return ReactNS; };
function h() { return ReactNS.createElement.apply(null, arguments); }
function cx() { return Array.prototype.filter.call(arguments, Boolean).join(" "); }
function reduced() { try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } }
/* site: canvas text uses the mono font loaded by next/font */
function monoFont() { try { var f = getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim(); if (f) return f; } catch (e) {} return '"Geist Mono", ui-monospace, monospace'; }

/* ── Icons: 1px-feel line icons, 24 grid, currentColor ── */
var P = {
  "arrow-ne": "M7 17L17 7M9 7h8v8",
  plus: "M12 6v12M6 12h12",
  minus: "M6 12h12",
  check: "M5 12.5l4.5 4.5L19 7",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
  bell: "M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15zM10 20.5h4",
  route: "M3 12h6M9 12c4 0 4-6 9-6M9 12h9M9 12c4 0 4 6 9 6M18 6h3M18 12h3M18 18h3",
  shield: "M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6zM9 12l2 2 4-4",
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
  dashboard: "M3 5h18v14H3zM3 9h18M7 16v-3M11 16v-5M15 16v-2M19 16v-4",
  doc: "M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h7",
  code: "M3 5h18v14H3zM3 9h18M10 12l-3 2.5 3 2.5M14 12l3 2.5-3 2.5",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  bag: "M5 8h14l-1 13H6zM9 8V6a3 3 0 0 1 6 0v2",
  switch: "M4 8h13l-3-3M20 16H7l3 3",
  card: "M3 6h18v12H3zM3 10h18M7 15h4",
  store: "M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9h16M9 20v-6h6v6",
  refresh: "M20 11a8 8 0 0 0-14.9-3M4 4v4h4M4 13a8 8 0 0 0 14.9 3M20 20v-4h-4",
  pause: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM10 9v6M14 9v6",
  plug: "M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0zM12 16v5",
  chart: "M4 20V4M4 20h16M8 16l4-5 3 3 5-7"
};
function Icon(p) {
  p = p || {}; var s = p.size || 24;
  return h("svg", { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: p.strokeWidth || 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": p.title ? undefined : true, className: p.className, role: p.title ? "img" : undefined },
    p.title ? h("title", null, p.title) : null, h("path", { d: P[p.name] || P.plus }));
}
function Arrow() { return h(Icon, { name: "arrow-ne", size: 16, strokeWidth: 2 }); }

/* ── Diamond: the motif ── */
function Diamond(p) {
  p = p || {}; var s = p.size || 10;
  var fill = p.color || (p.glow ? "var(--green)" : "currentColor");
  return h("svg", { width: s * 1.42, height: s * 1.42, viewBox: "0 0 20 20", "aria-hidden": true, className: p.className, style: p.glow ? { overflow: "visible" } : { overflow: "visible" } },
    h("rect", { x: 3, y: 3, width: 14, height: 14, rx: 2, fill: p.outline ? "none" : fill, stroke: p.outline ? fill : "none", strokeWidth: p.outline ? 1.5 : 0, transform: "rotate(45 10 10)" }));
}
function Logo(p) {
  p = p || {};
  return h("a", { className: "vt-logo", href: p.href || "#", "aria-label": "Vertlo home" },
    h(Diamond, { size: 16, glow: true }), h("span", null, "VERTLO"));
}

/* ── Buttons & pills ── */
/* Button: gradient pill with idle sheen, cursor light, magnetic pull, rolling label, arrow swap.
   Variants: primary · beam (dark pill, light running round the edge) · ghost (ink floods in from the cursor)
   · ghost-stealth (faint edge beam that ignites on hover) · text (underline draws in). */
function ArrowSwap(p) {
  return h("span", { className: cx("vt-btn-ico", p.chip && "vt-btn-chip"), "aria-hidden": true },
    h("span", { className: "vt-btn-ico-a" }, h(Arrow, null)), h("span", { className: "vt-btn-ico-b" }, h(Arrow, null)));
}
function Button(p) {
  var v = p.variant || "primary";
  var chip = (v === "primary" || v === "beam") && p.arrow !== false && p.size !== "sm" && !p.full;
  var cls = cx("vt-btn", "vt-btn--" + v, p.size === "sm" && "vt-btn--sm", p.size === "lg" && "vt-btn--lg", p.full && "vt-btn--full", chip && "vt-btn--chip", p.className);
  var label = p.children, roll = typeof label === "string" && v !== "text";
  function pos(e) {
    var el = e.currentTarget, r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    el.style.setProperty("--mx", x + "px"); el.style.setProperty("--my", y + "px");
    if (e.pointerType === "mouse" && !reduced() && v !== "text" && p.magnetic !== false) {
      el.style.setProperty("--tx", ((x - r.width / 2) / r.width * 8).toFixed(2) + "px");
      el.style.setProperty("--ty", ((y - r.height / 2) / r.height * 6).toFixed(2) + "px");
    }
  }
  function leave(e) { pos(e); e.currentTarget.style.setProperty("--tx", "0px"); e.currentTarget.style.setProperty("--ty", "0px"); }
  var kids = [
    h("span", { key: "f", className: "vt-btn-fill", "aria-hidden": true }),
    h("span", { key: "l", className: "vt-btn-label" }, roll ? h("span", { className: "vt-roll", "data-text": label }, label) : label)
  ];
  if (p.arrow !== false) kids.push(h(ArrowSwap, { key: "a", chip: chip }));
  var props = { className: cls, onClick: p.onClick, onPointerMove: pos, onPointerEnter: pos, onPointerLeave: leave };
  return p.href ? h("a", Object.assign({ href: p.href }, props), kids) : h("button", Object.assign({ type: p.type || "button", disabled: p.disabled }, props), kids);
}
function Pill(p) { return h("span", { className: cx("vt-pill", "vt-pill--" + (p.tone || "stealth"), p.className) }, p.children); }
function PillInput(p) {
  return h("label", { className: "vt-input" },
    p.editable ? h("input", { defaultValue: p.value, placeholder: p.placeholder, "aria-label": p.unit || p.placeholder }) : h("span", { className: "vt-tnum" }, p.value),
    p.unit ? h("b", null, p.unit) : null,
    p.icon ? h("span", { style: { color: "var(--on-stealth)", display: "flex" } }, h(Icon, { name: p.icon, size: 20 })) : null);
}

function StealthPanel(p) {
  var Tag = p.as || "section";
  return h(Tag, { className: cx("vt-stealth", p.className), style: p.style },
    p.haze === false ? null : h("div", { className: "vt-haze", "aria-hidden": true }), p.children);
}

/* ════════════════ ART ════════════════
   Dense hairline art with depth and light: laser beams travelling along
   lines, radar sweeps, ripples, glass layers, a 3D canvas core. Everything
   pauses off-screen and has a still frame for reduced motion. */
var G = "#16c45a", MINT = "rgba(242,246,243,.7)", RED = "#e5484d", GL = "rgba(255,255,255,.3)";
var W1 = "rgba(255,255,255,.06)", W2 = "rgba(255,255,255,.12)", W3 = "rgba(255,255,255,.22)", W4 = "rgba(255,255,255,.4)";
function useUid(prefix) { var React = R(); var id = React.useId ? React.useId() : String(Math.random()); return (prefix || "vt") + id.replace(/[^a-zA-Z0-9]/g, ""); }
function usePauseOffscreen() {
  var React = R(); var ref = React.useRef(null);
  React.useEffect(function () {
    var el = ref.current; if (!el || !window.IntersectionObserver) return;
    var io = new IntersectionObserver(function (e) { el.setAttribute("data-paused", e[0].isIntersecting ? "false" : "true"); });
    io.observe(el); return function () { io.disconnect(); };
  }, []);
  return ref;
}
function rng(s) { return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

/* Beam: a laser streak (bright head + fading tail) running along path d */
function Beam(p) {
  var dur = (p.dur || 3) + "s", del = (p.delay || 0) + "s", c = p.color || "#f2f6f3", w = p.w || 1.4;
  function seg(len, op, extra) {
    return h("path", Object.assign({ d: p.d, pathLength: 100, fill: "none", stroke: c, strokeOpacity: op, strokeWidth: w, strokeLinecap: "round", strokeDasharray: len + " 400", className: "vt-beam", style: { "--L": len, animationDuration: dur, animationDelay: del } }, extra));
  }
  return h("g", { "aria-hidden": true }, seg(28, .12), seg(14, .3), seg(4, 1, { strokeWidth: w + .6, style: { "--L": 4, animationDuration: dur, animationDelay: del } }));
}
function Ripple(p) {
  var n = p.n || 3, dur = p.dur || 3.6;
  var out = [];
  for (var i = 0; i < n; i++) out.push(h(p.shape === "rhombus" ? "path" : "circle", Object.assign({ key: i, className: "vt-ripple", fill: "none", stroke: p.color || G, strokeWidth: 1, style: { animationDuration: dur + "s", animationDelay: (-i * dur / n) + "s" } },
    p.shape === "rhombus" ? { d: "M" + p.cx + " " + (p.cy - p.r * .58) + " L" + (p.cx + p.r) + " " + p.cy + " L" + p.cx + " " + (p.cy + p.r * .58) + " L" + (p.cx - p.r) + " " + p.cy + "Z", strokeDasharray: "4 4" } : { cx: p.cx, cy: p.cy, r: p.r })));
  return h("g", { "aria-hidden": true }, out);
}
function dia(x, y, s, fill, k, extra) { return h("rect", Object.assign({ key: k, x: x - s / 2, y: y - s / 2, width: s, height: s, rx: s / 6, fill: fill, transform: "rotate(45 " + x + " " + y + ")" }, extra)); }
function glowDia(x, y, s, k) { return h("g", { key: k }, dia(x, y, s, G, "d")); }

/* ── OrbitArt: real-time 3D scene on canvas — dot-sphere core, orbits with depth,
      riding particles, ripples, perspective floor with laser beams, drifting diamonds ── */
function OrbitArt(p) {
  p = p || {}; var React = R(); var cvRef = React.useRef(null);
  var core = p.core !== false, aspect = p.aspect || 2;
  React.useEffect(function () {
    var cv = cvRef.current; if (!cv) return; var ctx = cv.getContext("2d");
    var W = 0, H = 0, dpr = Math.min(2, window.devicePixelRatio || 1), raf = 0, vis = true, still = reduced(), start = performance.now();
    var rand = rng(7), N = p.dots || 340, pts = [], i;
    for (i = 0; i < N; i++) { var yy = 1 - (i / (N - 1)) * 2, rr = Math.sqrt(1 - yy * yy), th = i * 2.39996; pts.push([Math.cos(th) * rr, yy, Math.sin(th) * rr, i % 11 === 0]); }
    var rings = [{ r: 2.0, tx: 1.22, rz: -0.30, sp: .00016, n: 3 }, { r: 2.7, tx: 1.30, rz: 0.16, sp: -.00011, n: 2 }, { r: 3.5, tx: 1.36, rz: -0.08, sp: .00007, n: 4 }, { r: 4.4, tx: 1.40, rz: 0.05, sp: -.00005, n: 2 }];
    var dias = []; for (i = 0; i < 18; i++) dias.push({ x: rand(), y: rand(), s: 3 + rand() * 4, g: i === 3, ph: rand() * 6.28 });
    var fans = []; for (i = -7; i <= 7; i++) fans.push(i);
    function size() { var b = cv.getBoundingClientRect(); W = b.width; H = b.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); if (still) frame(start + 5200); }
    function proj(x, y, z, S, cx0, cy0) { var f = 9 / (9 - z); return [cx0 + x * S * f, cy0 + y * S * f, z, f]; }
    function qpt(a, b, c2, t) { var u = 1 - t; return [u * u * a[0] + 2 * u * t * b[0] + t * t * c2[0], u * u * a[1] + 2 * u * t * b[1] + t * t * c2[1]]; }
    function frame(now) {
      var t = now - start; ctx.clearRect(0, 0, W, H);
      var S = Math.min(W / 11, H / 5.2), cx0 = W / 2, cy0 = H * (p.cy || .5);
      /* perspective floor: fan lines + latitude arcs, dashed */
      ctx.save(); ctx.setLineDash([2, 6]); ctx.lineWidth = 1;
      fans.forEach(function (k) {
        var a = [cx0 + k * S * .25, cy0], b = [cx0 + k * S * 1.3, cy0 + H * .25], c2 = [cx0 + k * S * 3.2, H + 20];
        ctx.strokeStyle = "rgba(255,255,255," + (.14 - Math.abs(k) * .01) + ")";
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.quadraticCurveTo(b[0], b[1], c2[0], c2[1]); ctx.stroke();
      });
      for (i = 1; i <= 6; i++) {
        var yl = cy0 + (H - cy0) * Math.pow(i / 6, 1.6) * .98, bend = 22 * (i / 6);
        ctx.strokeStyle = "rgba(255,255,255," + (.03 + i * .018) + ")";
        ctx.beginPath(); ctx.moveTo(-10, yl - bend); ctx.quadraticCurveTo(cx0, yl + bend, W + 10, yl - bend); ctx.stroke();
        var yu = cy0 - (cy0) * Math.pow(i / 6, 1.6) * .96;
        ctx.strokeStyle = "rgba(255,255,255," + (.015 + i * .008) + ")";
        ctx.beginPath(); ctx.moveTo(-10, yu + bend); ctx.quadraticCurveTo(cx0, yu - bend, W + 10, yu + bend); ctx.stroke();
      }
      ctx.restore();
      /* laser beams racing outward along fan lines */
      [[-5, 0], [3, .37], [6, .71], [-2, .52]].forEach(function (b) {
        var u = ((t / 2600) + b[1]) % 1; if (u > .8) return; u = u / .8;
        var k = b[0], A = [cx0 + k * S * .25, cy0], B = [cx0 + k * S * 1.3, cy0 + H * .25], C = [cx0 + k * S * 3.2, H + 20];
        var p1 = qpt(A, B, C, Math.max(0, u - .12)), p2 = qpt(A, B, C, u);
        var g = ctx.createLinearGradient(p1[0], p1[1], p2[0], p2[1]); g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(1, "rgba(255,255,255," + (.55 * (1 - u * .6)) + ")");
        ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(p1[0], p1[1]);
        for (var s = 1; s <= 8; s++) { var q = qpt(A, B, C, Math.max(0, u - .12) + (.12 * s / 8) * Math.min(1, u / .12)); ctx.lineTo(q[0], q[1]); }
        ctx.stroke();
      });
      /* collect geometry with depth */
      var back = [], front = [];
      rings.forEach(function (rg, ri) {
        var spin = t * rg.sp, cz = Math.cos(rg.rz), sz = Math.sin(rg.rz), ctx1 = Math.cos(rg.tx), stx = Math.sin(rg.tx), M = 150;
        function ringPt(a) { var x = rg.r * Math.cos(a), y = rg.r * Math.sin(a), y2 = y * ctx1, z2 = y * stx; return [x * cz - y2 * sz, x * sz + y2 * cz, z2]; }
        for (var j = 0; j < M; j++) {
          var a0 = j / M * 6.283, a1 = (j + 1) / M * 6.283, P0 = ringPt(a0), P1 = ringPt(a1), z = (P0[2] + P1[2]) / 2;
          var item = { k: "seg", a: P0, b: P1, z: z, r: rg.r, ri: ri };
          (z < 0 ? back : front).push(item);
        }
        for (var m = 0; m < rg.n; m++) { var aa = spin * 6.283 * 10 + m * 6.283 / rg.n + ri, PP = ringPt(aa); (PP[2] < 0 ? back : front).push({ k: "par", a: PP, z: PP[2], g: (m + ri) % 3 !== 1 }); }
      });
      if (core) {
        var ry = t * .00022, rx = .38, cyy = Math.cos(ry), syy = Math.sin(ry), cxx = Math.cos(rx), sxx = Math.sin(rx), Rs = 1.15;
        pts.forEach(function (q) {
          var x = q[0] * cyy + q[2] * syy, z = -q[0] * syy + q[2] * cyy, y = q[1] * cxx - z * sxx; z = q[1] * sxx + z * cxx;
          (z < 0 ? back : front).push({ k: "dot", a: [x * Rs, y * Rs, z * Rs], z: z * Rs, g: q[3] });
        });
      }
      function draw(it) {
        if (it.k === "seg") {
          var A = proj(it.a[0], it.a[1], it.a[2], S, cx0, cy0), B = proj(it.b[0], it.b[1], it.b[2], S, cx0, cy0);
          if (core && it.z < 0 && Math.hypot((A[0] + B[0]) / 2 - cx0, (A[1] + B[1]) / 2 - cy0) < S * 1.05) return;
          var d = (it.z / it.r + 1) / 2; ctx.strokeStyle = "rgba(255,255,255," + (.05 + d * .22) + ")"; ctx.lineWidth = .6 + d * .6;
          ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
        } else if (it.k === "par") {
          var Q = proj(it.a[0], it.a[1], it.a[2], S, cx0, cy0);
          if (core && it.z < 0 && Math.hypot(Q[0] - cx0, Q[1] - cy0) < S * 1.05) return;
          var sz2 = 3.2 * Q[3];
          ctx.save(); ctx.translate(Q[0], Q[1]); ctx.rotate(Math.PI / 4);
                      ctx.fillStyle = "rgba(242,246,243," + (it.z < 0 ? .22 : .55) + ")";
          ctx.fillRect(-sz2 / 2, -sz2 / 2, sz2, sz2); ctx.restore();
        } else {
          var D = proj(it.a[0], it.a[1], it.a[2], S, cx0, cy0), dd = (it.z / 1.15 + 1) / 2;
          ctx.fillStyle = it.g ? "rgba(242,246,243," + (.25 + dd * .5) + ")" : "rgba(242,246,243," + (.04 + dd * .5) + ")";
          ctx.fillRect(D[0] - .7, D[1] - .7, 1.4 + dd * .6, 1.4 + dd * .6);
        }
      }
      back.sort(function (a, b) { return a.z - b.z; }).forEach(draw);
      front.sort(function (a, b) { return a.z - b.z; }).forEach(draw);
      /* drifting diamonds */
      dias.forEach(function (d) {
        var x = d.x * W, y = d.y * H + Math.sin(t / 1500 + d.ph) * 6;
        ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4);
        ctx.fillStyle = d.g ? G : "rgba(255,255,255,.22)";
        ctx.fillRect(-d.s / 2, -d.s / 2, d.s, d.s); ctx.restore();
      });
    }
    function loop(now) { if (vis && !document.hidden) frame(now); raf = requestAnimationFrame(loop); }
    var ro = new ResizeObserver(size); ro.observe(cv); size();
    var io = new IntersectionObserver(function (e) { vis = e[0].isIntersecting; }); io.observe(cv);
    if (!still) raf = requestAnimationFrame(loop);
    return function () { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [core]);
  return h("canvas", { ref: cvRef, className: p.className, "aria-hidden": true, style: Object.assign({ display: "block", width: "100%", aspectRatio: String(aspect) }, p.style) });
}

/* ════════════════ PRODUCT: the real Vertlo portal, rebuilt in HTML ════════════════
   Portal = the Overview screen (1240×800 natural size, scaled to fit).
   PortalStage = the hero: the portal tilted on a dark lit stage, alerts popping off it.
   CrmSlice = card-sized pieces of the portal. ProductCard = dark card with a slice peeking up.
   All numbers are illustrative demo data, as in the product's own demo. */
function Fit(p) {
  var React = R(); var ref = React.useRef(null);
  var st = React.useState(p.initial || .5), s = st[0], set = st[1];
  var cst = React.useState(p.clipH || p.h), clip = cst[0], setClip = cst[1];
  React.useEffect(function () {
    var el = ref.current; if (!el) return;
    function m() { var w = el.offsetWidth; if (w) set(w / p.w); setClip(window.innerWidth <= 720 && p.clipHMobile ? p.clipHMobile : (p.clipH || p.h)); }
    m(); var ro = new ResizeObserver(m); ro.observe(el); return function () { ro.disconnect(); };
  }, []);
  return h("div", { ref: ref, className: p.className, style: Object.assign({ position: "relative", width: "100%", height: clip * s }, p.style) },
    h("div", { style: { position: "absolute", left: 0, top: 0, width: p.w, height: p.h, transform: "scale(" + s + ")", transformOrigin: "0 0" } }, p.children));
}

var KPIS = [
  ["Gross processing volume", 1.84, { prefix: "$", suffix: "M", decimals: 2 }, "+12.4%", "up"],
  ["Net processed", 1.71, { prefix: "$", suffix: "M", decimals: 2 }, "+11.8%", "up"],
  ["Approval rate", 92.6, { suffix: "%", decimals: 1 }, "-1.1pt", "down"],
  ["Successful transactions", 14208, {}, "+9.2%", "up"],
  ["Pending settlement", 212480, { prefix: "$" }, "+3.0%", "up"],
  ["Available settlement", 148220, { prefix: "$" }, "—", "flat"],
  ["Refund rate", 2.1, { suffix: "%", decimals: 1 }, "-0.3pt", "up"],
  ["Chargeback rate", 0.62, { suffix: "%", decimals: 2 }, "+0.08pt", "down"]
];
var HEALTH = [["Approval-rate trend", "Stable", ""], ["Decline-rate trend", "Watch — UK debit", "warn"], ["Dispute trend", "Within threshold", ""], ["Refund trend", "Improving", "ok"], ["Reserve position", "98% of target", "ok"], ["Settlement status", "On schedule", "ok"]];
var ATTN = [
  ["red", "1 dispute requires evidence", "DSP-0221 · $89.00 · due Jul 14", "Respond"],
  ["amber", "Approval rate declined 4.2% on UK-02", "UK Visa debit · last 7 days", "Analyse"],
  ["amber", "MID US-01 nearing monthly threshold", "72% utilised · projected cap Jul 26", "Review"],
  ["amber", "Compliance document expiring", "Insurance certificate · Jul 20", "Upload"],
  ["grey", "Subscription retries underperforming", "Loop Club · attempt-2 window", "Inspect"]
];
function Kpi(k, i, compact) {
  return h("div", { key: i, className: cx("vtp-kpi", compact && "vtp-kpi--c") },
    h("div", { className: "vtp-kpi-l" }, k[0]),
    h("div", { className: "vtp-kpi-v" }, h(CountUp, Object.assign({ to: k[1] }, k[2]))),
    h("div", { className: "vtp-kpi-d vtp-" + k[4] }, k[3]),
    compact ? null : h("div", { className: "vtp-kpi-s" }, "vs previous period"));
}
function attnRow(a, i) {
  return h("div", { key: i, className: "vtp-attn", style: { animationDelay: (300 + i * 120) + "ms" } },
    h("span", { className: "vtp-dot vtp-dot--" + a[0] }),
    h("div", { style: { minWidth: 0, flex: 1 } }, h("div", { className: "vtp-attn-t" }, a[1]), h("div", { className: "vtp-attn-s" }, a[2])),
    h("span", { className: cx("vtp-mini", i === 0 || i === 2 ? "vtp-mini--on" : "") }, a[3]));
}
function VolumeChart(p) {
  var id = useUid("vc"), W = p.w || 880, H = p.h || 150;
  var r = rng(p.seed || 3);
  function series(base, amp, trend) { var pts = []; for (var i = 0; i <= 14; i++) pts.push([i / 14 * W, H - (base + trend * i / 14 + Math.sin(i * .9 + base) * amp + (r() - .5) * amp) * H]); return pts; }
  function path(pts) { var d = "M" + pts[0][0] + " " + pts[0][1]; for (var i = 1; i < pts.length; i++) { var a = pts[i - 1], b = pts[i], mx = (a[0] + b[0]) / 2; d += " C" + mx + " " + a[1] + " " + mx + " " + b[1] + " " + b[0] + " " + b[1]; } return d; }
  var S = [["Approved", G, series(.5, .1, .28)], ["Declined", RED, series(.2, .05, .02)], ["Refunded", "#e0a93b", series(.1, .03, 0)], ["Disputed", "#9fb3c8", series(.05, .02, 0)]];
  return h("div", null,
    p.legend === false ? null : h("div", { className: "vtp-legend" }, S.map(function (s) { return h("span", { key: s[0] }, h("i", { style: { background: s[1] } }), s[0]); })),
    h("svg", { viewBox: "0 0 " + W + " " + H, width: "100%", height: p.hPx || H, preserveAspectRatio: "none", style: { display: "block", overflow: "visible" }, "aria-hidden": true },
      h("defs", null, h("linearGradient", { id: id, x1: 0, y1: 0, x2: 0, y2: 1 }, h("stop", { offset: 0, stopColor: G, stopOpacity: .1 }), h("stop", { offset: 1, stopColor: G, stopOpacity: .1 }))),
      [.25, .5, .75].map(function (y) { return h("path", { key: y, d: "M0 " + H * y + "H" + W, stroke: "rgba(255,255,255,.05)" }); }),
      h("path", { d: path(S[0][2]) + " V" + H + " H0Z", fill: "url(#" + id + ")" }),
      S.map(function (s, i) { return h("path", { key: i, d: path(s[2]), fill: "none", stroke: s[1], strokeWidth: i === 0 ? 2 : 1.4, strokeOpacity: i === 0 ? 1 : .75, pathLength: 100, className: "vtp-draw", style: { animationDelay: (i * 150) + "ms", vectorEffect: "non-scaling-stroke" } }); }),
      h("circle", { cx: S[0][2][14][0], cy: S[0][2][14][1], r: 4, fill: G, className: "vtp-live" })));
}

function Portal(p) {
  p = p || {};
  var NAV = [["Overview", [["Overview", 1]]], ["Payments", [["Transactions"], ["Performance", 0, 1], ["Routing"], ["Settlements"], ["Reserves", 0, 1]]], ["Operations", [["Disputes", 0, 0, 2], ["Subscriptions"], ["Customers", 0, 1], ["Checkout Builder", 0, 1]]], ["Account", [["Reports", 0, 1], ["Documents", 0, 1], ["Settings", 0, 1]]]];
  var ui = h("div", { className: "vtp", style: { width: 1240, height: 860 } },
    h("aside", { className: "vtp-side" },
      h("div", { className: "vtp-brand" }, h(Diamond, { size: 9, glow: true }), h("b", null, "Vertlo"), h("span", null, "Portal")),
      NAV.map(function (g) { return h("div", { key: g[0], className: "vtp-group" }, h("div", { className: "vtp-group-t" }, g[0]), g[1].map(function (it) { return h("div", { key: it[0], className: cx("vtp-nav", it[1] && "vtp-nav--on", it[2] && "vtp-nav--dim") }, it[0], it[3] ? h("span", { className: "vtp-badge" }, it[3]) : null); })); }),
      h("div", { className: "vtp-side-foot" }, ["Search", "Notifications", "Help Centre"].map(function (x) { return h("div", { key: x, className: "vtp-nav vtp-nav--dim" }, "· " + x); }),
        h("div", { className: "vtp-user" }, h("span", { className: "vtp-av" }, "JR"), h("div", null, h("div", { style: { color: "var(--on-stealth)", fontSize: 13 } }, "Jordan Reyes"), h("div", { style: { fontSize: 11 } }, "Owner"))))),
    h("main", { className: "vtp-main" },
      h("div", { className: "vtp-top" }, h("div", null, h("b", null, p.merchant || "Nordvia Group LLC"), h("span", null, "All brands")),
        h("div", { className: "vtp-top-r" }, h("span", { className: "vtp-chip" }, "Last 30 days"), h("span", { className: "vtp-chip" }, "USD"), h("span", { className: "vtp-chip vtp-chip--w" }, "Download statement"))),
      h("div", { className: "vtp-body" },
        h("div", { className: "vtp-h" }, "Overview"), h("div", { className: "vtp-sub" }, "Your payment operation at a glance — all brands."),
        h("div", { className: "vtp-kpis" }, KPIS.map(function (k, i) { return Kpi(k, i); })),
        h("div", { className: "vtp-row2" },
          h("section", { className: "vtp-panel" }, h("div", { className: "vtp-panel-h" }, "Payment health", h("span", { className: "vtp-healthy" }, h("i", null), "Healthy")),
            HEALTH.map(function (r, i) { return h("div", { key: i, className: "vtp-hrow" }, h("span", null, r[0]), h("span", { className: "vtp-" + (r[2] || "n") }, r[1])); })),
          h("section", { className: "vtp-panel" }, h("div", { className: "vtp-panel-h" }, "Attention required", h("span", { style: { color: "var(--on-stealth-faint)", fontWeight: 400, fontSize: 12 } }, "5 items")), ATTN.map(attnRow))),
        h("section", { className: "vtp-panel", style: { marginTop: 14 } }, h("div", { className: "vtp-panel-h" }, "Payment volume"), h(VolumeChart, { w: 920, h: 120 })))));
  return p.fit === false ? ui : h(Fit, { w: 1240, h: 860, clipH: p.clipH, clipHMobile: p.clipHMobile }, ui);
}

/* PortalStage: the hero visual */
var POPS = [
  { cls: "a", time: "09:41", message: "MID US-01 paused. Traffic rerouted to UK-02 and US-03.", status: { tone: "paused", label: "Rerouted" } },
  { cls: "b", time: "09:52", message: "New MID approved: US-04. Added to routing.", status: { label: "Approved" } },
  { cls: "c", time: "10:07", message: "Dispute DSP-0221 caught early. Refunded before chargeback.", status: { label: "Saved" } }
];
function PortalStage(p) {
  p = p || {}; var React = R(); var ref = React.useRef(null), pr = usePauseOffscreen();
  function move(e) {
    if (reduced() || e.pointerType !== "mouse") return;
    var r = e.currentTarget.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    e.currentTarget.style.setProperty("--ry", (x * 6).toFixed(2) + "deg"); e.currentTarget.style.setProperty("--rx", (14 - y * 4).toFixed(2) + "deg");
  }
  function leave(e) { e.currentTarget.style.setProperty("--ry", "0deg"); e.currentTarget.style.setProperty("--rx", "14deg"); }
  return h("div", { ref: pr, className: cx("vt-stage", p.className), onPointerMove: move, onPointerLeave: leave },
    h("div", { className: "vt-stage-tilt" }, h("div", { className: "vt-stage-screen" }, h("div", { className: "vt-cam" }, h(Portal, { clipH: p.clipH || 580, clipHMobile: p.clipHMobile, merchant: p.merchant })))),
    h("div", { className: "vt-stage-caps", "aria-hidden": true }, ["Every number, live", "What needs attention", "Payment health"].map(function (t, i) { return h("span", { key: i, className: "vt-stage-cap vt-stage-cap--" + (i + 1) }, h("i", null), t); })),
    p.alerts === false ? null : h("div", { className: "vt-stage-pops" }, POPS.map(function (a, i) { return h("div", { key: i, className: "vt-stage-pop vt-stage-pop--" + a.cls }, h(Notification, Object.assign({ animate: false }, a))); })),
    p.label === false ? null : h("span", { className: "vt-stage-label" }, "Vertlo portal · illustrative data"));
}

/* CrmSlice: card-sized pieces of the portal */
/* site: status reads as a subtitle under the title (sub), not a badge */
function sliceHead(t, right, sub) { return h("div", { className: "vts-h" }, h("span", null, t, sub ? h("small", { className: "vts-sub" }, sub) : null), right || null); }
function midRow(id, prov, state, share, key, hot) {
  var dot = state === "Paused" ? "red" : state === "Approved" ? "green" : "green";
  return h("div", { key: key, className: cx("vts-row", hot && "vts-row--hot") },
    h("span", { className: "vtp-dot vtp-dot--" + dot + (state === "Live" ? " vtp-pulse" : "") }),
    h("span", { className: "vts-mono" }, id), h("span", { className: "vts-muted" }, prov),
    h("span", { className: "vts-right " + (state === "Paused" ? "vtp-down" : state === "Approved" ? "vtp-up" : "") }, share || state));
}
var SLICES = {
  kpis: function () { return h("div", { className: "vts-kpis" }, Kpi(KPIS[0], 0, true), Kpi(KPIS[2], 2, true), Kpi(KPIS[3], 3, true), Kpi(KPIS[7], 7, true)); },
  mids: function () {
    return h("div", null, sliceHead("Merchant accounts", null, "3 of 4 live · US-01 paused"),
      midRow("US-01", "Processor A", "Paused", "Paused · rerouted", 1),
      midRow("UK-02", "Processor B", "Live", "38% of volume", 2),
      midRow("US-03", "Processor C", "Live", "42% of volume", 3),
      midRow("US-04", "Processor A", "Approved", "New · 20%", 4, true));
  },
  routing: function () {
    return h("div", null, sliceHead("Routing rule", h("span", { className: "vts-toggle" }, "Failover", h("i", null))),
      h("div", { className: "vts-rule" }, "Balance by approval rate · all brands"),
      h("div", { className: "vts-split" }, h("span", { style: { width: "42%", background: G } }), h("span", { style: { width: "38%", background: "#0e8c40" } }), h("span", { style: { width: "20%", background: "#7cf0a8" } })),
      midRow("US-03", "92.9% approval", "Live", "42%", 1), midRow("UK-02", "91.8% approval", "Live", "38%", 2), midRow("US-04", "93.4% approval", "Live", "20%", 3));
  },
  dispute: function () {
    return h("div", null, sliceHead("Attention required", h("span", { className: "vts-muted" }, "2 items")),
      attnRow(ATTN[0], 0),
      h("div", { className: "vts-alert" }, h("span", { className: "vtp-dot vtp-dot--green vtp-pulse" }), h("div", null, h("b", null, "Alert received · DSP-0224"), h("div", { className: "vts-muted" }, "Refunded $54.00 before it became a chargeback")), h("span", { className: "vtp-up" }, "Saved")));
  },
  health: function () { return h("div", null, sliceHead("Payment health", null, "Within limits · 1 to watch"), HEALTH.slice(0, 5).map(function (r, i) { return h("div", { key: i, className: "vtp-hrow" }, h("span", null, r[0]), h("span", { className: "vtp-" + (r[2] || "n") }, r[1])); })); },
  attention: function () { return h("div", null, sliceHead("Attention required", h("span", { className: "vts-muted" }, "5 items")), ATTN.slice(0, 3).map(attnRow)); },
  underwriting: function () {
    var steps = [["Application submitted", "Jul 02", 1], ["Documents verified", "Jul 03", 1], ["Underwriting review", "Jul 05", 1], ["MID US-04 approved", "Jul 08", 2]];
    return h("div", null, sliceHead("New merchant account", null, "Approved Jul 08 · 6 days"),
      steps.map(function (s, i) { return h("div", { key: i, className: cx("vts-step", s[2] === 2 && "vts-step--on"), style: { animationDelay: (i * 160) + "ms" } }, h("span", { className: "vts-check" }, h(Icon, { name: "check", size: 12, strokeWidth: 2.4 })), h("span", null, s[0]), h("span", { className: "vts-right vts-muted" }, s[1])); }),
      h("div", { className: "vts-note" }, "Added to routing automatically"));
  },
  providers: function () {
    var pr = [["Processor A", "Visa · Mastercard", "Connected"], ["PayPal", "Wallet", "Connected"], ["Processor B", "Visa · Mastercard", "Connected"], ["Processor C", "Debit · Credit", "Connected"]];
    return h("div", null, sliceHead("Connected providers", h("span", { className: "vts-muted" }, "4 of 4")),
      pr.map(function (x, i) { return h("div", { key: i, className: "vts-row" }, h("span", { className: "vts-logo" }, x[0][0]), h("span", null, x[0]), h("span", { className: "vts-muted" }, x[1]), h("span", { className: "vts-right vtp-up" }, x[2])); }),
      h("div", { className: "vts-add" }, "+ Add provider"));
  },
  volume: function () { return h("div", null, sliceHead("Payment volume", h("span", { className: "vtp-up" }, "+12.4%")), h(VolumeChart, { w: 400, h: 130, legend: false, seed: 5 })); },
  subscriptions: function () {
    return h("div", null, sliceHead("Subscriptions", h("span", { className: "vts-muted" }, "Loop Club")),
      h("div", { className: "vts-big" }, h(CountUp, { to: 12480, prefix: "$" }), h("span", null, "recovered by smart retries")),
      [["Attempt 1", "68%"], ["Attempt 2 · 3 days", "21%"], ["Attempt 3 · 7 days", "11%"]].map(function (x, i) { return h("div", { key: i, className: "vts-bar" }, h("span", null, x[0]), h("i", null, h("b", { style: { width: x[1] } })), h("span", { className: "vts-mono" }, x[1])); }));
  },
  stores: function () {
    return h("div", null, sliceHead("All brands", h("span", { className: "vts-muted" }, "4 stores")),
      [["Nordvia", "$842k"], ["Loop Club", "$511k"], ["Kind Botanics", "$302k"], ["Northline", "$185k"]].map(function (x, i) { return h("div", { key: i, className: "vts-row" }, h("span", { className: "vts-logo" }, x[0][0]), h("span", null, x[0]), h("span", { className: "vts-right vts-mono" }, x[1])); }));
  }
};
function CrmSlice(p) {
  var f = SLICES[p.kind] || SLICES.mids;
  return h("div", { className: cx("vts", p.className), style: p.style, "aria-hidden": p.decorative ? true : undefined }, f());
}

/* ProductCard: icon chip, headline, body, and a real CRM slice peeking up from the bottom */
function ProductCard(p) {
  function onMove(e) { var r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--mx", (e.clientX - r.left) + "px"); e.currentTarget.style.setProperty("--my", (e.clientY - r.top) + "px"); }
  return h("article", { className: cx("vt-card-dk vt-spot vt-pc", p.size === "sm" && "vt-pc--sm", p.figure && "vt-pc--fig", p.featured && "vt-edge--on", p.className), onPointerMove: onMove },
    h("div", { className: "vt-pc-top" },
      h("div", { className: "vt-pc-head" }, h("span", { className: "vt-pc-icon" }, h(Icon, { name: p.icon || "route", size: 22 })), p.tag ? h(Pill, null, p.tag) : null),
      h("h3", { className: "vt-pc-title" }, p.title),
      p.body ? h("p", { className: "vt-pc-body" }, p.body) : null),
    h("div", { className: "vt-pc-stage", "aria-hidden": true },
      h("div", { className: "vt-pc-orb" }),
      p.figure ? h("div", { className: "vt-pc-fig" }, h(Figure, { kind: p.figure })) : h("div", { className: "vt-pc-ghost" }),
      p.figure ? null : h(CrmSlice, { kind: p.slice || "mids", className: "vt-pc-slice", decorative: true })));
}

/* ════════════════ FIGURES: stealthy line art that acts out what a card means ════════════════
   Figure({kind}) — 320×220, hairlines on a faint dot grid, light moving through the story. */
function mono(x, y, t, fill, anchor, size) { return h("text", { x: x, y: y, fill: fill || "rgba(242,246,243,.55)", fontSize: size || 8.5, fontFamily: "var(--font-mono)", letterSpacing: ".08em", textAnchor: anchor || "middle" }, t); }
function ico(name, x, y, s, stroke) { return h("g", { transform: "translate(" + (x - 12 * s) + " " + (y - 12 * s) + ") scale(" + s + ")", fill: "none", stroke: stroke || "rgba(242,246,243,.7)", strokeWidth: 1.4 / s, strokeLinecap: "round", strokeLinejoin: "round" }, h("path", { d: P[name] })); }
var FIGS = {
  routing: function () {
    var ins = [], outs = [], k, T = [[50, "42%", .42], [110, "38%", .38], [170, "20%", .2]];
    for (k = -2; k <= 2; k++) ins.push("M-10 " + (110 + k * 3) + " C60 " + (110 + k * 3) + " 80 110 118 110");
    T.forEach(function (t) { for (var j = -1; j <= 1; j++) outs.push("M126 110 C185 110 185 " + (t[0] + j * 3) + " 244 " + (t[0] + j * 3)); });
    return [
      ins.map(function (d, i) { return h("path", { key: "i" + i, d: d, stroke: i === 2 ? W3 : W1, fill: "none" }); }),
      outs.map(function (d, i) { return h("path", { key: "o" + i, d: d, stroke: i % 3 === 1 ? GL : W1, fill: "none" }); }),
      h(Beam, { key: "b0", d: ins[2], dur: 2.6 }),
      T.map(function (t, i) { return h(Beam, { key: "bo" + i, d: outs[i * 3 + 1], dur: 2.6, delay: 1 + i * .35 }); }),
      h(Ripple, { key: "r", cx: 122, cy: 110, r: 26 }), glowDia(122, 110, 12, "n"),
      T.map(function (t, i) { return h("g", { key: "t" + i }, h("rect", { x: 246, y: t[0] - 15, width: 62, height: 30, rx: 8, fill: "#151816", stroke: W2 }), h("rect", { x: 254, y: t[0] + 5, width: 46, height: 3, rx: 1.5, fill: "rgba(255,255,255,.08)" }), h("rect", { className: "vt-fig-grow", x: 254, y: t[0] + 5, width: 46 * t[2] / .42, height: 3, rx: 1.5, fill: "rgba(255,255,255,.55)", style: { animationDelay: (1.4 + i * .35) + "s" } }), mono(277, t[0] - 1, t[1], "#f2f6f3", "middle", 9)); }),
      mono(122, 150, "SPLIT BY RULE")
    ];
  },
  failover: function () {
    var inL = "M-10 110 C40 110 60 110 92 110", dead = "M92 110 L138 110", up = "M92 110 C130 110 150 50 236 50", dn = "M92 110 C130 110 150 170 236 170";
    return [
      h("path", { key: "a", d: inL, stroke: W3, fill: "none" }), h("path", { key: "d", d: dead, stroke: RED, strokeOpacity: .6, strokeDasharray: "3 4", fill: "none" }),
      h("path", { key: "u", d: up, stroke: GL, fill: "none" }), h("path", { key: "w", d: dn, stroke: GL, fill: "none" }),
      h(Beam, { key: "b1", d: inL + " " + up.replace("M92 110", ""), dur: 2.8 }), h(Beam, { key: "b2", d: inL + " " + dn.replace("M92 110", ""), dur: 2.8, delay: 1.4 }),
      h(Ripple, { key: "rp", cx: 160, cy: 110, r: 24, color: RED, n: 2, dur: 2.8 }),
      h("circle", { key: "m", cx: 160, cy: 110, r: 20, fill: "#181414", stroke: "rgba(229,72,77,.7)" }), h("path", { key: "pb", d: "M155 103v14M165 103v14", stroke: RED, strokeWidth: 2.2, strokeLinecap: "round" }),
      mono(160, 146, "PAUSED", "rgba(229,72,77,.85)"),
      [[258, 50], [258, 170]].map(function (q, i) { return h("g", { key: "n" + i }, h("rect", { x: q[0] - 22, y: q[1] - 14, width: 58, height: 28, rx: 8, fill: "#151816", stroke: GL }), h("circle", { className: "vt-ping", cx: q[0] - 10, cy: q[1], r: 4, fill: "none", stroke: G, style: { animationDuration: "2.8s", animationDelay: (2 + i * 1.4) + "s" } }), h("circle", { cx: q[0] - 10, cy: q[1], r: 3, fill: G }), mono(q[0] + 12, q[1] + 3, "LIVE", "#f2f6f3")); })
    ];
  },
  disputes: function () {
    var ticks = []; for (var x = 20; x <= 300; x += 14) ticks.push("M" + x + " 150v" + (x % 56 === 20 ? 8 : 4));
    var arc = "M150 140 C132 62 64 62 46 138";
    return [
      h("path", { key: "tl", d: "M10 150H310", stroke: W2 }), h("path", { key: "tk", d: ticks.join(""), stroke: W1 }),
      h(Beam, { key: "bt", d: "M40 150H150", dur: 3 }),
      h("circle", { key: "o", cx: 40, cy: 150, r: 5, fill: "#f2f6f3" }), mono(40, 176, "ORDER"),
      h("path", { key: "arc", d: arc, stroke: W3, fill: "none", strokeDasharray: "3 3" }), h("path", { key: "ah", d: "M40 131 L46 140 L54 133", stroke: G, fill: "none", strokeWidth: 1.4 }),
      h(Beam, { key: "ba", d: arc, dur: 3, delay: 1.3 }), mono(96, 64, "REFUNDED", "rgba(242,246,243,.75)"),
      h(Ripple, { key: "rp", cx: 150, cy: 150, r: 20 }), glowDia(150, 150, 11, "al"), ico("bell", 150, 118, .7, "rgba(242,246,243,.75)"), mono(150, 176, "ALERT", "rgba(242,246,243,.75)"),
      h("circle", { key: "c", cx: 272, cy: 150, r: 9, fill: "none", stroke: "rgba(229,72,77,.45)", strokeDasharray: "2 3" }), h("path", { key: "x", d: "M266 144l12 12M278 144l-12 12", stroke: "rgba(229,72,77,.6)" }),
      h("text", { key: "cb", x: 272, y: 176, fill: "rgba(229,72,77,.55)", fontSize: 8.5, fontFamily: "var(--font-mono)", letterSpacing: ".08em", textAnchor: "middle", textDecoration: "line-through" }, "CHARGEBACK")
    ];
  },
  stores: function () {
    var xs = [52, 124, 196, 268], lines = xs.map(function (x) { return "M" + x + " 62 C" + x + " 110 160 100 160 138"; });
    return [
      lines.map(function (d, i) { return h("path", { key: "l" + i, d: d, stroke: W2, fill: "none" }); }),
      lines.map(function (d, i) { return h(Beam, { key: "b" + i, d: d, dur: 2.6, delay: i * .5 }); }),
      xs.map(function (x, i) { return h("g", { key: "s" + i }, h("rect", { x: x - 20, y: 22, width: 40, height: 40, rx: 11, fill: "#151816", stroke: W2 }), ico("store", x, 42, .72)); }),
      h("rect", { key: "f", x: 78, y: 138, width: 164, height: 66, rx: 12, fill: "#151816", stroke: GL }),
      [0, 1, 2].map(function (r) { return h("g", { key: "r" + r }, h("rect", { x: 92, y: 152 + r * 16, width: 50, height: 5, rx: 2.5, fill: "rgba(255,255,255,.14)" }), h("rect", { className: "vt-fig-grow", x: 170, y: 152 + r * 16, width: [52, 38, 26][r], height: 5, rx: 2.5, fill: r === 0 ? G : GL, style: { animationDelay: (r * .3) + "s" } })); }),
      mono(160, 216, "ONE CRM")
    ];
  },
  supplements: function () {
    var ticks = []; for (var i = 0; i < 12; i++) { var a = i / 12 * Math.PI * 2 - Math.PI / 2; ticks.push([160 + Math.cos(a) * 88, 110 + Math.sin(a) * 88, i]); }
    return [
      h("circle", { key: "o1", cx: 160, cy: 110, r: 88, fill: "none", stroke: W1 }),
      h("circle", { key: "o2", cx: 160, cy: 110, r: 64, fill: "none", stroke: W2, strokeDasharray: "2 5" }),
      ticks.map(function (t) { return h("g", { key: "t" + t[2] }, h("circle", { cx: t[0], cy: t[1], r: t[2] === 3 ? 4.5 : 2.4, fill: t[2] <= 3 ? G : "rgba(255,255,255,.3)" })); }),
      h(Beam, { key: "bm", d: "M160 22 A88 88 0 0 1 248 110", dur: 3.2 }),
      h("g", { key: "orb", className: "vt-spin", style: { animationDuration: "18s" } }, [0, 1, 2].map(function (i) { var a = i / 3 * Math.PI * 2; return dia(160 + Math.cos(a) * 64, 110 + Math.sin(a) * 64, 7, i ? "rgba(255,255,255,.4)" : G, "d" + i); })),
      h("g", { key: "cap", transform: "rotate(-35 160 110)" }, h("rect", { x: 132, y: 97, width: 56, height: 26, rx: 13, fill: "#151816", stroke: W3 }), h("path", { d: "M160 97v26", stroke: W3 }), h("path", { d: "M145 97H160V123H145A13 13 0 0 1 145 97Z", fill: "rgba(255,255,255,.12)", stroke: "rgba(242,246,243,.7)" })),
      mono(160, 214, "REORDER EVERY 30 DAYS")
    ];
  },
  subscriptions: function () {
    var loop = "M160 40 A70 70 0 1 1 159.9 40", nodes = [];
    for (var i = 0; i < 6; i++) { var a = i / 6 * Math.PI * 2 - Math.PI / 2; nodes.push([160 + Math.cos(a) * 70, 110 + Math.sin(a) * 70, i]); }
    var f = nodes[2];
    return [
      h("path", { key: "l", d: loop, stroke: W2, fill: "none", strokeDasharray: "2 4" }),
      h(Beam, { key: "b", d: loop, dur: 5 }),
      nodes.map(function (n) { return n[2] === 2 ? null : h("circle", { key: "n" + n[2], cx: n[0], cy: n[1], r: 5, fill: "#151816", stroke: "rgba(255,255,255,.4)" }); }),
      h("circle", { key: "fail", cx: f[0], cy: f[1], r: 6, fill: "#181414", stroke: RED }),
      h("path", { key: "r1", d: "M" + (f[0] + 6) + " " + (f[1] + 2) + " c24 4 34 22 22 34", stroke: GL, fill: "none", strokeDasharray: "2 3" }),
      h("path", { key: "r2", d: "M" + (f[0] + 28) + " " + (f[1] + 36) + " c-6 14 -22 20 -36 12", stroke: GL, fill: "none", strokeDasharray: "2 3" }),
      h(Ripple, { key: "rp", cx: f[0] - 8, cy: f[1] + 48, r: 14, n: 2 }), glowDia(f[0] - 8, f[1] + 48, 9, "ok"),
      mono(f[0] + 44, f[1] - 6, "FAILED", "rgba(229,72,77,.8)", "start"), mono(f[0] + 20, f[1] + 70, "RETRY → RECOVERED", "rgba(242,246,243,.75)", "middle"),
      ico("refresh", 160, 110, 1.1, "rgba(242,246,243,.5)")
    ];
  },
  digital: function () {
    var burst = []; for (var i = 0; i < 10; i++) { var a = i / 10 * Math.PI * 2; burst.push("M" + (262 + Math.cos(a) * 30) + " " + (110 + Math.sin(a) * 30) + "L" + (262 + Math.cos(a) * 40) + " " + (110 + Math.sin(a) * 40)); }
    return [
      h("rect", { key: "c", x: 22, y: 80, width: 92, height: 60, rx: 9, fill: "#151816", stroke: W3 }), h("path", { key: "cs", d: "M22 96H114", stroke: W2, strokeWidth: 6 }), h("rect", { key: "ch", x: 32, y: 112, width: 16, height: 12, rx: 3, fill: "none", stroke: "rgba(242,246,243,.6)" }),
      h("path", { key: "l1", d: "M114 110H186", stroke: W2 }), h("path", { key: "l2", d: "M198 110H240", stroke: GL }),
      h(Beam, { key: "b", d: "M114 110H240", dur: 2.4 }),
      h(Ripple, { key: "rp", cx: 192, cy: 110, r: 18 }), h("circle", { key: "ok", cx: 192, cy: 110, r: 12, fill: G }), h("path", { key: "ck", d: "M186 110l4 4 8-8", stroke: "#0b1410", strokeWidth: 2.2, fill: "none", strokeLinecap: "round" }),
      h("g", { key: "bs", className: "vt-fig-burst" }, h("path", { d: burst.join(""), stroke: MINT, strokeWidth: 1.2, strokeLinecap: "round" })),
      h("rect", { key: "k", x: 244, y: 92, width: 36, height: 36, rx: 10, fill: "#151816", stroke: W3 }), ico("code", 262, 110, .7, MINT),
      mono(68, 162, "PAID"), mono(192, 146, "APPROVED", "rgba(242,246,243,.75)"), mono(262, 150, "DELIVERED")
    ];
  },
  setup: function () {
    var ps = [["V", 50], ["M", 110], ["P", 170]], ls = ps.map(function (q) { return "M46 " + q[1] + " C110 " + q[1] + " 110 110 150 110"; });
    return [
      ls.map(function (d, i) { return h("path", { key: "l" + i, d: d, stroke: W2, fill: "none", strokeDasharray: "3 4" }); }),
      ls.map(function (d, i) { return h(Beam, { key: "b" + i, d: d, dur: 3, delay: i * .6 }); }),
      ps.map(function (q, i) { return h("g", { key: "p" + i }, h("circle", { cx: 32, cy: q[1], r: 15, fill: "#151816", stroke: W3 }), h("text", { x: 32, y: q[1] + 4, fill: "#f2f6f3", fontSize: 11, fontWeight: 700, textAnchor: "middle" }, q[0])); }),
      h("g", { key: "ring", className: "vt-spin", style: { animationDuration: "24s" } }, h("circle", { cx: 172, cy: 110, r: 38, fill: "none", stroke: GL, strokeDasharray: "2 5" })),
      h("rect", { key: "core", x: 150, y: 88, width: 44, height: 44, rx: 12, fill: "#0b1410", stroke: W3 }), glowDia(172, 110, 12, "cd"),
      h("path", { key: "o", d: "M210 110H300", stroke: GL }), h(Beam, { key: "bo", d: "M210 110H300", dur: 3, delay: 1.8 }),
      mono(255, 98, "LIVE", "rgba(242,246,243,.75)"), mono(172, 168, "ONE-TIME SETUP")
    ];
  },
  percent: function () {
    var beams = []; for (var i = 0; i < 4; i++) beams.push(h(Beam, { key: "b" + i, d: "M-10 104H330", dur: 4, delay: i, w: 1.6 }));
    return [
      h("path", { key: "ln", d: "M-10 104H330", stroke: W2 }), beams,
      h("path", { key: "g1", d: "M150 84v40M170 84v40", stroke: W3, strokeWidth: 1.5 }),
      h("rect", { key: "g", x: 150, y: 84, width: 20, height: 40, fill: "rgba(22,196,90,.08)" }),
      h("path", { key: "drop", d: "M160 124V160", stroke: GL, strokeDasharray: "2 3" }), h(Beam, { key: "bd", d: "M160 124V166", dur: 2, delay: .6 }),
      h("rect", { key: "box", x: 134, y: 166, width: 52, height: 30, rx: 8, fill: "#151816", stroke: GL }), h("text", { key: "pc", x: 160, y: 186, fill: G, fontSize: 14, fontWeight: 700, textAnchor: "middle" }, "%"),
      [40, 80, 240, 280].map(function (x, i) { return h("g", { key: "t" + i }, h("rect", { x: x - 12, y: 60, width: 24, height: 14, rx: 4, fill: "#151816", stroke: W2 }), h("text", { x: x, y: 70, fill: "rgba(242,246,243,.6)", fontSize: 7, fontFamily: "var(--font-mono)", textAnchor: "middle" }, "$")); }),
      mono(160, 70, "PER TRANSACTION", "rgba(242,246,243,.75)")
    ];
  },
  quote: function () {
    var ticks = []; for (var i = 0; i <= 30; i++) { var a = Math.PI + i / 30 * Math.PI, r1 = i % 5 ? 84 : 78; ticks.push("M" + (160 + Math.cos(a) * r1) + " " + (160 + Math.sin(a) * r1) + "L" + (160 + Math.cos(a) * 90) + " " + (160 + Math.sin(a) * 90)); }
    return [
      h("path", { key: "arc", d: "M70 160 A90 90 0 0 1 250 160", stroke: W1, fill: "none" }),
      h("path", { key: "tk", d: ticks.join(""), stroke: W3 }),
      h("path", { key: "band", d: "M" + (160 + Math.cos(Math.PI * 1.45) * 66) + " " + (160 + Math.sin(Math.PI * 1.45) * 66) + " A66 66 0 0 1 " + (160 + Math.cos(Math.PI * 1.7) * 66) + " " + (160 + Math.sin(Math.PI * 1.7) * 66), stroke: G, strokeWidth: 4, fill: "none", strokeLinecap: "round", opacity: .8 }),
      h("g", { key: "nd", className: "vt-needle" }, h("path", { d: "M160 160L160 86", stroke: "#f2f6f3", strokeWidth: 1.6, strokeLinecap: "round" }), dia(160, 86, 6, G, "tip", {})),
      h("circle", { key: "hub", cx: 160, cy: 160, r: 8, fill: "#151816", stroke: W3 }),
      mono(160, 196, "TUNED TO YOUR BUSINESS")
    ];
  },
  call: function () {
    var cells = [];
    for (var r = 0; r < 4; r++) for (var c = 0; c < 7; c++) { var hot = r === 2 && c === 4; cells.push(h("rect", { key: r + "-" + c, x: 76 + c * 24, y: 58 + r * 24, width: 18, height: 18, rx: 5, fill: hot ? G : "#151816", stroke: hot ? "none" : W1, style: undefined })); }
    return [
      h("rect", { key: "f", x: 64, y: 30, width: 192, height: 136, rx: 14, fill: "none", stroke: W2 }), h("path", { key: "hd", d: "M64 50H256", stroke: W1 }),
      [0, 1, 2].map(function (i) { return h("circle", { key: "d" + i, cx: 78 + i * 9, cy: 40, r: 2.5, fill: W3 }); }),
      cells, h(Ripple, { key: "rp", cx: 181, cy: 115, r: 18, n: 3 }),
      mono(160, 196, "PICK A TIME")
    ];
  }
};
function Figure(p) {
  var id = useUid("fg"), ref = usePauseOffscreen(), f = FIGS[p.kind] || FIGS.routing;
  return h("svg", { ref: ref, viewBox: "0 0 320 220", fill: "none", "aria-hidden": true, className: cx("vt-fig", p.className), style: Object.assign({ display: "block", width: "100%", height: "auto", overflow: "visible" }, p.style) },
    h("defs", null,
      h("pattern", { id: id + "p", width: 16, height: 16, patternUnits: "userSpaceOnUse" }, h("circle", { cx: 1, cy: 1, r: .7, fill: "rgba(255,255,255,.12)" })),
      h("radialGradient", { id: id + "g", cx: .5, cy: .5, r: .6 }, h("stop", { offset: 0, stopColor: "#fff" }), h("stop", { offset: 1, stopColor: "#fff", stopOpacity: 0 })),
      h("mask", { id: id + "m" }, h("rect", { x: -40, y: -40, width: 400, height: 300, fill: "url(#" + id + "g)" }))),
    h("rect", { x: -40, y: -40, width: 400, height: 300, fill: "url(#" + id + "p)", mask: "url(#" + id + "m)" }),
    f());
}

/* LineField: quiet abstract hairlines (seeded, so each card gets its own) with one slow light. Pure minimalism, no labels. */
function LineField(p) {
  p = p || {}; var id = useUid("lf"), ref = usePauseOffscreen(), r = rng((p.seed || 1) * 977 + 13), i, curves = [], n = p.count || 15;
  for (i = 0; i < n; i++) {
    var y0 = 30 + r() * 170, y1 = 30 + r() * 170, c1 = 60 + r() * 60, c2 = 200 + r() * 60, cy1 = r() * 220, cy2 = r() * 220;
    curves.push("M-10 " + y0.toFixed(1) + " C" + c1.toFixed(0) + " " + cy1.toFixed(0) + " " + c2.toFixed(0) + " " + cy2.toFixed(0) + " 330 " + y1.toFixed(1));
  }
  var hi = [2, 7, 11].map(function (k) { return k % n; });
  return h("svg", { ref: ref, viewBox: "0 0 320 220", fill: "none", "aria-hidden": true, className: cx("vt-fig", p.className), style: { display: "block", width: "100%", height: "auto", overflow: "visible" } },
    h("defs", null, h("linearGradient", { id: id + "g", x1: 0, y1: 0, x2: 1, y2: 0 }, h("stop", { offset: 0, stopColor: "#fff", stopOpacity: 0 }), h("stop", { offset: .25, stopColor: "#fff" }), h("stop", { offset: .75, stopColor: "#fff" }), h("stop", { offset: 1, stopColor: "#fff", stopOpacity: 0 })), h("mask", { id: id + "m" }, h("rect", { x: 0, y: -20, width: 320, height: 260, fill: "url(#" + id + "g)" }))),
    h("g", { mask: "url(#" + id + "m)" },
      curves.map(function (d, k) { return h("path", { key: k, d: d, stroke: hi.indexOf(k) >= 0 ? "rgba(22,196,90,.4)" : (k % 3 === 0 ? W2 : W1) }); }),
      h(Beam, { d: curves[hi[0]], dur: 5, delay: 0 }), h(Beam, { d: curves[hi[1]], dur: 6, delay: 2.2, color: MINT })));
}

/* ════════ FeatureStrip: four columns split by dashed rules, each a hand-drawn glyph + UPPERCASE title + muted line ════════
   Glyphs are drawn from what each column says (not generic icons): accounts / failover / alerts / underwriting / supplements / subscriptions / digital. */
var FS_S = "rgba(242,246,243,.6)";
function fsL(d, k, o) { return h("path", Object.assign({ key: k, d: d, pathLength: 100, className: "vt-fs-draw", stroke: FS_S, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" }, o)); }
var FS_ICONS = {
  accounts: function () {
    var sat = [[24, 28], [96, 28], [60, 100]], out = [];
    sat.forEach(function (q, i) {
      out.push(fsL("M" + q[0] + " " + q[1] + " L60 60", "l" + i, { strokeOpacity: .55, style: { animationDelay: (i * .15) + "s" } }));
      out.push(h(Beam, { key: "b" + i, d: "M" + q[0] + " " + q[1] + " L60 60", dur: 3, delay: i * .8, color: FS_S, w: 1.8 }));
      out.push(h("g", { key: "s" + i }, h("rect", { x: q[0] - 11, y: q[1] - 11, width: 22, height: 22, rx: 7, fill: "#0b1410", stroke: FS_S, strokeWidth: 1.5 }), h("circle", { cx: q[0], cy: q[1], r: 3, fill: FS_S })));
    });
    return [h("circle", { key: "ring", cx: 60, cy: 60, r: 46, stroke: FS_S, strokeOpacity: .25, strokeDasharray: "2 5", fill: "none" }), out,
      h(Ripple, { key: "rp", cx: 60, cy: 60, r: 22, color: FS_S, n: 2, dur: 3.2 }),
      h("g", { key: "c", transform: "translate(60 60) rotate(45)" }, h("rect", { className: "vt-breathe", x: -13, y: -13, width: 26, height: 26, rx: 5, fill: "#0b1410", stroke: FS_S, strokeWidth: 2 }), h("rect", { x: -5, y: -5, width: 10, height: 10, rx: 2, fill: FS_S }))];
  },
  failover: function () {
    var up = "M14 60 C36 60 40 26 96 26", dn = "M14 60 C36 60 40 94 96 94";
    return [fsL(up, "u", { strokeOpacity: .8 }), fsL(dn, "d", { strokeOpacity: .8, style: { animationDelay: ".2s" } }),
      h(Beam, { key: "bu", d: up, dur: 2.8, color: FS_S, w: 2 }), h(Beam, { key: "bd", d: dn, dur: 2.8, delay: 1.4, color: FS_S, w: 2 }),
      h("path", { key: "x", d: "M28 60 H92", stroke: RED, strokeOpacity: .35, strokeDasharray: "2 5" }),
      h("circle", { key: "src", cx: 14, cy: 60, r: 6, fill: "#0b1410", stroke: FS_S, strokeWidth: 1.6 }),
      h(Ripple, { key: "rp", cx: 60, cy: 60, r: 20, color: RED, n: 2, dur: 3 }),
      h("circle", { key: "m", cx: 60, cy: 60, r: 15, fill: "#0b1410", stroke: RED, strokeOpacity: .8, strokeWidth: 1.5 }), h("path", { key: "pz", d: "M55 53v14M65 53v14", stroke: RED, strokeWidth: 2.4, strokeLinecap: "round" }),
      [[100, 26], [100, 94]].map(function (q, i) { return h("g", { key: "e" + i }, h("rect", { x: q[0] - 9, y: q[1] - 9, width: 18, height: 18, rx: 6, fill: "#0b1410", stroke: FS_S, strokeWidth: 1.5 }), h("circle", { cx: q[0], cy: q[1], r: 3, fill: FS_S })); })];
  },
  alerts: function () {
    return [h("path", { key: "bell", d: "M38 78 V56 a22 22 0 0 1 44 0 V78 l6 8 H32 z M52 94 h16", pathLength: 100, className: "vt-fs-draw", stroke: FS_S, strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" }),
      [[24, 44, 30], [16, 56, 42]].map(function (a, i) { return [h("path", { key: "l" + i, className: "vt-fs-wave", d: "M" + (60 - a[0]) + " " + (60 - a[1] + 20) + " a" + a[2] + " " + a[2] + " 0 0 0 0 " + (a[1] - 22), stroke: FS_S, strokeWidth: 1.4, strokeLinecap: "round", fill: "none", style: { animationDelay: (i * .5) + "s" } }),
        h("path", { key: "r" + i, className: "vt-fs-wave", d: "M" + (60 + a[0]) + " " + (60 - a[1] + 20) + " a" + a[2] + " " + a[2] + " 0 0 1 0 " + (a[1] - 22), stroke: FS_S, strokeWidth: 1.4, strokeLinecap: "round", fill: "none", style: { animationDelay: (i * .5) + "s" } })]; }),
      h(Beam, { key: "bb", d: "M38 78 V56 a22 22 0 0 1 44 0 V78", dur: 3.4, color: FS_S, w: 2 }),
      h("g", { key: "d", transform: "translate(60 22)" }, h(Ripple, { cx: 0, cy: 0, r: 12, color: FS_S, n: 2, dur: 2.6 }), h("rect", { className: "vt-breathe", x: -5, y: -5, width: 10, height: 10, rx: 2, fill: FS_S, transform: "rotate(45)" }))];
  },
  underwriting: function () {
    return [h("path", { key: "doc", d: "M34 18 H70 L88 36 V96 a6 6 0 0 1 -6 6 H34 a6 6 0 0 1 -6 -6 V24 a6 6 0 0 1 6 -6 z M70 18 V36 H88", pathLength: 100, className: "vt-fs-draw", stroke: FS_S, strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" }),
      [50, 62, 74].map(function (y, i) { return h("path", { key: "t" + i, className: "vt-fs-draw", pathLength: 100, d: "M40 " + y + " H" + (i === 2 ? 58 : 76), stroke: FS_S, strokeOpacity: .5, strokeWidth: 1.6, strokeLinecap: "round", style: { animationDelay: (.3 + i * .15) + "s" } }); }),
      h(Beam, { key: "bd", d: "M40 50 H76", dur: 3, color: FS_S, w: 1.8 }),
      h(Ripple, { key: "rp", cx: 88, cy: 90, r: 20, color: FS_S, n: 2, dur: 3.2 }),
      h("g", { key: "st", transform: "translate(88 90) rotate(45)" }, h("rect", { className: "vt-breathe", x: -15, y: -15, width: 30, height: 30, rx: 6, fill: "#0b1410", stroke: FS_S, strokeWidth: 1.8 })),
      h("path", { key: "ck", d: "M80 90 l6 6 l11 -12", stroke: FS_S, strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round", fill: "none", pathLength: 100, className: "vt-fs-tick" })];
  }
};

/* Quiet glyphs (variant="quiet"): static, layered hairlines that fade from bright mint (front) to deep green (back). No motion, no glow. */
var QCD = ["#f2f6f3", "#9aa5a0", "#5a6660"], QCL = ["#0b1410", "#55625b", "#a3ada7"], QC = QCD, QW = 1.5;
function qP(d, k, c, o) { return h("path", Object.assign({ key: k, d: d, stroke: c, strokeWidth: QW, strokeLinecap: "round", strokeLinejoin: "round", fill: "none" }, o)); }
function qArc(r, a0, a1, k, c) {
  var R = Math.PI / 180, x0 = 60 + r * Math.cos(a0 * R), y0 = 60 + r * Math.sin(a0 * R), x1 = 60 + r * Math.cos(a1 * R), y1 = 60 + r * Math.sin(a1 * R);
  var t = (a1 + 90) * R, hd = 7, back = function (d) { return [x1 - hd * Math.cos(t + d), y1 - hd * Math.sin(t + d)]; }, p1 = back(.55), p2 = back(-.55);
  return [qP("M" + x0.toFixed(1) + " " + y0.toFixed(1) + " A" + r + " " + r + " 0 1 1 " + x1.toFixed(1) + " " + y1.toFixed(1), k + "a", c),
    qP("M" + p1[0].toFixed(1) + " " + p1[1].toFixed(1) + " L" + x1.toFixed(1) + " " + y1.toFixed(1) + " L" + p2[0].toFixed(1) + " " + p2[1].toFixed(1), k + "h", c)];
}
var QUIET_ICONS = {
  supplements: function () {
    var out = [];
    for (var i = 0; i < 8; i++) {
      var c = QC[i % 2 === 0 ? (i % 4 === 0 ? 0 : 1) : 2];
      out.push(h("g", { key: "c" + i, transform: "rotate(" + (i * 45) + " 60 60) translate(60 30) rotate(90)" },
        h("rect", { x: -11, y: -5.5, width: 22, height: 11, rx: 5.5, stroke: c, strokeWidth: QW, fill: "none" }),
        h("path", { d: "M0 -5.5 V5.5", stroke: c, strokeWidth: QW * .9 })));
    }
    return [out, h("circle", { key: "ctr", cx: 60, cy: 60, r: 7, stroke: QC[0], strokeWidth: QW, fill: "none" })];
  },
  subscriptions: function () {
    return [qArc(14, -60, 230, "a", QC[0]), qArc(27, -30, 260, "b", QC[1]), qArc(40, 0, 285, "c", QC[2]),
      h("g", { key: "d", transform: "translate(60 60) rotate(45)" }, h("rect", { x: -4, y: -4, width: 8, height: 8, rx: 1.5, fill: QC[0] }))];
  },
  digital: function () {
    var sheet = function (dx, dy, c, k) { return qP("M" + (30 + dx) + " " + (12 + dy) + " H" + (62 + dx) + " L" + (80 + dx) + " " + (30 + dy) + " V" + (78 + dy) + " a6 6 0 0 1 -6 6 H" + (30 + dx) + " a6 6 0 0 1 -6 -6 V" + (18 + dy) + " a6 6 0 0 1 6 -6 z", k, c); };
    return [sheet(18, 22, QC[2], "s3"), sheet(9, 11, QC[1], "s2"), sheet(0, 0, QC[0], "s1"),
      qP("M62 12 V30 H80", "fold", QC[0]),
      qP("M55 44 V66 M45 57 L55 67 L65 57", "arrow", QC[0], { strokeWidth: QW * 1.2 }),
      qP("M40 76 H70", "base", QC[0], { strokeOpacity: .6 })];
  }
};
function FeatureStrip(p) {
  var items = p.items || [], ref = usePauseOffscreen();
  return h("div", { ref: ref, className: cx("vt-fs", p.variant === "quiet" && "vt-fs--quiet", p.tone === "light" && "vt-fs--light", p.className), style: { "--n": items.length || 4, "--tmin": (items.length || 4) > 3 ? "62px" : "0px" } }, items.map(function (it, i) {
    QC = p.tone === "light" ? QCL : QCD; QW = p.tone === "light" ? 2.1 : 1.5;
    var f = (p.variant === "quiet" && QUIET_ICONS[it.icon]) || FS_ICONS[it.icon] || FS_ICONS.accounts;
    return h("div", { key: i, className: "vt-fs-col", style: { "--i": i } },
      h("svg", { className: "vt-fs-icon", viewBox: "0 0 120 120", width: p.variant === "quiet" ? 112 : 132, height: p.variant === "quiet" ? 112 : 132, fill: "none", "aria-hidden": true, style: { overflow: "visible" } }, f()),
      h("h3", { className: "vt-fs-title" }, it.title),
      h("p", { className: "vt-fs-body" }, it.body));
  }));
}

/* ── CountUp ── */
function CountUp(p) {
  var React = R(); var ref = React.useRef(null);
  var st = React.useState(reduced() ? p.to : 0), v = st[0], set = st[1];
  React.useEffect(function () {
    if (reduced()) return;
    var el = ref.current, raf, done = false;
    var io = new IntersectionObserver(function (e) {
      if (!e[0].isIntersecting || done) return; done = true;
      var t0 = performance.now(), d = p.duration || 1200;
      (function tick(t) { var k = Math.min(1, (t - t0) / d); var e5 = 1 - Math.pow(1 - k, 5); set(p.to * e5); if (k < 1) raf = requestAnimationFrame(tick); })(t0);
    });
    io.observe(el);
    return function () { io.disconnect(); cancelAnimationFrame(raf); };
  }, [p.to]);
  var dec = p.decimals || 0;
  return h("span", { ref: ref, className: "vt-tnum" }, (p.prefix || "") + Number(v).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + (p.suffix || ""));
}

/* ── RotatingWord (Viktor lesson) ── */
function RotatingWord(p) {
  var React = R(); var words = p.words || [""];
  var st = React.useState(0), i = st[0], set = st[1];
  React.useEffect(function () {
    if (reduced() || words.length < 2) return;
    var t = setInterval(function () { set(function (x) { return (x + 1) % words.length; }); }, p.interval || 2200);
    return function () { clearInterval(t); };
  }, [words.length]);
  return h("span", { className: "vt-rot", "aria-live": "off" }, words.map(function (w, k) {
    var s = k === i ? "in" : (k === (i - 1 + words.length) % words.length ? "out" : "next");
    return h("span", { key: k, "data-s": s, "aria-hidden": k !== i }, w);
  }));
}

/* ── Nav ── */
function Nav(p) {
  p = p || {};
  var links = p.links || ["Product", "Industries", "Reviews", "Company"];
  return h("nav", { className: cx("vt-nav", p.tone === "stealth" && "vt-nav--stealth", p.scrolled && "vt-nav--scrolled"), "aria-label": "Main" },
    h(Logo, null),
    h("ul", { className: "vt-nav-links" }, links.map(function (l) { var it = typeof l === "string" ? { label: l, href: "#" } : l; return h("li", { key: it.label }, h("a", { href: it.href }, it.label)); })),
    h("div", { className: "vt-nav-end" },
      h(Button, { variant: "text", href: p.loginHref || "#" }, p.loginLabel || "Login"),
      h(Button, { size: "sm", href: p.ctaHref || "#" }, p.ctaLabel || "Book a call")));
}

/* ── Hero ── */
function Hero(p) {
  var dark = p.variant === "stealth";
  var body = [
    p.eyebrow ? h(Pill, { key: "e", tone: dark ? "stealth" : "green" }, p.eyebrow) : null,
    h("h1", { key: "t", className: "vt-hero-t" }, p.title),
    p.subhead ? h("p", { key: "s" }, p.subhead) : null,
    h("div", { key: "a", className: "vt-hero-actions" },
      h(Button, { href: "#" }, p.primary || "Book a call"),
      p.secondary ? h(Button, { variant: dark ? "ghost-stealth" : "ghost", href: "#", arrow: false }, p.secondary) : null)
  ];
  if (dark) return h(StealthPanel, { className: "vt-hero vt-hero--stealth" }, body, h("div", { className: "vt-hero-orb" }, h(OrbitArt, { aspect: 2.3 })));
  return h("header", { className: "vt-hero" }, body,
    p.visual === false ? null : h("div", { className: "vt-hero-visual" }, p.children || h(PortalStage, null)));
}

/* ── LineArtCard ── */
function LineArtCard(p) {
  return h("div", { className: cx("vt-card-dk vt-lineart", p.body && "vt-lineart--body") },
    h("h3", null, h("span", null, p.title), p.tag ? h(Pill, { tone: "stealth" }, p.tag) : null),
    p.body ? h("p", { className: "vt-la-body" }, p.body) : null,
    p.inputs ? h("div", { className: "vt-inputs" }, p.inputs.map(function (x, i) { return h(PillInput, Object.assign({ key: i }, x)); }))
      : p.lines ? h("div", { className: "vt-la-fig vt-la-lines", "aria-hidden": true }, h(LineField, { seed: p.lines }))
      : p.figure ? h("div", { className: "vt-la-fig", "aria-hidden": true }, h(Figure, { kind: p.figure }))
      : h("div", { className: "vt-pc-stage vt-pc-stage--sm", "aria-hidden": true }, h("div", { className: "vt-pc-orb" }), h(CrmSlice, { kind: p.slice || "volume", className: "vt-pc-slice", decorative: true })));
}

/* ── PlanCard ── */
function PlanCard(p) {
  return h("article", { className: cx("vt-card-dk vt-plan", p.featured && "vt-edge--on") },
    p.figure ? h("div", { className: "vt-plan-fig", "aria-hidden": true }, h(Figure, { kind: p.figure })) : null,
    p.figure ? h("div", { className: "vt-plan-head vt-plan-head--fig" }, h(Pill, null, p.tag)) : h("div", { className: "vt-plan-head" }, h("span", { className: "vt-pc-icon" }, h(Icon, { name: p.icon || "route", size: 22 })), h(Pill, null, p.tag)),
    h("h3", { className: "vt-title-xl" }, p.title),
    h("div", { className: "vt-plan-value vt-tnum" }, p.value),
    h("div", { className: "vt-plan-label" }, p.label),
    h(Button, { full: true, href: "#" }, p.cta || "Book a call"),
    p.footnote ? h("p", { className: "vt-plan-foot" }, p.footnote) : null,
    p.description ? h("div", { className: "vt-plan-desc" }, p.description) : null);
}

/* ── StatCard ── */
function StatCard(p) {
  return h("article", { className: "vt-card-dk vt-statcard" },
    h("svg", { className: "vt-statcard-bg", viewBox: "0 0 300 300", fill: "none", "aria-hidden": true, preserveAspectRatio: "xMidYMid meet" },
      h("circle", { cx: 150, cy: 150, r: 140, stroke: "var(--stealth-line)", strokeDasharray: "2 6" }),
      h("circle", { cx: 150, cy: 150, r: 104, stroke: "var(--stealth-line)", strokeDasharray: "2 6" }),
      h("path", { d: "M10 200 C60 170 80 220 120 180 S190 150 220 110 S270 80 290 40", stroke: "var(--stealth-line-2)" }),
      h("path", { d: "M280 38 L292 38 L292 50", stroke: "var(--stealth-line-2)" }),
      h("rect", { x: 146, y: 6, width: 8, height: 8, rx: 1, fill: "rgba(255,255,255,.35)", transform: "rotate(45 150 10)" })),
    h("div", { className: "vt-statcard-name" }, p.name),
    p.illustrative !== false ? h("span", { className: "vt-illustrative" }, "Illustrative") : null,
    h("div", { className: "vt-statcard-body" },
      h("div", { className: "vt-stat" }, p.prefix || "", h(CountUp, { to: p.value, decimals: p.decimals }), p.unit ? h("sup", null, p.unit) : null),
      h("div", { className: "vt-statcard-label" }, p.label)),
    p.tag ? h(Pill, null, p.tag) : null);
}

/* ── FeaturePanel ── */
function FeaturePanel(p) {
  var ICONS = ["layers", "shield", "bell", "dashboard"];
  var items = (p.items || []).map(function (it, i) { return typeof it === "string" ? { label: it, icon: ICONS[i % 4] } : it; });
  return h(StealthPanel, { className: "vt-feature" },
    h("div", { className: "vt-fp-main" },
      p.tag ? h(Pill, null, p.tag) : null,
      h("h2", { className: "vt-title-xl" }, p.title),
      p.description ? h("p", { className: "vt-fp-lede" }, p.description) : null,
      h("div", { className: "vt-fp-tiles" }, items.map(function (it, i) {
        return h("div", { key: i, className: "vt-fp-tile", style: { animationDelay: (i * 90) + "ms" } },
          h("span", { className: "vt-pc-icon vt-fp-icon" }, h(Icon, { name: it.icon || ICONS[i % 4], size: 20 })),
          h("div", null, h("div", { className: "vt-fp-label" }, it.label), it.meta ? h("div", { className: "vt-fp-meta" }, it.meta) : null));
      })),
      h("div", { className: "vt-fp-cta" }, h(Button, { href: p.ctaHref || "#" }, p.cta || "Book a call"))),
    h("div", { className: "vt-fp-visual", "aria-hidden": true },
      p.art || [h("div", { key: "o", className: "vt-pc-orb vt-fp-orb" }), h("div", { key: "g", className: "vt-pc-ghost vt-fp-ghost" }), h(CrmSlice, { key: "s", kind: p.slice || "underwriting", className: "vt-pc-slice vt-fp-slice", decorative: true }),
        h(CrmSlice, { key: "s2", kind: p.slice2 || "mids", className: "vt-pc-slice vt-fp-slice vt-fp-slice--2", decorative: true }),
        /* site: chip={false} drops the floating chip */ p.chip === false ? null : h("div", { key: "c", className: "vt-fp-chip" }, h("span", { className: "vtp-dot vtp-dot--green vtp-pulse" }), p.chip || "Approved in-house")]));
}

/* ── ProviderFlow: providers → Vertlo → your accounts, with light running the lines (for white sections) ── */
function ProviderFlow(p) {
  p = p || {}; var ref = usePauseOffscreen(), v = p.layout === "vertical";
  var provs = p.providers || ["Visa", "Mastercard", "PayPal", "+ Your processor"];
  var accts = p.accounts || ["Your MID 1", "Your MID 2", "Your MID 3"];
  var W = v ? 360 : 1280, H = v ? 640 : 380, cx0 = v ? 180 : 640, cy0 = v ? 300 : 190, S = v ? 88 : 100;
  var inP = [], outP = [], pills = [], cards = [];
  provs.forEach(function (name, i) {
    if (v) { var x = 20 + (i % 2) * 170, y = 20 + Math.floor(i / 2) * 64; pills.push([x, y, 150, 44, name]); inP.push("M" + (x + 75) + " " + (y + 44) + " C" + (x + 75) + " " + (y + 150) + " " + cx0 + " " + (cy0 - 110) + " " + cx0 + " " + (cy0 - S / 2)); }
    else { var y2 = 26 + i * 90; pills.push([120, y2, 200, 48, name]); inP.push("M320 " + (y2 + 24) + " C470 " + (y2 + 24) + " 470 " + cy0 + " " + (cx0 - S / 2) + " " + cy0); }
  });
  accts.forEach(function (name, i) {
    if (v) { var x = 14 + i * 114, y = 540; cards.push([x, y, 104, 64, name]); outP.push("M" + cx0 + " " + (cy0 + S / 2) + " C" + cx0 + " " + (cy0 + 140) + " " + (x + 52) + " " + (y - 110) + " " + (x + 52) + " " + y); }
    else { var y3 = 65 + i * 95; cards.push([960, y3, 210, 60, name]); outP.push("M" + (cx0 + S / 2) + " " + cy0 + " C810 " + cy0 + " 820 " + (y3 + 30) + " 960 " + (y3 + 30)); }
  });
  return h("svg", { ref: ref, viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Your providers connect to Vertlo, which routes payments across your merchant accounts.", style: { display: "block", width: "100%", height: "auto", overflow: "visible" }, fontFamily: "var(--font-sans)" },
    inP.map(function (d, i) { return h("path", { key: "i" + i, d: d, fill: "none", stroke: "#d5ddd8", strokeDasharray: "4 6" }); }),
    outP.map(function (d, i) { return h("path", { key: "o" + i, d: d, fill: "none", stroke: "rgba(11,20,16,.28)", strokeWidth: 1.5 }); }),
    inP.map(function (d, i) { return h(Beam, { key: "bi" + i, d: d, dur: 3.2, delay: i * .55, w: 2.6, color: "#0b1410" }); }),
    outP.map(function (d, i) { return h(Beam, { key: "bo" + i, d: d, dur: 2.6, delay: .9 + i * .45, w: 2.6, color: "#0b1410" }); }),
    pills.map(function (q, i) {
      var dashed = q[4].charAt(0) === "+";
      return h("g", { key: "p" + i }, /* site: square-cut, hairline, no drop shadow (the paper look) */ h("rect", { x: q[0], y: q[1], width: q[2], height: q[3], rx: 4, fill: "#f7f9f6", stroke: "rgba(31,59,43,.28)", strokeDasharray: dashed ? "4 4" : "none" }),
        h("text", { x: q[0] + q[2] / 2, y: q[1] + q[3] / 2 + 4.5, textAnchor: "middle", fill: dashed ? "#4a5750" : "#0b1410", fontSize: v ? 11 : 12.5, fontWeight: 600, letterSpacing: ".08em" }, q[4].toUpperCase()));
    }),
    h(Ripple, { cx: cx0, cy: cy0, r: S * .9, n: 2, dur: 4, color: "rgba(11,20,16,.25)" }),
    h("g", { className: "vt-spin", style: { animationDuration: "30s" } }, h("circle", { cx: cx0, cy: cy0, r: S * .78, fill: "none", stroke: "rgba(11,20,16,.25)", strokeDasharray: "2 6" })),
          h("circle", { cx: cx0, cy: cy0, r: S * .5, fill: "#0b1410" }),
    h("circle", { cx: cx0, cy: cy0, r: S * .5 - 7, fill: "none", stroke: "rgba(255,255,255,.18)" }),
    h("g", { transform: "translate(" + cx0 + " " + cy0 + ") rotate(45)" },
      h("rect", { className: "vt-breathe", x: -15, y: -15, width: 30, height: 30, rx: 5, fill: G }),
      h("rect", { x: -6, y: -6, width: 12, height: 12, rx: 2, fill: "none", stroke: "#0b1410", strokeWidth: 2.4 })),
    cards.map(function (q, i) {
      return h("g", { key: "c" + i }, h("rect", { x: q[0], y: q[1], width: q[2], height: q[3], rx: 4, fill: "#f7f9f6", stroke: "rgba(31,59,43,.28)" }),
        h("circle", { className: "vt-ping", cx: q[0] + 20, cy: q[1] + q[3] / 2, r: 5, fill: "none", stroke: G, style: { animationDuration: "2.6s", animationDelay: (.9 + i * .45 + 1.6) + "s" } }),
        h("circle", { cx: q[0] + 20, cy: q[1] + q[3] / 2, r: 4, fill: G }),
        h("text", { x: q[0] + (v ? 32 : 34), y: q[1] + q[3] / 2 + 4.5, fill: "#0b1410", fontSize: v ? 10.5 : 13, fontFamily: "var(--font-mono)" }, v ? q[4].replace("Your ", "") : q[4]));
    }));
}

/* ── Notification moment ── */
function Notification(p) {
  return h("div", { className: cx("vt-note", p.animate !== false && "vt-note-in"), style: p.delay ? { animationDelay: p.delay + "ms" } : undefined, role: "status" },
    h("div", { className: "vt-note-av", "aria-hidden": true }, h(Diamond, { size: 9, glow: true })),
    h("div", null,
      h("div", { className: "vt-note-head" }, h("span", null, p.from || "Vertlo"), h("span", { className: "vt-mono" }, p.time || "now")),
      h("p", { className: "vt-note-msg" }, p.message),
      p.status ? h(Pill, { tone: p.status.tone === "paused" ? "neutral" : "green" }, p.status.tone === "paused" ? h("span", { style: { width: 6, height: 6, borderRadius: 3, background: "var(--red)" } }) : null, p.status.label) : null));
}
function NotificationStack(p) {
  return h("div", { className: "vt-note-stack" }, (p.items || []).map(function (it, i) { return h(Notification, Object.assign({ key: i, delay: i * 180 }, it)); }));
}

/* ── HowItWorks ── */
/* HowItWorks: three steps that light up in turn. Each step can show a real CrmSlice on a dark screen. */
function HowItWorks(p) {
  var still = reduced(), steps = p.steps || [], rich = steps.some(function (s) { return s.slice || s.figure || s.art; });
  return h("div", { className: cx("vt-how", rich && "vt-how--rich", p.tone === "light" && "vt-how--light") },
    h("div", { className: "vt-how-line", "aria-hidden": true }, still ? null : h("span", { className: "vt-how-dot" })),
    steps.map(function (s, i) {
      var visual = s.visual || (s.art ? h("div", { className: cx("vt-how-screen", p.tone === "light" && "vt-how-screen--light"), "aria-hidden": true }, h(PixelArt, { kind: s.art, tone: p.tone })) : s.slice ? h("div", { className: "vt-how-screen", "aria-hidden": true }, h("div", { className: "vt-pc-orb" }), h(CrmSlice, { kind: s.slice, className: "vt-how-slice", decorative: true }))
        : s.figure ? h("div", { className: "vt-how-screen", "aria-hidden": true }, h(Figure, { kind: s.figure })) : null);
      return h("div", { key: i, className: "vt-how-step", style: { "--i": i } },
        p.tone === "light" ? h("span", { className: "vt-how-idx" }, (i < 9 ? "0" : "") + (i + 1)) : null,
        h("div", { className: "vt-how-visual" }, visual),
        h("div", { className: "vt-how-num" }, i + 1),
        s.kicker ? h("div", { className: "vt-how-kicker" }, s.kicker) : null,
        h("h3", null, s.title), h("p", null, s.body));
    }));
}

/* ── LogoStrip ── */
function LogoStrip(p) {
  var logos = p.logos || [];
  var row = logos.concat(logos);
  return h("section", { "aria-label": p.heading || "Trusted by" },
    h("div", { className: "vt-eyebrow", style: { textAlign: "center", color: "var(--ink-muted)", marginBottom: 28 } }, p.heading || "Trusted by high-risk brands"),
    h("div", { className: "vt-strip" }, h("div", { className: "vt-strip-track" }, row.map(function (l, i) {
      return typeof l === "string" ? h("span", { key: i, className: "vt-strip-logo", "aria-hidden": i >= logos.length }, l) : h("img", { key: i, src: l.src, alt: i >= logos.length ? "" : l.alt, height: 28, style: { filter: "grayscale(1)", opacity: .55 } });
    }))));
}

/* ── FeatureGrid: a ruled 2×2 grid on white. Each cell = title, one line, and a small product moment:
   white cards with a soft drop shadow on a dotted grid, ink diamonds at the crossings. ── */
var FG_W = 544, FG_H = 420;
function fgGrid(xs, ys, dias, extra) {
  var out = [];
  ys.forEach(function (y, i) { out.push(h("line", { key: "h" + i, x1: 0, y1: y, x2: FG_W, y2: y, stroke: "rgba(11,20,16,.22)", strokeDasharray: "3 5" })); });
  xs.forEach(function (x, i) { out.push(h("line", { key: "v" + i, x1: x, y1: 0, x2: x, y2: FG_H, stroke: "rgba(11,20,16,.22)", strokeDasharray: "3 5" })); });
  (dias || []).forEach(function (d, i) { out.push(dia(d[0], d[1], d[2] || 9, d[3] || "#0b1410", "d" + i)); });
  return h("svg", { key: "grid", width: FG_W, height: FG_H, viewBox: "0 0 " + FG_W + " " + FG_H, style: { position: "absolute", left: 0, top: 0 }, "aria-hidden": true }, out, extra);
}
function fgCard(k, x, y, w, kids, cls) { return h("div", { key: k, className: "vt-fg-card" + (cls ? " " + cls : ""), style: { left: x, top: y, width: w } }, kids); }
/* site: no status badges; a plain muted count on the right at most, the status lives in the card's sub line */
function fgHead(title, count) { return h("div", { key: "h", className: "vt-fg-ch" }, h("b", null, title), count ? h("span", { className: "vt-fg-count" }, count) : null); }
function fgRow(k, sw, id, name, right, rightCls) { return h("div", { key: k, className: "vt-fg-row" }, sw, id ? h("span", { className: "vt-fg-mono" }, id) : null, h("span", { className: "vt-fg-mute" }, name), h("b", { className: "vt-fg-num" + (rightCls ? " " + rightCls : "") }, right)); }
var FGARTS = {
  routing: function () {
    var rows = [["US-03", "Processor A", 42, "#0b1410"], ["UK-02", "Processor B", 38, "#55625b"], ["US-04", "Processor C", 20, "#a3ada7"]];
    return [
      fgGrid([104, 272, 440], [96, 236, 372], [[104, 96], [440, 96], [104, 372, 9, G], [440, 372]]),
      fgCard("c", 56, 44, 432, [
        fgHead("Routing rule"),
        h("div", { key: "s", className: "vt-fg-sub" }, "Split by approval rate · failover on"),
        h("div", { key: "b", className: "vt-fg-split" }, rows.map(function (r, i) { return h("span", { key: i, style: { flex: r[2], background: r[3] } }); })),
        rows.map(function (r, i) { return fgRow("r" + i, h("i", { className: "vt-fg-sw", style: { background: r[3] } }), r[0], r[1], r[2] + "%"); })
      ]),
      fgCard("m", 248, 290, 240, [
        h("div", { key: "l", className: "vt-fg-sub", style: { margin: 0 } }, "Approval rate"),
        h("div", { key: "n", className: "vt-fg-big" }, "92.6%", h("span", { className: "vt-fg-up" }, "+0.4pt"))
      ])
    ];
  },
  failover: function () {
    var arcs = [h("circle", { key: "a1", cx: 272, cy: 92, r: 30, fill: "none", stroke: "rgba(229,72,77,.4)" }), h("circle", { key: "a2", cx: 272, cy: 92, r: 50, fill: "none", stroke: "rgba(229,72,77,.22)", strokeDasharray: "2 5" }), dia(272, 92, 14, RED, "pd")];
    return [
      fgGrid([130, 272, 414], [92, 214, 350], [[130, 92], [414, 92], [130, 350], [414, 350, 9, G]], arcs),
      fgCard("c", 64, 138, 416, [
        fgHead("Merchant accounts"),
        h("div", { key: "s", className: "vt-fg-sub" }, "2 of 3 live · US-01 paused, traffic rerouted"),
        fgRow("r1", h("i", { className: "vt-fg-dot vt-fg-dot--red" }), "US-01", "Processor A", "Paused", "vt-fg-red"),
        fgRow("r2", h("i", { className: "vt-fg-dot" }), "UK-02", "Processor B", "Live"),
        fgRow("r3", h("i", { className: "vt-fg-dot" }), "US-03", "Processor C", "Live")
      ]),
      fgCard("t", 104, 328, 336, [h("div", { key: "t", className: "vt-fg-toast" }, h("span", { className: "vt-fg-check" }, "✓"), h("span", null, "Traffic rerouted to UK-02 and US-03"))], "vt-fg-card--pill")
    ];
  },
  disputes: function () {
    return [
      fgGrid([96, 272, 448], [84, 236, 372], [[96, 84], [448, 84], [96, 372], [272, 236, 9, G]]),
      fgCard("a", 48, 36, 448, [
        fgHead("Attention required", "2 items"),
        fgRow("r1", h("i", { className: "vt-fg-dot vt-fg-dot--red" }), null, h("span", null, h("b", { className: "vt-fg-t2" }, "1 dispute requires evidence"), h("span", { className: "vt-fg-sub2" }, "DSP-0221 · $89.00 · due Jul 14")), h("span", { className: "vt-fg-btn" }, "Respond")),
        fgRow("r2", h("i", { className: "vt-fg-dot vt-fg-dot--amber" }), null, h("span", null, h("b", { className: "vt-fg-t2" }, "Approval rate declined on UK-02"), h("span", { className: "vt-fg-sub2" }, "UK Visa debit · last 7 days")), h("span", { className: "vt-fg-btn" }, "Review"))
      ]),
      fgCard("b", 120, 232, 376, [
        fgHead("Early dispute alert"),
        h("div", { key: "tl", className: "vt-fg-tl" },
          h("span", { key: "o", className: "vt-fg-tn" }, h("i", { className: "vt-fg-tdot" }), "Order"),
          h("span", { key: "l1", className: "vt-fg-tline" }),
          h("span", { key: "a", className: "vt-fg-tn vt-fg-tn--on" }, h("i", { className: "vt-fg-tdia" }), "Alert"),
          h("span", { key: "l2", className: "vt-fg-tline vt-fg-tline--dash" }),
          h("span", { key: "c", className: "vt-fg-tn vt-fg-tn--off" }, h("i", { className: "vt-fg-tx" }, "×"), "Chargeback")),
        h("div", { key: "f", className: "vt-fg-foot" }, h("span", { className: "vt-fg-check" }, "✓"), "Refunded before it became a chargeback")
      ])
    ];
  },
  stores: function () {
    var rows = [["Nordvia Supplements", "$48,220"], ["Nordvia Digital", "$31,905"], ["Nordvia Subscriptions", "$52,610"]];
    return [
      fgGrid([88, 272, 456], [84, 226, 368], [[88, 84], [456, 84], [88, 368], [456, 368, 9, G]]),
      h("div", { key: "back", className: "vt-fg-card vt-fg-back", style: { left: 84, top: 84, width: 432, height: 250 } }),
      fgCard("f", 40, 44, 432, [
        fgHead("All brands"),
        h("div", { key: "s", className: "vt-fg-sub" }, "Payouts from 3 stores · last 30 days"),
        rows.map(function (r, i) { return fgRow("r" + i, h("i", { className: "vt-fg-dot" }), null, r[0], r[1]); }),
        h("div", { key: "tot", className: "vt-fg-row vt-fg-total" }, h("span", { className: "vt-fg-mute" }, "Total payouts"), h("b", { className: "vt-fg-num" }, "$132,735"))
      ]),
      /* site: the "3 stores, 1 CRM" chip now reads in the sub line above */
    ];
  }
};
function FeatureGrid(p) {
  var items = p.items || [];
  return h("div", { className: cx("vt-fg", p.className) }, items.map(function (it, i) {
    var art = (FGARTS[it.art] || FGARTS.routing)();
    return h("article", { key: i, className: "vt-fg-cell" },
      h("h3", { className: "vt-fg-title" }, it.title),
      h("p", { className: "vt-fg-body" }, it.body),
      h("div", { className: "vt-fg-artwrap" }, h(Fit, { w: FG_W, h: FG_H }, art), p.illustrative === false ? null : h("span", { className: "vt-fg-ill" }, "Illustrative data")));
  }));
}

/* ── IndustryCards: three open columns split by dashed rules. Each column's art is a dot-matrix
   drawing on canvas: a faint dot field that fades into the page, the industry's shape drawn in
   slightly darker dots, and a few green dots moving through it (the live signal). No cards. ── */
var DOT_W = 360, DOT_H = 280, DOT_S = 6;
function dSeg(px, py, ax, ay, bx, by) { var dx = bx - ax, dy = by - ay, t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy))); return Math.hypot(px - ax - t * dx, py - ay - t * dy); }
function dLine(d, w) { return Math.max(0, 1 - Math.abs(d) / w); }
function dBox(px, py, x0, y0, x1, y1) { var dx = Math.max(x0 - px, 0, px - x1), dy = Math.max(y0 - py, 0, py - y1); if (dx || dy) return Math.hypot(dx, dy); return -Math.min(px - x0, x1 - px, py - y0, y1 - py); }
function dSnap(v) { return Math.round((v - DOT_S / 2) / DOT_S) * DOT_S + DOT_S / 2; }
var DOTK = {
  supplements: {
    ink: function (x, y) {
      /* big two-tone capsule, a smaller capsule behind, two round tablets */
      var ax = 96, ay = 196, bx = 236, by = 88, r = 38;
      var d = dSeg(x, y, ax, ay, bx, by) - r, v = 0;
      if (d < 0) { var t = ((x - ax) * (bx - ax) + (y - ay) * (by - ay)) / ((bx - ax) * (bx - ax) + (by - ay) * (by - ay)); v = t < .5 ? .85 : .22; if (Math.abs(t - .5) < .03) v = .1; }
      v = Math.max(v, dLine(d, 6) * .9);
      var d2 = dSeg(x, y, 214, 222, 306, 188) - 22; if (d > 4) v = Math.max(v, dLine(d2, 5.5) * .5);
      v = Math.max(v, dLine(Math.hypot(x - 286, y - 92) - 22, 5.5) * .55, Math.hypot(x - 286, y - 92) < 10 ? .3 : 0);
      v = Math.max(v, dLine(Math.hypot(x - 64, y - 84) - 16, 5.5) * .45);
      return v;
    },
    green: function (t) {
      /* a reorder pulse: dots ripple out of the small tablet every few seconds */
      var out = [], ph = (t * .5) % 1, R = 6 + ph * 40, a = 1 - ph;
      for (var i = 0; i < 14; i++) { var th = i / 14 * Math.PI * 2; out.push([286 + Math.cos(th) * R, 92 + Math.sin(th) * R, a * .8]); }
      out.push([286, 92, 1]);
      return out;
    }
  },
  subscriptions: {
    ink: function (x, y) {
      var cx = 180, cy = 140, dx = x - cx, dy = y - cy, rr = Math.hypot(dx, dy), th = Math.atan2(dy, dx), v = 0;
      var gap = th > -1.5 && th < -.95;
      if (!gap) v = Math.max(v, dLine(rr - 100, 6.5) * .9);
      if (Math.floor((th + Math.PI) / (Math.PI / 12)) % 2 === 0) v = Math.max(v, dLine(rr - 70, 5.5) * .4);
      /* arrowhead at the end of the loop */
      var hx = cx + Math.cos(-1.5) * 100, hy = cy + Math.sin(-1.5) * 100;
      v = Math.max(v, dLine(dSeg(x, y, hx, hy, hx - 22, hy - 16), 5.5) * .9, dLine(dSeg(x, y, hx, hy, hx - 20, hy + 20), 5.5) * .9);
      /* diamond core */
      var m = Math.abs(dx) + Math.abs(dy);
      if (m < 34 && m > 14) v = Math.max(v, .85); else if (m <= 14) v = Math.max(v, .15);
      return v;
    },
    green: function (t) {
      /* a renewal travelling round the loop */
      var out = [], th0 = -.95 + ((t * .55) % 1) * (Math.PI * 2 - .55);
      for (var i = 0; i < 9; i++) { var th = th0 - i * .1; out.push([180 + Math.cos(th) * 100, 140 + Math.sin(th) * 100, 1 - i / 9]); }
      return out;
    }
  },
  digital: {
    ink: function (x, y) {
      var v = 0;
      function file(ox, oy, w) {
        var x0 = 112 + ox, y0 = 34 + oy, x1 = 232 + ox, y1 = 246 + oy, f = 32;
        var inCut = (x - (x1 - f)) + (y0 + f - y) > f + 0;
        var d = dBox(x, y, x0, y0, x1, y1);
        if (inCut) d = Math.max(d, dSeg(x, y, x1 - f, y0, x1, y0 + f) * ((x - (x1 - f)) + (y0 + f - y) > f ? 1 : -1));
        var o = dLine(d, 5.5) * w;
        o = Math.max(o, dLine(dSeg(x, y, x1 - f, y0, x1 - f, y0 + f), 5) * w, dLine(dSeg(x, y, x1 - f, y0 + f, x1, y0 + f), 5) * w);
        return { o: o, inside: d < 0 && !inCut };
      }
      var f3 = file(40, 20, .22), f2 = file(20, 10, .4), f1 = file(0, 0, .9);
      if (!f1.inside) { v = Math.max(v, f2.o); if (!f2.inside) v = Math.max(v, f3.o); }
      v = Math.max(v, f1.o);
      v = Math.max(v, dLine(dSeg(x, y, 172, 84, 172, 176), 5.5) * .85, dLine(dSeg(x, y, 172, 176, 146, 150), 5.5) * .85, dLine(dSeg(x, y, 172, 176, 198, 150), 5.5) * .85, dLine(dSeg(x, y, 140, 206, 204, 206), 5.5) * .85);
      return v;
    },
    green: function (t) {
      /* files arriving: dots fall down the arrow and flash on the base bar */
      var out = [];
      for (var k = 0; k < 3; k++) { var p = ((t * .7) + k / 3) % 1; out.push([172, 84 + p * 92, Math.sin(p * Math.PI)]); }
      var ph = (t * .7) % 1; if (ph < .25) for (var x = 140; x <= 204; x += DOT_S) out.push([x, 206, 1 - ph * 4]);
      return out;
    }
  },
  closed: {
    /* one stream from checkout to three accounts; the middle one is paused, traffic flows to the other two */
    ink: function (x, y) {
      var v = 0, sx = 64, sy = 140, nodes = [[292, 64], [292, 140], [292, 216]];
      v = Math.max(v, dLine(Math.hypot(x - sx, y - sy) - 22, 5.5) * .9, Math.hypot(x - sx, y - sy) < 9 ? .7 : 0);
      nodes.forEach(function (n, i) {
        var d = Math.hypot(x - n[0], y - n[1]);
        v = Math.max(v, dLine(d - 24, 5.5) * (i === 1 ? .5 : .9));
        if (i !== 1 && d < 9) v = Math.max(v, .6);
        var mx = (sx + n[0]) / 2;
        var dd = Math.min(dSeg(x, y, sx + 22, sy, mx, sy + (n[1] - sy) * .15), dSeg(x, y, mx, sy + (n[1] - sy) * .15, n[0] - 26, n[1]));
        v = Math.max(v, dLine(dd, 5) * (i === 1 ? .18 : .55));
      });
      return v;
    },
    red: function () { var out = []; for (var yy = 128; yy <= 152; yy += 6) { out.push([286, yy, .9]); out.push([298, yy, .9]); } return out; },
    green: function (t) {
      var out = [], sx = 86, sy = 140;
      [[292, 64], [292, 216]].forEach(function (n, j) {
        for (var k = 0; k < 3; k++) {
          var p = ((t * .45) + k / 3 + j * .16) % 1, mx = (64 + n[0]) / 2, my = sy + (n[1] - sy) * .15, x, y;
          if (p < .45) { var q = p / .45; x = sx + (mx - sx) * q; y = sy + (my - sy) * q; } else { var q2 = (p - .45) / .55; x = mx + (n[0] - 26 - mx) * q2; y = my + (n[1] - my) * q2; }
          out.push([x, y, Math.sin(p * Math.PI)]);
        }
      });
      return out;
    }
  },
  scattered: {
    /* loose tiles all over, pulled into one screen in the middle */
    ink: function (x, y) {
      var v = 0, d = dBox(x, y, 118, 82, 242, 198);
      v = Math.max(v, dLine(d, 5.5) * .9);
      if (d < -4) { v = Math.max(v, dLine(y - 104, 3.5) * .5); if (y > 118 && y < 186 && x > 130 && x < 230) v = Math.max(v, ((x - 130) % 36 < 26) && ((y - 118) % 24 < 14) ? .28 : 0); }
      [[46, 50, 26], [300, 44, 22], [36, 208, 24], [314, 214, 28], [176, 26, 18], [320, 128, 18], [30, 128, 16], [178, 252, 18]].forEach(function (s, i) {
        var ds = dBox(x, y, s[0] - s[2] / 2, s[1] - s[2] / 2, s[0] + s[2] / 2, s[1] + s[2] / 2);
        v = Math.max(v, dLine(ds, 5) * (.3 + (i % 3) * .1));
      });
      return v;
    },
    green: function (t) {
      var out = [], src = [[46, 50], [300, 44], [36, 208], [314, 214], [320, 128], [30, 128]];
      src.forEach(function (s, i) {
        var p = ((t * .35) + i / src.length) % 1, tx = 180, ty = 140;
        if (p > .7) return;
        var q = p / .7; out.push([s[0] + (tx - s[0]) * q, s[1] + (ty - s[1]) * q, Math.sin(q * Math.PI) * .9]);
      });
      return out;
    }
  },
  underwriting: {
    /* an application with text lines and a round approval stamp that draws itself in */
    ink: function (x, y) {
      var v = 0, d = dBox(x, y, 96, 30, 222, 250);
      v = Math.max(v, dLine(d, 5.5) * .85);
      if (d < -6) [58, 78, 98, 126, 146, 166].forEach(function (ly, i) { var x1 = i % 3 === 2 ? 170 : 200; if (x > 114 && x < x1) v = Math.max(v, dLine(y - ly, 3.5) * .35); });
      var sd = Math.hypot(x - 238, y - 196);
      if (sd < 48) v = Math.max(v * .25, 0);
      v = Math.max(v, dLine(sd - 42, 5) * .7, dLine(sd - 30, 4) * .3);
      var m = Math.abs(x - 238) + Math.abs(y - 196); if (m < 16) v = Math.max(v, .7);
      return v;
    },
    green: function (t) {
      var out = [], ph = (t * .4) % 1.3, n = Math.min(1, ph) * 44;
      for (var i = 0; i < n; i++) { var th = -Math.PI / 2 + i / 44 * Math.PI * 2; out.push([238 + Math.cos(th) * 42, 196 + Math.sin(th) * 42, (ph > 1 ? 1 - (ph - 1) / .3 : 1) * (.35 + .5 * i / 44)]); }
      return out;
    }
  }
};
function DotArt(p) {
  var React = R(); var ref = React.useRef(null);
  React.useEffect(function () {
    var cv = ref.current; if (!cv || !cv.getContext) return;
    var dark = p.tone === "dark", INK = dark ? "242,246,243," : "11,20,16,", ctx = cv.getContext("2d"), K = DOTK[p.kind] || DOTK.supplements, raf = 0, on = true, t0 = performance.now(), last = 0;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var pts = [];
    for (var y = DOT_S / 2; y < DOT_H; y += DOT_S) for (var x = DOT_S / 2; x < DOT_W; x += DOT_S) {
      var ex = Math.abs(x - DOT_W / 2) / (DOT_W / 2), ey = Math.abs(y - DOT_H / 2) / (DOT_H / 2), e = Math.hypot(ex * .9, ey);
      var fade = Math.max(0, Math.min(1, (1.12 - e) / .75)); fade = fade * fade * (3 - 2 * fade);
      pts.push([x, y, K.ink(x, y), fade]);
    }
    function size() { var r = cv.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2); if (!r.width) return; cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); ctx.setTransform(cv.width / DOT_W, 0, 0, cv.height / DOT_H, 0, 0); }
    function draw(t) {
      ctx.clearRect(0, 0, DOT_W, DOT_H);
      for (var i = 0; i < pts.length; i++) {
        var q = pts[i], v = q[2], a, r;
        if (v > .02) { var w = 1 + .18 * Math.sin(t * 1.4 - (q[0] + q[1]) * .025); a = (dark ? (.08 + .6 * v) : (.06 + .34 * v)) * w * (.35 + .65 * q[3]); r = .85 + .75 * v; }
        else { a = (dark ? .1 : .075) * q[3]; r = .8; }
        if (a < .01) continue;
        ctx.fillStyle = "rgba(" + INK + a.toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(q[0], q[1], r, 0, 6.2832); ctx.fill();
      }
      var rd = K.red ? K.red(t) : [];
      for (var m = 0; m < rd.length; m++) { ctx.fillStyle = "rgba(229,72,77," + rd[m][2] + ")"; ctx.beginPath(); ctx.arc(dSnap(rd[m][0]), dSnap(rd[m][1]), 1.9, 0, 6.2832); ctx.fill(); }
      var g = K.green(t);
      for (var j = 0; j < g.length; j++) {
        if (g[j][2] <= .02) continue;
        ctx.fillStyle = "rgba(22,196,90," + Math.min(1, g[j][2]).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(dSnap(g[j][0]), dSnap(g[j][1]), 1.9, 0, 6.2832); ctx.fill();
      }
    }
    function loop(now) { raf = requestAnimationFrame(loop); if (!on || now - last < 33) return; last = now; draw((now - t0) / 1000); }
    size();
    var ro = new ResizeObserver(function () { size(); draw((performance.now() - t0) / 1000); }); ro.observe(cv);
    var io = window.IntersectionObserver ? new IntersectionObserver(function (es) { on = es[0].isIntersecting; }) : null; if (io) io.observe(cv);
    draw(1.2); if (!reduce) raf = requestAnimationFrame(loop);
    return function () { cancelAnimationFrame(raf); ro.disconnect(); if (io) io.disconnect(); };
  }, [p.kind, p.tone]);
  return h("canvas", { ref: ref, className: "vt-ic-canvas", "aria-hidden": true });
}
function IndustryCards(p) {
  var items = p.items || [];
  return h("div", { className: cx("vt-ic", p.tone === "dark" && "vt-ic--dark", p.className) }, items.map(function (it, i) {
    return h("article", { key: i, className: "vt-ic-card" },
      h("span", { className: "vt-ic-idx" }, (i < 9 ? "0" : "") + (i + 1)),
      h("div", { className: "vt-ic-art" }, h(DotArt, { kind: it.art, tone: p.tone })),
      h("div", { className: "vt-ic-text" }, h("h3", { className: "vt-ic-title" }, it.title), h("p", { className: "vt-ic-body" }, it.body)));
  }));
}

function flHash(n) { n = (n ^ 61) ^ (n >>> 16); n = n + (n << 3); n = n ^ (n >>> 4); n = Math.imul(n, 0x27d4eb2d); n = n ^ (n >>> 15); return (n >>> 0) / 4294967296; }
/* ── PixelArt: square-pixel drawings for the How it works cards (dark). Stepped at ~6fps on purpose:
   pixels jump cell to cell. connect / route / keep. ── */
var PX_W = 400, PX_H = 320, PX_S = 8, PX_C = PX_W / PX_S, PX_R = PX_H / PX_S;
function pxLane(pts) { var c = []; for (var i = 0; i < pts.length - 1; i++) { var a = pts[i], b = pts[i + 1], dx = Math.sign(b[0] - a[0]), dy = Math.sign(b[1] - a[1]), x = a[0], y = a[1]; while (x !== b[0] || y !== b[1]) { c.push([x, y]); x += dx; y += dy; } } c.push(pts[pts.length - 1].slice()); return c; }
function pxDia(cx, cy, r) { var o = []; for (var y = -r; y <= r; y++) for (var x = -r; x <= r; x++) { var m = Math.abs(x) + Math.abs(y); if (m === r) o.push([cx + x, cy + y, 1]); else if (m < r - 2 && m >= r - 3) o.push([cx + x, cy + y, .25]); } return o; }
function pxRect(x0, y0, w, hh) { var o = []; for (var y = y0; y < y0 + hh; y++) for (var x = x0; x < x0 + w; x++) if (y === y0 || y === y0 + hh - 1 || x === x0 || x === x0 + w - 1) o.push([x, y]); return o; }
var PXK = {
  connect: function (tk) {
    var P = [], T = [], rows = [7, 19, 31], names = ["VISA", "MC", "PAYPAL"];
    rows.forEach(function (ry, i) {
      pxRect(2, ry - 2, 10, 5).forEach(function (c) { P.push([c[0], c[1], "w", .55]); });
      T.push([7 * PX_S, (ry + .5) * PX_S, names[i], "w", .85]);
      var lane = pxLane([[12, ry], [20, ry], [20, 19], [27, 19]]);
      lane.forEach(function (c) { P.push([c[0], c[1], "w", .16]); });
      var pos = (tk + i * 5) % (lane.length + 6);
      [[pos, 1], [pos - 1, .45]].forEach(function (q) { var c = lane[q[0]]; if (c) P.push([c[0], c[1], "g", q[1]]); });
    });
    pxDia(35, 19, 7).forEach(function (c) { P.push([c[0], c[1], "w", c[2] * .7]); });
    var hit = rows.some(function (r, i) { var pos = (tk + i * 5) % (rows.length ? pxLane([[12, r], [20, r], [20, 19], [27, 19]]).length + 6 : 1); return pos >= 26 && pos <= 30; });
    [[35, 19], [34, 19], [36, 19], [35, 18], [35, 20]].forEach(function (c) { P.push([c[0], c[1], "g", hit ? 1 : .55]); });
    T.push([35.5 * PX_S, 30 * PX_S, "VERTLO", "w", .6]);
    T.push([35.5 * PX_S, 32 * PX_S, "3 CONNECTED", "g", .9]);
    return { P: P, T: T };
  },
  route: function (tk) {
    var P = [], T = [], rows = [7, 19, 31], share = [42, 38, 20], ids = ["MID 1", "MID 2", "MID 3"];
    pxDia(7, 19, 5).forEach(function (c) { P.push([c[0], c[1], "w", c[2] * .7]); });
    [[7, 19], [6, 19], [8, 19], [7, 18], [7, 20]].forEach(function (c) { P.push([c[0], c[1], "g", .9]); });
    rows.forEach(function (ry, i) {
      var lane = pxLane([[13, 19], [17, 19], [17, ry], [24, ry]]);
      lane.forEach(function (c) { P.push([c[0], c[1], "w", .16]); });
      var every = [3, 4, 7][i];
      for (var k = 0; k < 4; k++) { var pos = (tk - k * every * 2) % (lane.length + 20); if (pos >= 0 && pos < lane.length && ((tk - pos) % every === 0 || k === 0)) { var c = lane[pos]; P.push([c[0], c[1], "g", 1]); } }
      var len = Math.round(share[i] / 42 * 20), grow = Math.min(len, (tk % 60));
      for (var x = 0; x < len; x++) for (var y = 0; y < 2; y++) P.push([26 + x, ry + y - 1 + 1, "w", x < grow ? .5 : .1]);
      T.push([26 * PX_S, (ry - 1.4) * PX_S, ids[i], "w", .7, "l"]);
      T.push([(27 + len) * PX_S, (ry + .9) * PX_S, share[i] + "%", "w", .9, "l"]);
    });
    T.push([7.5 * PX_S, 27 * PX_S, "BY APPROVAL", "w", .5]);
    return { P: P, T: T };
  },
  keep: function (tk) {
    var P = [], T = [], rows = [8, 19, 30], blink = tk % 4 < 2;
    rows.forEach(function (ry, i) {
      var paused = i === 1;
      pxRect(2, ry - 2, 5, 5).forEach(function (c) { P.push([c[0], c[1], paused ? "r" : "w", paused ? (blink ? .9 : .35) : .55]); });
      P.push([4, ry, paused ? "r" : "g", paused ? (blink ? 1 : .4) : 1]);
      T.push([8.5 * PX_S, (ry + .5) * PX_S, "MID " + (i + 1), "w", .8, "l"]);
      T.push([8.5 * PX_S, (ry + 2.2) * PX_S, paused ? "PAUSED" : "LIVE", paused ? "r" : "g", .95, "l"]);
    });
    /* orders chart: bars step left every few ticks, the newest in green; the trend keeps rising */
    var x0 = 22, base = 34, n = 13, shift = Math.floor(tk / 3);
    for (var k = 0; k < n; k++) {
      var idx = shift + k, hgt = 5 + Math.floor((idx % 40) * .4) + Math.floor(flHash(idx * 13) * 5);
      if (idx % 40 > 36) hgt = 5 + Math.floor(flHash(idx * 13) * 5);
      hgt = Math.min(hgt, 22);
      for (var y = 0; y < hgt; y++) P.push([x0 + k * 2, base - y, k === n - 1 ? "g" : "w", k === n - 1 ? .95 : .18 + .025 * k]);
    }
    for (var x = x0 - 1; x < x0 + n * 2; x++) P.push([x, base + 1, "w", .2]);
    T.push([x0 * PX_S, 9.5 * PX_S, "ORDERS", "w", .7, "l"]);
    T.push([x0 * PX_S, 11.5 * PX_S, "STILL GOING THROUGH", "g", .9, "l"]);
    return { P: P, T: T };
  }
};
function PixelArt(p) {
  var React = R(), ref = React.useRef(null);
  React.useEffect(function () {
    var cv = ref.current; if (!cv || !cv.getContext) return;
    var ctx = cv.getContext("2d"), raf = 0, t0 = performance.now(), last = -1, on = true, K = PXK[p.kind] || PXK.connect, sc = 1, ox = 0, oy = 0;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var lt = p.tone === "light", col = { w: lt ? "11,20,16" : "242,246,243", g: "22,196,90", r: "229,72,77" }, wk = 1;
    function size() { var r = cv.getBoundingClientRect(); if (!r.width) return; var dpr = Math.min(window.devicePixelRatio || 1, 2); cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr); sc = Math.min(r.width / PX_W, r.height / PX_H); ox = (r.width - PX_W * sc) / 2; oy = (r.height - PX_H * sc) / 2; ctx.setTransform(dpr * sc, 0, 0, dpr * sc, dpr * ox, dpr * oy); last = -1; }
    function draw(tk) {
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.restore();
      for (var y = 0; y < PX_R; y++) for (var x = 0; x < PX_C; x++) {
        var ex = (x - PX_C / 2) / (PX_C / 2), ey = (y - PX_R / 2) / (PX_R / 2), f = Math.max(0, 1 - Math.hypot(ex * .8, ey) * .85);
        if (f <= 0) continue; ctx.fillStyle = "rgba(" + col.w + "," + ((lt ? .09 : .07) * f).toFixed(3) + ")"; ctx.fillRect(x * PX_S + 3, y * PX_S + 3, 2, 2);
      }
      var d = K(tk);
      d.P.forEach(function (q) { ctx.fillStyle = "rgba(" + col[q[2]] + "," + (q[2] === "w" ? q[3] * wk : q[3]) + ")"; ctx.fillRect(q[0] * PX_S + 1.5, q[1] * PX_S + 1.5, PX_S - 3, PX_S - 3); });
      ctx.font = (lt ? "500 10.5px" : "500 9px") + " " + monoFont(); ctx.textBaseline = "middle";
      d.T.forEach(function (t) { ctx.textAlign = t[5] === "l" ? "left" : "center"; ctx.fillStyle = "rgba(" + (lt && t[3] === "g" ? "10,122,59" : lt && t[3] === "r" ? "196,48,54" : col[t[3]]) + "," + t[4] + ")"; ctx.fillText(t[2], t[0], t[1]); });
    }
    function loop(now) { raf = requestAnimationFrame(loop); if (!on) return; var tk = Math.floor((now - t0) / 160); if (tk === last) return; last = tk; draw(tk); }
    size();
    var ro = new ResizeObserver(size); ro.observe(cv);
    var io = window.IntersectionObserver ? new IntersectionObserver(function (es) { on = es[0].isIntersecting; }) : null; if (io) io.observe(cv);
    draw(12); if (!reduce) raf = requestAnimationFrame(loop);
    return function () { cancelAnimationFrame(raf); ro.disconnect(); if (io) io.disconnect(); };
  }, [p.kind, p.tone]);
  return h("canvas", { ref: ref, className: "vt-pix-canvas", "aria-hidden": true });
}

/* ── Testimonial ── */
function Testimonial(p) {
  return h("figure", { className: "vt-card-lt vt-quote", style: { margin: 0 } },
    p.metric ? h(Pill, { tone: "green" }, p.metric) : null,
    h("blockquote", null, "“" + p.quote + "”"),
    h("figcaption", { className: "vt-quote-who" }, h("b", null, p.name), p.business));
}

/* ── FAQ ── */
function FAQ(p) {
  var React = R(); var st = React.useState(p.defaultOpen == null ? 0 : p.defaultOpen), open = st[0], set = st[1];
  return h("section", { className: "vt-faq" },
    h("div", { className: "vt-faq-side" }, h("h2", { className: "vt-h2" }, p.title || "Questions"), p.blurb ? h("p", { style: { margin: 0, color: "var(--ink-muted)" } }, p.blurb) : null, h(Button, { size: "sm", href: p.ctaHref || "#" }, p.cta || "Book a call")),
    h("div", { className: "vt-faq-list" }, (p.items || []).map(function (it, i) {
      var o = open === i;
      return h("div", { key: i, className: "vt-faq-row", "data-open": o },
        h("button", { className: "vt-faq-q", "aria-expanded": o, onClick: function () { set(o ? -1 : i); } }, h("span", null, it.q), h(Icon, { name: "plus", size: 20 })),
        h("div", { className: "vt-faq-a" }, h("div", null, h("p", null, it.a))));
    })));
}

/* ── CTABand ── */
function CTABand(p) {
  return h(StealthPanel, { className: "vt-cta" },
    h("div", { className: "vt-cta-bg", "aria-hidden": true }, h(OrbitArt, { core: p.core === true, style: { height: "100%", aspectRatio: "auto" } })),
    h("h2", { className: "vt-hero-t" }, p.title),
    h("div", { className: "vt-cta-actions" }, h(Button, { href: p.ctaHref || "#" }, p.cta || "Book a call")),
    p.points ? h("ul", { className: "vt-cta-points" }, p.points.map(function (x, i) { return h("li", { key: i }, h(Diamond, { size: 7, glow: true }), x); })) : null);
}

/* ── Footer ── */
function Footer(p) {
  var cols = p.columns || [];
  return h("footer", { className: "vt-footer" },
    h("div", { className: "vt-footer-top" },
      h("div", null, h(Logo, null), h("p", null, p.tagline)),
      cols.map(function (c, i) { return h("div", { key: i }, h("h4", null, c.title), h("ul", null, c.links.map(function (l) { var it = typeof l === "string" ? { label: l, href: "#" } : l; return h("li", { key: it.label }, h("a", { href: it.href }, it.label)); }))); })),
    p.wordmark === false ? null : h("div", { className: "vt-footer-mark", "aria-hidden": true }, "VERTLO"),
    h("div", { className: "vt-footer-legal" }, h("span", null, "© " + (p.year || new Date().getFullYear()) + " Vertlo"), h("span", null, (p.legal || ["Privacy", "Terms"]).map(function (l) { return h("a", { key: l, href: "#" }, l); }))));
}


export { Button, Pill, PillInput, Icon, Diamond, Logo, StealthPanel, OrbitArt, Portal, PortalStage, CrmSlice, ProductCard, Figure, LineField, FeatureStrip, CountUp, RotatingWord, Nav, Hero, LineArtCard, PlanCard, StatCard, FeaturePanel, ProviderFlow, Notification, NotificationStack, HowItWorks, LogoStrip, FeatureGrid, IndustryCards, PixelArt, Testimonial, FAQ, CTABand, Footer };
