import type { FAQProps, LinkItem } from "@/components/vertlo";
import type { PortalData } from "@/components/landing/portal/types";

/**
 * All landing-page copy lives here so it can be edited (or moved to a CMS) without touching layout.
 * The page follows one order down one line (Concept: The Route), so most of this file is that
 * order's story: every id, time, share and amount below is illustrative and agrees with the rest.
 * Rules from the brand: no published prices, "Book a call" is the one CTA, placeholders are labelled.
 */

export const navLinks: LinkItem[] = [
  { label: "Product", href: "#how" },
  { label: "Industries", href: "#industries" },
  { label: "Reviews", href: "#reviews" },
  { label: "Company", href: "#company" },
];

export const hero = {
  lead: "One account closes.",
  accent: "The rest keep selling.",
  subhead:
    "Every payment provider and merchant account in one CRM, routing orders around the one that stops.",
};

/* The order the page follows. `stages` is its status along the line: each takes over when the order
   passes the named point on the route (the data-rt anchors in Sections.tsx). */
export type OrderStage = { at: string; status: string; time: string; tone?: "stop" | "done" };
export const order = {
  id: "#4821",
  amount: "$129.00",
  card: "Visa debit ·· 4242",
  merchant: "Nordvia Group LLC",
  label: "Illustrative",
  stages: [
    { at: "checkout", status: "Created", time: "Jul 10, 09:41:02" },
    { at: "router", status: "Routing to US-01", time: "Jul 10, 09:41:02" },
    { at: "pause", status: "US-01 paused", time: "Jul 10, 09:41:02", tone: "stop" },
    { at: "junction", status: "Rerouted to US-03", time: "Jul 10, 09:41:03" },
    { at: "approved", status: "Approved", time: "Jul 10, 09:41:03" },
    { at: "home", status: "In payout P-0714", time: "Jul 14" },
    { at: "payout", status: "Settled", time: "Paid out Jul 14", tone: "done" },
  ] satisfies OrderStage[],
};

/* The product shot: the portal's Overview, all illustrative. Numbers reconcile: the 30 daily
   volumes sum to the $1.84M gross, and approvals average 92.6% weighted by volume. The dip on
   Jul 6 is the UK-02 debit decline (in Attention required); on Jul 10 US-01 paused and traffic
   rerouted with no dip, which is the failover the line shows further down the page. */
export const portal: PortalData = {
  merchant: "Nordvia Group LLC",
  period: { from: "Jun 14", mid: "Jun 28", to: "Jul 13" },
  kpis: [
    { label: "Gross volume", to: 1.84, prefix: "$", suffix: "M", decimals: 2, delta: "+12.4%", trend: "up", viz: "volume" },
    { label: "Approval rate", to: 92.6, suffix: "%", decimals: 1, delta: "-1.1pt", trend: "down", viz: "approval" },
    { label: "Successful transactions", to: 14208, delta: "+9.2%", trend: "up", viz: "count" },
    { label: "Chargeback rate", to: 0.62, suffix: "%", decimals: 2, delta: "+0.08pt", trend: "down", viz: { limit: 1, label: "Limit 1.0%" } },
    { label: "Available to pay out", to: 148220, prefix: "$", delta: "Next payout Jul 14", trend: "flat", viz: { payout: 212480, label: "$212,480 pending" } },
  ],
  volume: [51.8, 54.7, 58.6, 54.1, 53.6, 51.2, 51.1, 57.2, 58.6, 61.9, 58.4, 55.6, 55.8, 59.4, 59.7, 63.9, 67.3, 67.2, 62.4, 60.1, 64.6, 63.8, 71.6, 69.9, 67.5, 64.4, 64.0, 68.2, 68.9, 74.5],
  approval: [93.1, 92.9, 93.0, 92.7, 92.7, 92.8, 93.1, 93.0, 92.9, 93.1, 93.0, 92.9, 93.2, 93.1, 92.8, 93.1, 93.0, 93.3, 93.2, 92.9, 91.3, 90.1, 89.7, 90.5, 92.8, 93.0, 92.7, 93.1, 93.2, 93.1],
  notes: [
    { day: 22, date: "Jul 6", label: "UK-02 debit dip", tone: "warn" },
    { day: 26, date: "Jul 10", label: "US-01 paused, rerouted — no dip", tone: "ok" },
  ],
  routing: [
    { id: "US-03", share: 42, approval: 92.9, state: "live" },
    { id: "UK-02", share: 38, approval: 91.8, state: "watch" },
    { id: "US-04", share: 20, approval: 93.4, state: "new" },
    { id: "US-01", share: 0, state: "paused" },
  ],
  health: [
    { label: "Chargeback ratio", value: "0.62%", of: "limit 1.0%", fill: 0.62, status: "Within limit", tone: "ok" },
    { label: "Refund rate", value: "2.1%", of: "target under 3%", fill: 0.7, status: "Improving", tone: "ok" },
    { label: "Reserve held", value: "$96,400", of: "98% of target", fill: 0.98, status: "On track", tone: "ok" },
    { label: "UK-02 approval", value: "91.8%", of: "target 93%", fill: 0.55, status: "Watch — UK debit", tone: "warn" },
  ],
  settlement: { pending: "$212,480", available: "$148,220", next: "Next payout Jul 14" },
  attention: [
    { tone: "red", title: "1 dispute requires evidence", meta: "DSP-0221 · $89.00 · due Jul 14", action: "Respond", on: true },
    { tone: "amber", title: "Approval rate declined 4.2% on UK-02", meta: "UK Visa debit · since Jul 6", action: "Analyse" },
    { tone: "amber", title: "MID US-04 nearing monthly cap", meta: "72% utilised · projected cap Jul 26", action: "Review", on: true },
    { tone: "amber", title: "Compliance document expiring", meta: "Insurance certificate · Jul 20", action: "Upload" },
  ],
  tour: [
    { region: "kpis", caption: "Every number, live" },
    { region: "volume", caption: "Volume and approvals" },
    { region: "attention", caption: "What needs attention" },
    { region: "health", caption: "Payment health" },
  ],
  /* the first one is the order the page follows, seen from inside the portal */
  pops: [
    { time: "09:41", message: "Order #4821 received. $129.00, Visa debit." },
    { time: "09:41", message: "MID US-01 paused. Traffic rerouted to UK-02 and US-03." },
    { time: "09:52", message: "New MID approved: US-04. Added to routing." },
  ],
};

/** A patent-style drawing on the route (public/images/route): `n` is its figure number, `caption` the one line under it. */
export type Fig = { src: string; n: number; alt: string; caption: string };
const fig = (name: string, n: number, alt: string, caption: string): Fig => ({ src: `/images/route/${name}.webp`, n, alt, caption });

/* Stop 2, Paused: the order is sent to US-01 and the account closes under it. */
export const paused = {
  title: "Keep selling when your account closes.",
  blurb: "High-risk brands can lose an account with one email. Checkout doesn’t have to go with it.",
  node: { time: "09:41:02", label: "Routed to US-01" },
  fig: fig("terminal", 1, "Drawing of a card terminal locked shut with a padlock and chain.", "US-01, closed by its acquirer at 09:41:02"),
  /* the three accounts the router splits across: share before the pause, then after it */
  accounts: [
    { id: "US-01", name: "us01", before: "Live · 40%", after: "Paused · 0%" },
    { id: "US-03", name: "us03", before: "Live · 30%", after: "Live · 54%" },
    { id: "UK-02", name: "uk02", before: "Live · 30%", after: "Live · 46%" },
  ],
  alt: "Diagram: the order is sent to account US-01, which pauses. The route bends to account US-03, and UK-02 takes the rest of the traffic.",
};

/* Stop 3, Rerouted: how it works, in three lines. */
export const how = {
  title: "Set it up once. It routes from there.",
  node: { time: "09:41:03", label: "Rerouted" },
  fig: fig("switch", 2, "Drawing of a railway track switch set to the branch line.", "#4821 switched to US-03 at 09:41:03"),
  steps: ["Connect your providers", "Route across accounts", "Keep selling"],
};

/* Stop 4, Approved: the four checks the order passes on its way. */
export type Check = {
  key: string;
  title: string;
  body: string;
  /** the label on the line where the order passes this check */
  node: { time: string; label: string };
  fig: Fig;
  /** printed when the order passes the check */
  result: string;
};
export const whatYouGet: { title: string; blurb: string; node: { time: string; label: string }; note: string; items: Check[] } = {
  title: "One bad email won’t stop your checkout.",
  blurb: "Routing, failover, dispute alerts and every store in one CRM.",
  node: { time: "09:41:03", label: "Approved" },
  note: "Amounts and times are illustrative",
  items: [
    {
      key: "routing",
      title: "Route across accounts",
      body: "Split volume by rules you set, for steadier approval rates.",
      node: { time: "09:41:03", label: "Split" },
      fig: fig("manifold", 3, "Drawing of a pipe manifold splitting one inlet into three valved outlets, one shut.", "Split by approval rate: US-03 54%, UK-02 46%"),
      result: "#4821 sent to US-03",
    },
    {
      key: "failover",
      title: "Failover in seconds",
      body: "One MID pauses, the rest take the traffic.",
      node: { time: "09:41:03", label: "Held" },
      fig: fig("knife", 4, "Drawing of a double-throw knife switch thrown to its second contacts.", "US-01 out, traffic moved across in a second"),
      result: "Checkout stayed up",
    },
    {
      key: "disputes",
      title: "Catch disputes early",
      body: "Refund before it becomes a chargeback.",
      node: { time: "09:41:04", label: "Monitored" },
      fig: fig("magnifier", 5, "Drawing of a magnifying glass resting on a long paper receipt.", "DSP-0221 caught at 10:07, refunded in time"),
      result: "No chargeback",
    },
    {
      key: "stores",
      title: "Every store, one CRM",
      body: "All your brands and their payouts in one place.",
      node: { time: "09:41:04", label: "Logged" },
      fig: fig("drawer", 6, "Drawing of an open cash register drawer.", "Three stores, $132,735 paid out in 30 days"),
      result: "Total $132,735",
    },
  ],
};

/* Still stop 4: the providers, drawn as lines feeding into the route. */
export const providers = {
  title: "Connect the providers you already use.",
  items: ["Visa and Mastercard acquirers", "PayPal", "Your processor"],
};

/* Stop 5, Underwritten: a new account is issued in-house and joins the route as a live branch. */
export const forBrands = {
  title: "We’ll issue the accounts you need.",
  description: "We underwrite in-house, so getting a new account doesn’t stall your checkout.",
  node: { time: "09:52", label: "Underwritten" },
  split: { time: "09:52", label: "US-04 issued" },
  account: { id: "US-04", before: "Pending", after: "Live · 20%" },
  fig: fig("key", 7, "Drawing of a new key on a ring with a blank paper tag.", "US-04, underwritten in-house, live at 09:52 (illustrative)"),
  alt: "Diagram: a new account, US-04, branches off the route, goes live and joins it again.",
};

/* Stop 6, Settled: the payout the order lands in. */
export const settled = {
  title: "The payout lands.",
  blurb: "Four days after US-01 closed, order #4821 is paid out with the rest.",
  payout: { id: "P-0714", date: "Jul 14", amount: "$148,220.00", before: "Pending", after: "Paid", includes: "Includes #4821 · $129.00" },
  fig: fig("letterbox", 8, "Drawing of a wall-mounted post box with an envelope in its slot.", "Payout P-0714, Jul 14, with #4821 inside"),
  note: "Illustrative data",
};

export const industries = {
  title: "Made for brands banks call risky.",
  // Industry list is a working assumption: confirm with Vertlo before launch.
  items: [
    { title: "Supplements", body: "Monthly reorders keep flowing when one account tightens up.", fig: fig("bottle", 9, "Drawing of a supplement bottle with its cap off.", "") },
    { title: "Subscriptions", body: "A failed renewal is retried on another account.", fig: fig("parcels", 10, "Drawing of three parcels tied with string.", "") },
    { title: "Digital goods", body: "Payments go through on whichever account is live.", fig: fig("phone", 11, "Drawing of a smartphone with its charging cable.", "") },
  ],
};

export const trust = { heading: "Trusted by high-risk brands" };
// Placeholders: replace with real customer logos (with permission) before launch.
export const logos = ["LOGO 01", "LOGO 02", "LOGO 03", "LOGO 04", "LOGO 05", "LOGO 06"];

/** Which illustrative chart plays beside a quote. */
export type MerchantStory = "closed" | "hours" | "newMid";
/** A merchant quote with its result: `value` is the number, `label` says what it measures. */
export type MerchantQuote = { story: MerchantStory; value: string; label: string; quote: string; name: string; business: string };

// Placeholders: replace with real, approved quotes and numbers before launch. Never ship invented ones.
export const testimonials: { title: string; items: MerchantQuote[] } = {
  title: "Merchants who kept selling.",
  items: [
    {
      story: "closed",
      value: "[0]",
      label: "[sales lost when an account closed]",
      quote: "[Merchant quote: one or two sentences about keeping sales running when an account closed.]",
      name: "[Customer name]",
      business: "[Business type]",
    },
    {
      story: "hours",
      value: "[12 hrs]",
      label: "[saved every week]",
      quote: "[Merchant quote: how having every provider in one place changed the day-to-day.]",
      name: "[Customer name]",
      business: "[Business type]",
    },
    {
      story: "newMid",
      value: "[48 hrs]",
      label: "[to a new MID approval]",
      quote: "[Merchant quote: getting an account issued when others said no.]",
      name: "[Customer name]",
      business: "[Business type]",
    },
  ],
};

export const faq: Pick<FAQProps, "blurb" | "items"> & { title: string } = {
  title: "What merchants ask before the call.",
  blurb: "Ask us anything else on a call.",
  items: [
    {
      q: "How is Vertlo priced?",
      a: "A setup fee plus a percentage per transaction, quoted per merchant based on your business. We walk through it on a call.",
    },
    {
      q: "What happens when one of my accounts is paused?",
      a: "Traffic moves to your other live accounts, so checkout keeps working while you sort out the paused one.",
    },
    {
      q: "What if I don’t have merchant accounts yet?",
      a: "We underwrite in-house and can issue accounts for your business.",
    },
    {
      q: "Which providers can I connect?",
      a: "Visa and Mastercard acquirers, PayPal and more. Ask about yours on a call.",
    },
  ],
};

/* Where the line ends: the one CTA, framed as the start of the route for the visitor's own orders. */
export const cta = {
  title: "Put your orders on this route.",
  blurb: "A 30-minute call. We map your providers and accounts, and show you the portal with your numbers.",
  points: ["Multiple live accounts", "Failover in seconds", "Underwriting in-house"],
  next: { id: "#0001", label: "Your first order" },
};

export const footer = {
  tagline: "The payment CRM for high-risk ecommerce.",
  columns: [
    {
      title: "Product",
      links: [
        { label: "Routing", href: "#how" },
        { label: "Failover", href: "#paused" },
        { label: "Dispute alerts", href: "#approved" },
        { label: "Underwriting", href: "#underwriting" },
        { label: "Portal", href: "#portal" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Industries", href: "#industries" },
        { label: "Reviews", href: "#reviews" },
        { label: "Book a call", href: "#book" },
      ],
    },
    {
      title: "Account",
      links: [
        { label: "Login", href: "#book" },
        { label: "Support", href: "#book" },
      ],
    },
  ],
};
