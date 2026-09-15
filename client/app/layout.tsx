import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const nasyhama = localFont({
  src: "../public/fonts/Nasyhama.woff2",
  variable: "--font-nasyhama",
  display: "swap",
});

const taiganja = localFont({
  src: "../public/fonts/Taiganja.woff2",
  variable: "--font-taiganja",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eclecia'26: The Annual Cultural Fest of Heritage Institute of Technology",
  description:
    "The annual cultural fest of Heritage Institute of Technology, Kolkata. 30 & 31 October and 1 November 2026. Music, dance, drama, art, fashion and literary events across 40+ colleges.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${nasyhama.variable} ${taiganja.variable} h-full antialiased`}
    >
      <head>
        {/* Hero layers first: they are the LCP; everything else streams behind them. */}
        <link
          rel="preload"
          as="image"
          href="/assets/opt/bg-layer1.webp"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/assets/opt/mainart-layer6.webp"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/assets/opt/suncoverbg-layer5.webp"
        />
        <link
          rel="preload"
          as="image"
          href="/assets/opt/blacksun2-layer3.webp"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
