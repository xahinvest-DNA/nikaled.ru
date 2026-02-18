import { Header } from "@/components/layout/Header";
import { LeadForm } from "@/components/forms/LeadForm";
import { MessengerButtons } from "@/components/ui/MessengerButtons";
import { contacts } from "@/content/contacts";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata(
  "Контакты - наружная реклама в Воронеже",
  "Свяжитесь с нами для расчета наружной рекламы: телефон, мессенджеры, адрес производства в Воронеже.",
  "/kontakty/"
);

export default function ContactsPage() {
  return (
    <>
      <Header />
      <main className="container-narrow section-space grid gap-6 pb-24 md:grid-cols-[1fr_0.9fr] md:pb-16">
        <section className="card">
          <h1 className="text-3xl font-black text-ink md:text-4xl">Контакты</h1>
          <p className="mt-4 text-sm text-steel/80">Город: {contacts.city}</p>
          <p className="mt-1 text-sm text-steel/80">Адрес: {contacts.address}</p>
          <p className="mt-1 text-sm text-steel/80">Режим работы: {contacts.workHours}</p>
          <a href={`tel:${contacts.phoneRaw}`} className="mt-5 block text-3xl font-black text-steel">
            {contacts.phoneDisplay}
          </a>
          <div className="mt-5">
            <MessengerButtons />
          </div>
        </section>
        <LeadForm title="Оставьте заявку" buttonText="Получить консультацию" compact />
      </main>
    </>
  );
}
