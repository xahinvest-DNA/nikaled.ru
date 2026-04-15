"use client";

import Link from "next/link";

import { contacts } from "@/content/contacts";
import { services } from "@/content/services";
import { trackEvent } from "@/lib/analytics/events";

const pages = [
  { href: "/portfolio/", label: "Портфолио" },
  { href: "/resheniya/", label: "Готовые решения" },
  { href: "/blog/", label: "Полезные материалы" },
  { href: "/o-kompanii/", label: "О компании" },
  { href: "/kontakty/", label: "Контакты" }
];

export const Footer = () => {
  return (
    <footer className="border-t border-steel/10 bg-white">
      <div className="container-narrow grid gap-8 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Link href="/" className="text-lg font-black text-steel">
            Nikaled
          </Link>
          <p className="mt-3 max-w-md text-sm text-steel/80">
            Вывески, объёмные буквы, лайтбоксы и согласование в Воронеже. Берём на себя замер, дизайн, производство,
            монтаж и документы.
          </p>
          <a
            href={`tel:${contacts.phoneRaw}`}
            className="mt-4 inline-block text-2xl font-black text-steel"
            onClick={() => trackEvent("click_call", { section: "footer" })}
          >
            {contacts.phoneDisplay}
          </a>
          <p className="mt-2 text-sm text-steel/70">
            {contacts.address}
            <br />
            {contacts.workHours}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-steel/70">Услуги</h2>
          <ul className="mt-4 space-y-2 text-sm text-steel/85">
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/${service.slug}`} className="hover:text-steel">
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-steel/70">Разделы</h2>
          <ul className="mt-4 space-y-2 text-sm text-steel/85">
            {pages.map((page) => (
              <li key={page.href}>
                <Link href={page.href} className="hover:text-steel">
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={contacts.telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary px-4 py-2"
              onClick={() => trackEvent("click_telegram", { section: "footer" })}
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-steel/10 py-4">
        <div className="container-narrow text-xs text-steel/65">
          Работаем по Воронежу и Воронежской области. Делаем наружную рекламу под открытие, ребрендинг и согласование.
        </div>
      </div>
    </footer>
  );
};
