import Link from "next/link";

import { OpenCalcButton } from "@/components/ui/OpenCalcButton";

const items = [
  {
    title: "Открываете магазин, салон или новую точку",
    text: "Нужно успеть к открытию и спокойно запустить точку.",
    href: "/vyveski-voronezh/",
    action: "Перейти к вывескам"
  },
  {
    title: "Меняете старую вывеску на более заметную",
    text: "Хотите, чтобы фасад выглядел аккуратнее и заметнее.",
    href: "/obemnye-bukvy/",
    action: "Смотреть объёмные буквы"
  },
  {
    title: "Хотите заранее понять бюджет",
    text: "Нужно быстро понять цену, не влезая в долгие переписки.",
    href: "/laitboksy/",
    action: "Посмотреть варианты"
  },
  {
    title: "Нужно пройти согласование без переделок",
    text: "Лучше сразу разобраться с документами, чем потом всё переделывать.",
    href: "/soglasovanie-vyvesok/",
    action: "Перейти к согласованию"
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
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <li key={item.title} className="rounded-xl border border-steel/10 bg-paper px-4 py-4">
              <p className="text-sm font-semibold text-steel">{item.title}</p>
              <p className="mt-2 text-sm text-steel/75">{item.text}</p>
              <Link href={item.href} className="btn-secondary mt-4">
                {item.action}
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
