import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Header } from "@/components/layout/Header";
import { StructuredData } from "@/components/seo/StructuredData";
import { SmartImage } from "@/components/ui/SmartImage";
import { cases, casesMap } from "@/content/cases";
import { media } from "@/content/media";
import { services } from "@/content/services";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

type PortfolioCasePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return cases.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }: PortfolioCasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = casesMap[slug];
  if (!item) {
    return {};
  }

  return {
    title: item.seoTitle,
    description: item.seoDescription,
    alternates: {
      canonical: `/portfolio/${item.id}/`
    }
  };
}

export default async function PortfolioCasePage({ params }: PortfolioCasePageProps) {
  const { slug } = await params;
  const item = casesMap[slug];
  if (!item) {
    notFound();
  }

  const relatedServices = services.filter((service) => item.services.includes(service.slug));
  const relatedCases = cases.filter((candidate) => candidate.id !== item.id).slice(0, 3);

  return (
    <>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Главная", path: "" },
          { name: "Портфолио", path: "/portfolio/" },
          { name: item.title, path: `/portfolio/${item.id}/` }
        ])}
      />
      <Header />
      <main className="container-narrow section-space pb-24 md:pb-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-steel/60">Кейс Nikaled</p>
        <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight text-ink md:text-5xl">{item.title}</h1>
        <p className="mt-4 max-w-4xl text-sm leading-6 text-steel/80 md:text-base">{item.summary}</p>
        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
          <article className="space-y-4">
            <section className="card p-4">
              <div className="overflow-hidden rounded-xl border border-steel/10 bg-slate-100 p-2">
                <SmartImage
                  src={item.image}
                  fallbackSrc={media.caseFallback}
                  alt={item.title}
                  width={1280}
                  height={720}
                  sizes="(max-width: 1024px) 100vw, 70vw"
                  className="mx-auto h-auto w-full object-contain"
                />
              </div>
            </section>
            <section className="card">
              <h2 className="text-xl font-bold text-steel">Задача</h2>
              <p className="mt-4 text-sm leading-6 text-steel/80 md:text-base">{item.task}</p>
            </section>
            <section className="card">
              <h2 className="text-xl font-bold text-steel">Что сделали</h2>
              <p className="mt-4 text-sm leading-6 text-steel/80 md:text-base">{item.resultExpanded}</p>
            </section>
            <section className="card bg-white">
              <h2 className="text-xl font-bold text-steel">Что получил клиент</h2>
              <p className="mt-4 text-sm leading-6 text-steel/80 md:text-base">{item.outcome}</p>
            </section>
            <section className="card">
              <h2 className="text-xl font-bold text-steel">Ключевые акценты проекта</h2>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-steel/80 md:text-base">
                {item.highlights.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>
            <section className="card">
              <h2 className="text-xl font-bold text-steel">Для каких задач подходит похожее решение</h2>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-steel/75">
                {item.bestFor.map((tag) => (
                  <span key={tag} className="rounded-full border border-steel/10 px-3 py-2">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
            <section className="card">
              <h2 className="text-xl font-bold text-steel">Другие кейсы</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {relatedCases.map((candidate) => (
                  <Link key={candidate.id} href={`/portfolio/${candidate.id}/`} className="rounded-xl border border-steel/10 px-4 py-4 text-sm text-steel/80 transition hover:border-steel/20">
                    <span className="block font-semibold text-steel">{candidate.title}</span>
                    <span className="mt-2 block">{candidate.summary}</span>
                  </Link>
                ))}
              </div>
            </section>
          </article>
          <aside className="card lg:sticky lg:top-24">
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded bg-sky-100 px-2 py-1 text-steel">Срок: {item.term}</span>
              {item.budget ? <span className="rounded bg-orange-100 px-2 py-1 text-steel">Бюджет: {item.budget}</span> : null}
            </div>
            <h2 className="mt-5 text-lg font-bold text-steel">Связанные услуги</h2>
            <div className="mt-3 flex flex-col gap-2">
              {relatedServices.map((service) => (
                <Link key={service.slug} href={`/${service.slug}/`} className="rounded-lg bg-paper px-3 py-2 text-sm text-steel/85">
                  {service.name}
                </Link>
              ))}
            </div>
            <div className="mt-5 border-t border-steel/10 pt-5">
              <h3 className="text-base font-bold text-steel">Нужен похожий проект?</h3>
              <p className="mt-3 text-sm text-steel/80">
                Отправьте фото фасада или задачу, и мы предложим формат решения, срок и ориентир по бюджету.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Link href="/kontakty/" className="btn-primary">
                  Получить расчёт
                </Link>
                <Link href="/portfolio/" className="btn-secondary">
                  Назад в портфолио
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
