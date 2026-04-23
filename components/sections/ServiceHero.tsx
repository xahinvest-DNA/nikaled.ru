"use client";

import { OpenCalcButton } from "@/components/ui/OpenCalcButton";
import { contacts } from "@/content/contacts";
import { type Service } from "@/content/services";
import { trackEvent } from "@/lib/analytics/events";

type Props = {
  service: Service;
};

const quickChecklist = [
  "Фото фасада или входной группы",
  "Примерный размер или хотя бы ширина",
  "Адрес объекта и желаемый срок запуска"
];

export const ServiceHero = ({ service }: Props) => {
  return (
    <section className="section-space bg-[radial-gradient(circle_at_20%_20%,#e0f2fe_0%,#f8fafc_55%,#ffffff_100%)]">
      <div className="container-narrow grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <h1 className="max-w-4xl text-3xl font-black leading-tight text-ink md:text-5xl">{service.heroTitle}</h1>
          <div className="mt-5 flex flex-wrap gap-2">
            {service.heroBullets.map((bullet) => (
              <span key={bullet} className="rounded-full border border-steel/15 bg-white px-3 py-1 text-sm font-semibold text-steel/90">
                {bullet}
              </span>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-steel/85">
            Если уже понимаете задачу по услуге, не обязательно оставлять длинное описание. Достаточно фото, размеров и короткого
            комментария по срокам.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <OpenCalcButton text="Получить расчёт и понять бюджет" analyticsSource={`service_hero_${service.slug}`} />
            <a
              href={`tel:${contacts.phoneRaw}`}
              className="btn-secondary"
              onClick={() => trackEvent("click_call", { section: `service_hero_${service.slug}` })}
            >
              Позвонить
            </a>
            <a
              href={contacts.telegramUrl}
              className="btn-secondary"
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("click_telegram", { section: `service_hero_${service.slug}` })}
            >
              Отправить фото
            </a>
          </div>
        </div>
        <div className="rounded-2xl border border-steel/10 bg-white p-5 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-wide text-steel/60">Чтобы получить расчёт быстрее</p>
          <ul className="mt-4 space-y-3">
            {quickChecklist.map((item) => (
              <li key={item} className="rounded-xl border border-steel/10 bg-paper px-4 py-3 text-sm text-steel/80">
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-steel/75">
            В ответ скажем ориентир по бюджету, срок изготовления и нужен ли выезд на замер уже сейчас.
          </p>
        </div>
      </div>
    </section>
  );
};
