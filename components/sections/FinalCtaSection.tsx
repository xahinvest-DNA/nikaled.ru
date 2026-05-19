"use client";

import { LeadForm } from "@/components/forms/LeadForm";
import { OpenAiAssistantButton } from "@/components/ui/OpenAiAssistantButton";
import { contacts } from "@/content/contacts";
import { trackEvent } from "@/lib/analytics/events";

type Props = {
  service?: string;
};

export const FinalCtaSection = ({ service }: Props) => {
  return (
    <section className="section-space bg-steel text-white">
      <div className="container-narrow grid gap-6 md:grid-cols-[1fr_0.9fr]">
        <div>
          <h2 className="text-3xl font-black leading-tight md:text-4xl">Нужно быстро понять цену и сроки?</h2>
          <p className="mt-3 max-w-xl text-sm text-white/85">
            Напишите, что вам нужно, или просто отправьте фото. Мы быстро скажем, сколько это примерно будет стоить и сколько времени
            займёт.
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {["Скажем, что подойдёт для вашего фасада", "Назовём примерную цену", "Подскажем по срокам", "Объясним, что делать дальше"].map(
              (item) => (
                <div key={item} className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/80">
                  {item}
                </div>
              )
            )}
          </div>
          <a
            href={`tel:${contacts.phoneRaw}`}
            className="mt-5 inline-block text-3xl font-black text-white"
            onClick={() => trackEvent("click_call", { section: "final_cta" })}
          >
            {contacts.phoneDisplay}
          </a>
          <p className="mt-2 text-sm text-white/75">Если нужно срочно, лучше сразу звоните.</p>
          <a
            href={contacts.telegramUrl}
            className="btn-secondary mt-5"
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("click_telegram", { section: "final_cta" })}
          >
            Отправить фото в Telegram
          </a>
          <div className="mt-3">
            <OpenAiAssistantButton
              text="Помочь выбрать вывеску"
              className="btn-secondary"
              analyticsSource="final_cta_ai"
            />
          </div>
        </div>
        <LeadForm title="Напишите, что нужно сделать" buttonText="Получить расчёт" service={service} compact />
      </div>
    </section>
  );
};
