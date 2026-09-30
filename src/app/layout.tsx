import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

/* Two faces: Schibsted Grotesk for everything people read, JetBrains Mono for what the system
   prints (order ids, MIDs, timestamps, statuses). */
const grotesk = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains", display: "swap" });

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
    <html lang="en" className={`${grotesk.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
