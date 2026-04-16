import Link from "next/link";

import { OpenCalcButton } from "@/components/ui/OpenCalcButton";
import { SmartImage } from "@/components/ui/SmartImage";
import { type CaseItem } from "@/content/cases";
import { media } from "@/content/media";

type Props = {
  title?: string;
  items: CaseItem[];
};

export const CasesSection = ({ title = "Наши работы", items }: Props) => {
  return (
    <section className="section-space">
      <div className="container-narrow">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-steel md:text-3xl">{title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-steel/80">
              Показываем не только фото, но и что именно получил клиент по сроку, фасаду и результату для точки.
            </p>
          </div>
          <Link href="/portfolio/" className="text-sm font-semibold text-steel/80 hover:text-steel">
            Смотреть все кейсы
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="card">
              <div className="overflow-hidden rounded-xl border border-steel/10 bg-slate-100 p-2">
                <SmartImage
                  src={item.image}
                  fallbackSrc={media.caseFallback}
                  alt={item.title}
                  width={1280}
                  height={720}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="mx-auto h-56 w-full object-contain"
                />
              </div>
              <h3 className="mt-4 text-lg font-bold text-steel">{item.title}</h3>
              <p className="mt-1 text-sm text-steel/80">
                <span className="font-semibold">Задача:</span> {item.task}
              </p>
              <p className="mt-1 text-sm text-steel/80">
                <span className="font-semibold">Решение:</span> {item.result}
              </p>
              <p className="mt-3 rounded-xl border border-steel/10 bg-paper px-4 py-3 text-sm leading-6 text-steel/85">
                <span className="font-semibold text-steel">Что получил клиент:</span> {item.outcome}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded bg-sky-100 px-2 py-1 text-steel">Срок: {item.term}</span>
                <span className="rounded bg-orange-100 px-2 py-1 text-steel">Бюджет: {item.budget}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-steel/75">
                {item.bestFor.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full border border-steel/10 px-2 py-1">
                    {tag}
                  </span>
                ))}
              </div>
              <Link href={`/portfolio/${item.id}/`} className="btn-secondary mt-4">
                Открыть кейс
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-6">
          <OpenCalcButton text="Получить расчёт сегодня" />
        </div>
      </div>
    </section>
  );
};
