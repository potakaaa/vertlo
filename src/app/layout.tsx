import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk, Geist_Mono, Inter, Inter_Tight } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

/* headings: a grotesk with some character (the template default was Inter Tight) */
const familjen = Familjen_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-familjen",
  display: "swap",
});
/* the VERTLO wordmark only: it stays as it was */
const interTight = Inter_Tight({ subsets: ["latin"], weight: ["900"], variable: "--font-inter-tight", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-inter", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-geist-mono", display: "swap" });

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
    <html lang="en" className={`${familjen.variable} ${interTight.variable} ${inter.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
