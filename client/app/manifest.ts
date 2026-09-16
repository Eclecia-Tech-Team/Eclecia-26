import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Eclecia'26 - Heritage Institute of Technology",
    short_name: "Eclecia'26",
    description:
      "The Annual Cultural Fest of Heritage Institute of Technology, Kolkata. 30 & 31 October and 1 November 2026.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#d9a441",
    icons: [
      {
        src: "/icons/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/icons/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
