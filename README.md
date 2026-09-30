# Vertlo — marketing site

Landing page for **Vertlo**, the payment CRM and processor for high-risk ecommerce.
Built from the Vertlo design system: a flat white page, near-black ink and one green (`#16c45a`). White sections alternate with full-bleed black bands. The rest is the diamond motif, pill buttons and one CTA, **Book a call**.

## Stack

- Next.js (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (theme + utilities only, see below)
- GSAP 3 + ScrollTrigger for scroll-driven motion (the portal tour, How it works, the feature-grid stories, the portal's chart intro). Set up once in `src/lib/motion.ts`.
- Lenis for smooth scrolling, driven by GSAP's ticker so pins and scrubs read the same scroll position each frame (`SmoothScroll`, off for `prefers-reduced-motion`).
- The rest of the motion is CSS keyframes, SVG and a few `<canvas>` drawings: dot-matrix art in The problem and Industries, the How it works scene, and `OrbitArt` behind the CTA. Everything pauses off-screen and settles on its final state under reduced motion.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run typecheck
```

## Structure

```
src/
  app/
    layout.tsx        fonts (next/font: Inter Tight, Inter, Geist Mono), metadata
    page.tsx          the landing page = a list of sections
    globals.css       Tailwind (theme + utilities) + tokens + component CSS
    landing.css       page layout (lp-*): one responsive page, phone layout at max-width 720px
  content/landing.ts  ALL copy and placeholder data (edit here, not in the components)
  components/
    landing/
      Sections.tsx          Hero, ProductBand, Problem, How it works, What you get, … (server components)
      PortalTour.tsx        the product band: portal on a tilted stage, pinned scroll camera tour
      portal/
        types.ts            PortalData contract + tour regions (content/landing.ts fills it)
        PortalOverview.tsx  the portal's Overview page (1240 × 860) + its chart intro
        charts.tsx          sparklines, 30-day volume chart, routing donut (SVG)
      HowFlow.tsx           How it works: steps + sticky scene scrubbed by scroll
      how-flow/scene.ts     the pixel scene as pure data + canvas painter
      FeatureGridMotion.tsx What you get: per-card scroll-in stories on the FeatureGrid
      FlipWords.tsx, MerchantStories.tsx   hero word flip, reviews
    site/                  SiteHeader (sticky nav + phone menu), SmoothScroll (Lenis + GSAP ticker)
  lib/motion.ts            GSAP/ScrollTrigger setup, breakpoints (MQ), reduced-motion helper
    vertlo/                the design-system component library (client components)
      index.ts             typed public API — import from "@/components/vertlo"
      types.ts             props for every component
      lib.tsx              implementation, generated from the design-system bundle
  styles/
    tokens.css         design tokens (colours, radii, spacing, fonts)
    vertlo.css         component styles (vt-*), copied from the design system
```

## Design system

`src/components/vertlo/lib.tsx` is generated from the design system's component bundle, so the site matches the approved canvas exactly. That covers the portal, the ruled feature grid, the dot-matrix and pixel art, the provider flow and the rest. `vertlo.css` and `tokens.css` are copied from it too.
The internals use `h()` (= `React.createElement`) and carry `// @ts-nocheck`; the **public API is fully typed** (`types.ts`, applied in `index.ts`).
When the design system changes, regenerate these three files rather than hand-editing them. The site-only additions are real hrefs on Nav, FAQ, CTABand, FeaturePanel and Footer, `clipHMobile` on PortalStage, and **status as content, not badges**: CrmSlice and FeatureGrid cards say their status in a subtitle ("3 of 4 live · US-01 paused") or a plain count instead of dot-pill tags, and FeaturePanel takes `chip={false}`. They are marked `site:` or live in `types.ts`; carry them into the bundle when it is regenerated.

### Site layer on top of the bundle

These are built in `src/components/landing` on the bundle's classes and tokens, and are what the page uses today. Fold them back into the design system's bundle (then regenerate) when it is next updated:

| Site component | Replaces / extends (bundle) | What it adds |
| --- | --- | --- |
| `PortalTour` + `portal/*` | `PortalStage`, `Portal` | Same stage markup (`vt-stage-*`). A redesigned Overview (KPI strip with sparklines and limit meters, 30-day volume with approval line and annotated events, routing donut, health meters, attention list), a chart intro on first view, and a pinned scroll camera tour with one caption per region (`portal.tour` in content). Replaces the bundle's timed phone tour. |
| `HowFlow` + `how-flow/scene.ts` | `HowItWorks` + `PixelArt` (`connect` / `route` / `keep`) | One continuous pixel scene scrubbed by scroll (connect → route → pause & reroute), steps with a progress rail, a soft focus on the active step's part of the scene. |
| `FeatureGridMotion` | wraps `FeatureGrid` | Per-card stories on scroll-in (split fills, failover incident, dispute timeline, payouts counting). Changes to the grid's text/classes are restored on cleanup; the grid itself is untouched. |

Motion conventions for anything new:
- Import `gsap` / `ScrollTrigger` from `@/lib/motion`, never from `gsap` directly, and use `MQ` for breakpoints so JS matches `landing.css` (phone = ≤720px).
- Scroll-linked scenes read progress from one scrubbed ScrollTrigger; state that should show without JS is server-rendered at its final values and only animated from there.
- Under reduced motion: no pins, no scrubs, no counters; each scene shows its settled state (per step where it has steps).

Page structure, top to bottom:
- Hero (text only).
- The product on a black band: the portal Overview, pinned while scroll tours KPIs → volume → attention → health.
- Logo strip.
- **The problem** on a black band, with dot-matrix art.
- **How it works**: steps on the left, a sticky pixel scene on the right (on top on phones) that plays the flow as you scroll.
- **What you get**: a ruled 2×2 grid with white shadow cards; each card plays its story when it scrolls in.
- **For high-risk brands** on a black band.
- Providers.
- **Industries**: dot-matrix art on white.
- Reviews.
- FAQ.
- **Final CTA** on a black band.
- Footer.

Rules to keep:
- Use `vt-*` classes and the components for anything in the design system. Tailwind runs **without preflight** on purpose, because the component CSS was designed against browser defaults. Use utilities for new page-level layout. Tokens are exposed as `bg-ink`, `text-green-deep`, `rounded-panel`, `md:` (= 721px+), etc.
- The system is flat: no gradients, glows or blur. Only white cards get a (soft) shadow. A black section is the backdrop itself (`vt-bleed`), so never nest a black card inside it to hold more cards.
- No badge pills or eyebrow pills with status dots: say status in the content (a subtitle, a plain muted count, or the row value itself).
- Use one green. Red marks paused, declined or over-limit states; amber marks "watch". Don't publish prices; the framing is reliability and approval rates.

## Responsive behaviour

- Desktop reference is 1440px and phone reference is 390px. Type, gutters and section rhythm are fluid between them (`clamp()` in `landing.css`).
- Black bands get 88–144px of room above and below, and 72–88px on phones.
- ≤1040px: compact header pill with a working menu.
- ≤960px: 3-column grids stack.
- ≤720px: the phone layout.
  - The portal tour pins under the header, with caption pills below the screen.
  - How it works: the scene sticks under the header and the steps scroll beneath it.
  - The feature grid and industry columns stack with dashed rules.
  - The provider flow turns vertical.

## Placeholders to replace before launch

- Logo strip (`LOGO 01…06`) and the three testimonials in `src/content/landing.ts`
- Industries (Supplements / Subscriptions / Digital goods) — confirm the list
- All portal numbers and the merchant name are **illustrative demo data** (labelled "Illustrative data")
- "All industries", Login and Support link to `#book` for now
