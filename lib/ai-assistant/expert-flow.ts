import { detectSpinStage } from "@/lib/ai-assistant/spin";
import { buildCommunicationGuidance } from "@/lib/ai-assistant/dna-lite";
import type { AiInquiryType, AiLeadState, AiMessage, AiSpinStage } from "@/lib/ai-assistant/types";

const CALCULATION_MARKERS = ["рассчитать", "расчет", "расчёт", "стоимость", "цена", "сколько стоит", "посчитать"];
const SELECTION_MARKERS = ["подобрать", "какой вариант", "что лучше", "что выбрать", "какую вывеску", "тип вывески"];
const TIMING_MARKERS = ["срок", "сроки", "когда", "успеете", "до ", "к открытию", "срочно"];
const APPROVAL_MARKERS = ["согласование", "согласовать", "документы", "разрешение", "паспорт фасада"];
const MOCKUP_MARKERS = ["макет", "дизайн", "эскиз"];

const includesAny = (source: string, markers: string[]) => markers.some((marker) => source.includes(marker));

const normalize = (value: string) => value.toLowerCase();

const getConversationSource = (message: string, leadState: AiLeadState, history: AiMessage[] = []) =>
  normalize(
    [
      message,
      leadState.summary || "",
      leadState.service || "",
      leadState.productType || "",
      ...history.filter((item) => item.role === "user").map((item) => item.content)
    ].join(" ")
  );

const isApprovalTriggered = (message: string, leadState: AiLeadState, history: AiMessage[] = []) => {
  const source = getConversationSource(message, leadState, history);
  const page = (leadState.page || "").toLowerCase();
  const service = (leadState.service || "").toLowerCase();

  return (
    includesAny(source, APPROVAL_MARKERS) ||
    Boolean(leadState.needsApproval) ||
    service.includes("согласование") ||
    page.includes("soglas") ||
    page.includes("соглас")
  );
};

const hasCommercialIntent = (leadState: AiLeadState, history: AiMessage[] = [], message = "") => {
  const source = getConversationSource(message, leadState, history);
  const userMessagesCount = history.filter((item) => item.role === "user").length;
  const signals = [
    Boolean(leadState.service || leadState.productType),
    Boolean(leadState.size),
    Boolean(leadState.deadline),
    Boolean(leadState.mountingNeeded),
    Boolean(leadState.businessType || leadState.situation),
    includesAny(source, CALCULATION_MARKERS),
    includesAny(source, ["нужен расчет", "нужен расчёт", "посчитать", "просчитать", "к открытию"])
  ].filter(Boolean).length;

  return signals >= 2 || userMessagesCount >= 2;
};

const stageGoalMap: Record<AiSpinStage, string> = {
  situation: "собрать базовые вводные по объекту и конструкции",
  problem: "понять одно практическое ограничение без психологических формулировок",
  implication: "зафиксировать только деловой риск по сроку, монтажу или фасаду",
  need_payoff: "понять, какой результат нужен по фасаду и запуску",
  close: "подвести к расчёту или телефону без лишних кругов"
};

const scenarioQuestionMap: Record<AiInquiryType, Partial<Record<AiSpinStage, string>>> = {
  calculation: {
    situation: "Уточни только то, чего не хватает для расчёта: формат, размер, монтаж или срок.",
    problem: "Спроси один практический вопрос: что сейчас важнее для расчёта — заметность, аккуратный вид, срок или бюджет.",
    implication: "Если срок уже назван, уточни только один риск: нужно успеть к открытию, есть ограничения по фасаду или сложный монтаж.",
    need_payoff: "Спроси, какой результат важнее на выходе: заметнее, аккуратнее или быстрее запуститься.",
    close: "Кратко собери вводные и веди к телефону."
  },
  selection: {
    situation: "Предложи 1 основной и 1 запасной вариант вывески под задачу клиента, затем задай один практический вопрос.",
    problem: "Не спрашивай абстрактно, что ограничивает выбор. Лучше уточни: нужен монтаж или важен срок к открытию.",
    implication: "Покажи риск только по делу: можно ошибиться с читаемостью, бюджетом или сроком, если не учесть фасад.",
    need_payoff: "Уточни, что для клиента важнее: заметность, аккуратный фасад или более экономичный вариант.",
    close: "Предложи перейти к предварительному расчёту и попроси телефон."
  },
  timing: {
    situation: "Уточни дату или дедлайн, а затем только один важный технический параметр: размер или монтаж.",
    problem: "Не упоминай макет и согласование без запроса клиента. Лучше спроси, можно ли уже считать ориентир по тем вводным, что есть.",
    implication: "Зафиксируй деловой риск срыва срока коротко и без нагнетания.",
    need_payoff: "Уточни, что важнее при сроке: успеть к дате или сохранить определённый уровень исполнения.",
    close: "Если срок и базовые вводные уже есть, сразу веди к телефону для оперативного расчёта."
  },
  approval: {
    situation: "Уточни адрес или тип объекта и суть вопроса по согласованию.",
    problem: "Спроси, речь о документах заранее, замечании по объекту или риске переделки.",
    implication: "Коротко обозначь риск демонтажа, отказа или лишних расходов на переделку.",
    need_payoff: "Уточни, нужен ли запуск без возврата к документам и переделкам.",
    close: "После краткой диагностики попроси телефон для связи со специалистом по согласованию."
  },
  photo: {
    situation: "Не развивай тему фото. Переведи разговор к задаче, размеру, монтажу или сроку.",
    problem: "Уточни только один практический параметр для расчёта без обсуждения фото.",
    implication: "Если уместно, коротко зафиксируй деловой риск по сроку или монтажу.",
    need_payoff: "Уточни, какой результат важнее клиенту на выходе.",
    close: "Веди к телефону и предварительному расчёту."
  },
  question: {
    situation: "Сначала переведи общий вопрос в конкретную задачу по объекту или вывеске.",
    problem: "Не задавай лишние вопросы. Уточни только один следующий практический шаг.",
    implication: "Если уместно, зафиксируй только один деловой риск короткой фразой.",
    need_payoff: "Уточни ожидаемый результат одним предметным вопросом.",
    close: "Если контекст уже собран, проси телефон для расчёта или консультации."
  }
};

export const detectInquiryType = (message: string, leadState: AiLeadState, history: AiMessage[] = []): AiInquiryType => {
  const source = getConversationSource(message, leadState, history);

  if (isApprovalTriggered(message, leadState, history)) return "approval";
  if (includesAny(source, SELECTION_MARKERS) && !includesAny(source, CALCULATION_MARKERS)) return "selection";
  if (includesAny(source, CALCULATION_MARKERS) || leadState.size || leadState.budget || leadState.mountingNeeded !== undefined) {
    return "calculation";
  }
  if (includesAny(source, TIMING_MARKERS) || leadState.deadline) return "timing";
  return "question";
};

export const buildExpertGuidanceText = (message: string, leadState: AiLeadState, history: AiMessage[]) => {
  const inquiryType = detectInquiryType(message, leadState, history);
  const stage = detectSpinStage(leadState);
  const userMessagesCount = history.filter((item) => item.role === "user").length;
  const conversationSource = getConversationSource(message, leadState, history);
  const scenarioQuestion = scenarioQuestionMap[inquiryType][stage] || scenarioQuestionMap.question[stage] || "";
  const approvalTriggered = isApprovalTriggered(message, leadState, history);
  const commercialIntent = hasCommercialIntent(leadState, history, message);
  const mentionsMockup = includesAny(conversationSource, MOCKUP_MARKERS);
  const dnaGuidance = leadState.communicationProfile ? buildCommunicationGuidance(leadState.communicationProfile) : "";

  return [
    "Работай как менеджер-проектировщик Nikaled, а не как абстрактный AI-ассистент.",
    `Тип запроса: ${inquiryType}.`,
    `Внутренний этап SPIN: ${stage}. Используй его скрыто, не называй клиенту.`,
    `Цель текущего шага: ${stageGoalMap[stage]}.`,
    `Предметный следующий шаг: ${scenarioQuestion}`,
    commercialIntent
      ? "Клиент уже близок к расчёту. Не расширяй разговор лекцией: дай короткую рекомендацию и один следующий шаг."
      : "Сначала дай предметную пользу, затем задай один уточняющий вопрос.",
    "После выбора формата не возвращай клиента к общей теории. Переходи к монтажу, сроку или телефону.",
    "Не задавай искусственные вопросы про опасения, страхи или абстрактные ограничения.",
    approvalTriggered
      ? "Контекст допускает разговор о согласовании, но всё равно держи его коротким и только по делу."
      : "Не упоминай согласование первым и не открывай эту тему без прямого запроса клиента.",
    mentionsMockup
      ? "Если клиент говорит, что макета нет, отвечай: 'Это не проблема, макет можем подготовить сами.' Не отправляй клиента сначала делать макет."
      : "Не поднимай тему макета без необходимости. Если макета нет, это не должно звучать как препятствие.",
    "Не уводи разговор в фото фасада. Помощник должен вести к расчёту по базовым вводным и телефону.",
    dnaGuidance ? `Скрытый коммуникационный профиль клиента:\n${dnaGuidance}` : "",
    userMessagesCount <= 1
      ? "Первый ответ сделай максимально предметным: 1 рекомендация или 2 близких варианта, без длинных объяснений."
      : "Каждое следующее сообщение должно либо продвигать к расчёту, либо убирать одно реальное препятствие."
  ].join("\n");
};

export const buildExpertQuickReplies = (leadState: AiLeadState, currentMessage = "", history: AiMessage[] = []) => {
  const userMessagesCount = history.filter((item) => item.role === "user").length;

  if (userMessagesCount > 0) {
    return [];
  }

  const inquiryType = detectInquiryType(currentMessage, leadState, history);

  if (inquiryType === "selection") {
    return ["Подобрать вариант", "Световая вывеска", "Объёмные буквы", "Лайтбокс"];
  }

  return ["Рассчитать вывеску", "Подобрать вариант", "Нужен монтаж", "Нужно к открытию"];
};
