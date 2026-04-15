"use client";

import { SmartImage } from "@/components/ui/SmartImage";
import { media } from "@/content/media";
import { contacts } from "@/content/contacts";
import { trustProofs, trustStats } from "@/content/stats";
import { trackEvent } from "@/lib/analytics/events";

export const TrustSection = () => {
  return (
    <section className="section-space">
      <div className="container-narrow grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="card">
            <h2 className="text-2xl font-bold text-steel md:text-3xl">Почему с нами проще запускать объект без хаоса и переделок</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-steel/80">
              Для бизнеса вывеска важна не сама по себе, а как часть открытия, трафика и нормального запуска. Поэтому мы строим работу так,
              чтобы клиент заранее понимал сроки, бюджет и порядок действий, а не собирал это по кускам в процессе.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {trustStats.map((item) => (
                <article key={item.label} className="rounded-xl border border-steel/10 bg-paper px-4 py-3">
                  <p className="text-xl font-black text-steel">{item.value}</p>
                  <p className="text-sm text-steel/75">{item.label}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold text-steel">Что клиент получает на практике</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {trustProofs.map((item) => (
                <article key={item.title} className="rounded-xl border border-steel/10 px-4 py-4">
                  <p className="text-sm font-semibold text-steel">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-steel/75">{item.text}</p>
                </article>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={`tel:${contacts.phoneRaw}`}
                className="btn-secondary"
                onClick={() => trackEvent("click_call", { section: "trust" })}
              >
                Позвонить и обсудить объект
              </a>
              <a
                href={contacts.telegramUrl}
                className="btn-secondary"
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("click_telegram", { section: "trust" })}
              >
                Написать в Telegram
              </a>
            </div>
          </div>
        </div>

        <div className="relative min-h-72 overflow-hidden rounded-2xl border border-steel/10 bg-white shadow-card">
          <SmartImage src={media.workshop} fallbackSrc={media.caseFallback} alt="Фото цеха и процесса монтажа" fill className="object-cover" />
        </div>
      </div>
    </section>
  );
};
