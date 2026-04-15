import Link from "next/link";

import { articles } from "@/content/articles";

export const ArticleListSection = () => {
  return (
    <section className="section-space bg-white">
      <div className="container-narrow">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-steel md:text-3xl">Полезные материалы</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-steel/80">
              Собираем практические разборы по вывескам, наружной рекламе, бюджетам и согласованию в Воронеже. Это помогает сайту
              закрывать информационный спрос, а клиенту - быстрее принимать решение.
            </p>
          </div>
          <Link href="/blog/" className="btn-secondary">
            Все материалы
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {articles.map((article) => (
            <article key={article.slug} className="card">
              <p className="text-xs font-semibold uppercase tracking-wide text-steel/60">{article.readTime}</p>
              <h3 className="mt-2 text-lg font-bold text-steel">{article.title}</h3>
              <p className="mt-3 text-sm text-steel/80">{article.description}</p>
              <Link href={`/blog/${article.slug}/`} className="btn-secondary mt-4">
                Читать материал
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};