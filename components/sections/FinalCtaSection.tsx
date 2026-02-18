import { contacts } from "@/content/contacts";
import { LeadForm } from "@/components/forms/LeadForm";

type Props = {
  service?: string;
};

export const FinalCtaSection = ({ service }: Props) => {
  return (
    <section className="section-space bg-steel text-white">
      <div className="container-narrow grid gap-6 md:grid-cols-[1fr_0.9fr]">
        <div>
          <h2 className="text-3xl font-black leading-tight md:text-4xl">Нужна наружная реклама в ближайшее время?</h2>
          <p className="mt-3 max-w-xl text-sm text-white/85">
            Оставьте заявку - подготовим расчет сегодня и предложим оптимальное решение под ваш бюджет.
          </p>
          <a href={`tel:${contacts.phoneRaw}`} className="mt-5 inline-block text-3xl font-black text-white">
            {contacts.phoneDisplay}
          </a>
        </div>
        <LeadForm title="Финальный расчет за 1 шаг" buttonText="Получить расчет" service={service} compact />
      </div>
    </section>
  );
};

