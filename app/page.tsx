import { HomeLanding } from "@/components/pages/HomeLanding";
import { StructuredData } from "@/components/seo/StructuredData";
import { faqItems } from "@/content/faq";
import { buildFaqSchema } from "@/lib/structured-data";

export default function HomePage() {
  return (
    <>
      <StructuredData data={buildFaqSchema(faqItems)} />
      <HomeLanding />
    </>
  );
}