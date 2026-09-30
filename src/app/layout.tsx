import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Semi_Condensed, JetBrains_Mono } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

/* Transport signage type: Barlow, the semi-condensed cut for headlines, signs and the board's flaps,
   the normal width for body copy. JetBrains Mono sets codes, times and column labels. */
const barlow = Barlow({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-barlow", display: "swap" });
const barlowSemi = Barlow_Semi_Condensed({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-barlow-semi", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jb-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Vertlo — The payment CRM for high-risk ecommerce",
  description:
    "Vertlo runs every payment provider and merchant account you have in one CRM, and routes around the one that stops. One account closes. The rest keep selling.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Vertlo — One account closes. The rest keep selling.",
    description: "The payment CRM and processor for high-risk ecommerce.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#eef1ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${barlow.variable} ${barlowSemi.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
