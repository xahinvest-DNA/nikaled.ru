import Link from "next/link";

const deliverables = [
  "Выезд на замер и проверка фасада",
  "Дизайн вывески",
  "Подбор материалов и подсветки",
  "Изготовление на собственном производстве",
  "Монтаж и помощь с документами"
];

const businessTypes = [
  "Магазины",
  "Салоны красоты",
  "Кафе и пекарни",
  "Медицинские центры",
  "Офисы",
  "Небольшие коммерческие здания",
  "Частные дома"
];

const risks = [
  "Помогаем избежать переделок после монтажа.",
  "Подсказываем, какой размер и подсветка подойдут лучше.",
  "Если нужно, можем заняться не только вывеской, но и входной группой или фасадом."
];

export const SeoContentSection = () => {
  return (
    <section className="section-space bg-white">
      <div className="container-narrow">
        <h2 className="max-w-4xl text-2xl font-bold text-steel md:text-3xl">
          Вывески и отделка фасадов в Воронеже
        </h2>
        <p className="mt-4 max-w-4xl text-sm leading-6 text-steel/80 md:text-base">
          Делаем вывески, объёмные буквы, лайтбоксы и помогаем с отделкой фасадов. Можно обратиться к нам, если вы открываете новую
          точку, меняете старую вывеску или хотите привести в порядок входную группу и фасад.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="card border border-steel/10">
            <h3 className="text-lg font-bold text-steel">Что входит под ключ</h3>
            <ul className="mt-4 space-y-2 text-sm text-steel/80">
              {deliverables.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="card border border-steel/10">
            <h3 className="text-lg font-bold text-steel">С кем чаще всего работаем</h3>
            <ul className="mt-4 grid gap-2 text-sm text-steel/80 sm:grid-cols-2 md:grid-cols-1">
              {businessTypes.map((item) => (
                <li key={item} className="rounded-lg bg-paper px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="card border border-steel/10">
            <h3 className="text-lg font-bold text-steel">Что вы получаете</h3>
            <ul className="mt-4 space-y-2 text-sm text-steel/80">
              {risks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
        <div className="mt-6 rounded-2xl border border-steel/10 bg-paper p-6">
          <p className="text-sm text-steel/85">
            Если уже примерно понимаете, что вам нужно, можно сразу перейти в нужный раздел:
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/vyveski-voronezh/" className="btn-secondary px-4 py-2">
              Вывески в Воронеже
            </Link>
            <Link href="/obemnye-bukvy/" className="btn-secondary px-4 py-2">
              Объёмные буквы
            </Link>
            <Link href="/laitboksy/" className="btn-secondary px-4 py-2">
              Лайтбоксы
            </Link>
            <Link href="/soglasovanie-vyvesok/" className="btn-secondary px-4 py-2">
              Согласование вывесок
            </Link>
            <Link href="/otdelka-fasadov/" className="btn-secondary px-4 py-2">
              Отделка фасадов
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
