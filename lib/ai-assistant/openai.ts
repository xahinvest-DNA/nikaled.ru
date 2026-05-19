import { AI_ASSISTANT_KNOWLEDGE } from "@/lib/ai-assistant/knowledge";
import { buildExpertGuidanceText } from "@/lib/ai-assistant/expert-flow";
import { AI_ASSISTANT_SYSTEM_PROMPT } from "@/lib/ai-assistant/system-prompt";
import type { AiAssistantRequest, AiInquiryType, AiLeadState, AiSpinStage } from "@/lib/ai-assistant/types";

export type LeadStatePatch = {
  name: string | null;
  phone: string | null;
  service: string | null;
  businessType: string | null;
  objectType: string | null;
  city: string | null;
  size: string | null;
  hasPhoto: boolean | null;
  inquiryType: AiInquiryType | null;
  productType: string | null;
  illumination: string | null;
  mountingNeeded: boolean | null;
  designPreference: string | null;
  deadline: string | null;
  budget: string | null;
  goal: string | null;
  pain: string | null;
  implication: string | null;
  needPayoff: string | null;
  priority: string | null;
  needsApproval: boolean | null;
  situation: string | null;
  summary: string | null;
  spinStage: AiSpinStage | null;
};

export type OpenAiAssistantModelPayload = {
  reply: string;
  quickReplies: string[];
  shouldAskContact: boolean;
  shouldSubmitLead: boolean;
  leadStatePatch: LeadStatePatch;
};

export type OpenAiChatCompletionRequestBody = {
  model: string;
  temperature: number;
  max_tokens: number;
  messages: Array<{
    role: "system" | "user";
    content: string;
  }>;
};

export type OpenAiRelayRequestBody = {
  requestBody: OpenAiChatCompletionRequestBody;
};

export const OPENAI_RESPONSE_SCHEMA = {
  name: "nikaled_ai_assistant_response",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["reply", "quickReplies", "shouldAskContact", "shouldSubmitLead", "leadStatePatch"],
    properties: {
      reply: { type: "string" },
      quickReplies: {
        type: "array",
        items: { type: "string" }
      },
      shouldAskContact: { type: "boolean" },
      shouldSubmitLead: { type: "boolean" },
      leadStatePatch: {
        type: "object",
        additionalProperties: false,
        required: [
          "name",
          "phone",
          "service",
          "businessType",
          "objectType",
          "city",
          "size",
          "hasPhoto",
          "inquiryType",
          "productType",
          "illumination",
          "mountingNeeded",
          "designPreference",
          "deadline",
          "budget",
          "goal",
          "pain",
          "implication",
          "needPayoff",
          "priority",
          "needsApproval",
          "situation",
          "summary",
          "spinStage"
        ],
        properties: {
          name: { type: ["string", "null"] },
          phone: { type: ["string", "null"] },
          service: { type: ["string", "null"] },
          businessType: { type: ["string", "null"] },
          objectType: { type: ["string", "null"] },
          city: { type: ["string", "null"] },
          size: { type: ["string", "null"] },
          hasPhoto: { type: ["boolean", "null"] },
          inquiryType: {
            type: ["string", "null"],
            enum: ["calculation", "selection", "timing", "approval", "photo", "question", null]
          },
          productType: { type: ["string", "null"] },
          illumination: { type: ["string", "null"] },
          mountingNeeded: { type: ["boolean", "null"] },
          designPreference: { type: ["string", "null"] },
          deadline: { type: ["string", "null"] },
          budget: { type: ["string", "null"] },
          goal: { type: ["string", "null"] },
          pain: { type: ["string", "null"] },
          implication: { type: ["string", "null"] },
          needPayoff: { type: ["string", "null"] },
          priority: { type: ["string", "null"] },
          needsApproval: { type: ["boolean", "null"] },
          situation: { type: ["string", "null"] },
          summary: { type: ["string", "null"] },
          spinStage: {
            type: ["string", "null"],
            enum: ["situation", "problem", "implication", "need_payoff", "close", null]
          }
        }
      }
    }
  }
} as const;

export const stringifyHistoryForModel = (history: AiAssistantRequest["history"]) =>
  history
    .slice(-20)
    .map((item) => `${item.role === "user" ? "Клиент" : "AI"}: ${item.content}`)
    .join("\n");

export const buildOpenAiRequestBody = (
  payload: AiAssistantRequest,
  leadState: AiLeadState,
  model: string
): OpenAiChatCompletionRequestBody => ({
  model,
  temperature: 0.2,
  max_tokens: 280,
  messages: [
    {
      role: "system",
      content: AI_ASSISTANT_SYSTEM_PROMPT
    },
    {
      role: "system",
      content: `База знаний сайта Nikaled:\n${AI_ASSISTANT_KNOWLEDGE}`
    },
    {
      role: "system",
      content: buildExpertGuidanceText(payload.message, leadState, payload.history)
    },
    {
      role: "system",
      content: [
        "Верни только JSON без markdown, без пояснений и без лишнего текста.",
        "JSON должен соответствовать структуре:",
        JSON.stringify({
          reply: "string",
          quickReplies: ["string"],
          shouldAskContact: false,
          shouldSubmitLead: false,
          leadStatePatch: {
            name: null,
            phone: null,
            service: null,
            businessType: null,
            objectType: null,
            city: null,
            size: null,
            hasPhoto: null,
            inquiryType: null,
            productType: null,
            illumination: null,
            mountingNeeded: null,
            designPreference: null,
            deadline: null,
            budget: null,
            goal: null,
            pain: null,
            implication: null,
            needPayoff: null,
            priority: null,
            needsApproval: null,
            situation: null,
            summary: null,
            spinStage: null
          }
        }),
        "Все ключи обязательны. Если данных нет, используй null, false или пустой массив."
      ].join("\n")
    },
    {
      role: "user",
      content: [
        `Текущая страница: ${payload.page}`,
        `Referrer: ${payload.referrer || "-"}`,
        `UTM: ${JSON.stringify(payload.utm || {})}`,
        `Текущее leadState: ${JSON.stringify(leadState)}`,
        `История диалога:\n${stringifyHistoryForModel(payload.history) || "-"}`,
        `Новое сообщение клиента: ${payload.message}`,
        "",
        "Верни JSON по схеме. В reply дай готовый ответ клиенту."
      ].join("\n")
    }
  ]
});

export const extractCompletionContent = (data: unknown) => {
  const root = data as {
    choices?: Array<{
      message?: {
        content?: string | Array<{ type?: string; text?: string }>;
      };
    }>;
  };

  const content = root.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => item.text || "")
      .join("")
      .trim();
  }

  return "";
};

export const extractJsonObjectText = (content: string) => {
  const trimmed = content.trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("```")) {
    const withoutFence = trimmed
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/i, "")
      .trim();

    if (withoutFence.startsWith("{") && withoutFence.endsWith("}")) {
      return withoutFence;
    }
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
};
