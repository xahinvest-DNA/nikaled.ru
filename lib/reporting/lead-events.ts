import { mkdir, readFile, appendFile } from "node:fs/promises";
import { join } from "node:path";

import type { LeadPayload } from "@/lib/lead/types";

export type LeadDeliveryChannel = "telegram" | "relay" | "email";

export type LeadEventRecord = {
  occurredAt: string;
  source: string;
  service: string;
  page: string;
  deliveryChannel: LeadDeliveryChannel;
};

const LEAD_EVENTS_DIR = join(process.cwd(), "var", "lead-events");
const DAILY_REPORT_SOURCE = "daily_report";

const MOSCOW_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Moscow",
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
});

export const DAILY_REPORT_LEAD_SOURCE = DAILY_REPORT_SOURCE;

export const getMoscowDateKey = (value: Date | string = new Date()) =>
  MOSCOW_FORMATTER.format(typeof value === "string" ? new Date(value) : value);

const getLeadEventsFilePath = (dateKey: string) => join(LEAD_EVENTS_DIR, `${dateKey}.jsonl`);

export const shouldTrackLeadEvent = (lead: LeadPayload) => lead.source !== DAILY_REPORT_SOURCE;

export const recordLeadEvent = async (lead: LeadPayload, deliveryChannel: LeadDeliveryChannel) => {
  if (!shouldTrackLeadEvent(lead)) {
    return;
  }

  const occurredAt = lead.submittedAt || new Date().toISOString();
  const dateKey = getMoscowDateKey(occurredAt);
  const filePath = getLeadEventsFilePath(dateKey);
  const event: LeadEventRecord = {
    occurredAt,
    source: lead.source || "direct",
    service: lead.service || "-",
    page: lead.page || "/",
    deliveryChannel
  };

  await mkdir(LEAD_EVENTS_DIR, { recursive: true });
  await appendFile(filePath, `${JSON.stringify(event)}\n`, "utf-8");
};

export const readLeadEventsForDate = async (dateKey: string) => {
  try {
    const file = await readFile(getLeadEventsFilePath(dateKey), "utf-8");

    return file
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line) as LeadEventRecord);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [] as LeadEventRecord[];
    }

    throw error;
  }
};
