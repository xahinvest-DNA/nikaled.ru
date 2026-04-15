import { LeadForm } from "@/components/forms/LeadForm";
import { Header } from "@/components/layout/Header";
import { StructuredData } from "@/components/seo/StructuredData";
import { MessengerButtons } from "@/components/ui/MessengerButtons";
import { contacts } from "@/content/contacts";
import { buildPageMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

export const metadata = buildPageMetadata(
  "Контакты - наружная реклама в Воронеже",
  "Свяжитесь с нами для расчета наружной рекламы: телефон, мессенджеры, адрес производства в Воронеже.",
  "/kontakty/"
);

const requestChecklist = [
  "Фото фасада или входной группы",
  "Примерные размеры или хотя бы ориентир по ширине",
  "Что хотите сделать: вывеска, буквы, лайтбокс, согласование",
  "Когда нужен запуск: срочно, к открытию, без жесткого дедлайна"
];

export default function ContactsPage() {
  return (
    <>
      <StructuredData data={buildBreadcrumbSchema([{ name: "Главная", path: "" }, { name: "Контакты", path: "/kontakty/" }])} />
      <Header />
      <main className="container-narrow section-space grid gap-6 pb-24 md:grid-cols-[1fr_0.9fr] md:pb-16">
        <section className="card">
          <h1 className="text-3xl font-black text-ink md:text-4xl">Контакты</h1>
          <p className="mt-4 text-sm leading-6 text-steel/80">
            Если вам нужен расчёт вывески, наружной рекламы или помощь с согласованием в Воронеже, напишите или позвоните. Чем
            больше исходных данных вы отправите сразу, тем точнее и быстрее будет смета.
          </p>
          <p className="mt-4 text-sm text-steel/80">Город: {contacts.city}</p>
          <p className="mt-1 text-sm text-steel/80">Адрес: {contacts.address}</p>
          <p className="mt-1 text-sm text-steel/80">Режим работы: {contacts.workHours}</p>
          <a href={`tel:${contacts.phoneRaw}`} className="mt-5 block text-3xl font-black text-steel">
            {contacts.phoneDisplay}
          </a>
          <div className="mt-5">
            <MessengerButtons />
          </div>
          <div className="mt-6 rounded-2xl bg-paper p-4">
            <h2 className="text-base font-bold text-steel">Что лучше отправить сразу</h2>
            <ul className="mt-3 space-y-2 text-sm text-steel/80">
              {requestChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
        <LeadForm title="Оставьте заявку" buttonText="Получить расчёт и понять бюджет" compact />
      </main>
    </>
  );
}