import { OpenCalcButton } from "@/components/ui/OpenCalcButton";

const items = [
  "Открываете новый магазин или салон",
  "Обновляете старую вывеску",
  "Хотите выделиться среди конкурентов",
  "Нужно согласование с администрацией"
];

export const SelfIdentify = () => {
  return (
    <section className="section-space">
      <div className="container-narrow card">
        <h2 className="text-2xl font-bold text-steel md:text-3xl">Вы обратились по адресу, если вам нужно:</h2>
        <ul className="mt-5 grid gap-3 text-steel/85 md:grid-cols-2">
          {items.map((item) => (
            <li key={item} className="rounded-xl border border-steel/10 bg-paper px-4 py-3 text-sm">
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <OpenCalcButton text="Получить расчет" />
        </div>
      </div>
    </section>
  );
};

