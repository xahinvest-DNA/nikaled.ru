import { articles } from "@/content/articles";
import { cases } from "@/content/cases";
import { contacts } from "@/content/contacts";
import { faqItems } from "@/content/faq";
import { services } from "@/content/services";
import { solutionPages } from "@/content/solutions";
import { trustProofs, trustStats } from "@/content/stats";

const serviceLines = services.map((service) =>
  [
    `- ${service.name} (${service.slug})`,
    `цена: ${service.fromPrice}`,
    `коротко: ${service.short}`,
    `срок/ценность: ${service.heroBullets.join(", ")}`,
    `когда подходит: ${service.useCases.join("; ")}`,
    `что влияет на цену: ${service.pricingFactors.join(", ")}`
  ].join(" | ")
);

const faqLines = faqItems.map((item) => `- ${item.question} Ответ: ${item.answer}`);

const caseLines = cases.map((item) =>
  [
    `- ${item.title}`,
    `задача: ${item.task}`,
    `решение: ${item.result}`,
    `срок: ${item.term}`,
    item.budget ? `бюджет: ${item.budget}` : "бюджет: по запросу",
    `для кого: ${item.bestFor.join(", ")}`
  ].join(" | ")
);

const solutionLines = solutionPages.map((item) =>
  [
    `- ${item.title}`,
    `описание: ${item.description}`,
    `подходит для: ${item.relatedServiceSlugs.join(", ")}`,
    `акценты: ${item.bullets.join(", ")}`
  ].join(" | ")
);

const articleLines = articles.map((item) =>
  `- ${item.title} | категория: ${item.category} | ключевое: ${item.keyPoints.join("; ")}`
);

const statsLines = trustStats.map((item) => `- ${item.label}: ${item.value}`);
const proofLines = trustProofs.map((item) => `- ${item.title}: ${item.text}`);

export const AI_ASSISTANT_KNOWLEDGE = [
  "Компания Nikaled работает в Воронеже и Воронежской области.",
  `Контакты: телефон ${contacts.phoneDisplay}, Telegram ${contacts.telegramUrl}, режим ${contacts.workHours}.`,
  "Важные коммерческие тезисы: отвечаем в течение 10 минут, работаем по договору, есть собственное производство, можно начать с фото объекта.",
  "",
  "Услуги:",
  ...serviceLines,
  "",
  "FAQ:",
  ...faqLines,
  "",
  "Кейсы:",
  ...caseLines,
  "",
  "Готовые решения:",
  ...solutionLines,
  "",
  "Полезные материалы:",
  ...articleLines,
  "",
  "Факты доверия:",
  ...statsLines,
  "",
  "Что получает клиент:",
  ...proofLines
].join("\n");
