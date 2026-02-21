import type { Service } from "@/content/services";

export type CaseItem = {
  id: string;
  title: string;
  task: string;
  result: string;
  term: string;
  budget: string;
  image: string;
  services: Service["slug"][];
};

export const cases: CaseItem[] = [
  {
    id: "genetics-center",
    title: "Селекционно-генетический центр",
    task: "Реализовать утвержденный проект по отделке входной группы",
    result: "Обшивка колонн и фриза алюминиевыми композитными панелями. Объёмные световые буквы на фризе.",
    term: "14 дней",
    budget: "450 000 ₽",
    image: "/images/real/case-7-v1.jpg",
    services: ["vyveski-voronezh", "obemnye-bukvy"]
  },
  {
    id: "shop-fashion",
    title: "Магазин одежды",
    task: "Сделать заметную вывеску с высокой читаемостью вечером.",
    result: "Объёмные световые буквы на каркасе.",
    term: "10 дней",
    budget: "185 000 ₽",
    image: "/images/real/case-1-v3.png",
    services: ["obemnye-bukvy", "vyveski-voronezh"]
  },
  {
    id: "beauty-salon",
    title: "Студия красоты",
    task: "Обновить фасад и повысить входящий поток.",
    result: "Световая вывеска + оформление входной группы.",
    term: "7 дней",
    budget: "27 000 ₽",
    image: "/images/real/case-2-v2.webp",
    services: ["vyveski-voronezh"]
  },
  {
    id: "coffee",
    title: "Пекарня",
    task: "Компактная световая реклама при ограниченном бюджете.",
    result: "Лайтбокс + световой кронштейн.",
    term: "7 дней",
    budget: "74 000 ₽",
    image: "/images/real/case-3-v2.webp",
    services: ["laitboksy", "vyveski-voronezh"]
  },
  {
    id: "clinic",
    title: "Нотариус",
    task: "Согласовать и установить вывеску в срок запуска.",
    result: "Согласование + световая вывеска под требования администрации.",
    term: "14 дней",
    budget: "162 000 ₽",
    image: "/images/real/case-4-v2.webp",
    services: ["soglasovanie-vyvesok", "vyveski-voronezh"]
  },
  {
    id: "market",
    title: "Магазин цветов",
    task: "Быстрый ребрендинг фасада",
    result: "Лайтбокс и объемные буквы на каркасе.",
    term: "11 дней",
    budget: "95 000 ₽",
    image: "/images/real/case-5-v2.webp",
    services: ["laitboksy"]
  },
  {
    id: "office",
    title: "Магазин одежды и обуви",
    task: "Выделить входную группу без перегруза.",
    result: "Объёмные буквы с логотипом.",
    term: "9 дней",
    budget: "138 000 ₽",
    image: "/images/real/case-6-v2.webp",
    services: ["obemnye-bukvy"]
  }
];

export const getCasesByService = (slug?: Service["slug"], limit = 6) => {
  if (!slug) return cases.slice(0, limit);
  return cases.filter((item) => item.services.includes(slug)).slice(0, limit);
};
