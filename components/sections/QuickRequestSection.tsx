import { OpenCalcButton } from "@/components/ui/OpenCalcButton";

const checklist = [
  "Фото фасада или входной группы целиком",
  "Примерные размеры или хотя бы ориентир по ширине",
  "Что нужно сделать: вывеска, фасад, входная группа или согласование",
  "Срок запуска: срочно, к открытию или без жёсткого дедлайна"
];

export const QuickRequestSection = () => {
  return (
    <section className="section-space">
      <div className="container-narrow card">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <h2 className="text-2xl font-bold text-steel md:text-3xl">Что лучше прислать, чтобы быстрее получить точный расчёт</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-steel/80">
              Не нужно готовить идеальное техническое задание. Достаточно 3-4 понятных вводных, чтобы мы предложили адекватный формат,
              ориентир по бюджету и следующий шаг без длинной переписки. Это одинаково работает и для вывесок, и для входных групп,
              и для локальной отделки фасада.
            </p>
            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {checklist.map((item) => (
                <li key={item} className="rounded-xl border border-steel/10 bg-paper px-4 py-4 text-sm text-steel/80">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-steel/10 bg-paper p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-steel/60">На выходе</p>
            <p className="mt-3 text-sm leading-6 text-steel/80">
              Вы быстро понимаете, какой формат подходит объекту, достаточно ли локальной отделки, нужен ли выезд на замер и какой
              бюджет стоит закладывать уже на старте.
            </p>
            <div className="mt-5">
              <OpenCalcButton text="Получить расчёт по фото" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
