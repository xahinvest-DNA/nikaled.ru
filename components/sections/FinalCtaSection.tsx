"use client";

import { LeadForm } from "@/components/forms/LeadForm";
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
          <h2 className="text-3xl font-black leading-tight md:text-4xl">
            Нужна вывеска, которая пройдёт согласование и не сорвёт открытие?
          </h2>
          <p className="mt-3 max-w-xl text-sm text-white/85">
            Отправьте задачу в свободной форме. Мы быстро скажем, какой формат конструкции подойдет, сколько это будет стоить и что
            нужно предусмотреть по срокам и документам.
          </p>
          <a
            href={`tel:${contacts.phoneRaw}`}
            className="mt-5 inline-block text-3xl font-black text-white"
            onClick={() => trackEvent("click_call", { section: "final_cta" })}
          >
            {contacts.phoneDisplay}
          </a>
          <p className="mt-2 text-sm text-white/75">Если проект срочный, лучше сразу звоните. Подскажем реальный срок запуска.</p>
        </div>
        <LeadForm title="Получить расчёт без лишних кругов" buttonText="Получить расчёт и план работ" service={service} compact />
      </div>
    </section>
  );
};
