import type { FAQProps, IndustryCardsProps, LinkItem } from "@/components/vertlo";
import type { PortalData } from "@/components/landing/portal/types";
import type { FlowStep } from "@/components/landing/HowFlow";

/**
 * All landing-page copy lives here so it can be edited (or moved to a CMS) without touching layout.
 * Headings: `*words*` render in the accent ink (see components/landing/Rich.tsx); used sparingly,
 * on the hero and the cheque only. Rules from the brand: no published prices, "Book a call" is the
 * one CTA, placeholders are labelled and stay hidden until real.
 */

export const navLinks: LinkItem[] = [
  { label: "How it works", href: "#how" },
  { label: "Underwriting", href: "#underwriting" },
  { label: "Who it's for", href: "#industries" },
  { label: "Questions", href: "#questions" },
];

export const hero = {
  /** The one serial printed on the note. */
  serial: "Nº VT 000 001",
  /** Microprint: the issuer's name, as on a real note. */
  micro: "VERTLO MERCHANT SERVICES · ",
  lead: "One account closes.",
  accent: "The rest keep",
  word: "selling",
  subhead:
    "Every payment provider and merchant account in one CRM, routing orders around the one that stops.",
};

/* Under the laptop: what connects, stated plainly (the same list the FAQ gives). */
export const worksWith = {
  label: "Works with",
  items: ["Visa acquirers", "Mastercard acquirers", "PayPal", "Your current processor"],
};

/* The page is a stack of documents laid on the desk: after the banknote (hero) and the laptop, each
   section arrives as its own sheet and settles on the one before. `doc` is the sheet's printed title,
   `date` ties it to the story (the Jul 10 reroute); the sheet number comes from its place in this list. */
export const sheets = [
  { id: "notice", doc: "Notice of termination", date: "Jul 10, 09:41" },
  { id: "statement", doc: "Statement of account", date: "Jun 14 to Jul 13" },
  { id: "approval", doc: "Letter of approval", date: "Jul 08" },
  { id: "register", doc: "Register of merchants", date: "Updated Jul 13" },
  { id: "questions", doc: "Before the call", date: "Plain answers" },
  { id: "cheque", doc: "Cheque", date: "Nº 000126" },
] as const;
export type SheetId = (typeof sheets)[number]["id"];

/** A typed letter: the termination that opens the stack, and the approval that answers it. */
export type Letter = {
  from: string;
  fromSub: string;
  date: string;
  ref: string;
  /** Lines to strike through after they type on (the termination's verdict). */
  lines: { text: string; strike?: boolean }[];
  sign: string;
  /** Vertlo's note typed under the letter. */
  note?: { at: string; text: string };
  stamp: string;
  label: string;
};

/* Sheet 1: the letter every high-risk merchant dreads, then Vertlo's answer typed under it.
   Illustrative: the processor is unnamed on purpose, and the story matches the portal's Jul 10 reroute. */
export const notice: Letter & { title: string; blurb: string } = {
  title: "Keep selling when your account closes.",
  blurb:
    "High-risk brands can lose an account with one email. With every account in one place, the others take the orders while you sort it out.",
  from: "Risk & Compliance",
  fromSub: "Your acquiring bank",
  date: "Jul 10, 09:41",
  ref: "Re: Merchant account US-01",
  lines: [
    { text: "Dear merchant," },
    { text: "Following a routine review, merchant account US-01 is terminated with immediate effect.", strike: true },
    { text: "Card processing on this account stops today. Reserves will be held for 180 days.", strike: true },
  ],
  sign: "Risk Department",
  note: { at: "Vertlo, 09:41", text: "US-01 paused. Orders moved to UK-02 and US-03. Checkout never went dark." },
  stamp: "Rerouted",
  label: "Illustrative letter",
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
    { day: 26, date: "Jul 10", label: "US-01 paused, rerouted, no dip", tone: "ok" },
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
    { label: "UK-02 approval", value: "91.8%", of: "target 93%", fill: 0.55, status: "Watch: UK debit", tone: "warn" },
  ],
  settlement: { pending: "$212,480", available: "$148,220", next: "Next payout Jul 14" },
  attention: [
    { tone: "red", title: "1 dispute requires evidence", meta: "DSP-0221 · $89.00 · due Jul 14", action: "Respond", on: true },
    { tone: "amber", title: "Approval rate declined 4.2% on UK-02", meta: "UK Visa debit · since Jul 6", action: "Analyse" },
    { tone: "amber", title: "MID US-04 nearing monthly cap", meta: "72% utilised · projected cap Jul 26", action: "Review", on: true },
    { tone: "amber", title: "Compliance document expiring", meta: "Insurance certificate · Jul 20", action: "Upload" },
  ],
  // Three stops, kept short so the problem arrives soon after the hero.
  tour: [
    { region: "kpis", caption: "Every account's numbers on one screen" },
    { region: "volume", caption: "Jul 10: US-01 paused, approvals held" },
    { region: "attention", caption: "What needs you, sorted by what it costs" },
  ],
  pops: [
    { time: "09:41", message: "MID US-01 paused. Traffic rerouted to UK-02 and US-03." },
    { time: "09:52", message: "New MID approved: US-04. Added to routing." },
    { time: "10:07", message: "Dispute DSP-0221 caught early. Refunded before chargeback." },
  ],
};

/* Sheet 2: how it works (HowFlow's scene), then the day it matters as a statement's line items.
   Illustrative, and every figure matches the portal: the Jul 10 reroute, 92.6% approval,
   dispute DSP-0221 at $89.00, $148,220 available to pay out on Jul 14. */
export const how: { title: string; steps: FlowStep[] } = {
  title: "Set it up once. It routes from there.",
  // Rendered by HowFlow: one scroll-driven scene (connect → route → keep), steps alongside.
  steps: [
    { kicker: "Setup", title: "Connect your providers", body: "Bring every processor and merchant account into one CRM." },
    { kicker: "Your rules", title: "Route across accounts", body: "Split volume by the rules you set, for steadier approval rates." },
    { kicker: "Every day after", title: "Keep selling", body: "If one account pauses, the rest take the traffic in seconds." },
  ],
};

export type LedgerEntry = { time: string; entry: string; detail: string; amount: string; tone?: "warn" | "ok" };
export const statement: { title: string; label: string; entries: LedgerEntry[] } = {
  title: "Jul 10, line by line",
  label: "Illustrative statement",
  entries: [
    { time: "09:41", entry: "US-01 paused by processor", detail: "Its orders moved to UK-02 and US-03", amount: "No dip", tone: "warn" },
    { time: "11:20", entry: "Approval rate holding", detail: "Volume split by your rules across live accounts", amount: "92.6%" },
    { time: "14:05", entry: "Dispute alert, DSP-0221", detail: "Refunded before it became a chargeback", amount: "$89.00" },
    { time: "17:30", entry: "Payout scheduled for Jul 14", detail: "Every brand and account, one settlement", amount: "$148,220", tone: "ok" },
  ],
};

/* Sheet 3: underwriting, as the letter that answers the termination: a new account, approved. */
export const approval: Letter & { title: string; blurb: string } = {
  title: "We’ll issue the accounts you need.",
  blurb: "We underwrite in-house, so a new account doesn’t wait on outside approvals or stall your checkout.",
  from: "Vertlo Underwriting",
  fromSub: "In-house, no outside approvals",
  date: "Jul 08",
  ref: "Re: New merchant account US-04",
  lines: [
    { text: "Dear Nordvia," },
    { text: "Your application for a new merchant account is approved. MID US-04 is live." },
    { text: "It joins your routing at 20% of volume, alongside UK-02 and US-03." },
  ],
  sign: "Underwriting team",
  stamp: "Approved",
  label: "Illustrative letter",
};

/* Sheet 4: who it's for, as a register. Industry list is a working assumption: confirm with Vertlo
   before launch. Each row keeps its dot-matrix art. */
export const industries: { title: string; items: IndustryCardsProps["items"] } = {
  title: "Made for brands banks call risky.",
  items: [
    { art: "supplements", title: "Supplements", body: "Monthly reorders run on stored cards. A tightened account doesn’t stop the renewals." },
    { art: "subscriptions", title: "Subscriptions", body: "A failed renewal is retried on another account before the customer notices." },
    { art: "digital", title: "Digital goods", body: "Delivery is instant, so approval has to be too. Orders go to whichever account is live." },
  ],
};

/** Which illustrative chart plays beside a quote. */
export type MerchantStory = "closed" | "hours" | "newMid";
/** A merchant quote with its result: `value` is the number, `label` says what it measures. */
export type MerchantQuote = { story: MerchantStory; value: string; label: string; quote: string; name: string; business: string };

// Placeholders: replace with real, approved quotes and numbers before launch. Never ship invented ones.
// `ready: false` keeps the block off the page until then; flip it once the quotes are real.
export const testimonials: { ready: boolean; title: string; items: MerchantQuote[] } = {
  ready: false,
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
  blurb: "Anything else, ask us on the call.",
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
      q: "What’s a MID?",
      a: "A merchant ID: one merchant account with a processor. Most high-risk brands run several, and Vertlo routes orders across all of them.",
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
  title: "Put every account *in one CRM.*",
  blurb: "A 30-minute call. We map your providers and accounts, and show you the portal with your numbers.",
  points: ["Multiple live accounts", "Failover in seconds", "Underwriting in-house"],
  /** The closing call is drawn as a cheque; these fill its printed fields. */
  cheque: {
    issuer: "Vertlo Merchant Services",
    no: "000126",
    date: "Valid on any weekday",
    payLabel: "Pay to the order of",
    payee: "Your checkout",
    amount: "30 min",
    signLabel: "Authorised signature",
    micr: "⑆ 0026 0126 ⑆ 30 ⑈ 000126",
  },
};

export const footer = {
  tagline: "The payment CRM for high-risk ecommerce.",
  columns: [
    {
      title: "Product",
      links: [
        { label: "How it works", href: "#how" },
        { label: "Underwriting", href: "#underwriting" },
        { label: "Who it's for", href: "#industries" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Questions", href: "#questions" },
        { label: "Book a call", href: "#book" },
      ],
    },
  ],
};
