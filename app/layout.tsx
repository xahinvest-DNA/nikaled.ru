import type { Metadata } from "next";
import Script from "next/script";
import { Suspense } from "react";

import { contacts } from "@/content/contacts";
import { CalculatorModalHost } from "@/components/forms/CalculatorModalHost";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";

import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Наружная реклама в Воронеже под ключ",
  description: "Вывески, объёмные буквы, лайтбоксы в Воронеже. От проекта до монтажа за 7-14 дней. Гарантия 24 месяца.",
  openGraph: {
    title: "Наружная реклама в Воронеже под ключ",
    description: "Рассчитаем стоимость сегодня. Ответим в течение 10 минут.",
    url: siteUrl,
    siteName: contacts.companyName,
    locale: "ru_RU",
    type: "website",
    images: [{ url: "/images/og-cover.svg", width: 1200, height: 630, alt: "Наружная реклама в Воронеже" }]
  },
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA4_ID;
  const ymId = process.env.NEXT_PUBLIC_YM_ID;

  return (
    <html lang="ru">
      <body>
        {children}
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
          <Script id="yandex-metrika" strategy="afterInteractive">
            {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date(); for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
              ym(${Number(ymId)}, "init", {clickmap:true, trackLinks:true, accurateTrackBounce:true});`}
          </Script>
        ) : null}
      </body>
    </html>
  );
}
