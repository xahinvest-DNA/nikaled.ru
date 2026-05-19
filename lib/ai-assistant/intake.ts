import type { AiLeadState } from "@/lib/ai-assistant/types";

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

const parseSize = (source: string) => {
  const metricMatch = source.match(/(\d+(?:[.,]\d+)?)\s*(?:м|метр(?:а|ов)?)\s*[xх×на]\s*(\d+(?:[.,]\d+)?)\s*(?:м|метр(?:а|ов)?)/i);
  if (metricMatch) {
    return `${metricMatch[1].replace(",", ".")}x${metricMatch[2].replace(",", ".")} м`;
  }

  const centimeterMatch = source.match(/(\d+(?:[.,]\d+)?)\s*см\s*[xх×]\s*(\d+(?:[.,]\d+)?)\s*см/i);
  if (centimeterMatch) {
    return `${centimeterMatch[1].replace(",", ".")}x${centimeterMatch[2].replace(",", ".")} см`;
  }

  const bareMatch = source.match(/(\d+(?:[.,]\d+)?)\s*[xх×]\s*(\d+(?:[.,]\d+)?)/i);
  if (bareMatch) {
    return `${bareMatch[1].replace(",", ".")}x${bareMatch[2].replace(",", ".")}`;
  }

  return undefined;
};

const parseDeadline = (source: string) => {
  const dateMatch = source.match(/(?:до|к)\s+(\d{1,2}\s+[а-яё]+(?:\s+\d{4})?)/i);
  if (dateMatch) {
    return `до ${normalizeWhitespace(dateMatch[1])}`;
  }

  if (/к открытию/i.test(source)) return "к открытию";
  if (/на этой неделе/i.test(source)) return "на этой неделе";
  if (/срочно/i.test(source)) return "срочно";

  return undefined;
};

const parseBusinessType = (source: string) => {
  const directMatch = source.match(/для\s+([а-яёa-z0-9\- ]{3,60}?)(?:,|\.|$)/i);
  if (directMatch) {
    return normalizeWhitespace(directMatch[1]);
  }

  return undefined;
};

const parseProductSignals = (source: string) => {
  const lowered = source.toLowerCase();

  if (lowered.includes("объёмн") || lowered.includes("объемн")) {
    return {
      service: "Объёмные буквы",
      productType: "объёмные буквы"
    };
  }

  if (lowered.includes("лайтбокс") || lowered.includes("световой короб")) {
    return {
      service: "Лайтбоксы",
      productType: lowered.includes("световой короб") ? "световой короб" : "лайтбокс"
    };
  }

  if (lowered.includes("вывеск")) {
    return {
      service: "Вывески",
      productType: lowered.includes("светов") ? "световая вывеска" : "вывеска"
    };
  }

  if (lowered.includes("согласован")) {
    return {
      service: "Согласование вывесок",
      productType: "согласование вывески"
    };
  }

  if (lowered.includes("фасад")) {
    return {
      service: "Отделка фасадов",
      productType: "фасадное решение"
    };
  }

  return {};
};

const parsePhotoFlag = (source: string) => {
  if (/(фото|фасад).*(есть|готов|пришлю|отправлю)/i.test(source)) return true;
  if (/(без фото|фото позже|фото пока нет)/i.test(source)) return false;
  return undefined;
};

const parseMounting = (source: string) => {
  if (/(нужен монтаж|монтаж нужен|с монтажом)/i.test(source)) return true;
  if (/(без монтажа|монтаж не нужен)/i.test(source)) return false;
  return undefined;
};

const parseIllumination = (source: string) => {
  if (/контражур/i.test(source)) return "контражур";
  if (/несветов/i.test(source)) return "несветовая";
  if (/светов/i.test(source)) return "световая";
  return undefined;
};

const parseSituation = (source: string) => {
  if (/(новая точка|открываем|открытие|новый магазин|новое помещение)/i.test(source)) return "новая точка";
  if (/(меняем|обновляем|замена старой|обновление старой)/i.test(source)) return "обновление старой вывески";
  return undefined;
};

const parseDesignPreference = (source: string) => {
  if (/премиаль/i.test(source)) return "премиальный вид";
  if (/аккурат/i.test(source)) return "аккуратный вид";
  if (/заметн/i.test(source)) return "заметность";
  if (/минимал/i.test(source)) return "минималистичный вид";
  return undefined;
};

const parsePriority = (source: string) => {
  if (/срок|к открытию|срочно/i.test(source)) return "срок";
  if (/бюджет|подешевле|эконом/i.test(source)) return "бюджет";
  if (/заметн|ярк/i.test(source)) return "заметность";
  if (/аккурат|премиаль|солидн/i.test(source)) return "внешний вид";
  return undefined;
};

const parseGoal = (source: string) => {
  if (/к открытию/i.test(source)) return "открыться в срок";
  if (/заметн/i.test(source)) return "сделать вывеску более заметной";
  if (/аккурат|премиаль/i.test(source)) return "сделать фасад аккуратным и профессиональным";
  return undefined;
};

const detectInquiryType = (source: string) => {
  if (/согласован|документ|разрешен/i.test(source)) return "approval";
  if (/срок|когда|до\s+\d{1,2}\s+[а-яё]+|к открытию/i.test(source)) return "timing";
  if (/фото|фасад/i.test(source)) return "photo";
  if (/рассчит|расчет|стоимост|цена|посчитать/i.test(source)) return "calculation";
  if (/подобрать|что лучше|что выбрать|какой вариант/i.test(source)) return "selection";
  return "question";
};

export const inferLeadStateFromText = (message: string, history: Array<{ role: string; content: string }> = []): Partial<AiLeadState> => {
  const historyText = history
    .filter((item) => item.role === "user")
    .map((item) => item.content)
    .join(" ");
  const source = normalizeWhitespace(`${historyText} ${message}`);
  const productSignals = parseProductSignals(source);

  return {
    inquiryType: detectInquiryType(source),
    service: productSignals.service,
    productType: productSignals.productType,
    size: parseSize(source),
    deadline: parseDeadline(source),
    businessType: parseBusinessType(source),
    hasPhoto: parsePhotoFlag(source),
    mountingNeeded: parseMounting(source),
    illumination: parseIllumination(source),
    situation: parseSituation(source),
    designPreference: parseDesignPreference(source),
    priority: parsePriority(source),
    goal: parseGoal(source)
  };
};
