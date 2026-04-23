import Link from "next/link";

import { LeadForm } from "@/components/forms/LeadForm";
import { Header } from "@/components/layout/Header";
import { StructuredData } from "@/components/seo/StructuredData";
import { FacadeConceptsSection } from "@/components/sections/FacadeConceptsSection";
import { FacadeProjectsSection } from "@/components/sections/FacadeProjectsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { ServiceDetailsSection } from "@/components/sections/ServiceDetailsSection";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { ServicePricing } from "@/components/sections/ServicePricing";
import { StepsSection } from "@/components/sections/StepsSection";
import { articles } from "@/content/articles";
import { faqItems } from "@/content/faq";
import { solutionPages } from "@/content/solutions";
import type { Service } from "@/content/services";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema } from "@/lib/structured-data";

const relatedArticleSlugs = [
  "kogda-nuzhna-ne-tolko-vyveska-no-i-otdelka-fasada",
  "chem-otdelat-fasad-nebolshogo-kommercheskogo-zdaniya",
  "kogda-obnovlyat-vhodnuyu-gruppu-vmeste-s-vyveskoy",
  "skolko-stoit-otdelka-fasada-nebolshogo-zdaniya-v-voronezhe",
  "kak-oformit-fasad-magazina-chtoby-vyveska-rabotala-silnee"
];

const relatedSolutionSlugs = [
  "otdelka-fasada-ofisa-i-nebolshogo-zdaniya-v-voronezhe",
  "oformlenie-vhodnoy-gruppy-ofisa-i-medcentra-v-voronezhe",
  "otdelka-fasada-chastnogo-doma-v-voronezhe",
  "oformlenie-fasada-magazina-i-kommercheskogo-pomeshcheniya-v-voronezhe"
];

export const FacadeLanding = ({ service }: { service: Service }) => {
  const relevantFaqItems = faqItems.filter((item) => !item.serviceSpecific || item.serviceSpecific.includes(service.slug));
  const servicePath = `/${service.slug}/`;
  const relatedArticles = articles.filter((item) => relatedArticleSlugs.includes(item.slug));
  const relatedSolutions = solutionPages.filter((item) => relatedSolutionSlugs.includes(item.slug));

  return (
    <>
      <StructuredData data={buildBreadcrumbSchema([{ name: "Главная", path: "" }, { name: service.name, path: servicePath }])} />
      <StructuredData data={buildFaqSchema(relevantFaqItems)} />
      <StructuredData data={buildServiceSchema(service, servicePath)} />
      <Header />
      <main className="pb-24 md:pb-0">
        <ServiceHero service={service} />
        <section className="section-space">
          <div className="container-narrow">
            <div className="rounded-2xl border border-steel/10 bg-paper p-6 text-sm leading-6 text-steel/85 md:text-base">
              <p>
                Здесь собрали именно фасадные работы: входные группы, облицовку и обновление фасадов. Без вывесок вперемешку, чтобы
                было проще понять, что мы можем сделать именно по фасаду.
              </p>
            </div>
            <div className="mt-6">
              <LeadForm title="Узнайте цену по фасадным работам" buttonText="Узнать цену" service={service.name} compact />
            </div>
          </div>
        </section>
        <ServiceDetailsSection service={service} />
        <FacadeProjectsSection />
        <FacadeConceptsSection />
        <section className="section-space bg-white">
          <div className="container-narrow grid gap-4 md:grid-cols-2">
            <article className="card">
              <h2 className="text-2xl font-bold text-steel">Готовые решения</h2>
              <div className="mt-5 space-y-3">
                {relatedSolutions.map((item) => (
                  <Link key={item.slug} href={`/resheniya/${item.slug}/`} className="block rounded-xl border border-steel/10 px-4 py-4 text-sm text-steel/85 transition hover:border-steel/20">
                    <span className="block font-semibold text-steel">{item.title}</span>
                    <span className="mt-2 block">{item.description}</span>
                  </Link>
                ))}
              </div>
            </article>
            <article className="card">
              <h2 className="text-2xl font-bold text-steel">Полезные материалы</h2>
              <div className="mt-5 space-y-3">
                {relatedArticles.map((item) => (
                  <Link key={item.slug} href={`/blog/${item.slug}/`} className="block rounded-xl border border-steel/10 px-4 py-4 text-sm text-steel/85 transition hover:border-steel/20">
                    <span className="block font-semibold text-steel">{item.title}</span>
                    <span className="mt-2 block">{item.description}</span>
                  </Link>
                ))}
              </div>
            </article>
          </div>
        </section>
        <ServicePricing service={service} />
        <section className="section-space">
          <div className="container-narrow">
            <LeadForm
              title="Пришлите фото фасада или входной группы"
              buttonText="Получить расчёт"
              service={service.name}
              compact
            />
          </div>
        </section>
        <StepsSection />
        <FaqSection items={relevantFaqItems} />
        <FinalCtaSection service={service.name} />
      </main>
    </>
  );
};
