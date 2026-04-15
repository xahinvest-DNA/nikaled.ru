import { type Service } from "@/content/services";

export const ServicePricing = ({ service }: { service: Service }) => {
  return (
    <section className="section-space bg-white">
      <div className="container-narrow card">
        <h2 className="text-2xl font-bold text-steel md:text-3xl">Цена {service.fromPrice}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-steel/80">
          Точную смету даём после фото фасада или замера. Так вы заранее понимаете бюджет и не сталкиваетесь с доплатами за нюансы,
          которые не были учтены на старте.
        </p>
        <p className="mt-4 text-sm font-semibold text-steel/90">Что влияет на стоимость:</p>
        <ul className="mt-4 grid gap-2 md:grid-cols-2">
          {service.pricingFactors.map((factor) => (
            <li key={factor} className="rounded-lg border border-steel/10 px-3 py-2 text-sm text-steel/85">
              {factor}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};