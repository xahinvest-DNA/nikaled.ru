import { LeadForm } from "@/components/forms/LeadForm";
import { Header } from "@/components/layout/Header";
import { StructuredData } from "@/components/seo/StructuredData";
import { CasesSection } from "@/components/sections/CasesSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { ServiceDetailsSection } from "@/components/sections/ServiceDetailsSection";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { ServicePricing } from "@/components/sections/ServicePricing";
import { StepsSection } from "@/components/sections/StepsSection";
import { getCasesByService } from "@/content/cases";
import { faqItems } from "@/content/faq";
import type { Service } from "@/content/services";
import { buildBreadcrumbSchema, buildFaqSchema, buildServiceSchema } from "@/lib/structured-data";

export const ServiceLanding = ({ service }: { service: Service }) => {
  const relevantFaqItems = faqItems.filter((item) => !item.serviceSpecific || item.serviceSpecific.includes(service.slug));
  const servicePath = `/${service.slug}/`;

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
            <LeadForm title="Быстрый расчёт по услуге" buttonText="Получить расчёт сегодня" service={service.name} compact />
          </div>
        </section>
        <ServiceDetailsSection service={service} />
        <CasesSection title={`Примеры работ: ${service.name}`} items={getCasesByService(service.slug, 6)} />
        <ServicePricing service={service} />
        <section className="section-space">
          <div className="container-narrow">
            <LeadForm
              title="Пришлите размеры или фото объекта"
              buttonText="Получить расчёт и понять бюджет"
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