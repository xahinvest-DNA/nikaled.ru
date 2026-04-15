const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const SITE_URL =
  rawSiteUrl && /^https?:\/\//.test(rawSiteUrl) ? rawSiteUrl.replace(/\/$/, "") : "https://nikaled.ru";

export const SITE_NAME = "Nikaled";
export const DEFAULT_OG_IMAGE = "/images/og-cover.svg";