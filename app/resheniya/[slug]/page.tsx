import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { LeadForm } from "@/components/forms/LeadForm";
import { Header } from "@/components/layout/Header";
import { StructuredData } from "@/components/seo/StructuredData";
import { CasesSection } from "@/components/sections/CasesSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { StepsSection } from "@/components/sections/StepsSection";
import { articles } from "@/content/articles";
import { cases } from "@/content/cases";
import { services } from "@/content/services";
import { solutionPages, solutionPagesMap } from "@/content/solutions";
import { buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

type SolutionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return solutionPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: SolutionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = solutionPagesMap[slug];
  if (!page) {
    return {};
  }

  return {
    title: page.seoTitle,
    description: page.seoDescription,
    alternates: {
      canonical: `/resheniya/${page.slug}/`
    }
  };
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { slug } = await params;
  const page = solutionPagesMap[slug];
  if (!page) {
    notFound();
  }

  const relatedServices = services.filter((service) => page.relatedServiceSlugs.includes(service.slug));
  const uniqueCaseItems = cases
    .filter((item) => item.services.some((serviceSlug) => page.relatedServiceSlugs.includes(serviceSlug as (typeof services)[number]["slug"])))
    .slice(0, 4);
  const relatedArticles = articles
    .filter((article) => article.relatedServiceSlugs.some((serviceSlug) => page.relatedServiceSlugs.includes(serviceSlug as (typeof services)[number]["slug"])))
    .slice(0, 3);
  const relatedSolutions = solutionPages
    .filter((candidate) => candidate.slug !== page.slug)
    .map((candidate) => ({
      candidate,
      score: candidate.relatedServiceSlugs.filter((serviceSlug) => page.relatedServiceSlugs.includes(serviceSlug as (typeof services)[number]["slug"])).length
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.candidate)
    .slice(0, 3);

  return (
    <>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Главная", path: "" },
          { name: "Решения", path: "/resheniya/" },
          { name: page.title, path: `/resheniya/${page.slug}/` }
        ])}
      />
      <StructuredData data={buildFaqSchema(page.faqItems)} />
      <Header />
      <main className="pb-24 md:pb-0">
        <section className="section-space bg-[radial-gradient(circle_at_20%_20%,#e0f2fe_0%,#f8fafc_55%,#ffffff_100%)]">
          <div className="container-narrow grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-steel/60">Решение под задачу бизнеса</p>
              <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-ink md:text-5xl">{page.heroTitle}</h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-steel/80 md:text-base">{page.heroText}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {page.bullets.map((bullet) => (
                  <span key={bullet} className="rounded-full border border-steel/15 bg-white px-3 py-1 text-sm font-semibold text-steel/90">
                    {bullet}
                  </span>
                ))}
              </div>
            </div>
            <LeadForm title="Получить расчёт по объекту" buttonText="Получить расчёт сегодня" compact />
          </div>
        </section>

        <section className="section-space">
          <div className="container-narrow grid gap-4 md:grid-cols-2">
            <article className="card">
              <h2 className="text-2xl font-bold text-steel md:text-3xl">Что важно для такого проекта</h2>
              <ul className="mt-4 space-y-2 text-sm text-steel/80">
                {page.pains.map((pain) => (
                  <li key={pain}>{pain}</li>
                ))}
              </ul>
            </article>
            <article className="card">
              <h2 className="text-2xl font-bold text-steel md:text-3xl">Что мы берем на себя</h2>
              <ul className="mt-4 space-y-2 text-sm text-steel/80">
                {page.deliverables.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </section>

        <section className="section-space bg-white">
          <div className="container-narrow card">
            <h2 className="text-2xl font-bold text-steel md:text-3xl">Подходящие услуги</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {relatedServices.map((service) => (
                <Link key={service.slug} href={`/${service.slug}/`} className="rounded-xl border border-steel/10 px-4 py-4 text-sm text-steel/80 transition hover:border-steel/20">
                  <span className="block text-base font-bold text-steel">{service.name}</span>
                  <span className="mt-2 block">{service.short}</span>
                  <span className="mt-3 block font-semibold text-steel/90">Цена {service.fromPrice}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {relatedSolutions.length ? (
          <section className="section-space bg-paper/40">
            <div className="container-narrow card">
              <h2 className="text-2xl font-bold text-steel md:text-3xl">Похожие задачи и решения</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {relatedSolutions.map((candidate) => (
                  <Link key={candidate.slug} href={`/resheniya/${candidate.slug}/`} className="rounded-xl border border-steel/10 px-4 py-4 text-sm text-steel/80 transition hover:border-steel/20">
                    <span className="block text-base font-bold text-steel">{candidate.title}</span>
                    <span className="mt-2 block">{candidate.description}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {relatedArticles.length ? (
          <section className="section-space bg-white">
            <div className="container-narrow card">
              <h2 className="text-2xl font-bold text-steel md:text-3xl">Что полезно прочитать перед стартом</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {relatedArticles.map((article) => (
                  <Link key={article.slug} href={`/blog/${article.slug}/`} className="rounded-xl border border-steel/10 px-4 py-4 text-sm text-steel/80 transition hover:border-steel/20">
                    <span className="block text-base font-bold text-steel">{article.title}</span>
                    <span className="mt-2 block">{article.description}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <CasesSection title="Релевантные кейсы" items={uniqueCaseItems} />
        <FaqSection items={page.faqItems} />
        <StepsSection />
        <FinalCtaSection />
      </main>
    </>
  );
}