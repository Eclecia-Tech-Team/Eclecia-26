import { ASSETS } from "./assets";

export const ECLECIA_ALIASES = [
  "Eclecia'26",
  "Eclecia 2026",
  "Eclecia 26",
  "eclecia 26",
  "eclecia 2026",
  "eclecia'26",
  "ECLECIA'26",
  "ECLECIA 2026",
  "ECLECIA 26",
  "ECLECIA",
  "Eclecia",
  "eclecia",
  "Eclecia HITK",
  "eclecia hitk",
  "ECLECIA HITK",
  "Eclecia Heritage",
  "Eclecia Heritage Kolkata",
  "Eclecia Cultural Fest",
  "HITK Eclecia",
  "HITK Cultural Fest",
  "Heritage Institute of Technology Cultural Fest",
  "Heritage College Fest",
  "Heritage Fest",
];

export const HITK_ALIASES = [
  "Heritage Institute of Technology, Kolkata",
  "Heritage Institute of Technology",
  "HIT Kolkata",
  "HITK",
  "hitk",
  "hit kolkata",
  "heritage institute of technology kolkata",
  "heritage institute of technology",
  "heritage institute",
  "heritage kolkata",
  "heritage college kolkata",
  "heritage college",
  "heritage institute of technology india",
  "heritage institute of technology west bengal",
];

export const SEO_KEYWORDS = [
  "Eclecia",
  "Eclecia 2026",
  "Eclecia'26",
  "Eclecia HITK",
  "Heritage Institute of Technology Fest",
  "HITK cultural fest",
  "Kolkata college fest",
  "Kolkata cultural fest 2026",
  "Heritage College Fest Kolkata",
  "College cultural fest West Bengal",
  "Music fest Kolkata",
  "Dance competition Kolkata college",
  "Drama and stage events Kolkata",
  "Battle of bands Kolkata",
  "Fashion show college fest",
  "Literary fest Kolkata",
  "Heritage Institute of Technology Kolkata",
  "MAKAUT college fest",
  "Eastern India college cultural festival",
  // "October 2026 fest Kolkata",
];

export function getStructuredData(siteUrl: string = "") {
  const cleanSiteUrl = siteUrl ? siteUrl.replace(/\/+$/, "") : "";
  const ogImageUrl = ASSETS.cloudinary.ogImage.startsWith("http")
    ? ASSETS.cloudinary.ogImage
    : cleanSiteUrl
      ? `${cleanSiteUrl}${ASSETS.cloudinary.ogImage.startsWith("/") ? "" : "/"}${ASSETS.cloudinary.ogImage}`
      : ASSETS.cloudinary.ogImage;

  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Festival", "Event"],
    name: "Eclecia'26: The Annual Cultural Fest of Heritage Institute of Technology",
    alternateName: ECLECIA_ALIASES,
    location: {
      "@type": "Place",
      name: "Heritage Institute of Technology, Kolkata",
      address: {
        "@type": "PostalAddress",
        streetAddress: "994, Chowbaga Road, Anandapur, East Kolkata Township",
        addressLocality: "Kolkata",
        addressRegion: "West Bengal",
        postalCode: "700107",
        addressCountry: "IN",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Heritage Institute of Technology, Kolkata",
      alternateName: HITK_ALIASES,
      url: "https://heritageit.edu/",
      logo: ASSETS.cloudinary.hitkLogo,
      sameAs: [
        "https://www.instagram.com/eclecia_hitk",
        "https://www.linkedin.com/in/eclecia-hitk-552642434",
        "https://www.facebook.com/share/1Ja64ScqBF/",
      ],
    },
    description:
      "Welcome to Eclecia'26: The Annual Cultural Fest of Heritage Institute of Technology, Kolkata. 3 days of music, dance, drama, art, fashion, and literary events across 40+ colleges. Uniting talent, igniting culture.",
    image: [
      ogImageUrl,
      ASSETS.cloudinary.mainart,
      ASSETS.cloudinary.wordmarkBlacker,
    ],
    url: cleanSiteUrl || undefined,
    inLanguage: "en-IN",
    offers: {
      "@type": "Offer",
      url: cleanSiteUrl ? `${cleanSiteUrl}/register` : "/register",
      availability: "https://schema.org/InStock",
      price: "0",
      priceCurrency: "INR",
      validFrom: "2026-09-01T00:00:00+05:30",
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: cleanSiteUrl || undefined,
    name: "Eclecia'26",
    alternateName: ECLECIA_ALIASES,
    description:
      "Official website of Eclecia'26 - The Annual Cultural Fest of Heritage Institute of Technology, Kolkata.",
    publisher: {
      "@type": "Organization",
      name: "Heritage Institute of Technology, Kolkata",
      url: "https://heritageit.edu/",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollegeOrUniversity",
    name: "Heritage Institute of Technology, Kolkata",
    alternateName: HITK_ALIASES,
    url: "https://heritageit.edu/",
    logo: ASSETS.cloudinary.hitkLogo,
    address: {
      "@type": "PostalAddress",
      streetAddress: "994, Chowbaga Road, Anandapur",
      addressLocality: "Kolkata",
      addressRegion: "West Bengal",
      postalCode: "700107",
      addressCountry: "IN",
    },
    sameAs: [
      "https://www.instagram.com/eclecia_hitk",
      "https://www.linkedin.com/in/eclecia-hitk-552642434",
      "https://www.facebook.com/share/1Ja64ScqBF/",
    ],
  };

  return { eventJsonLd, websiteJsonLd, organizationJsonLd };
}
