import { ServiceLanding } from "@/components/pages/ServiceLanding";
import { servicesMap } from "@/content/services";
import { buildPageMetadata } from "@/lib/seo";

const service = servicesMap["soglasovanie-vyvesok"];

export const metadata = buildPageMetadata(service.seoTitle, service.seoDescription, "/soglasovanie-vyvesok/");

export default function SoglasovaniePage() {
  return <ServiceLanding service={service} />;
}

