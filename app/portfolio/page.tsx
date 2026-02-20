import { Header } from "@/components/layout/Header";
import { SmartImage } from "@/components/ui/SmartImage";
import { cases } from "@/content/cases";
import { media } from "@/content/media";
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
              <div className="overflow-hidden rounded-xl border border-steel/10 bg-slate-100 p-2">
                <SmartImage
                  src={item.image}
                  fallbackSrc={media.caseFallback}
                  alt={item.title}
                  width={1280}
                  height={720}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="mx-auto h-56 w-full object-contain"
                />
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
