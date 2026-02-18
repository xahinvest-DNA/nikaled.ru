"use client";

import Link from "next/link";

import { contacts } from "@/content/contacts";
import { trackEvent } from "@/lib/analytics/events";
import { OpenCalcButton } from "@/components/ui/OpenCalcButton";

export const Header = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-steel/10 bg-white/95 backdrop-blur">
      <div className="container-narrow flex items-center justify-between py-3">
        <Link href="/" className="text-sm font-bold text-steel md:text-base">
          Наружная реклама в Воронеже
        </Link>
        <div className="flex items-center gap-3">
          <a
            href={`tel:${contacts.phoneRaw}`}
            className="hidden text-sm font-semibold text-steel md:block"
            onClick={() => trackEvent("click_call")}
          >
            {contacts.phoneDisplay}
          </a>
          <OpenCalcButton text="Рассчитать" className="btn-primary px-4 py-2" />
        </div>
      </div>
    </header>
  );
};

