/* Data contract for the portal product shot (content/landing.ts fills it) and the regions of
   the Overview page that the scroll tour can frame. Plain module: no React, safe to import anywhere. */

export const PORTAL_W = 1240, PORTAL_H = 860;

/** Tour-able regions of the Overview, by the element that frames each one. */
export const PORTAL_REGIONS = {
  kpis: ".lpo-kpis",
  volume: ".lpo-rowb",
  /* the routing split panel alone: narrow enough that the camera properly pushes in */
  routing: ".lpo-routing",
  /* health and attention together: wide, so the camera pulls back out after the routing close-up */
  lower: ".lpo-rowc",
  attention: ".lpo-attn",
  health: ".lpo-health",
} as const;
export type PortalRegion = keyof typeof PORTAL_REGIONS;

export type Trend = "up" | "down" | "flat";
export type Tone = "ok" | "warn";
export type PortalData = {
  merchant: string;
  period: { from: string; mid: string; to: string };
  kpis: {
    label: string; to: number; prefix?: string; suffix?: string; decimals?: number; delta: string; trend: Trend;
    viz: "volume" | "approval" | "count" | { limit: number; label: string } | { payout: number; label: string };
  }[];
  volume: number[]; // $k per day
  approval: number[]; // % per day
  notes: { day: number; date: string; label: string; tone: Tone }[];
  routing: { id: string; share: number; approval?: number; state: "live" | "watch" | "new" | "paused" }[];
  health: { label: string; value: string; of: string; fill: number; status: string; tone: Tone }[];
  settlement: { pending: string; available: string; next: string };
  attention: { tone: "red" | "amber" | "grey"; title: string; meta: string; action: string; on?: boolean }[];
  /** the scroll tour: one camera stop per entry, in order */
  tour: { region: PortalRegion; caption: string }[];
  /** stage notifications: the message says what happened, no status badge */
  pops: { time: string; message: string }[];
};

