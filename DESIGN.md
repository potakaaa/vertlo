---
name: Vertlo
description: The payment CRM for high-risk ecommerce, drawn as one route on misty green.
colors:
  mist: "#eef1ee"
  paper: "#f6f8f5"
  forest: "#1f3b2b"
  forest-hover: "#2a4c38"
  live: "#16c45a"
  stop: "#9a3a31"
  ink: "#0b1410"
  ink-muted: "#4a5750"
  ink-faint: "#616d66"
  ink-dim: "#78857e"
  track: "#c6d0c9"
  track-dead: "#94a199"
  rule: "rgba(31,59,43,.26)"
  rule-soft: "rgba(31,59,43,.13)"
  forest-wash: "rgba(31,59,43,.07)"
typography:
  display:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(38px, 3.9vw, 58px)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "clamp(30px, 3.2vw, 48px)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.028em"
  title:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body-lg:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1
  data:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: "18px"
    fontFeature: "\"tnum\""
  data-note:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.4
  amount:
    fontFamily: "Schibsted Grotesk, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
rounded:
  hairline: "2px"
  inner: "4px"
  tag: "5px"
  card: "6px"
  panel: "8px"
  menu: "10px"
spacing:
  gap: "24px"
  gutter: "clamp(20px, 5.55vw, 80px)"
  container: "1280px"
  header: "72px"
  stop: "clamp(104px, 15vh, 184px)"
  stop-tight: "clamp(32px, 5vh, 56px)"
components:
  button-primary:
    backgroundColor: "{colors.forest}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.card}"
    padding: "0 18px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.forest-hover}"
  button-primary-lg:
    backgroundColor: "{colors.forest}"
    textColor: "#ffffff"
    rounded: "{rounded.card}"
    padding: "0 22px 0 24px"
    height: "52px"
  button-primary-sm:
    backgroundColor: "{colors.forest}"
    textColor: "#ffffff"
    rounded: "{rounded.card}"
    padding: "0 16px"
    height: "40px"
  link-action:
    textColor: "{colors.ink}"
    padding: "14px 0"
  order-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.data}"
    rounded: "{rounded.card}"
    padding: "10px 14px 11px"
    width: "300px"
  order-tag:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.data}"
    rounded: "{rounded.tag}"
    padding: "0 9px"
    height: "26px"
  route-node:
    backgroundColor: "{colors.mist}"
    size: "10px"
    rounded: "1.5px"
  route-node-on:
    backgroundColor: "{colors.forest}"
  route-node-live:
    backgroundColor: "{colors.live}"
  route-node-stop:
    backgroundColor: "{colors.stop}"
  record-panel:
    textColor: "{colors.ink}"
    typography: "{typography.data}"
  story-panel:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.panel}"
  header:
    backgroundColor: "{colors.mist}"
    height: "72px"
  mobile-menu:
    backgroundColor: "{colors.paper}"
    rounded: "{rounded.menu}"
    padding: "6px"
---

# Design System: Vertlo

## Overview

**Creative North Star: "The Route"**

The page is one line. A single 1.5px forest line drops from under the header, runs down a misty green ground, and carries one illustrative order from checkout to payout. Sections are stops on that line, never bands: copy sits beside the line, whitespace separates the stops, and nothing is boxed unless it is something the system printed. The line is a route map, not a curve: only horizontal and vertical runs joined by quarter-circle corners (14px radius), and the main line never travels upward.

The world is quiet and exact. Trust comes from precision rather than decoration: order ids, MIDs, timestamps and statuses are set in JetBrains Mono with tabular figures, laid flat on the mist or on a barely lighter paper panel with a hairline edge. Colour is almost entirely forest and ink on mist; bright green appears only on what is live, one muted red only on what has stopped. The one dark object on the page is the reused portal product shot, which sits in a laptop the line runs behind; it is the product, not a surface style.

Each stop after the product shot leads with one **figure**: a patent-sheet drawing of a single object in forest ink on transparency (always the order's parcel: padlocked, relabelled, keyed, delivered), numbered like a patent sheet and hung off its node by a hairline leader. The drawings give the page something to look at while the copy stays at a headline and one line; they are drawn by the line as it passes.

State is shown by the line passing a point. Everything that changes (a node filling, a log line appearing, a tick drawing, a statement row darkening) flips when the line reaches it and flips back when the reader scrolls up. With reduced motion the whole route is drawn, every state is on, and the order waits settled at its payout.

**Key Characteristics:**
- One continuous forest line, orthogonal runs with 14px corners, drawn by scroll.
- Diamond (45 degree) nodes, pips and bullets; no circles in the route's own grammar.
- Misty green ground everywhere, including the header; paper panels only for printed things.
- Two faces: Schibsted Grotesk for words, JetBrains Mono for what the system prints.
- Flat hairlines, 6px corners, no shadows, no gradients, no glass.
- Mostly empty space: tall stop padding, a headline and one line of copy per stop.
- One patent-sheet figure per stop: the same parcel (the order) in its state at that stop, forest ink, tied to the line by a leader and drawn by the scroll.

## Colors

A near-monochrome forest-on-mist palette where colour is a status signal, not decoration.

### Primary
- **Forest** (`forest`): the line, drawn nodes, the passed-order head, every button, focus rings, text selection, bars in record panels, check ticks. The single voice of the page.
- **Forest Hover** (`forest-hover`): button hover only.

### Secondary
- **Live Green** (`live`): the moving order's pip, live account nodes, the status diamond on the order card, the portal notification's live dot. Nothing decorative is ever live green.

### Tertiary
- **Stop Red** (`stop`): the paused account only: its node once reached, its label, the order tag while paused, a paused row in a record panel, negative marks in the stories chart.

### Neutral
- **Mist** (`mist`): the page ground, the header, the hollow centre of an unreached node. Also the browser theme colour.
- **Paper** (`paper`): a panel laid on the mist: the order card and tag, the merchant-story panel, the mobile menu.
- **Ink** (`ink`): headings, data values, primary text.
- **Ink Muted** (`ink-muted`): subheads, body copy, nav links, card secondary text.
- **Ink Faint** (`ink-faint`): timestamps, record headers, notes, unreached states. Darkened on this site to hold 4.5:1 on mist.
- **Ink Dim** (`ink-dim`): large text only; the dimmed first line of the hero headline.
- **Track** (`track`): the line not yet travelled (1px). Opaque so crossing lines never darken.
- **Dead Track** (`track-dead`): the dotted stub to the paused account.
- **Rule / Rule Soft** (`rule`, `rule-soft`): hairline panel edges and row dividers; `rule` for a panel's own edge or a list's top, `rule-soft` between rows.
- **Forest Wash** (`forest-wash`): hover fill on menu rows; at .08 it backs inline value chips in the stories.

### Named Rules
**The Live Means Live Rule.** Bright green marks only something currently live (the moving order, a live account). If it is not live, it is forest.

**The One Red Rule.** Stop red belongs to the paused account and nothing else. There is no warning orange, no error pink in the route's own layer.

**The Same Ground Rule.** The header, the stops and the footer all sit on mist. Separation comes from a hairline or from space, never from a differently coloured band.

## Typography

**Display Font:** Schibsted Grotesk (with system-ui)
**Body Font:** Schibsted Grotesk (with system-ui)
**Label/Mono Font:** JetBrains Mono (400, 500; with ui-monospace)

**Character:** A tight, slightly newsprint grotesk for everything people read, paired with a plain terminal mono for everything the system prints. The pairing is the page's argument: words from people, data from the machine.

### Hierarchy
- **Display** (600, `clamp(38px, 3.9vw, 58px)`, 1.02, -0.035em): the hero headline in two block lines (first line in Ink Dim) and the closing "Book" headline.
- **Headline** (600, `clamp(30px, 3.2vw, 48px)`, 1.08, -0.028em, balanced wrap): each stop's heading.
- **Title** (600, 18px, 1.3, -0.01em): question buttons; 19px for step names and provider names; 22px for check and industry names.
- **Body Large** (400, 18px, 1.55, max 31em): the hero subhead only.
- **Body** (400, 17px, 1.55, max 52ch, pretty wrap): the one line under each stop heading and answers (58ch).
- **Body Small** (400, 16px, 1.5): step and check descriptions.
- **Label** (500, 15px): nav links, provider names, buttons at 600.
- **Data** (JetBrains Mono 500, 12px/18px, tabular figures): node labels, logs, record panels, the order card and tag. 13px in the payout statement.
- **Data Note** (JetBrains Mono 500, 11px): the "Illustrative" footnotes under panels.
- **Amount** (600, 26px, -0.02em): the money on the order card. The payout is the one display number on the page (600, `clamp(44px, 4.8vw, 72px)`, -0.035em), dim until the order lands.
- **Figure caption** (JetBrains Mono 500, 12px/18px): "Fig. N" in ink, then one line in faint.

### Named Rules
**The Printed Data Rule.** Anything a system would print (ids, MIDs, times, statuses, amounts in records) is JetBrains Mono with tabular figures. Nothing a person says is ever set in mono.

**The No Shouting Rule.** No uppercase, no letterspaced labels in the route layer. The base design system's uppercase footer headings and chart labels are reset to sentence case, zero tracking.

## Layout

Every row is a 12-column grid (`gap` 24px column gap) inside a 1280px container with a gutter of `clamp(20px, 5.55vw, 80px)`. The line does not live in a column; it runs in a **lane** between columns, placed by CSS:

- **Centre lane**: between columns 6 and 7. The hero and down to the pause.
- **Right lane**: between columns 9 and 10. Copy and figures share columns 1 to 8 beside it: copy in 1 to 4, the figure in 5 to 8 against the line.
- **Far-right lane**: 96px in from the container's right edge (the second live account).
- **Left-edge lane**: 5px in from the container edge. The arrival, the stations, the book.
- **Branch lane**: right lane minus 240px, out to the left (the account issued in-house).

Points on the line are zero-size anchors or nodes placed by lane and height; the engine measures them and draws one path through them. Layout stays CSS; the script only draws.

Stops are separated by space, not bands: `clamp(112px, 16vh, 200px)` above a stop, `clamp(48px, 7vh, 88px)` for a tight follow-on. Header 72px (64px under 720px). Copy blocks are single-column grids with a 20px gap.

**Responsive.** At 1100px and below the grid collapses to one column and every lane moves to the left edge; the copy gets a 44px rail (28px under 720px) to the right of the line, and detours step out from it at 113px and 221px. The order travels as its pip alone (the tag would cover copy), and node labels become a printed line above their heading. At 860px the nav folds into a menu button. At 720px tables restack (the statement becomes a two-column card-less row).

**The Lane Rule.** The line always runs between columns, never through copy. If a new stop needs the line, place its node by lane and height in CSS; do not position it in script.

## Elevation & Depth

Flat. Depth on the mist comes from the paper tone plus a 1px hairline drawn as an inset/outset ring (`box-shadow: 0 0 0 1px` in Rule), never from blur. The header gains a 1px Rule Soft bottom line once scrolled and hides upward on scroll down. The portal's notification toasts are flattened to the same hairline ring.

### Shadow Vocabulary
- **Hairline ring** (`box-shadow: 0 0 0 1px rgba(31,59,43,.26)`): order card, order tag, story panel (at Rule Soft), portal notifications. This is a border, not elevation.

### Named Rules
**The Flat Paper Rule.** Nothing casts a shadow, not even the mobile menu that floats over the page: it sits on paper with the same hairline ring as everything else.

## Shapes

Small, near-square corners: 6px for cards and buttons, 5px for the order tag, 4px for inner elements and tooltips, 8px for the story panel, 10px for the floating menu. The recurring silhouette is the **diamond**: a square rotated 45 degrees with a 1 to 1.5px corner, used for nodes (10px), the order pip (10px), the passed head (7px), the card's status mark (7px), the "next" marker (9px outline) and list bullets (5px). The line's own corners are quarter circles of 14px. Record panels have no box at all: a top hairline and nothing else.

## Components

### Buttons
Solid, compact, forest.
- **Shape:** gently squared (6px).
- **Primary:** forest fill, white 600 label, 44px tall with 18px sides; large 52px (the hero and the terminus), small 40px (header). An arrow icon (1.75 stroke) follows the label.
- **Hover / Focus:** fill steps to Forest Hover and the arrow slides 3px right; press scales to .96. Focus is a 2px forest outline at 3px offset.
- **Text action:** "See how it works" is ink text with a 1px Rule underline at 6px offset that turns forest on hover. There is no secondary filled or ghost button.

### Order card and tag (signature)
The order is a card where it starts and where it settles, a tag while it travels, and hidden while inside the portal.
- **Card:** paper, hairline ring, 6px, 300px wide, mono 12px/18px. Top row id plus status (a 7px live diamond, forest once settled); the amount in 26px grotesk; then card and merchant rows in faint.
- **Tag:** paper, hairline ring, 5px, 26px tall; the order id in ink and its status beside it, the status in stop red while paused.
- **Pip:** a 10px diamond at the head of the line: live while travelling, stop while paused, forest when done.

### Route nodes and labels (signature)
- **Node:** a 10px hollow diamond (mist fill, 1.5px forest edge). Filled forest once passed; live for a live account; stop for the paused account, whose label also turns stop.
- **Label:** mono 12px/18px, ink, with its timestamp in faint, set in the gutter left of the line (or right, where the line runs at the far side), 18px from the node. Labels are part of the line's print, not tags on headings.
- **Swap:** a label's text can swap to a second state when the line passes (e.g. "Live" to "Paused").

### Figures (signature)
One drawing per stop, never decoration between stops.
- **Subject:** every figure is the same object, the order's parcel (#4821): the same box, string, bow and blank label, from the same three-quarter angle at the same size. Each stop changes one thing about it (padlocked when US-01 closes, relabelled when rerouted, a new key when US-04 is issued, untied beside an envelope at payout, opened on the industry it carries). No metaphors from other worlds (trains, pipes, switches): the reader follows one object down the route.
- **Drawing:** in the style of a patent drawing: technical-pen line, sparse parallel hatching only on faces turned away, no tonal mass, no text or numerals in the image. Shipped as forest ink (`#1f3b2b`) on transparency, trimmed to its ink and padded square, 880px WebP. The base parcel (no change applied) is the reference every stop's drawing is generated against.
- **Size:** at most four columns (about 410px at 1440); 300 to 380px on one lane.
- **Caption:** "Fig. N" in ink and one mono line in faint; numbers in captions reconcile with the order's story, and a caption that states a time or amount is marked illustrative nearby.
- **Leader:** on the wide layout a 1px forest hairline runs straight across from the stop's node into the figure's near edge. The node's label sits above the leader (never struck through).
- **Drawn by the line:** the figure reveals top to bottom behind a soft 18% mask edge as the head of the line passes down beside it (`--draw`, 0 to 1); the caption fades in over the last 30%. Reduced motion: fully drawn.
- **Provenance:** every figure ships with a `.webp.json` sidecar holding its exact generation prompt.

### Records
What the system printed, flat on the mist.
- **Result line:** under a check's copy, a mono 13px line with a tick that draws when the line reaches the check; faint until then.
- **Payout:** the display amount, then two mono lines (payout id, date and status; what it includes). The status swaps from Pending to Paid when the order lands.

### Lists on hairlines
Steps and questions are rows divided by Rule Soft top hairlines with 14 to 22px vertical padding, steps led by a 7px forest diamond. Industries are not a row of columns: each is its own node on the line with its figure, stepped further along the route. No cards, no icons. Questions expand with a plus that loses its vertical bar; the answer opens by grid-row interpolation.

### Navigation
Flat mist strip, sticky, 72px. Logo mark in forest, 15px 500 links in Ink Muted turning ink on hover, 32px apart; Log in as a link and a small primary button at the end. Under 860px a 40px menu button (hairline ring, 6px) morphs bars to cross, and a paper menu drops 4px below the strip.

### Merchant story panel
The reused stories component laid flat: paper fill, Rule Soft ring, its chart as a region of the panel rather than a nested card, tabs split by Rule Soft hairlines, forest fills and tooltip.

### Motion
Steady scrub, crisp state swaps, no glow, no bounce. The line's drawn length follows scroll with a short exponential catch-up (about 100ms) and a speed cap; on load it draws down to the order over 0.9s (`power2.out`). State swaps are 150 to 200ms ease-out colour or opacity changes; entrances use `cubic-bezier(.2,0,0,1)`. Figures are drawn by the scroll too (see Figures); there is no timed entrance anywhere below the hero. Reduced motion: the whole route is drawn, all states on, every figure drawn, the order sits settled at the payout, and transitions are off.

## Do's and Don'ts

### Do:
- **Do** let the line carry the page: new sections are stops placed by lane and height, with a node and a mono label, not new bands.
- **Do** keep copy to a headline and one line per stop, set beside the line with generous space above (`clamp(104px, 15vh, 184px)`).
- **Do** set every printed value (ids, MIDs, timestamps, statuses) in JetBrains Mono 500 with tabular figures, and label illustrative data as illustrative.
- **Do** express state by the line reaching a point (`data-on`), reversibly, and show the final state when motion is reduced.
- **Do** use the diamond for every mark on the route: nodes, pips, bullets, status.
- **Do** give each stop one patent-sheet figure, tied to its node by a leader, with a one-line caption.
- **Do** separate with Rule Soft hairlines and whitespace; use paper plus a hairline ring only for things the system printed or cards laid on the mist.

### Don't:
- **Don't** stack full-width coloured bands or put a centred heading over a card grid.
- **Don't** use bright green on anything that is not live, or red on anything but the paused account.
- **Don't** add shadows, gradients, glass or glows anywhere; depth is paper tone plus a hairline.
- **Don't** draw the line as a free curve or send the main line upward; runs are horizontal and vertical with 14px corners.
- **Don't** use uppercase letterspaced labels, badges or small text above headings; a stop is announced by its node's printed label on the line.
- **Don't** use Ink Dim for text under display size.
- **Don't** add a second filled call to action; Book a call is the only one.
- **Don't** lay figures out as a row of equal columns or as alternating image/text feature rows; a figure hangs off the line.
- **Don't** use photographs, 3D renders, icon tiles or heavy engraving; one ink, sparse hatching, lighter than the line.
