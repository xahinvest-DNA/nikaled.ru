"use client";

import { OpenCalcButton } from "@/components/ui/OpenCalcButton";
import { contacts } from "@/content/contacts";
import { trackEvent } from "@/lib/analytics/events";

export const MobileBottomBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-steel/15 bg-white p-3 md:hidden">
      <div className="mx-auto flex max-w-md items-center gap-2">
        <a
          href={`tel:${contacts.phoneRaw}`}
          className="btn-secondary flex-1"
          onClick={() => trackEvent("click_call", { section: "mobile_bottom_bar" })}
        >
          Позвонить
        </a>
        <OpenCalcButton text="Получить расчёт" className="btn-primary flex-1" analyticsSource="mobile_bottom_bar" />
      </div>
    </div>
  );
};
