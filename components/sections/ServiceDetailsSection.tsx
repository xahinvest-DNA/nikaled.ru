import { type Service } from "@/content/services";

export const ServiceDetailsSection = ({ service }: { service: Service }) => {
  return (
    <section className="section-space">
      <div className="container-narrow grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
        <article className="card">
          <h2 className="text-2xl font-bold text-steel md:text-3xl">Что входит в услугу</h2>
          <p className="mt-3 text-sm leading-6 text-steel/80">{service.detailIntro}</p>
          <ul className="mt-5 grid gap-2 text-sm text-steel/85">
            {service.deliverables.map((item) => (
              <li key={item} className="rounded-lg border border-steel/10 px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </article>
        <article className="card bg-white">
          <h2 className="text-2xl font-bold text-steel md:text-3xl">Когда это решение подходит</h2>
          <ul className="mt-5 space-y-2 text-sm text-steel/80">
            {service.useCases.map((item) => (
              <li key={item} className="rounded-lg bg-paper px-4 py-3">
                {item}
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
};