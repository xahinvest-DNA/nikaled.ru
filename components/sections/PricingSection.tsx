import { LeadForm } from "@/components/forms/LeadForm";

const rows = [
  { name: "Объёмные буквы", price: "от 12 000 ₽" },
  { name: "Световая вывеска", price: "от 10 000 ₽" },
  { name: "Лайтбокс", price: "от 5 000 ₽" }
];

type Props = {
  service?: string;
};

export const PricingSection = ({ service }: Props) => {
  return (
    <section className="section-space bg-white">
      <div className="container-narrow grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="card">
          <h2 className="text-2xl font-bold text-steel md:text-3xl">Сколько стоит</h2>
          <p className="mt-3 text-sm text-steel/80">
            Точная стоимость зависит от размеров, материалов, подсветки и сложности монтажа.
          </p>
          <div className="mt-5 space-y-2">
            {rows.map((row) => (
              <div key={row.name} className="flex items-center justify-between rounded-lg border border-steel/10 px-3 py-2">
                <span className="text-sm text-steel">{row.name}</span>
                <span className="text-sm font-bold text-steel">{row.price}</span>
              </div>
            ))}
          </div>
        </div>
        <LeadForm title="Оставить заявку" buttonText="Получить расчёт сегодня" service={service} compact />
      </div>
    </section>
  );
};
