import Link from "next/link";

import { Header } from "@/components/layout/Header";
import { StructuredData } from "@/components/seo/StructuredData";
import { SmartImage } from "@/components/ui/SmartImage";
import { cases } from "@/content/cases";
import { media } from "@/content/media";
import { buildPageMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

export const metadata = buildPageMetadata(
  "Портфолио наружной рекламы и фасадных решений в Воронеже",
  "Примеры выполненных работ: вывески, объемные буквы, лайтбоксы, фасадные решения и оформление входных групп.",
  "/portfolio/"
);

export default function PortfolioPage() {
  return (
    <>
      <StructuredData data={buildBreadcrumbSchema([{ name: "Главная", path: "" }, { name: "Портфолио", path: "/portfolio/" }])} />
      <Header />
      <main className="container-narrow section-space pb-24 md:pb-16">
        <h1 className="text-3xl font-black text-ink md:text-5xl">Портфолио</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-steel/80">
          Реальные кейсы по наружной рекламе и фасадным работам в Воронеже: от вывесок и объёмных букв до входных групп,
          локальной отделки фасадов и брендирования объектов. Показываем не только картинку, но и задачу бизнеса, решение,
          срок и что получил клиент в итоге.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {cases.map((item) => (
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
              <h2 className="mt-4 text-xl font-bold text-steel">{item.title}</h2>
              <p className="mt-1 text-sm text-steel/80">
                <span className="font-semibold">Задача:</span> {item.task}
              </p>
              <p className="mt-1 text-sm text-steel/80">
                <span className="font-semibold">Решение:</span> {item.result}
              </p>
              <p className="mt-3 rounded-xl border border-steel/10 bg-paper px-4 py-3 text-sm leading-6 text-steel/85">
                <span className="font-semibold text-steel">Что получил клиент:</span> {item.outcome}
              </p>
              <p className="mt-3 text-sm text-steel/80">
                Срок: <strong>{item.term}</strong>
                {item.budget ? (
                  <>
                    , бюджет: <strong>{item.budget}</strong>
                  </>
                ) : null}
              </p>
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
      </main>
    </>
  );
}
