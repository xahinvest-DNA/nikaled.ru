import { detectSpinStage } from "@/lib/ai-assistant/spin";
import type { AiInquiryType, AiLeadState, AiMessage, AiSpinStage } from "@/lib/ai-assistant/types";

const CALCULATION_MARKERS = ["рассчитать", "расчет", "стоимость", "цена", "сколько стоит", "посчитать"];
const SELECTION_MARKERS = ["подобрать", "какой вариант", "что лучше", "что выбрать", "какую вывеску"];
const TIMING_MARKERS = ["срок", "сроки", "когда", "успеете", "до ", "к открытию"];
const APPROVAL_MARKERS = ["согласование", "согласовать", "документы", "разрешение"];
const PHOTO_MARKERS = ["фото", "фасад", "объект", "прикрепить", "прислать"];

const includesAny = (source: string, markers: string[]) => markers.some((marker) => source.includes(marker));

export const detectInquiryType = (message: string, leadState: AiLeadState): AiInquiryType => {
  const source = `${message} ${leadState.summary || ""} ${leadState.service || ""}`.toLowerCase();

  if (includesAny(source, APPROVAL_MARKERS) || leadState.needsApproval) return "approval";
  if (includesAny(source, TIMING_MARKERS) || leadState.deadline) return "timing";
  if (includesAny(source, PHOTO_MARKERS) || leadState.hasPhoto) return "photo";
  if (includesAny(source, CALCULATION_MARKERS) || leadState.size || leadState.budget) return "calculation";
  if (includesAny(source, SELECTION_MARKERS)) return "selection";
  return "question";
};

const stageGoalMap: Record<AiSpinStage, string> = {
  situation: "собрать базовые вводные по объекту и формату вывески",
  problem: "понять ограничение проекта без психологических формулировок",
  implication: "уточнить деловой риск: срок, согласование, фасад, монтаж, читаемость",
  need_payoff: "зафиксировать, какой итоговый результат нужен клиенту по фасаду и запуску",
  close: "подвести к расчёту и забрать контакт без лишних повторов"
};

const scenarioQuestionMap: Record<AiInquiryType, Partial<Record<AiSpinStage, string>>> = {
  calculation: {
    situation: "Уточни формат изделия, размеры, есть ли фото фасада и нужен ли монтаж.",
    problem: "Уточни, что важнее для расчёта: заметность, аккуратный вид, срок или бюджет.",
    implication: "Если срок уже назван, уточни только один деловой риск: к открытию, ограничения фасада или сложность монтажа.",
    need_payoff: "Спроси, какой вариант нужен на выходе: заметный, аккуратный, более экономичный или премиальный.",
    close: "Кратко собери вводные и попроси телефон для предварительного расчёта."
  },
  selection: {
    situation: "Помоги выбрать между световой вывеской, объёмными буквами и лайтбоксом под задачу клиента.",
    problem: "Уточни, что ограничивает выбор: фасад, бюджет, читаемость, срок или требования по согласованию.",
    implication: "Покажи деловое последствие неверного выбора: слишком просто, слишком дорого, нечитабельно или риск переделки.",
    need_payoff: "Спроси, какой итог нужен: более заметно, солидно, компактно или без лишнего бюджета.",
    close: "Предложи передать вводные на подбор 2-3 вариантов и попроси телефон."
  },
  timing: {
    situation: "Уточни дату открытия или крайний срок, размер, фото фасада и нужен ли монтаж.",
    problem: "Спроси только про то, что может помешать сроку: макет, фасад, согласование или электрика.",
    implication: "Зафиксируй деловой риск срыва: открытие, запуск рекламы, монтаж в неудобное окно.",
    need_payoff: "Уточни, что важнее при сроке: успеть к дате любой ценой, уложиться в бюджет или сохранить качество.",
    close: "Если срок и базовые вводные есть, сразу веди к телефону для оперативного расчёта."
  },
  approval: {
    situation: "Уточни адрес/тип объекта, что именно хотят разместить и есть ли ограничения по фасаду.",
    problem: "Спроси, в чём вопрос: документы заранее, уже получили замечание или боятся переделки.",
    implication: "Зафиксируй риск демонтажа, отказа или лишних расходов на переделку.",
    need_payoff: "Уточни, нужен ли спокойный запуск без возврата к документам и переделкам.",
    close: "После краткой диагностики попроси телефон для связи со специалистом по согласованию."
  },
  photo: {
    situation: "Попроси описать фасад, если фото пока не отправлено, и объясни, что по фото расчёт будет точнее.",
    problem: "Уточни, что именно нужно понять по фото: формат вывески, размер, крепление или внешний вид.",
    implication: "Покажи, что без фото можно дать ориентир, а не точный вариант по фасаду.",
    need_payoff: "Спроси, какой результат ждут от подбора по фото: заметность, аккуратность, экономия времени.",
    close: "Предложи передать фото и телефон для более точного расчёта."
  },
  question: {
    situation: "Сначала переведи общий вопрос в конкретную задачу по объекту или услуге.",
    problem: "Не задавай вопросы про страхи. Уточни только деловое ограничение клиента.",
    implication: "Если есть смысл, зафиксируй деловой риск короткой фразой.",
    need_payoff: "Уточни желаемый результат одним предметным вопросом.",
    close: "Если контекст уже собран, проси телефон для расчёта или консультации."
  }
};

export const buildExpertGuidanceText = (message: string, leadState: AiLeadState, history: AiMessage[]) => {
  const inquiryType = detectInquiryType(message, leadState);
  const stage = detectSpinStage(leadState);
  const userMessagesCount = history.filter((item) => item.role === "user").length;
  const scenarioQuestion = scenarioQuestionMap[inquiryType][stage] || scenarioQuestionMap.question[stage] || "";

  return [
    "Работай как менеджер-проектировщик Nikaled, а не как абстрактный AI-ассистент.",
    `Тип запроса: ${inquiryType}.`,
    `Внутренний этап SPIN: ${stage}. Используй его скрыто, не называй этап клиенту.`,
    `Цель текущего шага: ${stageGoalMap[stage]}.`,
    `Предметный следующий шаг: ${scenarioQuestion}`,
    userMessagesCount <= 1
      ? "Сделай первый ответ максимально предметным: предложи 2-3 профессиональных направления или один точный уточняющий вопрос."
      : "В каждом сообщении добавляй практическую пользу: вариант решения, пояснение по фасаду, подсветке, монтажу или сроку.",
    "Не задавай искусственные вопросы про страхи, опасения или 'всё ли в порядке с бюджетом'.",
    "Если уже есть размер или срок, опирайся на них и задавай следующий технический вопрос по существу.",
    "Без фото фасада допускается только ориентир. Объясняй это спокойно и профессионально.",
    "Не используй фразы-пустышки: 'отличное решение', 'важно, чтобы', 'учтём в расчёте', если они не добавляют новой информации."
  ].join("\n");
};

export const buildExpertQuickReplies = (leadState: AiLeadState, currentMessage = "") => {
  const inquiryType = detectInquiryType(currentMessage, leadState);
  const stage = detectSpinStage(leadState);

  if (stage === "close") {
    return ["Оставить телефон", "Есть фото фасада", "Нужен предварительный расчёт", "Нужна консультация"];
  }

  if (inquiryType === "calculation") {
    return ["Есть фото фасада", "Нужен монтаж", "Важно успеть к дате", "Нужен ориентир по цене"];
  }

  if (inquiryType === "selection") {
    return ["Нужен заметный вариант", "Нужен аккуратный вид", "Важно уложиться в бюджет", "Есть фото фасада"];
  }

  if (inquiryType === "timing") {
    return ["Нужно к открытию", "Срок уже есть", "Монтаж нужен", "Фото пришлю"];
  }

  if (inquiryType === "approval") {
    return ["Нужно согласование", "Есть ограничения фасада", "Нужны документы", "Хочу без переделок"];
  }

  if (inquiryType === "photo") {
    return ["Фото уже есть", "Фото пришлю позже", "Нужен ориентир без фото", "Нужен монтаж"];
  }

  if (stage === "situation") {
    return ["Рассчитать вывеску", "Есть фото фасада", "Нужен монтаж", "Нужно к открытию"];
  }

  if (stage === "need_payoff") {
    return ["Нужна заметность", "Нужен аккуратный фасад", "Важно успеть в срок", "Нужен ориентир по цене"];
  }

  return ["Новая точка", "Меняем старую вывеску", "Есть размеры", "Нужен расчёт"];
};
