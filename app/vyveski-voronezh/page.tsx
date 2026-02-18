import { ServiceLanding } from "@/components/pages/ServiceLanding";
import { servicesMap } from "@/content/services";
import { buildPageMetadata } from "@/lib/seo";

const service = servicesMap["vyveski-voronezh"];

export const metadata = buildPageMetadata(service.seoTitle, service.seoDescription, "/vyveski-voronezh/");

export default function VyveskiPage() {
  return <ServiceLanding service={service} />;
}

