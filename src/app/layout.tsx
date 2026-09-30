import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

/* One family for all text: Archivo's width axis runs from the expanded capitals of the headlines
   (banknote lettering) to the normal width of the body. Plex Mono sets serials, codes and labels. */
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Vertlo | The payment CRM for high-risk ecommerce",
  description:
    "Vertlo runs every payment provider and merchant account you have in one CRM, and routes around the one that stops. One account closes. The rest keep selling.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Vertlo | One account closes. The rest keep selling.",
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
    // suppressHydrationWarning: the inline script adds `js` to <html> before React hydrates
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks that scripts run, so the hero can wait for its entrance (paper.css) without ever
            hiding it from a visitor whose JavaScript fails. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
