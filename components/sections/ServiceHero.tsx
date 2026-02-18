import { type Service } from "@/content/services";
import { OpenCalcButton } from "@/components/ui/OpenCalcButton";

type Props = {
  service: Service;
};

export const ServiceHero = ({ service }: Props) => {
  return (
    <section className="section-space bg-[radial-gradient(circle_at_20%_20%,#e0f2fe_0%,#f8fafc_55%,#ffffff_100%)]">
      <div className="container-narrow">
        <h1 className="max-w-4xl text-3xl font-black leading-tight text-ink md:text-5xl">{service.heroTitle}</h1>
        <div className="mt-5 flex flex-wrap gap-2">
          {service.heroBullets.map((bullet) => (
            <span key={bullet} className="rounded-full border border-steel/15 bg-white px-3 py-1 text-sm font-semibold text-steel/90">
              {bullet}
            </span>
          ))}
        </div>
        <p className="mt-5 text-sm text-steel/85">Пришлите размеры/фото - посчитаем точнее.</p>
        <div className="mt-4">
          <OpenCalcButton text="Рассчитать стоимость" />
        </div>
      </div>
    </section>
  );
};

