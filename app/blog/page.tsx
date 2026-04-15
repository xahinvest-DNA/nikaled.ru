import Link from "next/link";

import { Header } from "@/components/layout/Header";
import { StructuredData } from "@/components/seo/StructuredData";
import { articles } from "@/content/articles";
import { buildPageMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

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
          Здесь мы собираем практические материалы по вывескам, наружной рекламе, согласованию и запуску фасадных конструкций в
          Воронеже. Такой раздел помогает закрывать реальные вопросы клиентов до звонка и одновременно усиливает поисковую видимость
          сайта по информационным запросам.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {articles.map((article) => (
            <article key={article.slug} className="card">
              <p className="text-xs font-semibold uppercase tracking-wide text-steel/60">{article.readTime}</p>
              <h2 className="mt-2 text-xl font-bold text-steel">{article.title}</h2>
              <p className="mt-3 text-sm text-steel/80">{article.description}</p>
              <Link href={`/blog/${article.slug}/`} className="btn-secondary mt-4">
                Читать материал
              </Link>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}