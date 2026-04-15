"use client";

import Link from "next/link";

import { OpenCalcButton } from "@/components/ui/OpenCalcButton";
import { contacts } from "@/content/contacts";
import { trackEvent } from "@/lib/analytics/events";

const navItems = [
  { href: "/vyveski-voronezh/", label: "Вывески" },
  { href: "/obemnye-bukvy/", label: "Объёмные буквы" },
  { href: "/laitboksy/", label: "Лайтбоксы" },
  { href: "/resheniya/", label: "Решения" },
  { href: "/portfolio/", label: "Портфолио" },
  { href: "/blog/", label: "Материалы" },
  { href: "/kontakty/", label: "Контакты" }
];

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-steel/10 bg-white/95 backdrop-blur">
      <div className="container-narrow flex items-center justify-between gap-6 py-3">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-sm font-bold text-steel md:text-base">
            Вывески в Воронеже | Nikaled
          </Link>
          <nav className="hidden xl:flex xl:items-center xl:gap-4">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-steel/80 transition hover:text-steel">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`tel:${contacts.phoneRaw}`}
            className="hidden text-sm font-semibold text-steel lg:block"
            onClick={() => trackEvent("click_call")}
          >
            {contacts.phoneDisplay}
          </a>
          <OpenCalcButton text="Получить расчёт" className="btn-primary px-4 py-2" />
        </div>
      </div>
    </header>
  );
};