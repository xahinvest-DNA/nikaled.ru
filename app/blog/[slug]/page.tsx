import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Header } from "@/components/layout/Header";
import { StructuredData } from "@/components/seo/StructuredData";
import { articles, articlesMap } from "@/content/articles";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = articlesMap[params.slug];
  if (!article) {
    return {};
  }

  return {
    title: article.seoTitle,
    description: article.seoDescription,
    alternates: {
      canonical: `/blog/${article.slug}/`
    }
  };
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const article = articlesMap[params.slug];

  if (!article) {
    notFound();
  }

  return (
    <>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Главная", path: "" },
          { name: "Полезные материалы", path: "/blog/" },
          { name: article.title, path: `/blog/${article.slug}/` }
        ])}
      />
      <Header />
      <main className="container-narrow section-space pb-24 md:pb-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-steel/60">Полезный материал • {article.readTime}</p>
        <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-ink md:text-5xl">{article.title}</h1>
        <p className="mt-4 max-w-4xl text-sm leading-6 text-steel/80 md:text-base">{article.intro}</p>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
          <article className="space-y-4">
            {article.sections.map((section) => (
              <section key={section.title} className="card">
                <h2 className="text-xl font-bold text-steel">{section.title}</h2>
                <div className="mt-4 space-y-3 text-sm leading-6 text-steel/80 md:text-base">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </article>
          <aside className="card lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-steel">Если нужен расчёт по объекту</h2>
            <p className="mt-3 text-sm text-steel/80">
              Отправьте фото фасада, размеры и задачу. Это быстрее, чем ориентироваться на усредненные советы без привязки к объекту.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link href="/kontakty/" className="btn-primary">
                Получить расчёт
              </Link>
              <Link href="/portfolio/" className="btn-secondary">
                Посмотреть кейсы
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}