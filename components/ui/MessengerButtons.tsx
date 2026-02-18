"use client";

import { contacts } from "@/content/contacts";
import { trackEvent } from "@/lib/analytics/events";

export const MessengerButtons = () => {
  return (
    <div className="flex flex-wrap gap-2">
      <a href={contacts.telegramUrl} className="btn-secondary" target="_blank" rel="noreferrer" onClick={() => trackEvent("click_telegram")}>
        Telegram
      </a>
      <a href={contacts.whatsappUrl} className="btn-secondary" target="_blank" rel="noreferrer" onClick={() => trackEvent("click_whatsapp")}>
        WhatsApp
      </a>
    </div>
  );
};

