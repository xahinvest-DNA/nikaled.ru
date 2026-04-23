import Link from "next/link";

import { OpenCalcButton } from "@/components/ui/OpenCalcButton";
import { services } from "@/content/services";

export const ServicesGrid = () => {
  return (
    <section className="section-space bg-white">
      <div className="container-narrow">
        <h2 className="text-2xl font-bold text-steel md:text-3xl">Выберите нужную услугу и переходите сразу к расчёту</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-steel/80">
          Так проще и быстрее: вы сразу попадаете на страницу по своей задаче, видите цены и понимаете, с чего начать.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {services.map((service) => {
            const isFacade = service.slug === "otdelka-fasadov";

            return (
              <article
                key={service.slug}
                className={`card ${isFacade ? "border-steel/20 bg-[linear-gradient(135deg,#f8fafc_0%,#eef6ff_40%,#ffffff_100%)]" : ""}`}
              >
                {isFacade ? (
                  <span className="inline-flex rounded-full border border-steel/15 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-steel/65">
                    Новое направление
                  </span>
                ) : null}
                <h3 className={`text-xl font-bold text-steel ${isFacade ? "mt-4" : ""}`}>{service.name}</h3>
                <p className="mt-2 text-sm text-steel/80">{service.short}</p>
                <p className="mt-2 text-sm font-semibold text-steel/90">Цена {service.fromPrice}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-steel/70">
                  {service.heroBullets.slice(0, 2).map((bullet) => (
                    <span key={bullet} className="rounded-full border border-steel/10 bg-white px-3 py-2">
                      {bullet}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href={`/${service.slug}`} className="btn-secondary">
                    Перейти на страницу услуги
                  </Link>
                  <OpenCalcButton
                    text="Узнать цену"
                    className="btn-primary"
                    analyticsSource={`services_grid_${service.slug}`}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
