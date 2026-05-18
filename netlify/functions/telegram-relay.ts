import { toLeadText } from "../../lib/lead/format";
import type { LeadPayload } from "../../lib/lead/types";

type RelayFile = {
  name?: string;
  type?: string;
  contentBase64?: string;
};

type RelayBody = {
  lead?: LeadPayload;
  file?: RelayFile;
};

const getChatIds = () => {
  const raw = process.env.TELEGRAM_CHAT_IDS || process.env.TELEGRAM_CHAT_ID || "";
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const handler = async (event: { httpMethod?: string; headers?: Record<string, string | undefined>; body?: string | null }) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ ok: false, message: "Method not allowed" }) };
  }

  const relayToken = process.env.TELEGRAM_RELAY_TOKEN?.trim() || "";
  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim() || "";
  const chatIds = getChatIds();

  if (!relayToken || !botToken || chatIds.length === 0) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, message: "Relay env is not configured" }) };
  }

  const providedToken = event.headers?.["x-telegram-relay-token"] || event.headers?.["X-Telegram-Relay-Token"] || "";
  if (providedToken.trim() !== relayToken) {
    return { statusCode: 401, body: JSON.stringify({ ok: false, message: "Unauthorized" }) };
  }

  let parsed: RelayBody;
  try {
    parsed = JSON.parse(event.body || "{}") as RelayBody;
  } catch {
    return { statusCode: 400, body: JSON.stringify({ ok: false, message: "Invalid JSON body" }) };
  }

  const lead = parsed.lead;
  if (!lead?.phone || !lead.context) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, message: "Lead payload is incomplete" }) };
  }

  const leadText = toLeadText(lead);

  for (const chatId of chatIds) {
    if (parsed.file?.contentBase64) {
      const form = new FormData();
      const bytes = Buffer.from(parsed.file.contentBase64, "base64");
      const blob = new Blob([bytes], { type: parsed.file.type || "application/octet-stream" });

      form.append("chat_id", chatId);
      form.append("document", blob, parsed.file.name || "attachment.bin");
      form.append("caption", "Файл к заявке");

      const documentResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
        method: "POST",
        body: form
      });

      if (!documentResponse.ok) {
        return {
          statusCode: 502,
          body: JSON.stringify({
            ok: false,
            message: "Telegram sendDocument failed",
            details: await documentResponse.text()
          })
        };
      }
    }

    const messageResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: leadText
      })
    });

    if (!messageResponse.ok) {
      return {
        statusCode: 502,
        body: JSON.stringify({
          ok: false,
          message: "Telegram sendMessage failed",
          details: await messageResponse.text()
        })
      };
    }
  }

  return {
    statusCode: 200,
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ ok: true })
  };
};
