import Link from "next/link";

export const FacadeEntrySection = () => {
  return (
    <section className="section-space bg-white">
      <div className="container-narrow rounded-[32px] border border-steel/10 bg-[linear-gradient(135deg,#f8fafc_0%,#eef6ff_45%,#ffffff_100%)] p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel/55">Новое направление</p>
            <h2 className="mt-3 max-w-3xl text-2xl font-black leading-tight text-ink md:text-4xl">
              Отделка фасадов для офисов, входных групп, частных домов и небольших зданий до 1000 м²
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-steel/80 md:text-base">
              Если объекту уже мало одной вывески и внешний вид фасада тянет впечатление вниз, берём в работу локальную облицовку,
              фризы, входные группы и фасадные элементы. Это не тяжёлая большая стройка, а управляемые фасадные работы под ключ
              для небольших и средних объектов.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold text-steel/85">
              {[
                "Опыт более 7 лет",
                "Объекты до 1000 м²",
                "Офисы, дома, входные группы",
                "Фасад + вывеска в одной логике"
              ].map((item) => (
                <span key={item} className="rounded-full border border-steel/15 bg-white px-3 py-2">
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/otdelka-fasadov/" className="btn-primary">
                Открыть направление
              </Link>
              <Link href="/resheniya/otdelka-fasada-ofisa-i-nebolshogo-zdaniya-v-voronezhe/" className="btn-secondary">
                Посмотреть решение
              </Link>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <article className="rounded-2xl border border-steel/10 bg-white px-5 py-5">
              <h3 className="text-lg font-bold text-steel">Когда это особенно актуально</h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-steel/80">
                <li>Нужно обновить входную группу перед открытием или ребрендингом</li>
                <li>Фасад выглядит уставшим и новая вывеска не решает задачу целиком</li>
                <li>Нужен собранный внешний вид офиса, медцентра или небольшого коммерческого объекта</li>
              </ul>
            </article>
            <article className="rounded-2xl border border-steel/10 bg-paper px-5 py-5">
              <h3 className="text-lg font-bold text-steel">С чего начать</h3>
              <p className="mt-4 text-sm leading-6 text-steel/80">
                Достаточно прислать фото фасада или входной группы, примерные размеры и коротко описать задачу. Мы скажем, где
                достаточно локальной отделки, а где лучше собирать фасад и навигацию как единый проект.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
};
