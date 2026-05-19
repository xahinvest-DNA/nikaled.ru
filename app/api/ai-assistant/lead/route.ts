import { NextResponse } from "next/server";

import { buildAiLeadContext, enrichLeadStateForSubmission } from "@/lib/ai-assistant/lead-summary";
import { checkRateLimit } from "@/lib/ai-assistant/rate-limit";
import type { AiAssistantLeadRequest, AiAssistantLeadResponse } from "@/lib/ai-assistant/types";
import { sendLead } from "@/lib/lead/send";
import { isValidRuPhone } from "@/lib/phone";

export const runtime = "nodejs";

const AI_LEAD_LIMIT = 3;
const AI_LEAD_WINDOW_MS = 60 * 60 * 1000;

const bad = (message: string, status = 400) =>
  NextResponse.json(
    {
      ok: false,
      message
    } satisfies AiAssistantLeadResponse,
    { status }
  );

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let payload: AiAssistantLeadRequest;
    let file: File | undefined;

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const historyRaw = String(form.get("history") || "[]");
      const leadStateRaw = String(form.get("leadState") || "{}");

      payload = {
        sessionId: String(form.get("sessionId") || "").trim(),
        history: JSON.parse(historyRaw),
        leadState: JSON.parse(leadStateRaw)
      } as AiAssistantLeadRequest;

      const maybeFile = form.get("file");
      file = maybeFile instanceof File && maybeFile.size > 0 ? maybeFile : undefined;
    } else {
      payload = (await request.json()) as AiAssistantLeadRequest;
    }

    if (!payload.sessionId?.trim()) return bad("sessionId is required");
    if (!payload.leadState?.phone?.trim()) return bad("phone is required");
    if (!isValidRuPhone(payload.leadState.phone)) return bad("phone is invalid");

    const phone = payload.leadState.phone.trim();

    const rateLimit = checkRateLimit(`ai-lead:${payload.sessionId}`, AI_LEAD_LIMIT, AI_LEAD_WINDOW_MS);
    if (!rateLimit.ok) {
      return bad("Too many lead submissions for this session", 429);
    }

    const enrichedLeadState = enrichLeadStateForSubmission(
      {
        ...payload.leadState,
        hasPhoto: file ? true : payload.leadState.hasPhoto
      },
      payload.history || []
    );
    const context = buildAiLeadContext(enrichedLeadState, payload.history || []);

    const leadPayload = {
      name: enrichedLeadState.name?.trim() || "",
      phone,
      context,
      service: enrichedLeadState.service?.trim() || "",
      page: enrichedLeadState.page?.trim() || "/",
      source: enrichedLeadState.source?.trim() || "ai_assistant",
      referrer: enrichedLeadState.referrer?.trim() || "",
      utm_source: enrichedLeadState.utm_source?.trim() || "",
      utm_campaign: enrichedLeadState.utm_campaign?.trim() || "",
      utm_term: enrichedLeadState.utm_term?.trim() || "",
      utm_content: enrichedLeadState.utm_content?.trim() || "",
      submittedAt: new Date().toISOString()
    } as const;

    // Attachment delivery can take noticeably longer than the browser request budget on mobile.
    // We acknowledge the lead immediately and let delivery finish in the background.
    void sendLead(leadPayload, file).catch((error) => {
      console.error("AI assistant lead background delivery failed:", error);
    });

    return NextResponse.json({
      ok: true,
      message: "Заявка от AI-помощника отправлена"
    } satisfies AiAssistantLeadResponse);
  } catch (error) {
    console.error("AI assistant lead error:", error);
    return bad("Internal error", 500);
  }
}
