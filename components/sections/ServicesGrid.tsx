import Link from "next/link";

import { services } from "@/content/services";

export const ServicesGrid = () => {
  return (
    <section className="section-space bg-white">
      <div className="container-narrow">
        <h2 className="text-2xl font-bold text-steel md:text-3xl">Что производим</h2>
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
                <Link href={`/${service.slug}`} className="btn-secondary mt-4">
                  Подробнее
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
