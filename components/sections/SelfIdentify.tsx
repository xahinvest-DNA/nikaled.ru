import { OpenCalcButton } from "@/components/ui/OpenCalcButton";

const items = [
  {
    title: "Открываете магазин, салон или новую точку",
    text: "Нужна вывеска к старту продаж без задержек по монтажу и документам."
  },
  {
    title: "Меняете старую вывеску на более заметную",
    text: "Нужно обновить фасад так, чтобы вывеска стала заметнее и не выглядела дешево."
  },
  {
    title: "Хотите заранее понять бюджет",
    text: "Важно быстро получить расчёт и не уйти в бесконечные пересогласования с подрядчиком."
  },
  {
    title: "Нужно пройти согласование без переделок",
    text: "Закладываем требования по размещению ещё до производства и монтажа."
  }
];

export const SelfIdentify = () => {
  return (
    <section className="section-space">
      <div className="container-narrow card">
        <h2 className="text-2xl font-bold text-steel md:text-3xl">Сайт будет полезен, если вам нужен подрядчик, а не просто производство</h2>
        <p className="mt-3 max-w-3xl text-sm text-steel/80">
          Мы берем проект на себя целиком и помогаем пройти путь от идеи до работающей вывески без срывов, ошибок в размерах и
          неприятных сюрпризов после монтажа.
        </p>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <li key={item.title} className="rounded-xl border border-steel/10 bg-paper px-4 py-4">
              <p className="text-sm font-semibold text-steel">{item.title}</p>
              <p className="mt-2 text-sm text-steel/75">{item.text}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <OpenCalcButton text="Получить расчёт сегодня" />
        </div>
      </div>
    </section>
  );
};