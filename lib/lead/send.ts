import nodemailer from "nodemailer";

import type { LeadPayload } from "@/lib/lead/types";

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
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) throw new Error("Telegram env is not configured");

  const leadText = toLeadText(lead);

  if (file && file.size > 0) {
    const form = new FormData();
    form.append("chat_id", chatId);
    form.append("document", file, file.name);
    form.append("caption", "Файл к заявке");
    await fetch(`https://api.telegram.org/bot${token}/sendDocument`, { method: "POST", body: form });
  }

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: leadText
    })
  });
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

export const sendLead = async (lead: LeadPayload, file?: File) => {
  const provider = process.env.LEAD_PROVIDER ?? "telegram";

  if (provider === "email") {
    await sendLeadToEmail(lead, file);
    return;
  }

  await sendLeadToTelegram(lead, file);
};

