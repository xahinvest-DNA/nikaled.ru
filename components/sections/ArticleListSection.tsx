import Link from "next/link";

import { articles } from "@/content/articles";

const featuredArticles = [...articles].reverse().slice(0, 6);

export const ArticleListSection = () => {
  return (
    <section className="section-space bg-white">
      <div className="container-narrow">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-steel md:text-3xl">Полезные материалы</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-steel/80">
              Здесь собрали практические материалы по выбору вывески, бюджету, фасаду и согласованию. Можно быстро разобраться в теме,
              а потом уже выходить на расчёт с более понятной задачей.
            </p>
          </div>
          <Link href="/blog/" className="btn-secondary">
            Все материалы
          </Link>
        </div>
        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {featuredArticles.map((article) => (
            <article key={article.slug} className="card">
              <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wide text-steel/60">
                <span>{article.category}</span>
                <span>{article.readTime}</span>
              </div>
              <h3 className="mt-3 text-lg font-bold text-steel">{article.title}</h3>
              <p className="mt-3 text-sm text-steel/80">{article.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-steel/75">
                {article.keyPoints.slice(0, 2).map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <Link href={`/blog/${article.slug}/`} className="btn-secondary mt-5">
                Читать материал
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
