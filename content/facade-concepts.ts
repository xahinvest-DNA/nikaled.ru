export type FacadeConceptItem = {
  id: string;
  title: string;
  objectType: string;
  image: string;
  summary: string;
  focus: string[];
};

export const facadeConcepts: FacadeConceptItem[] = [
  {
    id: "office-entrance-concept",
    title: "Офис и административный вход",
    objectType: "AI-концепт будущего проекта",
    image: "/images/facade-concepts/office-entrance-concept-v1.png",
    summary:
      "Визуальный сценарий для аккуратной входной группы офиса или административного объекта: композитные панели, чистая геометрия входа и спокойная корпоративная подача.",
    focus: ["Входная группа", "Композитные панели", "Офисный фасад"]
  },
  {
    id: "private-house-concept",
    title: "Частный дом до 1000 м²",
    objectType: "AI-концепт будущего проекта",
    image: "/images/facade-concepts/private-house-concept-v1.png",
    summary:
      "Сценарий для частного дома, где нужен более современный и собранный фасад без тяжёлой реконструкции: локальная облицовка, акцентная входная зона и спокойная палитра.",
    focus: ["Частный дом", "Локальная отделка", "Современный фасад"]
  },
  {
    id: "commercial-facade-concept",
    title: "Магазин или коммерческий павильон",
    objectType: "AI-концепт будущего проекта",
    image: "/images/facade-concepts/commercial-facade-concept-v1.png",
    summary:
      "Коммерческий фасад, где отделка и фриз заранее собраны так, чтобы вывеска работала сильнее, а точка выглядела как единый объект, а не набор случайных деталей.",
    focus: ["Коммерческий фасад", "Фриз под вывеску", "Под открытие точки"]
  },
  {
    id: "medical-entrance-concept",
    title: "Медцентр или деловая входная группа",
    objectType: "AI-концепт будущего проекта",
    image: "/images/facade-concepts/medical-entrance-concept-v1.png",
    summary:
      "Визуальный пример для клиники, медцентра или делового объекта: спокойный фасадный образ, доступный вход, аккуратная навигационная зона и чистая отделка входной группы.",
    focus: ["Медцентр", "Доступный вход", "Чистая входная группа"]
  }
];