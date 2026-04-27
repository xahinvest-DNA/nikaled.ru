import Image from "next/image";
import Link from "next/link";

import { OpenCalcButton } from "@/components/ui/OpenCalcButton";

const items = [
  {
    title: "Открываете магазин, салон или новую точку",
    text: "Нужно успеть к открытию и спокойно запустить точку.",
    href: "/vyveski-voronezh/",
    action: "Перейти к вывескам",
    image: "/images/self-identify/new-store-sign.png",
    alt: "Новая вывеска на аккуратном фасаде перед открытием магазина"
  },
  {
    title: "Меняете старую вывеску на более заметную",
    text: "Хотите, чтобы фасад выглядел аккуратнее и заметнее.",
    href: "/obemnye-bukvy/",
    action: "Смотреть объёмные буквы",
    image: "/images/self-identify/noticeable-sign.png",
    alt: "Современная объёмная вывеска на фасаде магазина"
  },
  {
    title: "Хотите заранее понять бюджет",
    text: "Нужно быстро понять цену, не влезая в долгие переписки.",
    href: "/laitboksy/",
    action: "Посмотреть варианты",
    image: "/images/self-identify/budget-estimate.png",
    alt: "Материалы и пример расчёта вывески на рабочем столе"
  },
  {
    title: "Нужно пройти согласование без переделок",
    text: "Лучше сразу разобраться с документами, чем потом всё переделывать.",
    href: "/soglasovanie-vyvesok/",
    action: "Перейти к согласованию",
    image: "/images/self-identify/approval-docs.png",
    alt: "План фасада и документы для согласования вывески"
  }
];

export const SelfIdentify = () => {
  return (
    <section className="section-space">
      <div className="container-narrow card">
        <h2 className="text-2xl font-bold text-steel md:text-3xl">Что вам нужно сейчас</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-steel/80">
          Не нужно просматривать весь сайт. Выберите задачу, которая больше похожа на вашу, и сразу переходите в нужный раздел.
        </p>
        <ul className="mt-5 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <li key={item.title} className="h-full">
              <Link
                href={item.href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-steel/10 bg-paper transition duration-200 hover:-translate-y-0.5 hover:border-steel/20 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-steel/5">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col px-4 py-4">
                  <p className="text-sm font-semibold text-steel md:text-base">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-steel/75">{item.text}</p>
                  <span className="btn-secondary mt-4 self-start transition group-hover:border-steel/35">{item.action}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <OpenCalcButton text="Получить расчёт" analyticsSource="self_identify" />
          <Link href="/portfolio/" className="btn-secondary">
            Посмотреть наши работы
          </Link>
        </div>
      </div>
    </section>
  );
};
