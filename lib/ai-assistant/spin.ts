import type { AiLeadState, AiMessage, AiSpinStage } from "@/lib/ai-assistant/types";

type SpinStageInfo = {
  stage: AiSpinStage;
  objective: string;
  askFor: string;
  contactReady: boolean;
};

const hasSituationContext = (leadState: AiLeadState) =>
  Boolean(
    leadState.service ||
      leadState.businessType ||
      leadState.objectType ||
      leadState.situation ||
      leadState.hasPhoto ||
      leadState.size
  );

const hasProblemContext = (leadState: AiLeadState) => Boolean(leadState.pain || leadState.priority || leadState.needsApproval);
const hasImplicationContext = (leadState: AiLeadState) => Boolean(leadState.implication || leadState.deadline);
const hasNeedPayoffContext = (leadState: AiLeadState) => Boolean(leadState.goal || leadState.needPayoff);

export const detectSpinStage = (leadState: AiLeadState): AiSpinStage => {
  if (!hasSituationContext(leadState)) return "situation";
  if (!hasProblemContext(leadState)) return "problem";
  if (!hasImplicationContext(leadState)) return "implication";
  if (!hasNeedPayoffContext(leadState)) return "need_payoff";
  return "close";
};

export const getSpinStageInfo = (leadState: AiLeadState, history: AiMessage[]): SpinStageInfo => {
  const stage = detectSpinStage(leadState);
  const userMessagesCount = history.filter((item) => item.role === "user").length;

  if (stage === "situation") {
    return {
      stage,
      objective: "Понять контекст объекта, тип бизнеса, нужную услугу и базовые вводные.",
      askFor: "Спроси 1 конкретный вопрос про объект, фото, размеры, тип точки или что именно нужно сделать.",
      contactReady: false
    };
  }

  if (stage === "problem") {
    return {
      stage,
      objective: "Выявить проблему клиента: цена, сроки, заметность, согласование, внешний вид или риск переделок.",
      askFor: "Спроси 1 вопрос о главной сложности или страхе клиента.",
      contactReady: false
    };
  }

  if (stage === "implication") {
    return {
      stage,
      objective: "Понять, чем обернётся ошибка или затягивание проекта.",
      askFor: "Спроси 1 вопрос о последствиях: срыв открытия, потеря потока, штрафы, повторные работы, лишние расходы.",
      contactReady: false
    };
  }

  if (stage === "need_payoff") {
    return {
      stage,
      objective: "Зафиксировать, какой результат клиент считает хорошим и ради чего ему решать задачу сейчас.",
      askFor: "Спроси 1 вопрос о желаемом результате: заметность, запуск в срок, аккуратный вид, спокойствие по документам, экономия времени.",
      contactReady: userMessagesCount >= 3
    };
  }

  return {
    stage,
    objective: "Мягко перевести клиента к передаче контакта и предварительному расчёту.",
    askFor: "Кратко резюмируй задачу и попроси телефон для передачи специалисту.",
    contactReady: true
  };
};

export const buildSpinGuidanceText = (leadState: AiLeadState, history: AiMessage[]) => {
  const info = getSpinStageInfo(leadState, history);

  return [
    "Применяй технику SPIN Selling.",
    `Текущий этап: ${info.stage}.`,
    `Цель этапа: ${info.objective}`,
    `Следующий шаг: ${info.askFor}`,
    info.contactReady
      ? "Телефон уже можно просить, если есть достаточный контекст по задаче."
      : "Пока не торопись с контактом, сначала раскрой ситуацию и ценность."
  ].join("\n");
};

export const buildSpinQuickReplies = (leadState: AiLeadState) => {
  const stage = detectSpinStage(leadState);

  if (stage === "situation") {
    return ["Новая точка", "Меняем старую вывеску", "Есть фото фасада", "Нужен расчёт"];
  }

  if (stage === "problem") {
    return ["Важно уложиться в бюджет", "Нужны сроки", "Боюсь переделок", "Нужно согласование"];
  }

  if (stage === "implication") {
    return ["Нужно к открытию", "Не хочу затянуть запуск", "Важно без штрафов", "Нельзя ошибиться с фасадом"];
  }

  if (stage === "need_payoff") {
    return ["Хочу заметность", "Нужен аккуратный вид", "Важно быстро запуститься", "Хочу спокойный процесс"];
  }

  return ["Оставить телефон", "Нужен расчёт", "Есть фото фасада", "Хочу консультацию"];
};
