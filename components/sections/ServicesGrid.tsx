import Link from "next/link";

import { services } from "@/content/services";

export const ServicesGrid = () => {
  return (
    <section className="section-space bg-white">
      <div className="container-narrow">
        <h2 className="text-2xl font-bold text-steel md:text-3xl">Что производим</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <article key={service.slug} className="card">
              <h3 className="text-xl font-bold text-steel">{service.name}</h3>
              <p className="mt-2 text-sm text-steel/80">{service.short}</p>
              <p className="mt-2 text-sm font-semibold text-steel/90">Цена {service.fromPrice}</p>
              <Link href={`/${service.slug}`} className="btn-secondary mt-4">
                Подробнее
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

