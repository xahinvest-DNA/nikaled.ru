import { readLeadEventsForDate, getMoscowDateKey } from "@/lib/reporting/lead-events";

const DATE_LABEL_FORMATTER = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Europe/Moscow",
  day: "numeric",
  month: "long",
  year: "numeric"
});

const formatDateLabel = (dateKey: string) => {
  const date = new Date(`${dateKey}T12:00:00+03:00`);
  return DATE_LABEL_FORMATTER.format(date);
};

const formatCounters = (entries: Array<[string, number]>, emptyLabel = "-") =>
  entries.length > 0 ? entries.map(([label, count]) => `${label} — ${count}`).join(", ") : emptyLabel;

export const buildDailyReportText = async (dateKey = getMoscowDateKey()) => {
  const events = await readLeadEventsForDate(dateKey);
  const title = `Ежедневный отчёт Nikaled — ${formatDateLabel(dateKey)}`;

  if (events.length === 0) {
    return {
      dateKey,
      total: 0,
      text: `${title}\nЯ на связи, заявок сегодня не было.`
    };
  }

  const bySource = new Map<string, number>();
  const byService = new Map<string, number>();
  const byChannel = new Map<string, number>();

  for (const event of events) {
    bySource.set(event.source || "direct", (bySource.get(event.source || "direct") || 0) + 1);
    byService.set(event.service || "-", (byService.get(event.service || "-") || 0) + 1);
    byChannel.set(event.deliveryChannel, (byChannel.get(event.deliveryChannel) || 0) + 1);
  }

  const latestEvent = [...events].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt)).at(-1);

  const text = [
    title,
    `Всего заявок: ${events.length}`,
    `Источники: ${formatCounters([...bySource.entries()].sort((a, b) => b[1] - a[1]))}`,
    `Услуги: ${formatCounters([...byService.entries()].sort((a, b) => b[1] - a[1]))}`,
    `Доставка: ${formatCounters([...byChannel.entries()].sort((a, b) => b[1] - a[1]))}`,
    latestEvent ? `Последняя заявка: ${latestEvent.occurredAt}` : ""
  ]
    .filter(Boolean)
    .join("\n");

  return {
    dateKey,
    total: events.length,
    text
  };
};
