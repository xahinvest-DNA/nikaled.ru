import type { LeadPayload } from "@/lib/lead/types";

const DAILY_REPORT_SOURCE = "daily_report";

export const toLeadText = (lead: LeadPayload) => {
  if (lead.source === DAILY_REPORT_SOURCE) {
    return lead.context;
  }

  return [
    "Новая заявка с сайта",
    `Имя: ${lead.name || "-"}`,
    `Телефон: ${lead.phone}`,
    `Задача: ${lead.context}`,
    `Услуга: ${lead.service || "-"}`,
    `Страница: ${lead.page}`,
    `Источник: ${lead.source}`,
    `Referrer: ${lead.referrer || "-"}`,
    `UTM source: ${lead.utm_source || "-"}`,
    `UTM campaign: ${lead.utm_campaign || "-"}`,
    `UTM term: ${lead.utm_term || "-"}`,
    `UTM content: ${lead.utm_content || "-"}`,
    `Время: ${lead.submittedAt}`
  ].join("\n");
};
