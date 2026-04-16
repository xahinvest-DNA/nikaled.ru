import Link from "next/link";

import { Header } from "@/components/layout/Header";
import { StructuredData } from "@/components/seo/StructuredData";
import { articles } from "@/content/articles";
import { buildPageMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

const categoryIntro = [
  "Выбор решения: какие форматы лучше подходят под разные фасады и задачи бизнеса.",
  "Цена и бюджет: как считать смету и от чего реально зависит стоимость вывески или фасадных работ.",
  "Согласование и фасад: как учитывать документы, внешний вид объекта и ограничения до запуска производства."
];

const orderedArticles = [...articles].reverse();

export const metadata = buildPageMetadata(
  "Полезные материалы по вывескам, фасадам и наружной рекламе в Воронеже",
  "Статьи о вывесках, наружной рекламе, фасадах, согласовании и расчете бюджета в Воронеже.",
  "/blog/"
);

export default function BlogIndexPage() {
  return (
    <>
      <StructuredData data={buildBreadcrumbSchema([{ name: "Главная", path: "" }, { name: "Полезные материалы", path: "/blog/" }])} />
      <Header />
      <main className="container-narrow section-space pb-24 md:pb-16">
        <h1 className="text-3xl font-black text-ink md:text-5xl">Полезные материалы</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-steel/80">
          Здесь собраны материалы, которые помогают быстрее разобраться в теме до звонка или заявки. Объясняем простым языком,
          какую вывеску выбрать, от чего зависит цена, когда важно согласование, в каких случаях одной вывески уже мало и на что
          смотреть до запуска работ по фасаду и наружной рекламе.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {categoryIntro.map((item) => (
            <article key={item} className="rounded-2xl border border-steel/10 bg-paper px-5 py-4 text-sm text-steel/80">
              {item}
            </article>
          ))}
        </div>
        <div className="mt-8 space-y-4">
          {orderedArticles.map((article) => (
            <article key={article.slug} className="card">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-steel/60">
                    {article.category} • {article.readTime}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-steel">{article.title}</h2>
                </div>
                <Link href={`/blog/${article.slug}/`} className="btn-secondary">
                  Открыть статью
                </Link>
              </div>
              <p className="mt-4 text-sm leading-6 text-steel/80">{article.intro}</p>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {article.keyPoints.map((point) => (
                  <div key={point} className="rounded-xl border border-steel/10 px-4 py-3 text-sm text-steel/80">
                    {point}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
