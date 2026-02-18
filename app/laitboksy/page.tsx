import { ServiceLanding } from "@/components/pages/ServiceLanding";
import { servicesMap } from "@/content/services";
import { buildPageMetadata } from "@/lib/seo";

const service = servicesMap["laitboksy"];

export const metadata = buildPageMetadata(service.seoTitle, service.seoDescription, "/laitboksy/");

export default function LaitboksyPage() {
  return <ServiceLanding service={service} />;
}

