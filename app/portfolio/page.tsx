import Image from "next/image";

import { Header } from "@/components/layout/Header";
import { cases } from "@/content/cases";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata(
  "Портфолио наружной рекламы в Воронеже",
  "Примеры выполненных работ: вывески, объемные буквы, лайтбоксы и оформление входных групп.",
  "/portfolio/"
);

export default function PortfolioPage() {
  return (
    <>
      <Header />
      <main className="container-narrow section-space pb-24 md:pb-16">
        <h1 className="text-3xl font-black text-ink md:text-5xl">Портфолио</h1>
        <p className="mt-3 text-sm text-steel/80">Реальные кейсы с задачей, сроками и бюджетом.</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {cases.map((item) => (
            <article key={item.id} className="card">
              <div className="relative h-56 overflow-hidden rounded-xl border border-steel/10">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-steel">{item.title}</h2>
              <p className="mt-1 text-sm text-steel/80">{item.task}</p>
              <p className="mt-1 text-sm text-steel/80">
                Срок: <strong>{item.term}</strong>, бюджет: <strong>{item.budget}</strong>
              </p>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}

