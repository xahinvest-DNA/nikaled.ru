import type {
  AiLeadState,
  AiMessage,
  AiProbability,
  AiQualification
} from "@/lib/ai-assistant/types";

const lastUserMessages = (history: AiMessage[], limit = 4) =>
  history.filter((item) => item.role === "user").slice(-limit);

export const qualifyAiLead = (leadState: AiLeadState): { qualification: AiQualification; probability: AiProbability } => {
  const hasPhone = Boolean(leadState.phone);
  const hasService = Boolean(leadState.service);
  const hasObject = Boolean(leadState.businessType || leadState.objectType || leadState.situation);
  const hasContext = Boolean(
    leadState.goal ||
      leadState.pain ||
      leadState.summary ||
      leadState.implication ||
      leadState.needPayoff
  );
  const hasTiming = Boolean(leadState.deadline);
  const hasSize = Boolean(leadState.size);
  const hasPhoto = leadState.hasPhoto === true;

  const hotSignals = [hasPhone, hasService, hasObject, hasContext, hasTiming || hasSize || hasPhoto].filter(Boolean).length;
  const warmSignals = [hasService, hasObject, hasContext, hasTiming || hasSize || hasPhoto].filter(Boolean).length;

  if (hasPhone && hotSignals >= 4) {
    return { qualification: "hot", probability: "high" };
  }

  if (warmSignals >= 2) {
    return { qualification: "warm", probability: "medium" };
  }

  return { qualification: "cold", probability: "low" };
};

export const buildAiLeadRecommendation = (leadState: AiLeadState, qualification: AiQualification) => {
  if (qualification === "hot") {
    if (leadState.hasPhoto) {
      return "Позвонить, уточнить детали по объекту и подготовить предварительный расчёт по фото.";
    }

    return "Позвонить, запросить фото фасада или размеры и предложить предварительный расчёт.";
  }

  if (qualification === "warm") {
    if (!leadState.hasPhoto) {
      return "Запросить фото фасада, размеры и ориентир по срокам, затем предложить расчёт.";
    }

    return "Уточнить сроки и приоритет клиента, затем предложить предварительный расчёт или замер.";
  }

  return "Продолжить консультацию, помочь выбрать сценарий и мягко вернуться к контакту позже.";
};

export const buildAiLeadSummary = (leadState: AiLeadState) => {
  const parts = [
    leadState.service ? `Услуга: ${leadState.service}` : "",
    leadState.businessType ? `Бизнес: ${leadState.businessType}` : "",
    leadState.objectType ? `Объект: ${leadState.objectType}` : "",
    leadState.situation ? `Ситуация: ${leadState.situation}` : "",
    leadState.goal ? `Цель: ${leadState.goal}` : "",
    leadState.pain ? `Боль: ${leadState.pain}` : "",
    leadState.implication ? `Последствия: ${leadState.implication}` : "",
    leadState.needPayoff ? `Ожидаемый результат: ${leadState.needPayoff}` : "",
    leadState.deadline ? `Срок: ${leadState.deadline}` : "",
    leadState.budget ? `Бюджет: ${leadState.budget}` : "",
    leadState.hasPhoto === true ? "Фото фасада: есть или готов прислать" : "",
    leadState.size ? `Размеры: ${leadState.size}` : ""
  ].filter(Boolean);

  if (leadState.summary) {
    return leadState.summary;
  }

  return parts.join(". ");
};

export const formatAiDialogue = (history: AiMessage[]) =>
  history
    .slice(-8)
    .map((item) => `${item.role === "user" ? "Клиент" : "AI"}: ${item.content}`)
    .join("\n");

export const buildAiLeadContext = (leadState: AiLeadState, history: AiMessage[]) => {
  const { qualification, probability } = qualifyAiLead(leadState);
  const recommendation = buildAiLeadRecommendation(leadState, qualification);
  const summary = buildAiLeadSummary(leadState) || "Клиент общался с AI-помощником, но краткое резюме не собрано.";

  const lines = [
    "AI-помощник сайта Nikaled",
    "",
    `Квалификация: ${qualification.toUpperCase()}`,
    `Вероятность продажи: ${probability === "high" ? "высокая" : probability === "medium" ? "средняя" : "низкая"}`,
    `Услуга: ${leadState.service || "-"}`,
    `Тип бизнеса: ${leadState.businessType || "-"}`,
    `Тип объекта: ${leadState.objectType || "-"}`,
    `Ситуация: ${leadState.situation || "-"}`,
    `SPIN-этап: ${leadState.spinStage || "-"}`,
    `Цель: ${leadState.goal || "-"}`,
    `Боль: ${leadState.pain || "-"}`,
    `Последствия: ${leadState.implication || "-"}`,
    `Ожидаемый результат: ${leadState.needPayoff || "-"}`,
    `Приоритет: ${leadState.priority || "-"}`,
    `Срок: ${leadState.deadline || "-"}`,
    `Бюджет: ${leadState.budget || "-"}`,
    `Фото фасада: ${leadState.hasPhoto === true ? "готов прислать / есть" : "-"}`,
    `Размеры: ${leadState.size || "-"}`,
    "",
    "Рекомендованный следующий шаг:",
    recommendation,
    "",
    "Краткое резюме диалога:",
    summary,
    "",
    "Последние сообщения:",
    formatAiDialogue(history)
  ];

  return lines.join("\n");
};

export const enrichLeadStateForSubmission = (leadState: AiLeadState, history: AiMessage[]): AiLeadState => {
  const { qualification, probability } = qualifyAiLead(leadState);
  const recommendedNextStep = buildAiLeadRecommendation(leadState, qualification);
  const summary = buildAiLeadSummary(leadState);
  const recentUserText = lastUserMessages(history)
    .map((item) => item.content)
    .join(" ");

  return {
    ...leadState,
    qualification,
    probability,
    recommendedNextStep,
    summary: summary || recentUserText || leadState.summary
  };
};
