import { SmartImage } from "@/components/ui/SmartImage";
import { facadeConcepts } from "@/content/facade-concepts";
import { media } from "@/content/media";

export const FacadeConceptsSection = () => {
  return (
    <section className="section-space bg-white">
      <div className="container-narrow">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold text-steel md:text-3xl">Визуальные концепции будущих фасадных проектов</h2>
          <p className="mt-3 text-sm leading-6 text-steel/80 md:text-base">
            Ниже мы показываем не реализованные объекты, а честные визуальные сценарии того, как может выглядеть фасадный проект
            после обновления. Эти концепции сделаны на базе реального опыта более 7 лет в отделке фасадов и помогают быстрее
            обсудить стиль, масштаб и подход к объекту ещё до замера и расчёта.
          </p>
          <div className="mt-4 inline-flex rounded-full border border-steel/15 bg-paper px-4 py-2 text-xs font-semibold uppercase tracking-wide text-steel/70">
            AI-концепты. Не выдаём их за реализованные объекты.
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {facadeConcepts.map((item) => (
            <article key={item.id} className="card">
              <div className="overflow-hidden rounded-xl border border-steel/10 bg-slate-100 p-2">
                <SmartImage
                  src={item.image}
                  fallbackSrc={media.caseFallback}
                  alt={item.title}
                  width={1280}
                  height={960}
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="mx-auto h-56 w-full object-cover"
                />
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-steel">{item.title}</h3>
                <span className="rounded-full border border-steel/15 bg-paper px-3 py-1 text-[11px] font-semibold text-steel/75">
                  {item.objectType}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-steel/80">{item.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-steel/75">
                {item.focus.map((point) => (
                  <span key={point} className="rounded-full border border-steel/10 px-2 py-1">
                    {point}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};