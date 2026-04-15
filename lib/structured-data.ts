import type { FaqItem } from "@/content/faq";
import type { Service } from "@/content/services";
import { contacts } from "@/content/contacts";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

const organizationId = `${SITE_URL}/#organization`;

export const buildLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": organizationId,
  name: SITE_NAME,
  alternateName: contacts.companyName,
  url: SITE_URL,
  image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
  telephone: contacts.phoneRaw,
  areaServed: ["Воронеж", "Воронежская область"],
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: contacts.city,
    streetAddress: contacts.address,
    addressCountry: "RU"
  },
  openingHours: "Mo-Sa 09:00-19:00",
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: contacts.phoneRaw,
      contactType: "sales",
      availableLanguage: ["Russian"],
      areaServed: "RU"
    }
  ],
  sameAs: [contacts.telegramUrl]
});

export const buildWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: "ru-RU",
  publisher: { "@id": organizationId }
});

export const buildFaqSchema = (items: FaqItem[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer
    }
  }))
});

export const buildBreadcrumbSchema = (items: Array<{ name: string; path: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.path ? `${SITE_URL}${item.path}` : SITE_URL
  }))
});

export const buildServiceSchema = (service: Service, path: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: `${service.name} в Воронеже`,
  description: service.seoDescription,
  serviceType: service.name,
  areaServed: ["Воронеж", "Воронежская область"],
  provider: { "@id": organizationId },
  offers: {
    "@type": "Offer",
    url: `${SITE_URL}${path}`,
    priceCurrency: "RUB",
    availability: "https://schema.org/InStock"
  }
});