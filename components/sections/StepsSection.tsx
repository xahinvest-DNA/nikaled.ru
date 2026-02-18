const steps = ["Бесплатный замер", "Расчет и дизайн", "Договор", "Производство", "Монтаж", "Гарантия"];

export const StepsSection = () => {
  return (
    <section className="section-space">
      <div className="container-narrow">
        <h2 className="text-2xl font-bold text-steel md:text-3xl">Как работаем</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step} className="card">
              <p className="text-xs font-semibold uppercase tracking-wide text-steel/60">Шаг {index + 1}</p>
              <h3 className="mt-2 text-lg font-bold text-steel">{step}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

