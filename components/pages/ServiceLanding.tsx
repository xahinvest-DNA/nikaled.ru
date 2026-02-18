import { getCasesByService } from "@/content/cases";
import { faqItems } from "@/content/faq";
import type { Service } from "@/content/services";
import { Header } from "@/components/layout/Header";
import { LeadForm } from "@/components/forms/LeadForm";
import { CasesSection } from "@/components/sections/CasesSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { ServicePricing } from "@/components/sections/ServicePricing";
import { StepsSection } from "@/components/sections/StepsSection";

export const ServiceLanding = ({ service }: { service: Service }) => {
  return (
    <>
      <Header />
      <main className="pb-24 md:pb-0">
        <ServiceHero service={service} />
        <section className="section-space">
          <div className="container-narrow">
            <LeadForm title="Быстрый расчет по услуге" buttonText="Получить расчет" service={service.name} compact />
          </div>
        </section>
        <CasesSection title={`Примеры работ: ${service.name}`} items={getCasesByService(service.slug, 6)} />
        <ServicePricing service={service} />
        <section className="section-space">
          <div className="container-narrow">
            <LeadForm
              title="Пришлите размеры/фото - посчитаем"
              buttonText="Рассчитать по параметрам"
              service={service.name}
              compact
            />
          </div>
        </section>
        <StepsSection />
        <FaqSection items={faqItems} />
        <FinalCtaSection service={service.name} />
      </main>
    </>
  );
};

