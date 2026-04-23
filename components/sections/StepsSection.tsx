const steps = [
  { title: "Смотрим объект", risk: "По фото или после выезда на место" },
  { title: "Считаем цену", risk: "Чтобы вы сразу понимали бюджет" },
  { title: "Показываем, как это будет выглядеть", risk: "Без сюрпризов после изготовления" },
  { title: "Делаем вывеску", risk: "На своём производстве" },
  { title: "Монтируем", risk: "Аккуратно и в согласованный день" },
  { title: "Остаёмся на связи", risk: "Гарантия 24 месяца" }
];

export const StepsSection = () => {
  return (
    <section className="section-space">
      <div className="container-narrow">
        <h2 className="text-2xl font-bold text-steel md:text-3xl">Как всё проходит</h2>
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
