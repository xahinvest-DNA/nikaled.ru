import { SmartImage } from "@/components/ui/SmartImage";
import { media } from "@/content/media";
import { trustStats } from "@/content/stats";

export const TrustSection = () => {
  return (
    <section className="section-space">
      <div className="container-narrow grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="card">
          <h2 className="text-2xl font-bold text-steel md:text-3xl">Почему нам доверяют проекты с запуском под дату</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-steel/80">
            Для бизнеса наружная реклама важна не сама по себе, а как часть открытия и продаж. Поэтому мы строим работу так, чтобы
            заказчик заранее понимал сроки, бюджет и этапы, а не разбирался с этим уже после запуска производства.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {trustStats.map((item) => (
              <article key={item.label} className="rounded-xl border border-steel/10 bg-paper px-4 py-3">
                <p className="text-xl font-black text-steel">{item.value}</p>
                <p className="text-sm text-steel/75">{item.label}</p>
              </article>
            ))}
          </div>
          <p className="mt-5 text-sm text-steel/75">
            Помогаем не только сделать конструкцию, но и снизить риск переделки, срыва срока монтажа и проблем с читаемостью вывески.
          </p>
        </div>
        <div className="relative min-h-72 overflow-hidden rounded-2xl border border-steel/10 bg-white shadow-card">
          <SmartImage src={media.workshop} fallbackSrc={media.caseFallback} alt="Фото цеха и процесса монтажа" fill className="object-cover" />
        </div>
      </div>
    </section>
  );
};