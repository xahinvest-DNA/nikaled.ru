import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

const routes = [
  "/",
  "/vyveski-voronezh/",
  "/obemnye-bukvy/",
  "/laitboksy/",
  "/soglasovanie-vyvesok/",
  "/portfolio/",
  "/o-kompanii/",
  "/kontakty/"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.8
  }));
}

