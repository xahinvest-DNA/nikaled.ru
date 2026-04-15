import Link from "next/link";

import { Header } from "@/components/layout/Header";
import { StructuredData } from "@/components/seo/StructuredData";
import { articles } from "@/content/articles";
import { buildPageMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

const categoryIntro = [
  "Выбор решения: какие форматы лучше подходят под разные фасады и задачи бизнеса.",
  "Цена и бюджет: как считать смету и от чего реально зависит стоимость вывески.",
  "Согласование: как учитывать документы и ограничения до запуска производства."
];

export const metadata = buildPageMetadata(
  "Полезные материалы по вывескам и наружной рекламе в Воронеже",
  "Статьи о вывесках, наружной рекламе, согласовании и расчете бюджета в Воронеже.",
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
          Это уже полноценный раздел знаний по вывескам и наружной рекламе в Воронеже. Здесь мы разбираем не только “что заказать”,
          но и как выбрать формат, как считать бюджет, как избежать переделок и на что смотреть до запуска производства.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {categoryIntro.map((item) => (
            <article key={item} className="rounded-2xl border border-steel/10 bg-paper px-5 py-4 text-sm text-steel/80">
              {item}
            </article>
          ))}
        </div>
        <div className="mt-8 space-y-4">
          {articles.map((article) => (
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