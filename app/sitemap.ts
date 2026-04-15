import type { MetadataRoute } from "next";

import { articles } from "@/content/articles";
import { cases } from "@/content/cases";
import { solutionPages } from "@/content/solutions";
import { SITE_URL } from "@/lib/site";

const routes = [
  "/",
  "/vyveski-voronezh/",
  "/obemnye-bukvy/",
  "/laitboksy/",
  "/soglasovanie-vyvesok/",
  "/portfolio/",
  "/blog/",
  "/resheniya/",
  "/o-kompanii/",
  "/kontakty/"
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "daily" : "weekly",
    priority: route === "/" ? 1 : 0.8
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/blog/${article.slug}/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7
  }));

  const solutionRoutes: MetadataRoute.Sitemap = solutionPages.map((page) => ({
    url: `${SITE_URL}/resheniya/${page.slug}/`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.75
  }));

  const caseRoutes: MetadataRoute.Sitemap = cases.map((item) => ({
    url: `${SITE_URL}/portfolio/${item.id}/`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.72
  }));

  return [...staticRoutes, ...articleRoutes, ...solutionRoutes, ...caseRoutes];
}