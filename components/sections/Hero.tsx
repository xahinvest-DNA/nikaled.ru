"use client";

import Image from "next/image";
import Link from "next/link";

import { OpenCalcButton } from "@/components/ui/OpenCalcButton";
import { contacts } from "@/content/contacts";
import { trackEvent } from "@/lib/analytics/events";

const quickRoutes = [
  {
    href: "/vyveski-voronezh/",
    title: "Нужна вывеска для новой точки",
    text: "Если открываетесь и хотите быстро понять цену и сроки."
  },
  {
    href: "/obemnye-bukvy/",
    title: "Нужны объёмные буквы",
    text: "Если нужна более заметная и аккуратная вывеска."
  },
  {
    href: "/laitboksy/",
    title: "Нужен недорогой световой вариант",
    text: "Когда нужен простой и понятный вариант без лишних затрат."
  },
  {
    href: "/soglasovanie-vyvesok/",
    title: "Сначала нужно понять согласование",
    text: "Разберёмся с документами до того, как начнём делать вывеску."
  }
];

const proofPoints = ["Отвечаем в течение 10 минут", "Работаем по Воронежу", "Можно начать с фото объекта"];
const heroFacts = [
  { value: "от 10 000 ₽", label: "Примерная цена на старте" },
  { value: "7-14 дней", label: "Обычный срок изготовления" },
  { value: "24 месяца", label: "Гарантия на материалы и монтаж" }
];

const heroFrames = [
  {
    src: "/images/hero-video/frame-1-dusk-facade-nikaled-v2.png",
    alt: "Вечерний фасад с подсвеченной вывеской"
  },
  {
    src: "/images/hero-video/frame-2-closeup-nikaled-v3.png",
    alt: "Объёмные буквы на тёмном фасаде"
  },
  {
    src: "/images/hero-video/frame-3-workshop-clean-v3.png",
    alt: "Изготовление световой вывески в мастерской"
  },
  {
    src: "/images/hero-video/frame-4-interior-nikaled-v3.png",
    alt: "Интерьер с фирменной световой вывеской Nikaled"
  }
];

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#dbeafe_0%,#f8fafc_50%,#ffffff_100%)]">
      <div className="container-narrow section-space grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)] lg:items-start">
        <div className="space-y-6">
          <p className="inline-flex rounded-full border border-steel/15 bg-white px-3 py-1 text-xs font-semibold uppercase text-steel/75">
            Производство в Воронеже
          </p>
          <h1 className="max-w-2xl text-4xl font-black leading-[1.02] text-ink md:text-6xl">
            Вывеска, которая приводит клиентов.
          </h1>
          <p className="max-w-xl text-base leading-7 text-steel/85 md:text-lg">
            Делаем вывески для магазинов, салонов, кафе и офисов в Воронеже. Поможем выбрать подходящий вариант, посчитаем цену и
            аккуратно доведём всё до монтажа.
          </p>
          <div className="flex flex-wrap gap-2 text-sm text-steel/80">
            {proofPoints.map((item) => (
              <span key={item} className="rounded-full border border-steel/15 bg-white px-3 py-2 font-medium">
                {item}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <OpenCalcButton text="Получить расчёт за 10 минут" className="btn-primary min-w-[220px]" analyticsSource="hero_primary" />
            <a
              href={`tel:${contacts.phoneRaw}`}
              className="btn-secondary min-w-[220px]"
              onClick={() => trackEvent("click_call", { section: "hero" })}
            >
              Позвонить и обсудить объект
            </a>
            <a
              href={contacts.telegramUrl}
              className="btn-secondary min-w-[220px]"
              target="_blank"
              rel="noreferrer"
              onClick={() => trackEvent("click_telegram", { section: "hero" })}
            >
              Отправить фото в Telegram
            </a>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {heroFacts.map((item) => (
              <div key={item.label} className="rounded-2xl border border-steel/10 bg-white px-4 py-4 shadow-card">
                <p className="text-lg font-black text-steel">{item.value}</p>
                <p className="mt-1 text-sm leading-5 text-steel/72">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[28px] border border-steel/10 bg-white p-4 shadow-card md:p-5">
          <div className="overflow-hidden rounded-2xl border border-steel/10 bg-[#020b1a]">
            <div className="relative aspect-[16/10] w-full bg-[#040b16]">
              {heroFrames.map((frame, index) => (
                <div
                  key={frame.src}
                  className="hero-cinematic-frame motion-reduce:animate-none"
                  style={{ animationDelay: `${index * 5}s` }}
                >
                  <Image
                    src={frame.src}
                    alt={frame.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center"
                    priority={index === 0}
                  />
                </div>
              ))}
              <div className="hero-cinematic-overlay" />
              <div className="hero-cinematic-scan motion-reduce:hidden" />
            </div>
          </div>
          <div className="mt-4 rounded-2xl bg-paper p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase text-steel/60">Быстрый выбор</p>
                <p className="mt-1 text-sm text-steel/72">Если уже знаете, что вам нужно, переходите сразу в нужный раздел.</p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {quickRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className="rounded-2xl border border-steel/10 bg-white px-4 py-4 text-sm text-steel/80 transition hover:border-steel/20"
                >
                  <span className="block text-base font-semibold text-steel">{route.title}</span>
                  <span className="mt-2 block leading-6">{route.text}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
