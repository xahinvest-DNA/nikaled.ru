import { OpenCalcButton } from "@/components/ui/OpenCalcButton";
import { SmartImage } from "@/components/ui/SmartImage";
import { contacts } from "@/content/contacts";
import { media } from "@/content/media";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#dbeafe_0%,#f8fafc_50%,#ffffff_100%)]">
      <div className="container-narrow section-space grid gap-8 md:grid-cols-2">
        <div className="space-y-5">
          <p className="inline-flex rounded-full border border-steel/15 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-steel/75">
            Производство в Воронеже
          </p>
          <h1 className="text-3xl font-black leading-tight text-ink md:text-5xl">
            Вывеска, которая пройдёт согласование и начнёт приводить клиентов с первого дня открытия.
          </h1>
          <p className="text-base text-steel/85 md:text-lg">
            Берём на себя замер, дизайн, производство, монтаж и документы. Без срывов сроков и переделок.
          </p>
          <div className="flex flex-wrap gap-3">
            <OpenCalcButton text="Получить расчёт и понять бюджет" />
            <a href={`tel:${contacts.phoneRaw}`} className="btn-secondary">
              Получить консультацию
            </a>
          </div>
          <p className="text-sm text-steel/70">Ответим в течение 10 минут</p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-steel/10 bg-[#020b1a] shadow-card">
          <div className="relative aspect-[3/2] w-full">
            <SmartImage
              src={media.hero}
              fallbackSrc={media.caseFallback}
              alt="Изображение Nikaled"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};
