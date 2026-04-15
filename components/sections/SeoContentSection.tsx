import Link from "next/link";

const deliverables = [
  "Выезд на замер и проверка фасада до производства",
  "Дизайн под читаемость днём и вечером",
  "Подбор материалов и подсветки под бюджет",
  "Изготовление на собственном производстве",
  "Монтаж и помощь с документами при необходимости"
];

const businessTypes = ["Магазины", "Салоны красоты", "Кафе и пекарни", "Медицинские центры", "Офисы", "Торговые помещения"];

const risks = [
  "Сразу закладываем требования по согласованию, чтобы не переделывать вывеску после монтажа.",
  "Подбираем размеры, шрифт и подсветку так, чтобы вывеска читалась с потока и не терялась вечером.",
  "Фиксируем сроки и бюджет в договоре, чтобы открытие не сдвигалось из-за подрядчика."
];

export const SeoContentSection = () => {
  return (
    <section className="section-space bg-white">
      <div className="container-narrow">
        <h2 className="max-w-4xl text-2xl font-bold text-steel md:text-3xl">
          Наружная реклама в Воронеже под задачи бизнеса: открытие, ребрендинг, замена вывески и согласование
        </h2>
        <p className="mt-4 max-w-4xl text-sm leading-6 text-steel/80 md:text-base">
          Nikaled помогает бизнесу в Воронеже запустить вывеску без хаоса и переделок. Мы не просто изготавливаем конструкцию,
          а собираем весь цикл под ключ: выезжаем на замер, подготавливаем дизайн, рассчитываем смету, производим, монтируем и,
          если нужно, помогаем с согласованием вывески. Такой подход снижает риск сорванного открытия и делает наружную рекламу
          рабочим инструментом, а не формальной табличкой на фасаде.
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
            <h3 className="text-lg font-bold text-steel">Почему это повышает конверсию</h3>
            <ul className="mt-4 space-y-2 text-sm text-steel/80">
              {risks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        </div>
        <div className="mt-6 rounded-2xl border border-steel/10 bg-paper p-6">
          <p className="text-sm text-steel/85">
            Для коммерческих запросов и быстрого выбора мы вынесли отдельные посадочные по ключевым услугам. Если вы уже понимаете,
            какая конструкция нужна, переходите сразу в нужный раздел:
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
          </div>
        </div>
      </div>
    </section>
  );
};