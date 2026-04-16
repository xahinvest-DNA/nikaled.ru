import { ServiceLanding } from "@/components/pages/ServiceLanding";
import { servicesMap } from "@/content/services";
import { buildPageMetadata } from "@/lib/seo";

const service = servicesMap["otdelka-fasadov"];

export const metadata = buildPageMetadata(service.seoTitle, service.seoDescription, "/otdelka-fasadov/");

export default function OtdelkaFasadovPage() {
  return <ServiceLanding service={service} />;
}
