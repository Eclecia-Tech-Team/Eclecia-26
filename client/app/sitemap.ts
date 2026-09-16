import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!.replace(/\/+$/, "");
  const lastModified = new Date();

  const routes = [
    "",
    "/events",
    "/schedule",
    "/our-tale",
    "/sponsors",
    "/team",
    "/register",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/register" ? 0.9 : 0.8,
  }));
}
