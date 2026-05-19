import { contacts } from "@/content/contacts";
import { faqItems } from "@/content/faq";
import { services } from "@/content/services";
import { trustProofs, trustStats } from "@/content/stats";

const serviceLines = services.map((service) =>
  [
    `- ${service.name} (${service.slug})`,
    `цена: ${service.fromPrice}`,
    `коротко: ${service.short}`,
    `когда подходит: ${service.useCases.slice(0, 2).join("; ")}`,
    `ключевое: ${service.heroBullets.slice(0, 2).join(", ")}`
  ].join(" | ")
);

const faqLines = faqItems.slice(0, 6).map((item) => `- ${item.question} Ответ: ${item.answer}`);

const statsLines = trustStats.map((item) => `- ${item.label}: ${item.value}`);
const proofLines = trustProofs.slice(0, 4).map((item) => `- ${item.title}: ${item.text}`);

export const AI_ASSISTANT_KNOWLEDGE = [
  "Nikaled: наружная реклама и фасадные решения в Воронеже и области.",
  `Контакты: телефон ${contacts.phoneDisplay}, Telegram ${contacts.telegramUrl}, режим ${contacts.workHours}.`,
  "Коммерческие тезисы: отвечаем в течение 10 минут, работаем по договору, есть собственное производство, можно начать с фото объекта.",
  "Ориентиры: часто старт от 10 000 ₽, типовые сроки 7-14 дней, гарантия 24 месяца.",
  "",
  "Услуги:",
  ...serviceLines,
  "",
  "Короткие ответы:",
  ...faqLines,
  "",
  "Факты доверия:",
  ...statsLines,
  "",
  "Что получает клиент:",
  ...proofLines
].join("\n");
