import type { Metadata } from "next";

import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

export const buildPageMetadata = (title: string, description: string, path: string): Metadata => ({
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}${path}`,
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630 }]
  }
});