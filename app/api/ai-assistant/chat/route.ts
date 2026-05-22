import { NextResponse } from "next/server";

import {
  buildExpertQuickReplies,
  detectInquiryType
} from "@/lib/ai-assistant/expert-flow";
import { inferCommunicationProfile } from "@/lib/ai-assistant/dna-lite";
import { inferLeadStateFromText } from "@/lib/ai-assistant/intake";
import {
  buildOpenAiRequestBody,
  extractCompletionContent,
  extractJsonObjectText,
  type LeadStatePatch,
  type OpenAiAssistantModelPayload,
  type OpenAiChatCompletionRequestBody,
  type OpenAiRelayRequestBody
} from "@/lib/ai-assistant/openai";
import { checkRateLimit } from "@/lib/ai-assistant/rate-limit";
import { detectSpinStage } from "@/lib/ai-assistant/spin";
import type {
  AiAssistantChatRouteResponse,
  AiAssistantRequest,
  AiLeadState
} from "@/lib/ai-assistant/types";

export const runtime = "nodejs";

const FALLBACK_REPLY =
  "Сейчас помощник временно не отвечает. Вы можете оставить телефон и коротко описать задачу — мы сами свяжемся с вами для расчёта.";

const AI_CHAT_MESSAGES_LIMIT = 20;
const AI_CHAT_WINDOW_MS = 10 * 60 * 1000;
const OPENAI_MODEL = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
const OPENAI_DIRECT_TIMEOUT_MS = 8000;
const OPENAI_RELAY_TIMEOUT_MS = 18000;

const bad = (message: string, status = 400) =>
  NextResponse.json(
    {
      ok: false,
      message
    } satisfies AiAssistantChatRouteResponse,
    { status }
  );

const fallback = (message: string, leadState: AiLeadState, shouldAskContact = true, status = 503) =>
  NextResponse.json(
    {
      ok: false,
      message,
      fallbackReply: FALLBACK_REPLY,
      quickReplies: ["Оставить телефон", "Опишу задачу коротко"],
      leadState,
      shouldAskContact
    } satisfies AiAssistantChatRouteResponse,
    { status }
  );

const normalizeLeadState = (payload: AiAssistantRequest): AiLeadState => {
  const historyWithCurrentMessage =
    payload.history.at(-1)?.role === "user" && payload.history.at(-1)?.content === payload.message
      ? payload.history
      : [
          ...payload.history,
          {
            id: `${payload.sessionId}-current`,
            role: "user" as const,
            content: payload.message,
            createdAt: new Date().toISOString()
          }
        ];
  const inferredLeadState = inferLeadStateFromText(payload.message, payload.history);
  const normalizedState: AiLeadState = {
    ...payload.leadState,
    ...inferredLeadState,
    page: payload.page || payload.leadState.page || "/",
    referrer: payload.referrer || payload.leadState.referrer || "",
    source: payload.leadState.source || payload.utm?.utm_source || "ai_assistant",
    utm_source: payload.utm?.utm_source || payload.leadState.utm_source || "",
    utm_campaign: payload.utm?.utm_campaign || payload.leadState.utm_campaign || "",
    utm_term: payload.utm?.utm_term || payload.leadState.utm_term || "",
    utm_content: payload.utm?.utm_content || payload.leadState.utm_content || "",
    inquiryType:
      payload.leadState.inquiryType ||
      inferredLeadState.inquiryType ||
      detectInquiryType(payload.message, payload.leadState, payload.history)
  };

  return {
    ...normalizedState,
    spinStage: normalizedState.spinStage || detectSpinStage(normalizedState),
    communicationProfile: inferCommunicationProfile(historyWithCurrentMessage, normalizedState)
  };
};

const mergeLeadState = (current: AiLeadState, patch: LeadStatePatch): AiLeadState => {
  const next: AiLeadState = { ...current };

  for (const [key, value] of Object.entries(patch) as Array<[keyof LeadStatePatch, LeadStatePatch[keyof LeadStatePatch]]>) {
    if (typeof value === "boolean") {
      (next as Record<string, unknown>)[key] = value;
      continue;
    }

    if (typeof value === "string" && value.trim()) {
      (next as Record<string, unknown>)[key] = value.trim();
    }
  }

  return {
    ...next,
    spinStage: patch.spinStage || detectSpinStage(next)
  };
};

const APPROVAL_TOPIC_REGEX = /согласован|разрешени|документ/iu;
const MOCKUP_BARRIER_REGEX =
  /(как только .*макет|когда .*макет|нужн[оа] подготовить макет|рекомендую подготовить макет|как только у вас будет макет)/iu;

const splitSentences = (value: string) =>
  value
    .split(/(?<=[.!?])\s+/u)
    .map((item) => item.trim())
    .filter(Boolean);

const shouldMentionApproval = (payload: AiAssistantRequest, leadState: AiLeadState) => {
  const source = [
    payload.message,
    ...payload.history.filter((item) => item.role === "user").map((item) => item.content),
    leadState.service || "",
    leadState.summary || "",
    leadState.page || ""
  ]
    .join(" ")
    .toLowerCase();

  return (
    /согласован|разрешени|документ/i.test(source) ||
    Boolean(leadState.needsApproval) ||
    (leadState.service || "").toLowerCase().includes("согласование") ||
    (leadState.page || "").toLowerCase().includes("соглас")
  );
};

const isMockupMissingContext = (payload: AiAssistantRequest) => {
  const source = [payload.message, ...payload.history.filter((item) => item.role === "user").map((item) => item.content)]
    .join(" ")
    .toLowerCase();

  return /макет|дизайн|эскиз/i.test(source) && /(нет|не готов|не сделали|ничего из этого нет|пока нет)/i.test(source);
};

const sanitizeAssistantReply = (reply: string, payload: AiAssistantRequest, leadState: AiLeadState) => {
  let nextReply = reply.trim();

  if (!nextReply) {
    return nextReply;
  }

  if (!shouldMentionApproval(payload, leadState)) {
    nextReply = splitSentences(nextReply)
      .filter((sentence) => !APPROVAL_TOPIC_REGEX.test(sentence))
      .join(" ")
      .trim();
  }

  if (!nextReply) {
    nextReply = "Могу помочь с предварительным расчётом. Подскажите размер или желаемый формат вывески.";
  }

  if (MOCKUP_BARRIER_REGEX.test(nextReply)) {
    nextReply = nextReply.replace(
      /(как только .*макет[^.!?]*[.!?]?|когда .*макет[^.!?]*[.!?]?|нужн[оа] подготовить макет[^.!?]*[.!?]?|рекомендую подготовить макет[^.!?]*[.!?]?)/giu,
      "Если макета нет, это не проблема: можем подготовить его сами."
    );
  }

  if (isMockupMissingContext(payload) && !/можем подготовить (его )?(сами|у нас)|подготовим (его )?(сами|у нас)/iu.test(nextReply)) {
    nextReply = `Если макета нет, это не проблема: можем подготовить его сами. ${nextReply}`.trim();
  }

  return nextReply.replace(/\s{2,}/g, " ").trim();
};

const buildQuickReplies = (leadState: AiLeadState, currentMessage = "", history: AiAssistantRequest["history"] = []) =>
  buildExpertQuickReplies(leadState, currentMessage, history);

const buildHeuristicFlags = (leadState: AiLeadState, userMessagesCount: number) => {
  const qualificationSignals = [
    Boolean(leadState.service),
    Boolean(leadState.productType || leadState.illumination || leadState.mountingNeeded === true),
    Boolean(leadState.goal || leadState.needPayoff),
    Boolean(leadState.pain || leadState.implication),
    Boolean(leadState.businessType || leadState.objectType || leadState.situation),
    Boolean(leadState.deadline || leadState.size || leadState.hasPhoto),
    Boolean(leadState.priority || leadState.budget)
  ].filter(Boolean).length;

  const stage = detectSpinStage(leadState);
  const shouldAskContact =
    !leadState.phone &&
    qualificationSignals >= 3 &&
    (stage === "close" || (stage === "need_payoff" && userMessagesCount >= 4));
  const shouldSubmitLead = Boolean(leadState.phone) && qualificationSignals >= 3;

  return { shouldAskContact, shouldSubmitLead };
};

const parseModelPayload = (data: unknown) => {
  const content = extractCompletionContent(data);

  if (!content) {
    throw new Error("OpenAI returned empty content");
  }

  const parsed = JSON.parse(extractJsonObjectText(content)) as Partial<OpenAiAssistantModelPayload>;

  return {
    reply: typeof parsed.reply === "string" ? parsed.reply : "",
    quickReplies: Array.isArray(parsed.quickReplies)
      ? parsed.quickReplies.filter((item): item is string => typeof item === "string" && item.trim().length > 0).slice(0, 4)
      : [],
    shouldAskContact: Boolean(parsed.shouldAskContact),
    shouldSubmitLead: Boolean(parsed.shouldSubmitLead),
    leadStatePatch: {
      name: parsed.leadStatePatch?.name ?? null,
      phone: parsed.leadStatePatch?.phone ?? null,
      service: parsed.leadStatePatch?.service ?? null,
      businessType: parsed.leadStatePatch?.businessType ?? null,
      objectType: parsed.leadStatePatch?.objectType ?? null,
      city: parsed.leadStatePatch?.city ?? null,
      size: parsed.leadStatePatch?.size ?? null,
      hasPhoto: parsed.leadStatePatch?.hasPhoto ?? null,
      inquiryType: parsed.leadStatePatch?.inquiryType ?? null,
      productType: parsed.leadStatePatch?.productType ?? null,
      illumination: parsed.leadStatePatch?.illumination ?? null,
      mountingNeeded: parsed.leadStatePatch?.mountingNeeded ?? null,
      designPreference: parsed.leadStatePatch?.designPreference ?? null,
      deadline: parsed.leadStatePatch?.deadline ?? null,
      budget: parsed.leadStatePatch?.budget ?? null,
      goal: parsed.leadStatePatch?.goal ?? null,
      pain: parsed.leadStatePatch?.pain ?? null,
      implication: parsed.leadStatePatch?.implication ?? null,
      needPayoff: parsed.leadStatePatch?.needPayoff ?? null,
      priority: parsed.leadStatePatch?.priority ?? null,
      needsApproval: parsed.leadStatePatch?.needsApproval ?? null,
      situation: parsed.leadStatePatch?.situation ?? null,
      summary: parsed.leadStatePatch?.summary ?? null,
      spinStage: parsed.leadStatePatch?.spinStage ?? null
    }
  };
};

const isRetryableAssistantError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return false;
  }

  return /OpenAI returned empty content|Unexpected end of JSON input|JSON|invalid payload|length|Unexpected token|timeout|aborted|fetch failed|network/i.test(error.message);
};

const shouldTryRelayAfterError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message;
  return (
    /403/.test(message) ||
    /unsupported_country_region_territory/i.test(message) ||
    /abort/i.test(message) ||
    /timed out/i.test(message) ||
    /fetch failed/i.test(message) ||
    /network/i.test(message) ||
    /ECONNRESET/i.test(message) ||
    /ENOTFOUND/i.test(message) ||
    /ETIMEDOUT/i.test(message) ||
    /socket/i.test(message)
  );
};

const requestOpenAiDirect = async (requestBody: OpenAiChatCompletionRequestBody, apiKey: string) => {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    signal: AbortSignal.timeout(OPENAI_DIRECT_TIMEOUT_MS),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`OpenAI direct request failed: ${response.status} ${details}`);
  }

  return parseModelPayload(await response.json());
};

const requestOpenAiRelay = async (requestBody: OpenAiChatCompletionRequestBody) => {
  const relayUrl = process.env.OPENAI_RELAY_URL?.trim() || "";
  const relayToken = process.env.OPENAI_RELAY_TOKEN?.trim() || "";

  if (!relayUrl || !relayToken) {
    throw new Error("OpenAI relay env is not configured");
  }

  const response = await fetch(relayUrl, {
    method: "POST",
    signal: AbortSignal.timeout(OPENAI_RELAY_TIMEOUT_MS),
    headers: {
      "Content-Type": "application/json",
      "x-openai-relay-token": relayToken
    },
    body: JSON.stringify({
      requestBody
    } satisfies OpenAiRelayRequestBody)
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`OpenAI relay request failed: ${response.status} ${details}`);
  }

  const relayJson = (await response.json()) as {
    ok?: boolean;
    data?: unknown;
    message?: string;
  };

  if (!relayJson.ok || !relayJson.data) {
    throw new Error(`OpenAI relay returned invalid payload: ${relayJson.message || "empty data"}`);
  }

  return parseModelPayload(relayJson.data);
};

const executeOpenAiRequest = async (
  requestBody: OpenAiChatCompletionRequestBody,
  apiKey: string | undefined,
  hasRelay: boolean
) => {
  if (apiKey) {
    try {
      return await requestOpenAiDirect(requestBody, apiKey);
    } catch (error) {
      if (!hasRelay || !shouldTryRelayAfterError(error)) {
        throw error;
      }

      const debug = process.env.AI_ASSISTANT_DEBUG?.trim().toLowerCase() === "true";
      if (debug) {
        console.warn("OpenAI direct request failed. Trying relay fallback.", {
          message: error instanceof Error ? error.message : String(error)
        });
      }
    }
  }

  if (hasRelay) {
    return requestOpenAiRelay(requestBody);
  }

  return null;
};

const requestOpenAiCompletion = async (payload: AiAssistantRequest, leadState: AiLeadState) => {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const enabled = process.env.AI_ASSISTANT_ENABLED?.trim().toLowerCase() !== "false";
  const hasRelay = Boolean(process.env.OPENAI_RELAY_URL?.trim() && process.env.OPENAI_RELAY_TOKEN?.trim());

  if (!enabled) {
    return null;
  }

  const primaryRequestBody = buildOpenAiRequestBody(payload, leadState, OPENAI_MODEL, {
    maxTokens: 360
  });

  try {
    return await executeOpenAiRequest(primaryRequestBody, apiKey, hasRelay);
  } catch (error) {
    const debug = process.env.AI_ASSISTANT_DEBUG?.trim().toLowerCase() === "true";

    if (debug) {
      console.warn("Primary AI request failed.", {
        message: error instanceof Error ? error.message : String(error)
      });
    }

    if (!isRetryableAssistantError(error)) {
      throw error;
    }

    const compactRequestBody = buildOpenAiRequestBody(payload, leadState, OPENAI_MODEL, {
      compact: true,
      maxTokens: 180
    });

    if (debug) {
      console.warn("Retrying AI request with compact prompt.");
    }

    return executeOpenAiRequest(compactRequestBody, apiKey, hasRelay);
  }
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as AiAssistantRequest;

    if (!payload.sessionId?.trim()) return bad("sessionId is required");
    if (!payload.message?.trim()) return bad("message is required");

    const rateLimit = checkRateLimit(`ai-chat:${payload.sessionId}`, AI_CHAT_MESSAGES_LIMIT, AI_CHAT_WINDOW_MS);
    if (!rateLimit.ok) {
      return fallback("Слишком много сообщений за короткое время. Попробуйте ещё раз через несколько минут.", normalizeLeadState(payload), true, 429);
    }

    const normalizedLeadState = normalizeLeadState(payload);
    const modelResult = await requestOpenAiCompletion(payload, normalizedLeadState);

    if (!modelResult) {
      return fallback("AI-помощник сейчас отключён или не настроен.", normalizedLeadState);
    }

    const mergedLeadState = mergeLeadState(normalizedLeadState, modelResult.leadStatePatch);
    const historyWithCurrentMessage =
      payload.history.at(-1)?.role === "user" && payload.history.at(-1)?.content === payload.message
        ? payload.history
        : [
            ...payload.history,
            {
              id: `${payload.sessionId}-current`,
              role: "user" as const,
              content: payload.message,
              createdAt: new Date().toISOString()
            }
          ];
    const profiledLeadState: AiLeadState = {
      ...mergedLeadState,
      communicationProfile: inferCommunicationProfile(historyWithCurrentMessage, mergedLeadState)
    };
    const userMessagesCount = payload.history.filter((item) => item.role === "user").length;
    const heuristicFlags = buildHeuristicFlags(profiledLeadState, userMessagesCount);

    const resolvedQuickReplies = buildQuickReplies(profiledLeadState, payload.message, payload.history);

    return NextResponse.json({
      ok: true,
      reply: sanitizeAssistantReply(modelResult.reply, payload, profiledLeadState),
      leadState: profiledLeadState,
      quickReplies: resolvedQuickReplies,
      shouldAskContact: modelResult.shouldAskContact || heuristicFlags.shouldAskContact,
      shouldSubmitLead: modelResult.shouldSubmitLead || heuristicFlags.shouldSubmitLead
    } satisfies AiAssistantChatRouteResponse);
  } catch (error) {
    const debug = process.env.AI_ASSISTANT_DEBUG?.trim().toLowerCase() === "true";

    if (debug) {
      console.error("AI assistant chat error:", error);
    }

    return fallback("Не удалось получить ответ от AI-помощника.", {});
  }
}
