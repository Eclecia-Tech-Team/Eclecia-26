import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { ASSETS } from "@/constants/assets";

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title:
    "Eclecia'26: The Annual Cultural Fest of Heritage Institute of Technology",
  description:
    "Welcme to Eclecia'26: The Annual Cultural Fest of Heritage Institute of Technology, Kolkata. Music, Dance, Drama, Art, Fashion and Literary events across 3 days and 40+ colleges. Create. Celbrate. Inspire.",
  openGraph: {
    title:
      "Eclecia'26: The Annual Cultural Fest of Heritage Institute of Technology",
    description:
      "Welcme to Eclecia'26: The Annual Cultural Fest of Heritage Institute of Technology, Kolkata. Music, Dance, Drama, Art, Fashion and Literary events across 3 days and 40+ colleges. Create. Celbrate. Inspire.",
    url: "/",
    siteName: "Eclecia'26",
    images: [
      {
        url: ASSETS.cloudinary.ogImage,
        width: 1200,
        height: 630,
        alt: "Eclecia'26: Heritage Institute of Technology",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Eclecia'26: The Annual Cultural Fest of Heritage Institute of Technology",
    description:
      "The annual cultural fest of Heritage Institute of Technology, Kolkata. 30 & 31 October and 1 November 2026.",
    images: [ASSETS.cloudinary.ogImage],
  },
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
          href={ASSETS.cloudinary.bg}
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href={ASSETS.cloudinary.mainart}
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href={ASSETS.cloudinary.suncover}
        />
        <link
          rel="preload"
          as="image"
          href={ASSETS.cloudinary.blacksun2}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
