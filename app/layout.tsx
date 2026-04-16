import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";

import { YandexMetrika } from "@/components/analytics/YandexMetrika";
import { CalculatorModalHost } from "@/components/forms/CalculatorModalHost";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { StructuredData } from "@/components/seo/StructuredData";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";
import { buildLocalBusinessSchema, buildWebsiteSchema } from "@/lib/structured-data";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Вывески и наружная реклама в Воронеже под ключ",
    template: "%s | Nikaled"
  },
  description:
    "Вывески, объёмные буквы, лайтбоксы и согласование в Воронеже. Берём на себя замер, дизайн, производство, монтаж и документы.",
  keywords: [
    "наружная реклама Воронеж",
    "вывески Воронеж",
    "объемные буквы Воронеж",
    "лайтбоксы Воронеж",
    "согласование вывесок Воронеж",
    "изготовление вывесок Воронеж"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Вывески и наружная реклама в Воронеже под ключ",
    description: "Рассчитаем бюджет, подготовим дизайн, произведем и смонтируем без срывов сроков.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "ru_RU",
    type: "website",
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "Наружная реклама в Воронеже" }]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;
  const ymId = process.env.NEXT_PUBLIC_YM_ID ? Number(process.env.NEXT_PUBLIC_YM_ID) : null;

  return (
    <html lang="ru">
      <body>
        <StructuredData data={buildLocalBusinessSchema()} />
        <StructuredData data={buildWebsiteSchema()} />
        {children}
        <Footer />
        <Suspense fallback={null}>
          <CalculatorModalHost />
        </Suspense>
        <MobileBottomBar />
        {gaId ? (
          <>
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}');`}
            </Script>
          </>
        ) : null}
        {ymId ? (
          <Suspense fallback={null}>
            <YandexMetrika counterId={ymId} />
          </Suspense>
        ) : null}
      </body>
    </html>
  );
}
