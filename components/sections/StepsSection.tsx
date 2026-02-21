const steps = [
  { title: "Бесплатный замер", risk: "чтобы не было ошибок в размерах" },
  { title: "Расчёт и дизайн", risk: "чтобы вывеска читалась вечером" },
  { title: "Договор", risk: "фиксируем сроки" },
  { title: "Производство", risk: "своё, без посредников" },
  { title: "Монтаж", risk: "без повреждения фасада" },
  { title: "Гарантия 24 месяца", risk: "на материалы и монтаж" }
];

export const StepsSection = () => {
  return (
    <section className="section-space">
      <div className="container-narrow">
        <h2 className="text-2xl font-bold text-steel md:text-3xl">Как работаем</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="card">
              <p className="text-xs font-semibold uppercase tracking-wide text-steel/60">Шаг {index + 1}</p>
              <h3 className="mt-2 text-lg font-bold text-steel">{step.title}</h3>
              <p className="mt-1 text-sm text-steel/80">{step.risk}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
