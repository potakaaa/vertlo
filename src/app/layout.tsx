import type { Metadata, Viewport } from "next";
import { Newsreader, Public_Sans } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";

/* A trade paper's two faces: Newsreader, a news serif with optical sizes, sets the nameplate, the
   headlines and the running copy (roman only: no italic accents); Public Sans sets the paper's
   furniture: flags, kickers, captions, tables, and the product UI inside the figures. */
const newsreader = Newsreader({ subsets: ["latin"], style: ["normal"], axes: ["opsz"], variable: "--font-newsreader", display: "swap" });
const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-public-sans", display: "swap" });

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

/* Set before first paint so the ink-in starting states (press.css) never flash the printed page first. */
const INK_SCRIPT = "document.documentElement.classList.add('pr-js')";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${publicSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INK_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
