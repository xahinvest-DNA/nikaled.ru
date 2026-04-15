import { Header } from "@/components/layout/Header";
import { ArticleListSection } from "@/components/sections/ArticleListSection";
import { CasesSection } from "@/components/sections/CasesSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { Hero } from "@/components/sections/Hero";
import { PricingSection } from "@/components/sections/PricingSection";
import { SelfIdentify } from "@/components/sections/SelfIdentify";
import { SeoContentSection } from "@/components/sections/SeoContentSection";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { SolutionsEntrySection } from "@/components/sections/SolutionsEntrySection";
import { StepsSection } from "@/components/sections/StepsSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { getCasesByService } from "@/content/cases";
import { faqItems } from "@/content/faq";

export const HomeLanding = () => {
  return (
    <>
      <Header />
      <main className="pb-24 md:pb-0">
        <Hero />
        <SelfIdentify />
        <ServicesGrid />
        <SolutionsEntrySection />
        <SeoContentSection />
        <CasesSection items={getCasesByService(undefined, 4)} />
        <PricingSection />
        <StepsSection />
        <ArticleListSection />
        <FaqSection items={faqItems} />
        <TrustSection />
        <FinalCtaSection />
      </main>
    </>
  );
};