import { FacadeLanding } from "@/components/pages/FacadeLanding";
import { servicesMap } from "@/content/services";
import { buildPageMetadata } from "@/lib/seo";

const service = servicesMap["otdelka-fasadov"];

export const metadata = buildPageMetadata(service.seoTitle, service.seoDescription, "/otdelka-fasadov/");

export default function OtdelkaFasadovPage() {
  return <FacadeLanding service={service} />;
}
