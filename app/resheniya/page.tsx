import Link from "next/link";

import { Header } from "@/components/layout/Header";
import { StructuredData } from "@/components/seo/StructuredData";
import { solutionPages } from "@/content/solutions";
import { buildPageMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

export const metadata = buildPageMetadata(
  "Готовые решения по вывескам и наружной рекламе в Воронеже",
  "Подбор готовых решений по вывескам в Воронеже: для магазинов, салонов красоты и других коммерческих объектов.",
  "/resheniya/"
);

export default function SolutionsIndexPage() {
  return (
    <>
      <StructuredData data={buildBreadcrumbSchema([{ name: "Главная", path: "" }, { name: "Решения", path: "/resheniya/" }])} />
      <Header />
      <main className="container-narrow section-space pb-24 md:pb-16">
        <h1 className="text-3xl font-black text-ink md:text-5xl">Готовые решения</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-steel/80">
          В этом разделе собраны посадочные под типовые задачи бизнеса. Такой формат помогает быстрее понять, какой сценарий
          подойдет именно вашему объекту: магазину, салону, кафе или точке с дедлайном открытия.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {solutionPages.map((page) => (
            <article key={page.slug} className="card">
              <h2 className="text-2xl font-bold text-steel">{page.title}</h2>
              <p className="mt-3 text-sm text-steel/80">{page.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {page.bullets.map((bullet) => (
                  <span key={bullet} className="rounded-full border border-steel/15 bg-paper px-3 py-1 text-sm font-semibold text-steel/85">
                    {bullet}
                  </span>
                ))}
              </div>
              <Link href={`/resheniya/${page.slug}/`} className="btn-secondary mt-5">
                Перейти к решению
              </Link>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}