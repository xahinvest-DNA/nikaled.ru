import { ServiceLanding } from "@/components/pages/ServiceLanding";
import { servicesMap } from "@/content/services";
import { buildPageMetadata } from "@/lib/seo";

const service = servicesMap["obemnye-bukvy"];

export const metadata = buildPageMetadata(service.seoTitle, service.seoDescription, "/obemnye-bukvy/");

export default function ObemnyeBukvyPage() {
  return <ServiceLanding service={service} />;
}

