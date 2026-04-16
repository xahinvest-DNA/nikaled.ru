import { SmartImage } from "@/components/ui/SmartImage";
import { facadeProjects } from "@/content/facade-projects";
import { media } from "@/content/media";

export const FacadeProjectsSection = () => {
  return (
    <section className="section-space">
      <div className="container-narrow">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold text-steel md:text-3xl">Опыт и форматы работ по фасадам</h2>
          <p className="mt-3 text-sm leading-6 text-steel/80 md:text-base">
            В этот блок мы не включаем рекламные вывески и смешанные рекламные кейсы. Здесь собраны отдельные фасадные объекты из
            реального опыта и рабочие сценарии по отделке фасадов, входных групп и небольших зданий. Это честная часть нового
            направления: показываем не обещания, а характер работ, с которыми уже есть практический опыт более 7 лет.
          </p>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {facadeProjects.map((item) => (
            <article key={item.id} className="card">
              <div className="overflow-hidden rounded-xl border border-steel/10 bg-slate-100 p-2">
                <SmartImage
                  src={item.image}
                  fallbackSrc={media.caseFallback}
                  alt={item.title}
                  width={1280}
                  height={960}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="mx-auto h-60 w-full object-cover"
                />
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-steel">{item.title}</h3>
                <span className="rounded-full border border-steel/15 bg-paper px-3 py-1 text-xs font-semibold text-steel/75">
                  {item.status}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-steel/65">{item.objectType}</p>
              <p className="mt-3 text-sm leading-6 text-steel/80">{item.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-steel/75">
                {item.scope.map((point) => (
                  <span key={point} className="rounded-full border border-steel/10 px-2 py-1">
                    {point}
                  </span>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-steel/10 bg-paper px-4 py-3 text-sm leading-6 text-steel/85">
                <span className="font-semibold text-steel">Что это показывает:</span> {item.result}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
