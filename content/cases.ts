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
    id: "shop-fashion",
    title: "Магазин одежды на проспекте Революции",
    task: "Сделать заметную вывеску с высокой читаемостью вечером.",
    result: "Объёмные буквы с контражурной подсветкой.",
    term: "10 дней",
    budget: "185 000 ₽",
    image: "/images/real/case-1.webp",
    services: ["obemnye-bukvy", "vyveski-voronezh"]
  },
  {
    id: "beauty-salon",
    title: "Салон красоты в центре Воронежа",
    task: "Обновить фасад и повысить входящий поток.",
    result: "Световая вывеска + оформление входной группы.",
    term: "8 дней",
    budget: "120 000 ₽",
    image: "/images/real/case-2.webp",
    services: ["vyveski-voronezh"]
  },
  {
    id: "coffee",
    title: "Кофейня у бизнес-центра",
    task: "Компактная световая реклама при ограниченном бюджете.",
    result: "Лайтбокс + световой кронштейн.",
    term: "7 дней",
    budget: "74 000 ₽",
    image: "/images/real/case-3.webp",
    services: ["laitboksy", "vyveski-voronezh"]
  },
  {
    id: "clinic",
    title: "Стоматология в новом ЖК",
    task: "Согласовать и установить вывеску в срок запуска.",
    result: "Согласование + световая вывеска под требования администрации.",
    term: "14 дней",
    budget: "162 000 ₽",
    image: "/images/real/case-4.webp",
    services: ["soglasovanie-vyvesok", "vyveski-voronezh"]
  },
  {
    id: "market",
    title: "Сетевой минимаркет",
    task: "Быстрый ребрендинг фасада на 2 входные группы.",
    result: "Комплект лайтбоксов и навигации.",
    term: "11 дней",
    budget: "210 000 ₽",
    image: "/images/real/case-5.webp",
    services: ["laitboksy"]
  },
  {
    id: "office",
    title: "Офис продаж девелопера",
    task: "Выделить офис на фасаде без перегруза.",
    result: "Объёмные буквы на композитной подложке.",
    term: "9 дней",
    budget: "138 000 ₽",
    image: "/images/real/case-6.webp",
    services: ["obemnye-bukvy"]
  }
];

export const getCasesByService = (slug?: Service["slug"], limit = 6) => {
  if (!slug) return cases.slice(0, limit);
  return cases.filter((item) => item.services.includes(slug)).slice(0, limit);
};
