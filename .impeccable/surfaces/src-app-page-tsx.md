---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: []
---

# Landing page: Concept "The Route"

Scope: `src/app/page.tsx` (the whole landing page). Visitor mode: Persuade.

Audience and job: a high-risk ecommerce merchant deciding whether to book a call. They should believe that when one merchant account closes, their checkout keeps working. Proof: one illustrative order (#4821, Nordvia Group LLC, Jul 10 09:41) followed from checkout to payout, through the moment US-01 pauses.

Constraints: the direction is pinned by the client brief (structure, palette, type, motion). No concept roll was run; seed key: `brief-pinned`. Code-led build, no comp. All data stays labelled illustrative. One CTA: Book a call.

## Direction contract

THESIS: The page is one line. A single order travels it from checkout to payout, and the line visibly routes around the account that closes. It refuses the stacked-sections landing page: no bands, no centred heading over a card grid, no badge over each section.

OWN-WORLD: A route map drawn on misty green (#eef1ee). One 1.5px forest (#1f3b2b) line with small diamond nodes; bright green (#16c45a) only on what is live (the moving order, live accounts); one muted red (#9a3a31) for the paused account. Schibsted Grotesk for words, JetBrains Mono for system data (order ids, MIDs, timestamps). Flat hairline panels, 6px corners, no shadows, no glass, no gradients. Mostly empty space.

STORY: The visitor sees an order created, watches it head for US-01, sees US-01 close and the order bend to US-03, pass its checks, see a new account issued in-house, and land in a payout. They conclude the failover is real and book a call to put their own orders on the route.

FIRST VIEWPORT: Headline left in two lines, "One account closes." dimmed and "The rest keep selling." in ink, with the subhead and two actions under it (Book a call, See how it works). The line drops from under the header down the centre of the page. The order sits on it as a small card to its right: id, amount, card, time, status. Below, the line runs into the top of the laptop showing the portal.

FORM: A single SVG path measured from DOM anchors, drawn by scroll; the order rides it. Stops: Checkout, Paused, Rerouted, Approved, Underwritten, Settled, ending at Book a call. Signature interaction: at the pause, the node ahead turns red, its stub goes dotted, and the order takes the bend. Motion grammar: steady scrub, crisp state swaps, no glow, no bounce. Position 1 of 1 (brief-pinned). Seed key: brief-pinned.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
