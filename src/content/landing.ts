import type {
  FAQProps,
  FeatureGridProps,
  FeaturePanelProps,
  IndustryCardsProps,
  LinkItem,
} from "@/components/vertlo";
import type { PortalData } from "@/components/landing/portal/types";
import type { FlowStep } from "@/components/landing/HowFlow";

/**
 * All landing-page copy lives here so it can be edited (or moved to a CMS) without touching layout.
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
  accent: "The rest keep",
  /** Flips after "keep"; the first word is the one screen readers and no-JS visitors get. */
  flip: ["selling", "shipping", "scaling", "earning", "growing"],
  subhead:
    "Every payment provider and merchant account in one CRM, routing orders around the one that stops.",
};

/* The product shot: the portal's Overview, all illustrative. Numbers reconcile: the 30 daily
   volumes sum to the $1.84M gross, and approvals average 92.6% weighted by volume. The dip on
   Jul 6 is the UK-02 debit decline (in Attention required); on Jul 10 US-01 paused and traffic
   rerouted with no dip, which is the failover story told further down the page. */
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
  pops: [
    { time: "09:41", message: "MID US-01 paused. Traffic rerouted to UK-02 and US-03.", status: { tone: "paused", label: "Rerouted" } },
    { time: "09:52", message: "New MID approved: US-04. Added to routing.", status: { label: "Approved" } },
    { time: "10:07", message: "Dispute DSP-0221 caught early. Refunded before chargeback.", status: { label: "Saved" } },
  ],
};

export const logos = ["LOGO 01", "LOGO 02", "LOGO 03", "LOGO 04", "LOGO 05", "LOGO 06"];

export const problem: {
  eyebrow: string;
  rotating: string[];
  blurb: string;
  items: IndustryCardsProps["items"];
} = {
  eyebrow: "The problem",
  rotating: ["closes.", "freezes.", "gets flagged."],
  blurb:
    "High-risk brands can lose an account with one email. Most also run payments across separate tools and chat groups.",
  // Dot-matrix art on the black band (IndustryCards tone="dark").
  items: [
    {
      art: "closed",
      title: "Account closed, sales stop",
      body: "One processor decision and checkout goes dark. Vertlo moves the traffic to your other live accounts.",
    },
    {
      art: "scattered",
      title: "Payments scattered everywhere",
      body: "Providers, accounts and payouts across tools and chat groups. Vertlo puts them on one screen.",
    },
    {
      art: "underwriting",
      title: "New accounts are hard to get",
      body: "High-risk applications get declined or stall. We underwrite in-house and issue them.",
    },
  ],
};

export const how: { eyebrow: string; title: string; steps: FlowStep[] } = {
  eyebrow: "How it works",
  title: "Connect. Route. Keep selling.",
  // Rendered by HowFlow: one scroll-driven scene (connect → route → keep), steps alongside.
  steps: [
    {
      kicker: "Setup",
      title: "Connect your providers",
      body: "Bring every processor and merchant account into one CRM.",
    },
    {
      kicker: "Your rules",
      title: "Route across accounts",
      body: "Split volume by the rules you set, for steadier approval rates.",
    },
    {
      kicker: "Every day after",
      title: "Keep selling",
      body: "If one account pauses, the rest take the traffic in seconds.",
    },
  ],
};

export const whatYouGet: { eyebrow: string; title: string; blurb: string; items: FeatureGridProps["items"] } = {
  eyebrow: "What you get",
  title: "One bad email won’t stop your checkout.",
  blurb: "Routing, failover, dispute alerts and every store in one CRM.",
  // Ruled 2×2 grid with white shadow cards. Numbers are demo data, labelled "Illustrative data".
  items: [
    { title: "Route across accounts", body: "Split volume by rules you set, for steadier approval rates.", art: "routing" },
    { title: "Failover in seconds", body: "One MID pauses, the rest take the traffic.", art: "failover" },
    { title: "Catch disputes early", body: "Refund before it becomes a chargeback.", art: "disputes" },
    { title: "Every store, one CRM", body: "All your brands and their payouts in one place.", art: "stores" },
  ],
};

export const forBrands: FeaturePanelProps = {
  tag: "For high-risk brands",
  title: "We’ll issue the accounts you need.",
  description: "We underwrite in-house, so getting a new account doesn’t stall your checkout.",
  items: [
    { label: "Multiple live accounts", meta: "Run several MIDs side by side", icon: "layers" },
    { label: "Underwriting in-house", meta: "No outside approvals to wait on", icon: "shield" },
    { label: "Dispute alerts", meta: "Refund before it’s a chargeback", icon: "bell" },
    { label: "One CRM", meta: "Every provider on one screen", icon: "dashboard" },
  ],
  ctaHref: "#book",
};

export const providers = {
  eyebrow: "Providers",
  title: "Connect the providers you already use.",
};

export const industries: { eyebrow: string; title: string; items: IndustryCardsProps["items"] } = {
  eyebrow: "Industries",
  title: "Made for brands banks call risky.",
  // Industry list is a working assumption: confirm with Vertlo before launch.
  items: [
    { art: "supplements", title: "Supplements", body: "Monthly reorders keep flowing when one account tightens up." },
    { art: "subscriptions", title: "Subscriptions", body: "A failed renewal is retried on another account." },
    { art: "digital", title: "Digital goods", body: "Payments go through on whichever account is live." },
  ],
};

// Placeholders: replace with real merchant quotes (with permission) before launch.
/** Which illustrative chart plays beside a quote. */
export type MerchantStory = "closed" | "hours" | "newMid";
/** A merchant quote with its result: `value` is the number, `label` says what it measures. */
export type MerchantQuote = { story: MerchantStory; value: string; label: string; quote: string; name: string; business: string };

// Placeholders: replace with real, approved quotes and numbers before launch. Never ship invented ones.
export const testimonials: { eyebrow: string; title: string; items: MerchantQuote[] } = {
  eyebrow: "Merchants",
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

export const faq: Pick<FAQProps, "blurb" | "items"> = {
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

export const cta = {
  title: "Put every account in one CRM.",
  points: ["Multiple live accounts", "Failover in seconds", "Underwriting in-house"],
};

export const footer = {
  tagline: "The payment CRM for high-risk ecommerce.",
  columns: [
    {
      title: "Product",
      links: [
        { label: "Routing", href: "#how" },
        { label: "Failover", href: "#how" },
        { label: "Dispute alerts", href: "#how" },
        { label: "Underwriting", href: "#book" },
        { label: "Portal", href: "#top" },
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
