import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Header } from "@/components/layout/Header";
import { StructuredData } from "@/components/seo/StructuredData";
import { FaqSection } from "@/components/sections/FaqSection";
import { articles, articlesMap } from "@/content/articles";
import { services } from "@/content/services";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

type BlogArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articlesMap[slug];
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

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = await params;
  const article = articlesMap[slug];

  if (!article) {
    notFound();
  }

  const relatedServices = services.filter((service) => article.relatedServiceSlugs.includes(service.slug));
  const relatedArticles = articles.filter((item) => item.slug !== article.slug).slice(0, 3);

  return (
    <>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Главная", path: "" },
          { name: "Полезные материалы", path: "/blog/" },
          { name: article.title, path: `/blog/${article.slug}/` }
        ])}
      />
      <StructuredData data={buildFaqSchema(article.faqItems)} />
      <Header />
      <main className="container-narrow section-space pb-24 md:pb-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-steel/60">
          {article.category} • {article.readTime}
        </p>
        <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-ink md:text-5xl">{article.title}</h1>
        <p className="mt-4 max-w-4xl text-sm leading-6 text-steel/80 md:text-base">{article.intro}</p>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
          <article className="space-y-4">
            <section className="card">
              <h2 className="text-xl font-bold text-steel">Коротко по сути</h2>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-steel/80 md:text-base">
                {article.keyPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>
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
            <section className="card">
              <h2 className="text-xl font-bold text-steel">Что посмотреть дальше</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {relatedArticles.map((item) => (
                  <Link key={item.slug} href={`/blog/${item.slug}/`} className="rounded-xl border border-steel/10 px-4 py-4 text-sm text-steel/80 transition hover:border-steel/20">
                    <span className="block font-semibold text-steel">{item.title}</span>
                    <span className="mt-2 block">{item.description}</span>
                  </Link>
                ))}
              </div>
            </section>
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
            <div className="mt-5 border-t border-steel/10 pt-5">
              <h3 className="text-sm font-bold uppercase tracking-wide text-steel/60">Связанные услуги</h3>
              <div className="mt-3 flex flex-col gap-2">
                {relatedServices.map((service) => (
                  <Link key={service.slug} href={`/${service.slug}/`} className="rounded-lg bg-paper px-3 py-2 text-sm text-steel/85">
                    {service.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <FaqSection items={article.faqItems} />
    </>
  );
}
