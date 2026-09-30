import type { FAQProps, IndustryCardsProps } from "@/components/vertlo";
import type { PortalData } from "@/components/landing/portal/types";
import type { FlowStep } from "@/components/landing/HowFlow";

/**
 * All landing-page copy lives here so it can be edited (or moved to a CMS) without touching layout.
 * The page is set as a trade paper, so copy reads like reporting: plain, specific, in the industry's terms.
 * Rules from the brand: no published prices, "Book a call" is the one CTA, placeholders are labelled,
 * and nothing here states a fact, figure or quote about Vertlo that Vertlo hasn't confirmed.
 * Headlines are whole sentences in one face, with no accent words. Keep copy short: a headline, one
 * line under it, and let the figures carry the rest.
 */

/** The edition: the site is a paper you turn page by page. The front section (A) and back section (B)
    turn sideways; the centre spread in between scrolls down. `id` is each page's anchor. */
export const edition: { pages: { id: string; no: string; section: string }[]; turn: string; centre: string } = {
  pages: [
    { id: "front", no: "A1", section: "Front page" },
    { id: "risk", no: "A2", section: "Risk" },
    { id: "routing", no: "A3", section: "Routing" },
    { id: "underwriting", no: "A4", section: "Underwriting" },
    { id: "centre", no: "C", section: "Centre spread" },
    { id: "numbers", no: "B1", section: "The numbers" },
    { id: "letters", no: "B2", section: "Letters" },
    { id: "questions", no: "B3", section: "Q&A" },
    { id: "classifieds", no: "B4", section: "Classifieds" },
  ],
  turn: "Scroll to turn the page",
  centre: "The paper opens: the product, at full size.",
};

export const masthead = {
  nameplate: "Vertlo",
  edition: "Vol. 1 · No. 1",
  motto: "For merchants banks call risky",
};

/** A1's lead story: the headline, one line, the call (beside Exhibit A). */
export const hero = {
  headline: "One account closes. The rest keep selling.",
  deck: "Every merchant account in one CRM, routed around the one that gets paused.",
};

/** Exhibit A: the notice merchants dread, struck through, and the reroute that followed. A composite, not a real processor's letter.
    Kept to a subject and one line so the strike and the notification read at a glance. */
export const notice = {
  label: "Exhibit A",
  caption: "Composite example.",
  sender: "Merchant Risk",
  date: "Fri 10 Jul, 09:38",
  subject: "Your merchant account has been terminated",
  body: ["We have ended our processing relationship, effective immediately."],
  reroute: {
    from: "Vertlo",
    time: "09:41",
    message: "MID US-01 paused. Traffic rerouted to UK-02 and US-03.",
  },
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
    { time: "09:41", message: "MID US-01 paused. Traffic rerouted to UK-02 and US-03." },
    { time: "09:52", message: "MID US-04 carrying 20% of volume. Approvals steady." },
    { time: "10:07", message: "Dispute DSP-0221 caught early. Refunded before chargeback." },
  ],
};

/** Figure 3: the portal tour's caption. */
export const portalFigure = {
  label: "Figure 3",
  caption: "The portal’s Overview. Scroll to tour it.",
  credit: "Illustrative data",
};

export const trust = { heading: "Merchants on Vertlo", note: "Placeholder logos" };
export const logos = ["LOGO 01", "LOGO 02", "LOGO 03", "LOGO 04", "LOGO 05", "LOGO 06"];

export const problem: {
  title: string;
  blurb: string;
  items: IndustryCardsProps["items"];
  madeFor: { label: string; items: string[] };
} = {
  title: "Three ways a high-risk checkout stops.",
  blurb:
    "High-risk brands can lose an account with one email. Most also run payments across separate tools and chat groups.",
  // Dot-matrix art, printed as the illustration over each brief.
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
  // Industry list is a working assumption: confirm with Vertlo before launch.
  madeFor: { label: "Made for", items: ["Supplements", "Subscriptions", "Digital goods"] },
};

export const how: { title: string; deck: string; steps: FlowStep[] } = {
  title: "Set it up once. It routes from there.",
  deck: "Connect the processors you have, set the rules, and let each order find a live account.",
  // Rendered by HowFlow: one scroll-driven scene (connect → route → keep), steps alongside.
  steps: [
    {
      kicker: "Setup",
      title: "Connect your providers",
      body: "Visa and Mastercard acquirers, PayPal and your own processor, in one CRM.",
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

/** Figure 4: the HowFlow scene's caption. A schematic: its MIDs are generic, not the demo account's. */
export const flowFigure = {
  label: "Figure 4",
  caption: "Processors in, volume split across MIDs, and a paused MID's share moved to the rest.",
  credit: "Schematic",
};

/** A3: the routing board (Figure 1). The morning US-01 is paused, its 30% drains to 0 and goes to US-03 and
    UK-02, as the notification says; US-04 holds its share. After matches the portal's split (42 / 38 / 20). */
export const routing = {
  title: "One account pauses. The rest take the traffic.",
  deck: "When a processor pauses a MID, Vertlo takes it out of routing and splits its share across the accounts still live.",
  board: {
    title: "Routing",
    merchant: "Nordvia Group LLC",
    live: "Checkout live",
    from: "09:40",
    to: "09:41",
    orders: "Orders per minute",
    label: "Figure 1",
    caption: "The routing board the minute US-01 is paused.",
    note: "Illustrative data",
    rows: [
      { id: "US-01", provider: "Processor A", before: 30, after: 0 },
      { id: "US-03", provider: "Processor C", before: 27, after: 42 },
      { id: "UK-02", provider: "Processor B", before: 23, after: 38 },
      { id: "US-04", provider: "Processor A", before: 20, after: 20 },
    ],
  },
};

/** B1: the month on the demo account. Table 1 carries the page. */
export const numbers = {
  title: "The month, in numbers.",
  deck: "One account paused mid-month. Thirty days on the demo account, from the portal.",
};

/** Table 1: the demo account's month, from the same data as the portal. Illustrative, and labelled so. */
export const table = {
  label: "Table 1",
  title: "Routing on a demo account, 14 Jun – 13 Jul",
  note: "Illustrative data from the portal demo, not customer results.",
  footnote: "MID: merchant ID, the account a processor opens for you to take card payments.",
  head: ["MID¹", "Share", "Approval", "Status"],
  rows: [
    ["US-03", "42%", "92.9%", "Live"],
    ["UK-02", "38%", "91.8%", "Watch"],
    ["US-04", "20%", "93.4%", "New"],
    ["US-01", "0%", "—", "Paused, rerouted"],
  ],
  foot: ["All", "100%", "92.6%", "$1.84M volume"],
};

/** A4: underwriting, told as one application's timeline on the demo account (the same dates the portal shows). */
export const underwriting = {
  title: "We’ll issue the accounts you need.",
  deck: "We underwrite in-house, so getting a new account doesn’t stall your checkout.",
  steps: [
    { date: "Jul 02", label: "Application submitted" },
    { date: "Jul 03", label: "Documents verified" },
    { date: "Jul 05", label: "Underwriting review" },
    { date: "Jul 08", label: "MID US-04 approved", note: "Added to routing the same day" },
  ],
  figure: { label: "Figure 2", caption: "One application on the demo account, from submission to a live MID.", credit: "Illustrative data" },
};

/** Which illustrative chart plays beside a quote. */
export type MerchantStory = "closed" | "hours" | "newMid";
/** A merchant quote with its result: `value` is the number, `label` says what it measures. */
export type MerchantQuote = { story: MerchantStory; value: string; label: string; quote: string; name: string; business: string };

// Placeholders: replace with real, approved quotes and numbers before launch. Never ship invented ones.
export const testimonials: { title: string; note: string; items: MerchantQuote[] } = {
  title: "Merchants who kept selling.",
  note: "Placeholder quotes until merchants approve their own.",
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

/** The closing call, printed as a clip-out coupon. Its headline calls back to the front page's promise. */
export const cta = {
  title: "Keep selling when one account closes.",
  blurb: "A 30-minute call. We map your providers and accounts, and show you the portal with your numbers.",
  /** What to bring, printed as tick boxes on the coupon. */
  bring: ["Your processors", "Your live and paused MIDs", "Last month’s chargeback ratio"],
  terms: "Pricing is quoted per merchant, on the call.",
};

/** The imprint at the foot of the paper. Its contents list comes from `edition.pages`. */
export const imprint = {
  tagline: "The payment CRM for high-risk ecommerce.",
  notes: ["Figures and tables marked illustrative use demo data.", "Set in Newsreader and Public Sans."],
};
