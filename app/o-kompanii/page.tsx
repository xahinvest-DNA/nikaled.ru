import { Header } from "@/components/layout/Header";
import { SmartImage } from "@/components/ui/SmartImage";
import { media } from "@/content/media";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata(
  "О компании - наружная реклама в Воронеже",
  "Производство наружной рекламы в Воронеже: работаем официально, по договору, с гарантией 24 месяца.",
  "/o-kompanii/"
);

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="container-narrow section-space pb-24 md:pb-16">
        <h1 className="text-3xl font-black text-ink md:text-5xl">О компании</h1>
        <p className="mt-4 max-w-3xl text-sm text-steel/80">
          Мы производим и монтируем наружную рекламу в Воронеже более 8 лет. Берем проект под ключ: от замера и дизайна до монтажа и
          гарантии.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="card">
            <h2 className="text-xl font-bold text-steel">Что важно клиентам</h2>
            <ul className="mt-3 space-y-2 text-sm text-steel/80">
              <li>Работа по договору с фиксированными сроками и стоимостью</li>
              <li>Собственное производство и монтажная команда</li>
              <li>Гарантия 24 месяца на изготовление и монтаж</li>
              <li>Помощь с согласованием вывесок</li>
            </ul>
          </article>
          <div className="relative min-h-72 overflow-hidden rounded-2xl border border-steel/10 bg-white shadow-card">
            <SmartImage src={media.workshop} fallbackSrc={media.caseFallback} alt="Производство наружной рекламы" fill className="object-cover" />
          </div>
        </div>
      </main>
    </>
  );
}

