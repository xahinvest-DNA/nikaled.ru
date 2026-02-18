import { getCasesByService } from "@/content/cases";
import { faqItems } from "@/content/faq";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { SelfIdentify } from "@/components/sections/SelfIdentify";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { CasesSection } from "@/components/sections/CasesSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { StepsSection } from "@/components/sections/StepsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";

export const HomeLanding = () => {
  return (
    <>
      <Header />
      <main className="pb-24 md:pb-0">
        <Hero />
        <SelfIdentify />
        <ServicesGrid />
        <CasesSection items={getCasesByService(undefined, 4)} />
        <PricingSection />
        <StepsSection />
        <FaqSection items={faqItems} />
        <TrustSection />
        <FinalCtaSection />
      </main>
    </>
  );
};

