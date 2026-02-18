import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const buildPageMetadata = (title: string, description: string, path: string): Metadata => ({
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${siteUrl}${path}`,
    images: [{ url: "/images/og-cover.svg", width: 1200, height: 630 }]
  }
});

