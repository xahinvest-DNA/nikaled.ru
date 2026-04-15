import { Header } from "@/components/layout/Header";
import { SmartImage } from "@/components/ui/SmartImage";
import { media } from "@/content/media";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata(
  "О компании - наружная реклама в Воронеже",
  "Производство наружной рекламы в Воронеже: работаем официально, по договору, с гарантией 24 месяца.",
  "/o-kompanii/"
);

const facts = [
  "Работаем по договору с фиксированными сроками и стоимостью",
  "Собственное производство и монтажная команда без посредников",
  "Гарантия 24 месяца на изготовление и монтаж",
  "Помощь с согласованием вывесок и размещением на фасаде"
];

const process = [
  "Проверяем задачу и фасад до запуска производства, чтобы не было ошибок по размерам и креплениям.",
  "Подбираем формат конструкции под поток, расстояние обзора, бюджет и требования по размещению.",
  "Собираем проект под ключ: от замера и дизайна до монтажа и передачи готового результата."
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="container-narrow section-space pb-24 md:pb-16">
        <h1 className="text-3xl font-black text-ink md:text-5xl">О компании</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-steel/80">
          Nikaled занимается наружной рекламой в Воронеже более 8 лет. Мы делаем вывески, объёмные буквы, лайтбоксы и оформление
          входных групп для магазинов, салонов, кафе, офисов и коммерческих помещений. Главный принцип в работе - не просто
          изготовить конструкцию, а помочь бизнесу запуститься в срок и без переделок.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="card">
            <h2 className="text-xl font-bold text-steel">Почему с нами проще запускаться</h2>
            <ul className="mt-3 space-y-2 text-sm text-steel/80">
              {facts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <div className="relative min-h-72 overflow-hidden rounded-2xl border border-steel/10 bg-white shadow-card">
            <SmartImage src={media.workshop} fallbackSrc={media.caseFallback} alt="Производство наружной рекламы" fill className="object-cover" />
          </div>
        </div>
        <section className="mt-8 card">
          <h2 className="text-xl font-bold text-steel">Как мы ведем проект</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {process.map((item) => (
              <article key={item} className="rounded-xl border border-steel/10 bg-paper px-4 py-4 text-sm text-steel/80">
                {item}
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}