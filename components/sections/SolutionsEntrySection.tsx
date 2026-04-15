import Link from "next/link";

import { solutionPages } from "@/content/solutions";

export const SolutionsEntrySection = () => {
  return (
    <section className="section-space">
      <div className="container-narrow">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-steel md:text-3xl">Готовые решения под типовые задачи бизнеса</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-steel/80">
              Здесь собрали готовые варианты под частые задачи бизнеса. Если вы открываете магазин, салон, кафе или аптеку,
              не нужно разбираться во всех типах конструкций с нуля. Можно сразу перейти в близкий вам раздел и посмотреть,
              какое решение обычно подходит в таких случаях.
            </p>
          </div>
          <Link href="/resheniya/" className="btn-secondary">
            Все решения
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {solutionPages.map((page) => (
            <article key={page.slug} className="card">
              <h3 className="text-xl font-bold text-steel">{page.title}</h3>
              <p className="mt-3 text-sm text-steel/80">{page.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-steel/75">
                {page.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <Link href={`/resheniya/${page.slug}/`} className="btn-secondary mt-5">
                Открыть решение
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};