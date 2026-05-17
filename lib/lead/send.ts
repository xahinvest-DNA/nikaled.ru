import { mkdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { randomUUID } from "node:crypto";
import nodemailer from "nodemailer";

import type { LeadPayload } from "@/lib/lead/types";

type LeadProvider = "telegram" | "email";

const FALLBACK_DIR = join(process.cwd(), "var", "failed-leads");

const toLeadText = (lead: LeadPayload) =>
  [
    "Новая заявка с сайта",
    `Имя: ${lead.name || "-"}`,
    `Телефон: ${lead.phone}`,
    `Задача: ${lead.context}`,
    `Услуга: ${lead.service || "-"}`,
    `Страница: ${lead.page}`,
    `Источник: ${lead.source}`,
    `Referrer: ${lead.referrer || "-"}`,
    `UTM source: ${lead.utm_source || "-"}`,
    `UTM campaign: ${lead.utm_campaign || "-"}`,
    `UTM term: ${lead.utm_term || "-"}`,
    `UTM content: ${lead.utm_content || "-"}`,
    `Время: ${lead.submittedAt}`
  ].join("\n");

export const sendLeadToTelegram = async (lead: LeadPayload, file?: File) => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIdsRaw = process.env.TELEGRAM_CHAT_IDS || process.env.TELEGRAM_CHAT_ID || "";
  const chatIds = chatIdsRaw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (!token || chatIds.length === 0) throw new Error("Telegram env is not configured");

  const leadText = toLeadText(lead);

  for (const chatId of chatIds) {
    if (file && file.size > 0) {
      const form = new FormData();
      form.append("chat_id", chatId);
      form.append("document", file, file.name);
      form.append("caption", "Файл к заявке");
      const fileRes = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, { method: "POST", body: form });
      if (!fileRes.ok) {
        const details = await fileRes.text();
        throw new Error(`Telegram sendDocument failed for chat_id=${chatId}: ${details}`);
      }
    }

    const msgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: leadText
      })
    });
    if (!msgRes.ok) {
      const details = await msgRes.text();
      throw new Error(`Telegram sendMessage failed for chat_id=${chatId}: ${details}`);
    }
  }
};

export const sendLeadToEmail = async (lead: LeadPayload, file?: File) => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465;
  const secure = process.env.SMTP_SECURE !== "false";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;
  const to = process.env.SMTP_TO;

  if (!host || !user || !pass || !from || !to) throw new Error("SMTP env is not configured");

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass }
  });

  const attachments =
    file && file.size > 0
      ? [
          {
            filename: file.name,
            content: Buffer.from(await file.arrayBuffer())
          }
        ]
      : [];

  await transporter.sendMail({
    from,
    to,
    subject: "Новая заявка с сайта",
    text: toLeadText(lead),
    attachments
  });
};

const getLeadConfig = () => {
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
  const telegramChatIdsRaw = process.env.TELEGRAM_CHAT_IDS || process.env.TELEGRAM_CHAT_ID || "";
  const telegramChatIds = telegramChatIdsRaw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const smtp = {
    host: process.env.SMTP_HOST?.trim() || "",
    user: process.env.SMTP_USER?.trim() || "",
    pass: process.env.SMTP_PASS?.trim() || "",
    from: process.env.SMTP_FROM?.trim() || "",
    to: process.env.SMTP_TO?.trim() || ""
  };

  return {
    requestedProvider: (process.env.LEAD_PROVIDER?.trim().toLowerCase() || "auto") as LeadProvider | "auto",
    hasTelegram: Boolean(telegramToken) && telegramChatIds.length > 0,
    hasEmail: Boolean(smtp.host && smtp.user && smtp.pass && smtp.from && smtp.to),
    debug: {
      requestedProvider: process.env.LEAD_PROVIDER?.trim() || "auto",
      hasTelegramToken: Boolean(telegramToken),
      telegramChatIdsCount: telegramChatIds.length,
      hasSmtpHost: Boolean(smtp.host),
      hasSmtpUser: Boolean(smtp.user),
      hasSmtpPass: Boolean(smtp.pass),
      hasSmtpFrom: Boolean(smtp.from),
      hasSmtpTo: Boolean(smtp.to)
    }
  };
};

const normalizeAttachmentName = (file: File) => {
  const extension = extname(file.name || "").trim();
  return extension ? `attachment${extension}` : "attachment.bin";
};

const saveLeadFallback = async (lead: LeadPayload, file: File | undefined, error: unknown) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const leadId = `${timestamp}-${randomUUID()}`;
  const leadDir = join(FALLBACK_DIR, leadId);

  await mkdir(leadDir, { recursive: true });

  const fallbackRecord = {
    lead,
    savedAt: new Date().toISOString(),
    error: error instanceof Error ? error.message : String(error)
  };

  await writeFile(join(leadDir, "lead.json"), JSON.stringify(fallbackRecord, null, 2), "utf-8");

  if (file && file.size > 0) {
    const attachment = Buffer.from(await file.arrayBuffer());
    await writeFile(join(leadDir, normalizeAttachmentName(file)), attachment);
  }

  return leadDir;
};

const resolveLeadProvider = (): LeadProvider => {
  const config = getLeadConfig();

  if (config.requestedProvider === "telegram") {
    if (config.hasTelegram) return "telegram";
    if (config.hasEmail) {
      console.warn("LEAD_PROVIDER=telegram, but Telegram env is incomplete. Falling back to email.");
      return "email";
    }
  }

  if (config.requestedProvider === "email") {
    if (config.hasEmail) return "email";
    if (config.hasTelegram) {
      console.warn("LEAD_PROVIDER=email, but SMTP env is incomplete. Falling back to telegram.");
      return "telegram";
    }
  }

  if (config.hasTelegram) return "telegram";
  if (config.hasEmail) return "email";

  const details = JSON.stringify(config.debug);
  throw new Error(`Lead transport is not configured. ${details}`);
};

export const sendLead = async (lead: LeadPayload, file?: File) => {
  const provider = resolveLeadProvider();

  try {
    if (provider === "email") {
      await sendLeadToEmail(lead, file);
      return;
    }

    await sendLeadToTelegram(lead, file);
  } catch (error) {
    const fallbackPath = await saveLeadFallback(lead, file, error);

    console.error("Lead delivery failed, saved to fallback storage:", {
      provider,
      fallbackPath,
      message: error instanceof Error ? error.message : String(error)
    });
  }
};
