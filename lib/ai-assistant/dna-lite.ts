import type {
  AiCommunicationMode,
  AiCommunicationProfile,
  AiConfidenceSource,
  AiHiddenNeed,
  AiLeadState,
  AiMessage,
  AiProfileConfidence,
  AiRequestStyle,
  AiThinkingHorizon,
  AiUncertaintyTolerance,
  AiValueDriver
} from "@/lib/ai-assistant/types";

const includesAny = (source: string, markers: string[]) => markers.some((marker) => source.includes(marker));

const countMatches = (source: string, markers: string[]) => markers.reduce((sum, marker) => sum + (source.includes(marker) ? 1 : 0), 0);

const pickBest = <T extends string>(scores: Record<T, number>, fallback: T) => {
  const entries = Object.entries(scores) as Array<[T, number]>;
  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const top = sorted[0];

  if (!top || top[1] <= 0) {
    return fallback;
  }

  if (sorted[1] && sorted[1][1] === top[1]) {
    return fallback;
  }

  return top[0];
};

const getUserSource = (history: AiMessage[], leadState: AiLeadState) => {
  const text = history
    .filter((item) => item.role === "user")
    .map((item) => item.content)
    .join(" ")
    .toLowerCase();

  return `${text} ${leadState.summary || ""} ${leadState.goal || ""} ${leadState.priority || ""}`.trim();
};

const detectSourceOfConfidence = (source: string): AiConfidenceSource =>
  pickBest<AiConfidenceSource>(
    {
      experience: countMatches(source, ["у нас уже", "мы уже", "у меня было", "делали", "пробовали", "сталкивались"]),
      logic: countMatches(source, ["если", "значит", "нужно понять", "какой вариант", "как именно", "что лучше"]),
      emotion: countMatches(source, ["мне кажется", "ощущение", "нравится", "не нравится", "смущает", "переживаю"]),
      authority: countMatches(source, ["как правильно", "по правилам", "по нормам", "по требованиям", "эксперты", "разрешение"]),
      mixed: 0
    },
    "mixed"
  );

const detectUncertaintyTolerance = (source: string): AiUncertaintyTolerance => {
  const low = countMatches(source, ["точно", "конкретно", "четко", "сразу", "без сюрпризов", "что в итоге"]);
  const high = countMatches(source, ["примерно", "возможно", "можно посмотреть", "пока думаю", "разберемся"]);

  if (low > high && low > 0) return "low";
  if (high > low && high > 0) return "high";
  return "medium";
};

const detectRequestStyle = (source: string): AiRequestStyle =>
  pickBest<AiRequestStyle>(
    {
      solution: countMatches(source, ["что делать", "как лучше", "подберите", "рассчитать", "посчитать", "нужен вариант"]),
      validation: countMatches(source, ["правильно ли", "верно ли", "нормально ли", "так можно"]),
      confirmation: countMatches(source, ["я же говорил", "я так и думал", "то есть", "получается"]),
      contact: countMatches(source, ["ответьте", "вы тут", "свяжитесь", "напишите"]),
      objection: countMatches(source, ["дорого", "не подходит", "сомневаюсь", "не уверен", "не хочу"]),
      mixed: 0
    },
    "mixed"
  );

const detectThinkingHorizon = (source: string): AiThinkingHorizon => {
  if (includesAny(source, ["срочно", "сегодня", "завтра", "к открытию", "на этой неделе"])) return "immediate";
  if (includesAny(source, ["в этом месяце", "до конца месяца", "планируем", "в ближайшее время"])) return "planned";
  if (includesAny(source, ["на перспективу", "в будущем", "дальше", "на будущее"])) return "strategic";
  return "planned";
};

const detectValueDriver = (source: string, leadState: AiLeadState): AiValueDriver =>
  pickBest<AiValueDriver>(
    {
      speed: countMatches(source, ["срочно", "к открытию", "быстро", "успеть", "срок"]) + (leadState.deadline ? 1 : 0),
      clarity: countMatches(source, ["подскажите", "хочу понять", "какой вариант", "что выбрать", "объясните"]),
      reliability: countMatches(source, ["надежно", "аккуратно", "без переделок", "гарантия", "спокойно"]),
      visibility: countMatches(source, ["заметно", "ярко", "видно", "привлекало", "премиально"]),
      price: countMatches(source, ["цена", "стоимость", "бюджет", "подешевле", "сколько стоит"]),
      mixed: 0
    },
    "mixed"
  );

const detectCommunicationMode = (history: AiMessage[], source: string): AiCommunicationMode => {
  const userMessages = history.filter((item) => item.role === "user");
  const totalWords = userMessages.reduce((sum, item) => sum + item.content.split(/\s+/).filter(Boolean).length, 0);
  const avgWords = userMessages.length ? totalWords / userMessages.length : 0;

  if (includesAny(source, ["бред", "чушь", "ерунда", "раздражает"])) return "aggressive";
  if (avgWords > 16 || includesAny(source, ["потому что", "в целом", "получается", "с одной стороны"])) return "reflective";
  if (includesAny(source, ["спасибо", "добрый", "пожалуйста"])) return "contact";
  if (avgWords > 0 && avgWords <= 6) return "operational";
  return "mixed";
};

const detectHiddenNeed = (
  valueDriver: AiValueDriver,
  requestStyle: AiRequestStyle,
  uncertaintyTolerance: AiUncertaintyTolerance
): AiHiddenNeed => {
  if (valueDriver === "speed") return "speed";
  if (valueDriver === "price") return "control";
  if (valueDriver === "reliability") return "safety";
  if (valueDriver === "visibility") return "recognition";
  if (requestStyle === "validation" || uncertaintyTolerance === "low") return "certainty";
  return "simplicity";
};

const toConfidence = (score: number): AiProfileConfidence => {
  if (score >= 5) return "high";
  if (score >= 3) return "medium";
  return "low";
};

const buildDoList = (
  mode: AiCommunicationMode,
  valueDriver: AiValueDriver,
  requestStyle: AiRequestStyle
) => {
  const base = ["говорить коротко и по делу", "давать следующий шаг без лишней теории"];

  if (mode === "operational") base.push("держать темп и не растягивать диалог");
  if (mode === "reflective") base.push("давать короткое обоснование, почему вариант подходит");
  if (valueDriver === "price") base.push("сразу обозначать ориентир, вилку или логику цены");
  if (valueDriver === "speed") base.push("подчеркивать срок и ближайшее действие");
  if (valueDriver === "reliability") base.push("подчеркивать аккуратность, предсказуемость и отсутствие переделок");
  if (valueDriver === "visibility") base.push("показывать, как решение даст заметность и внешний эффект");
  if (requestStyle === "validation") base.push("мягко подтверждать логику клиента перед предложением решения");

  return Array.from(new Set(base)).slice(0, 4);
};

const buildAvoidList = (
  uncertaintyTolerance: AiUncertaintyTolerance,
  mode: AiCommunicationMode,
  valueDriver: AiValueDriver
) => {
  const base = ["не уходить в общую теорию", "не давить и не учить жизни"];

  if (uncertaintyTolerance === "low") base.push("не оставлять размытых формулировок и подвешенных вариантов");
  if (mode === "operational") base.push("не писать длинные полотна текста");
  if (valueDriver === "price") base.push("не обходить тему стоимости слишком долго");
  if (valueDriver === "speed") base.push("не тормозить разговор второстепенными вопросами");

  return Array.from(new Set(base)).slice(0, 4);
};

const buildTrustTriggers = (valueDriver: AiValueDriver, sourceOfConfidence: AiConfidenceSource) => {
  const triggers = ["конкретика по следующему шагу"];

  if (valueDriver === "speed") triggers.push("понятный срок ответа и расчёта");
  if (valueDriver === "price") triggers.push("прозрачная логика стоимости");
  if (valueDriver === "reliability") triggers.push("спокойный, надёжный тон без суеты");
  if (valueDriver === "visibility") triggers.push("понятное объяснение визуального эффекта");
  if (sourceOfConfidence === "logic") triggers.push("короткое рациональное обоснование");
  if (sourceOfConfidence === "experience") triggers.push("ссылка на практический опыт и похожие кейсы");

  return Array.from(new Set(triggers)).slice(0, 4);
};

const buildResistanceTriggers = (uncertaintyTolerance: AiUncertaintyTolerance, mode: AiCommunicationMode) => {
  const triggers = ["вода и расплывчатость", "лишние усложнения"];

  if (uncertaintyTolerance === "low") triggers.push("неопределённость без следующего шага");
  if (mode === "operational") triggers.push("слишком длинные сообщения");
  if (mode === "aggressive") triggers.push("давление в ответ на сопротивление");

  return Array.from(new Set(triggers)).slice(0, 4);
};

const buildManagerOpener = (leadState: AiLeadState, profile: Omit<AiCommunicationProfile, "managerOpener" | "followUpStyle">) => {
  const service = leadState.service || "задаче";
  const business = leadState.businessType ? `по ${leadState.businessType}` : "по вашему объекту";
  const timing = leadState.deadline ? ` и срок ${leadState.deadline}` : "";

  if (profile.communicationMode === "operational") {
    return `Собрал вводные ${business} по ${service}${timing}. Коротко сориентирую по рабочим вариантам и следующему шагу.`;
  }

  if (profile.sourceOfConfidence === "logic") {
    return `Собрал ваши вводные ${business} по ${service}${timing}. Покажу 2 рабочих варианта и коротко объясню, чем они отличаются.`;
  }

  if (profile.valueDriver === "price") {
    return `Собрал вводные ${business} по ${service}${timing}. Сразу дам понятный ориентир по стоимости и от чего она зависит.`;
  }

  return `Собрал ваши вводные ${business} по ${service}${timing}. Предложу самый подходящий вариант и быстро переведу к расчёту.`;
};

const buildFollowUpStyle = (profile: Omit<AiCommunicationProfile, "managerOpener" | "followUpStyle">) => {
  if (profile.communicationMode === "operational") return "Короткий звонок или сообщение с одним следующим шагом.";
  if (profile.valueDriver === "price") return "Сообщение с ориентиром цены или вилкой, без длинной подводки.";
  if (profile.sourceOfConfidence === "logic") return "Сообщение с 2 вариантами и коротким объяснением различий.";
  if (profile.valueDriver === "speed") return "Быстрый контакт с акцентом на срок и оперативность.";
  return "Спокойное короткое сообщение с конкретным предложением следующего шага.";
};

export const inferCommunicationProfile = (history: AiMessage[], leadState: AiLeadState): AiCommunicationProfile => {
  const source = getUserSource(history, leadState);
  const sourceOfConfidence = detectSourceOfConfidence(source);
  const uncertaintyTolerance = detectUncertaintyTolerance(source);
  const requestStyle = detectRequestStyle(source);
  const thinkingHorizon = detectThinkingHorizon(source);
  const valueDriver = detectValueDriver(source, leadState);
  const communicationMode = detectCommunicationMode(history, source);
  const hiddenNeed = detectHiddenNeed(valueDriver, requestStyle, uncertaintyTolerance);

  const signalScore = [
    sourceOfConfidence !== "mixed",
    uncertaintyTolerance !== "medium",
    requestStyle !== "mixed",
    thinkingHorizon !== "planned",
    valueDriver !== "mixed",
    communicationMode !== "mixed"
  ].filter(Boolean).length;

  const baseProfile = {
    sourceOfConfidence,
    uncertaintyTolerance,
    requestStyle,
    thinkingHorizon,
    valueDriver,
    communicationMode,
    hiddenNeed,
    confidence: toConfidence(signalScore),
    do: buildDoList(communicationMode, valueDriver, requestStyle),
    avoid: buildAvoidList(uncertaintyTolerance, communicationMode, valueDriver),
    trustTriggers: buildTrustTriggers(valueDriver, sourceOfConfidence),
    resistanceTriggers: buildResistanceTriggers(uncertaintyTolerance, communicationMode)
  };

  return {
    ...baseProfile,
    managerOpener: buildManagerOpener(leadState, baseProfile),
    followUpStyle: buildFollowUpStyle(baseProfile)
  };
};

const sourceLabels: Record<AiConfidenceSource, string> = {
  experience: "опирается на опыт",
  logic: "опирается на логику",
  emotion: "опирается на ощущение",
  authority: "ищет правильность и опору на правила",
  mixed: "смешанный источник уверенности"
};

const toleranceLabels: Record<AiUncertaintyTolerance, string> = {
  low: "низкая терпимость к неопределённости",
  medium: "средняя терпимость к неопределённости",
  high: "нормально выдерживает неопределённость"
};

const requestLabels: Record<AiRequestStyle, string> = {
  solution: "ждёт конкретное решение",
  validation: "хочет подтверждения своей логики",
  confirmation: "нуждается в подтверждении позиции",
  contact: "чувствителен к отклику",
  objection: "заходит через сопротивление или сомнение",
  mixed: "смешанный стиль запроса"
};

const modeLabels: Record<AiCommunicationMode, string> = {
  operational: "операционный стиль",
  contact: "контактный стиль",
  reflective: "рефлексивный стиль",
  aggressive: "жёсткий стиль",
  mixed: "смешанный стиль"
};

export const buildCommunicationProfileSummary = (profile: AiCommunicationProfile) =>
  `${modeLabels[profile.communicationMode]}, ${requestLabels[profile.requestStyle]}, ${sourceLabels[profile.sourceOfConfidence]}, ${toleranceLabels[profile.uncertaintyTolerance]}`;

const horizonLabels: Record<AiThinkingHorizon, string> = {
  immediate: "ориентирован на быстрый результат",
  planned: "мыслит в рамках ближайшего плана",
  strategic: "смотрит на задачу стратегически"
};

const valueLabels: Record<AiValueDriver, string> = {
  speed: "скорость",
  clarity: "ясность",
  reliability: "надёжность",
  visibility: "заметность",
  price: "стоимость",
  mixed: "смешанная ценность"
};

const hiddenNeedLabels: Record<AiHiddenNeed, string> = {
  certainty: "определённость",
  control: "контроль над затратами и решением",
  speed: "быстрый результат",
  safety: "спокойствие и отсутствие переделок",
  recognition: "заметный эффект и внешний результат",
  simplicity: "простота решения без лишних шагов"
};

const confidenceLabels: Record<AiProfileConfidence, string> = {
  low: "низкая",
  medium: "средняя",
  high: "высокая"
};

export const getCommunicationProfileLabels = (profile: AiCommunicationProfile) => ({
  summary: buildCommunicationProfileSummary(profile),
  horizon: horizonLabels[profile.thinkingHorizon],
  value: valueLabels[profile.valueDriver],
  hiddenNeed: hiddenNeedLabels[profile.hiddenNeed],
  confidence: confidenceLabels[profile.confidence]
});

export const buildCommunicationGuidance = (profile: AiCommunicationProfile) =>
  [
    `Communication DNA Lite: ${buildCommunicationProfileSummary(profile)}.`,
    `Скрытая потребность: ${profile.hiddenNeed}.`,
    `В ответах лучше: ${profile.do.join("; ")}.`,
    `Избегать: ${profile.avoid.join("; ")}.`,
    `Триггеры доверия: ${profile.trustTriggers.join("; ")}.`,
    `Триггеры отторжения: ${profile.resistanceTriggers.join("; ")}.`
  ].join("\n");
