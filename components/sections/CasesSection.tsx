import Image from "next/image";

import { type CaseItem } from "@/content/cases";
import { OpenCalcButton } from "@/components/ui/OpenCalcButton";

type Props = {
  title?: string;
  items: CaseItem[];
};

export const CasesSection = ({ title = "Кейсы с цифрами", items }: Props) => {
  return (
    <section className="section-space">
      <div className="container-narrow">
        <h2 className="text-2xl font-bold text-steel md:text-3xl">{title}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="card">
              <div className="relative h-52 overflow-hidden rounded-xl border border-steel/10">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-steel">{item.title}</h3>
              <p className="mt-1 text-sm text-steel/80">
                <span className="font-semibold">Задача:</span> {item.task}
              </p>
              <p className="mt-1 text-sm text-steel/80">
                <span className="font-semibold">Решение:</span> {item.result}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded bg-sky-100 px-2 py-1 text-steel">Срок: {item.term}</span>
                <span className="rounded bg-orange-100 px-2 py-1 text-steel">Бюджет: {item.budget}</span>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-6">
          <OpenCalcButton text="Рассчитать стоимость" />
        </div>
      </div>
    </section>
  );
};

