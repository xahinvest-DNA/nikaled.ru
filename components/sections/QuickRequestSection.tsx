"use client";

import { OpenCalcButton } from "@/components/ui/OpenCalcButton";
import { OpenAiAssistantButton } from "@/components/ui/OpenAiAssistantButton";
import { contacts } from "@/content/contacts";
import { trackEvent } from "@/lib/analytics/events";

const checklist = [
  "Фото фасада или входной группы целиком",
  "Примерный размер или хотя бы ширина",
  "Что именно нужно сделать",
  "Когда хотите запуститься"
];

const resultItems = [
  "Поймёте, сколько это примерно будет стоить",
  "Скажем, что лучше подойдёт именно для вашего объекта",
  "Объясним, что делать дальше"
];

export const QuickRequestSection = () => {
  return (
    <section className="section-space">
      <div className="container-narrow card">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <h2 className="text-2xl font-bold text-steel md:text-3xl">Что прислать, чтобы мы быстро посчитали стоимость</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-steel/80">
              Не нужно готовить подробное ТЗ. Достаточно пары понятных вводных, чтобы мы прикинули цену и сразу сказали, что лучше
              делать в вашем случае.
            </p>
            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {checklist.map((item) => (
                <li key={item} className="rounded-xl border border-steel/10 bg-paper px-4 py-4 text-sm text-steel/80">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-steel/10 bg-paper p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-steel/60">На выходе</p>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-steel/80">
              {resultItems.map((item) => (
                <li key={item} className="rounded-xl border border-steel/10 bg-white px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <OpenCalcButton text="Получить расчёт по фото" analyticsSource="quick_request" />
              <OpenAiAssistantButton text="Подобрать вариант" analyticsSource="quick_request_ai" />
              <a
                href={contacts.telegramUrl}
                className="btn-secondary"
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent("click_telegram", { section: "quick_request" })}
              >
                Отправить фото в Telegram
              </a>
              <a
                href={`tel:${contacts.phoneRaw}`}
                className="btn-secondary"
                onClick={() => trackEvent("click_call", { section: "quick_request" })}
              >
                Позвонить
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
