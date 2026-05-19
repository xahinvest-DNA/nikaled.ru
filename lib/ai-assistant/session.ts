import type { AiLeadState, AiMessage, AiStoredSession } from "@/lib/ai-assistant/types";

export const AI_ASSISTANT_STORAGE_KEYS = {
  sessionId: "nikaled_ai_session_id",
  messages: "nikaled_ai_messages",
  leadState: "nikaled_ai_lead_state",
  meta: "nikaled_ai_meta"
} as const;

export const AI_ASSISTANT_MAX_MESSAGES = 20;
export const AI_ASSISTANT_INACTIVITY_MS = 24 * 60 * 60 * 1000;
export const AI_ASSISTANT_LEAD_COOLDOWN_MS = 45_000;

type StoredMeta = {
  leadSubmittedAt?: string;
  lastActiveAt: string;
};

const safeJsonParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const createSessionId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `ai-${Math.random().toString(36).slice(2)}-${Date.now()}`;
};

export const createAiMessage = (role: AiMessage["role"], content: string): AiMessage => ({
  id: createSessionId(),
  role,
  content,
  createdAt: new Date().toISOString()
});

export const trimAiMessages = (messages: AiMessage[]) => messages.slice(-AI_ASSISTANT_MAX_MESSAGES);

export const shouldResetAiSession = (lastActiveAt?: string) => {
  if (!lastActiveAt) return true;

  const lastTs = new Date(lastActiveAt).getTime();
  if (Number.isNaN(lastTs)) return true;

  return Date.now() - lastTs > AI_ASSISTANT_INACTIVITY_MS;
};

export const loadAiSession = (): AiStoredSession => {
  const now = new Date().toISOString();

  if (typeof window === "undefined") {
    return {
      sessionId: createSessionId(),
      messages: [],
      leadState: {},
      lastActiveAt: now
    };
  }

  const meta = safeJsonParse<StoredMeta | null>(window.localStorage.getItem(AI_ASSISTANT_STORAGE_KEYS.meta), null);
  const shouldReset = shouldResetAiSession(meta?.lastActiveAt);

  if (shouldReset) {
    const sessionId = createSessionId();

    window.localStorage.setItem(AI_ASSISTANT_STORAGE_KEYS.sessionId, sessionId);
    window.localStorage.setItem(AI_ASSISTANT_STORAGE_KEYS.messages, "[]");
    window.localStorage.setItem(AI_ASSISTANT_STORAGE_KEYS.leadState, "{}");
    window.localStorage.setItem(
      AI_ASSISTANT_STORAGE_KEYS.meta,
      JSON.stringify({
        lastActiveAt: now
      } satisfies StoredMeta)
    );

    return {
      sessionId,
      messages: [],
      leadState: {},
      lastActiveAt: now
    };
  }

  const sessionId = window.localStorage.getItem(AI_ASSISTANT_STORAGE_KEYS.sessionId) || createSessionId();
  const messages = trimAiMessages(safeJsonParse<AiMessage[]>(window.localStorage.getItem(AI_ASSISTANT_STORAGE_KEYS.messages), []));
  const leadState = safeJsonParse<AiLeadState>(window.localStorage.getItem(AI_ASSISTANT_STORAGE_KEYS.leadState), {});

  return {
    sessionId,
    messages,
    leadState,
    leadSubmittedAt: meta?.leadSubmittedAt,
    lastActiveAt: meta?.lastActiveAt || now
  };
};

export const saveAiSession = (session: AiStoredSession) => {
  if (typeof window === "undefined") return;

  const normalizedSession: AiStoredSession = {
    ...session,
    messages: trimAiMessages(session.messages),
    lastActiveAt: session.lastActiveAt || new Date().toISOString()
  };

  window.localStorage.setItem(AI_ASSISTANT_STORAGE_KEYS.sessionId, normalizedSession.sessionId);
  window.localStorage.setItem(AI_ASSISTANT_STORAGE_KEYS.messages, JSON.stringify(normalizedSession.messages));
  window.localStorage.setItem(AI_ASSISTANT_STORAGE_KEYS.leadState, JSON.stringify(normalizedSession.leadState));
  window.localStorage.setItem(
    AI_ASSISTANT_STORAGE_KEYS.meta,
    JSON.stringify({
      leadSubmittedAt: normalizedSession.leadSubmittedAt,
      lastActiveAt: normalizedSession.lastActiveAt
    } satisfies StoredMeta)
  );
};

export const clearAiSession = () => {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(AI_ASSISTANT_STORAGE_KEYS.sessionId);
  window.localStorage.removeItem(AI_ASSISTANT_STORAGE_KEYS.messages);
  window.localStorage.removeItem(AI_ASSISTANT_STORAGE_KEYS.leadState);
  window.localStorage.removeItem(AI_ASSISTANT_STORAGE_KEYS.meta);
};
