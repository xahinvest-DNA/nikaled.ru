"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { trackEvent } from "@/lib/analytics/events";
import {
  AI_ASSISTANT_LEAD_COOLDOWN_MS,
  clearAiSession,
  createAiMessage,
  createSessionId,
  loadAiSession,
  saveAiSession,
  trimAiMessages
} from "@/lib/ai-assistant/session";
import type {
  AiAssistantChatRouteResponse,
  AiAssistantLeadResponse,
  AiAssistantResponse,
  AiLeadState,
  AiMessage
} from "@/lib/ai-assistant/types";
import { formatPhoneRu, isValidRuPhone } from "@/lib/phone";

import { AiAssistantMessage } from "@/components/ai/AiAssistantMessage";
import { AiAssistantQuickReplies } from "@/components/ai/AiAssistantQuickReplies";

type Props = {
  open: boolean;
  onClose: () => void;
};

const INITIAL_QUICK_REPLIES = [
  "Рассчитать вывеску",
  "Подобрать тип вывески",
  "Есть фото фасада",
  "Нужен монтаж",
  "Нужно к открытию",
  "Нужно согласование",
  "Задать вопрос"
];

const WELCOME_MESSAGE =
  "Помогу понять, какой формат вывески подойдёт под ваш фасад, что влияет на стоимость и какие вводные нужны для расчёта. Что у вас за задача?";

const getWindowContext = () => {
  if (typeof window === "undefined") {
    return {
      page: "/",
      referrer: "",
      utm: {}
    };
  }

  const url = new URL(window.location.href);

  return {
    page: url.pathname,
    referrer: document.referrer || "",
    utm: {
      utm_source: url.searchParams.get("utm_source") || "",
      utm_campaign: url.searchParams.get("utm_campaign") || "",
      utm_term: url.searchParams.get("utm_term") || "",
      utm_content: url.searchParams.get("utm_content") || ""
    }
  };
};

const createWelcomeMessage = () => createAiMessage("assistant", WELCOME_MESSAGE);

export const AiAssistantPanel = ({ open, onClose }: Props) => {
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [leadState, setLeadState] = useState<AiLeadState>({});
  const [quickReplies, setQuickReplies] = useState<string[]>(INITIAL_QUICK_REPLIES);
  const [inputValue, setInputValue] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+7");
  const [contactComment, setContactComment] = useState("");
  const [fallbackPhone, setFallbackPhone] = useState("+7");
  const [fallbackContext, setFallbackContext] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showFallbackForm, setShowFallbackForm] = useState(false);
  const [showMobileQuickReplies, setShowMobileQuickReplies] = useState(true);
  const [leadSubmittedAt, setLeadSubmittedAt] = useState<string | undefined>(undefined);
  const [error, setError] = useState("");
  const [leadSuccess, setLeadSuccess] = useState("");
  const [hasStartedDialog, setHasStartedDialog] = useState(false);
  const [contactRequestedTracked, setContactRequestedTracked] = useState(false);
  const initializedRef = useRef(false);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const canSubmitLeadAgain = useMemo(() => {
    if (!leadSubmittedAt) return true;

    return Date.now() - new Date(leadSubmittedAt).getTime() >= AI_ASSISTANT_LEAD_COOLDOWN_MS;
  }, [leadSubmittedAt]);

  const userMessagesCount = useMemo(() => messages.filter((item) => item.role === "user").length, [messages]);

  const persistSession = (
    nextMessages: AiMessage[],
    nextLeadState: AiLeadState,
    nextLeadSubmittedAt = leadSubmittedAt
  ) => {
    if (!sessionId) return;

    saveAiSession({
      sessionId,
      messages: trimAiMessages(nextMessages),
      leadState: nextLeadState,
      leadSubmittedAt: nextLeadSubmittedAt,
      lastActiveAt: new Date().toISOString()
    });
  };

  const updateSessionState = (
    nextMessages: AiMessage[],
    nextLeadState: AiLeadState,
    nextLeadSubmittedAt = leadSubmittedAt
  ) => {
    setMessages(trimAiMessages(nextMessages));
    setLeadState(nextLeadState);
    setLeadSubmittedAt(nextLeadSubmittedAt);
    persistSession(nextMessages, nextLeadState, nextLeadSubmittedAt);
  };

  const resetDialogState = () => {
    const nextSessionId = createSessionId();
    const welcomeMessage = createWelcomeMessage();
    const context = getWindowContext();
    const nextLeadState: AiLeadState = {
      page: context.page,
      referrer: context.referrer,
      source: context.utm.utm_source || "ai_assistant",
      ...context.utm
    };

    clearAiSession();
    setSessionId(nextSessionId);
    setMessages([welcomeMessage]);
    setLeadState(nextLeadState);
    setQuickReplies(INITIAL_QUICK_REPLIES);
    setInputValue("");
    setName("");
    setPhone("+7");
    setContactComment("");
    setFallbackPhone("+7");
    setFallbackContext("");
    setIsLoading(false);
    setIsSubmittingLead(false);
    setShowContactForm(false);
    setShowFallbackForm(false);
    setShowMobileQuickReplies(true);
    setLeadSubmittedAt(undefined);
    setError("");
    setLeadSuccess("");
    setHasStartedDialog(false);
    setContactRequestedTracked(false);

    saveAiSession({
      sessionId: nextSessionId,
      messages: [welcomeMessage],
      leadState: nextLeadState,
      lastActiveAt: new Date().toISOString()
    });
  };

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const stored = loadAiSession();
    const context = getWindowContext();
    const nextMessages = stored.messages.length ? stored.messages : [createWelcomeMessage()];
    const nextLeadState: AiLeadState = {
      ...stored.leadState,
      page: context.page,
      referrer: context.referrer,
      source: stored.leadState.source || context.utm.utm_source || "ai_assistant",
      utm_source: context.utm.utm_source || stored.leadState.utm_source || "",
      utm_campaign: context.utm.utm_campaign || stored.leadState.utm_campaign || "",
      utm_term: context.utm.utm_term || stored.leadState.utm_term || "",
      utm_content: context.utm.utm_content || stored.leadState.utm_content || ""
    };

    setSessionId(stored.sessionId);
    setMessages(nextMessages);
    setLeadState(nextLeadState);
    setLeadSubmittedAt(stored.leadSubmittedAt);
    setContactComment(stored.leadState.summary || "");
    setHasStartedDialog(stored.messages.some((item) => item.role === "user"));
    setShowMobileQuickReplies(!stored.messages.some((item) => item.role === "user"));

    saveAiSession({
      sessionId: stored.sessionId,
      messages: nextMessages,
      leadState: nextLeadState,
      leadSubmittedAt: stored.leadSubmittedAt,
      lastActiveAt: new Date().toISOString()
    });
  }, []);

  useEffect(() => {
    if (!open) return;

    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open, showContactForm, showFallbackForm]);

  useEffect(() => {
    if (!showContactForm || contactRequestedTracked) return;

    trackEvent("ai_contact_requested", {
      page: leadState.page || "/",
      service: leadState.service || "unknown"
    });
    setContactRequestedTracked(true);
  }, [contactRequestedTracked, leadState.page, leadState.service, showContactForm]);

  useEffect(() => {
    if (userMessagesCount > 0) {
      setShowMobileQuickReplies(false);
    }
  }, [userMessagesCount]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading || !sessionId) return;

    const userMessage = createAiMessage("user", trimmed);
    const nextMessages = trimAiMessages([...messages, userMessage]);
    const nextLeadState = {
      ...leadState,
      page: getWindowContext().page,
      referrer: getWindowContext().referrer,
      source: leadState.source || getWindowContext().utm.utm_source || "ai_assistant",
      ...getWindowContext().utm
    };

    if (!hasStartedDialog) {
      trackEvent("start_ai_dialog", {
        page: nextLeadState.page || "/",
        source: "ai_assistant"
      });
      setHasStartedDialog(true);
    }

    setInputValue("");
    setError("");
    setLeadSuccess("");
    setShowFallbackForm(false);
    setShowMobileQuickReplies(false);
    updateSessionState(nextMessages, nextLeadState);
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-assistant/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sessionId,
          message: trimmed,
          history: nextMessages,
          leadState: nextLeadState,
          page: nextLeadState.page,
          referrer: nextLeadState.referrer,
          utm: {
            utm_source: nextLeadState.utm_source || "",
            utm_campaign: nextLeadState.utm_campaign || "",
            utm_term: nextLeadState.utm_term || "",
            utm_content: nextLeadState.utm_content || ""
          }
        })
      });

      const data = (await response.json()) as AiAssistantChatRouteResponse;

      if (!response.ok || data.ok === false) {
        const errorData = data as Exclude<AiAssistantChatRouteResponse, { ok: true } & AiAssistantResponse>;

        setShowFallbackForm(true);
        setShowContactForm(Boolean(errorData.shouldAskContact));
        setQuickReplies(errorData.quickReplies?.length ? errorData.quickReplies : INITIAL_QUICK_REPLIES);

        if (errorData.fallbackReply) {
          const fallbackMessage = createAiMessage("assistant", errorData.fallbackReply);
          const fallbackMessages = trimAiMessages([...nextMessages, fallbackMessage]);
          updateSessionState(fallbackMessages, errorData.leadState || nextLeadState);
        }

        setError(errorData.message || "Помощник временно не отвечает.");
        trackEvent("ai_dialog_error", {
          page: nextLeadState.page || "/",
          source: "ai_assistant",
          stage: "chat"
        });
        return;
      }

      const assistantMessage = createAiMessage("assistant", data.reply);
      const mergedMessages = trimAiMessages([...nextMessages, assistantMessage]);

      setQuickReplies(data.quickReplies?.length ? data.quickReplies : INITIAL_QUICK_REPLIES);
      setShowContactForm(Boolean(data.shouldAskContact) && !leadSubmittedAt);
      setContactComment(data.leadState.summary || contactComment);
      updateSessionState(mergedMessages, data.leadState);
    } catch {
      setShowFallbackForm(true);
      setShowContactForm(true);
      setError("Помощник временно не отвечает.");
      trackEvent("ai_dialog_error", {
        page: leadState.page || "/",
        source: "ai_assistant",
        stage: "chat"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = async (value: string) => {
    trackEvent("ai_quick_reply_click", {
      page: leadState.page || "/",
      reply: value
    });
    await sendMessage(value);
  };

  const submitLead = async () => {
    setError("");
    setLeadSuccess("");

    if (!canSubmitLeadAgain) {
      setError("Повторно отправить заявку можно через 45 секунд.");
      return;
    }

    if (!isValidRuPhone(phone)) {
      setError("Введите корректный телефон в формате +7.");
      return;
    }

    const nextLeadState: AiLeadState = {
      ...leadState,
      name: name.trim() || leadState.name || "",
      phone,
      summary: contactComment.trim() || leadState.summary || "",
      page: leadState.page || getWindowContext().page,
      referrer: leadState.referrer || getWindowContext().referrer,
      source: leadState.source || getWindowContext().utm.utm_source || "ai_assistant",
      ...getWindowContext().utm
    };

    setIsSubmittingLead(true);

    try {
      const response = await fetch("/api/ai-assistant/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sessionId,
          history: messages,
          leadState: nextLeadState
        })
      });

      const data = (await response.json()) as AiAssistantLeadResponse;

      if (!response.ok || !data.ok) {
        setError(data.message || "Не удалось отправить заявку.");
        trackEvent("ai_dialog_error", {
          page: nextLeadState.page || "/",
          source: "ai_assistant",
          stage: "lead_submit"
        });
        return;
      }

      const submittedAt = new Date().toISOString();
      const successMessage = createAiMessage(
        "assistant",
        "Готово. Я передал информацию специалисту. Обычно отвечаем в течение 10 минут в рабочее время."
      );
      const nextMessages = trimAiMessages([...messages, successMessage]);

      updateSessionState(nextMessages, nextLeadState, submittedAt);
      setShowContactForm(false);
      setLeadSubmittedAt(submittedAt);
      setLeadSuccess("Заявка отправлена.");
      trackEvent("submit_lead", {
        source: "ai_assistant",
        service: nextLeadState.service || "unknown",
        page: nextLeadState.page || "/"
      });
      trackEvent("ai_lead_submitted", {
        source: "ai_assistant",
        service: nextLeadState.service || "unknown",
        page: nextLeadState.page || "/"
      });
    } catch {
      setError("Не удалось отправить заявку.");
      trackEvent("ai_dialog_error", {
        page: leadState.page || "/",
        source: "ai_assistant",
        stage: "lead_submit"
      });
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const submitFallbackLead = async () => {
    setError("");
    setLeadSuccess("");

    if (!canSubmitLeadAgain) {
      setError("Повторно отправить заявку можно через 45 секунд.");
      return;
    }

    if (!isValidRuPhone(fallbackPhone)) {
      setError("Введите корректный телефон в формате +7.");
      return;
    }

    if (!fallbackContext.trim()) {
      setError("Коротко опишите задачу.");
      return;
    }

    setIsSubmittingLead(true);

    try {
      const context = getWindowContext();
      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("phone", fallbackPhone);
      formData.append("context", `Fallback AI-помощника: ${fallbackContext.trim()}`);
      formData.append("service", leadState.service || "");
      formData.append("page", context.page);
      formData.append("source", context.utm.utm_source || "ai_assistant_fallback");
      formData.append("referrer", context.referrer || "");
      formData.append("company", "");
      formData.append("utm_source", context.utm.utm_source || "");
      formData.append("utm_campaign", context.utm.utm_campaign || "");
      formData.append("utm_term", context.utm.utm_term || "");
      formData.append("utm_content", context.utm.utm_content || "");

      const response = await fetch("/api/lead", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Fallback lead request failed");
      }

      const submittedAt = new Date().toISOString();
      const nextLeadState: AiLeadState = {
        ...leadState,
        name: name.trim() || leadState.name || "",
        phone: fallbackPhone,
        summary: fallbackContext.trim(),
        page: context.page,
        referrer: context.referrer,
        source: context.utm.utm_source || "ai_assistant_fallback",
        ...context.utm
      };
      const successMessage = createAiMessage(
        "assistant",
        "Заявка отправлена. Мы получили ваш телефон и описание задачи, свяжемся в рабочее время."
      );
      const nextMessages = trimAiMessages([...messages, successMessage]);

      updateSessionState(nextMessages, nextLeadState, submittedAt);
      setLeadSubmittedAt(submittedAt);
      setLeadSuccess("Заявка отправлена.");
      trackEvent("submit_lead", {
        source: "ai_assistant_fallback",
        service: nextLeadState.service || "unknown",
        page: nextLeadState.page || "/"
      });
      trackEvent("ai_lead_submitted", {
        source: "ai_assistant_fallback",
        service: nextLeadState.service || "unknown",
        page: nextLeadState.page || "/"
      });
    } catch {
      setError("Не удалось отправить заявку.");
      trackEvent("ai_dialog_error", {
        page: leadState.page || "/",
        source: "ai_assistant_fallback",
        stage: "fallback_submit"
      });
    } finally {
      setIsSubmittingLead(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-x-3 bottom-[5.5rem] top-4 z-[60] md:inset-x-auto md:bottom-6 md:right-6 md:top-auto md:h-[640px] md:w-[400px]">
      <div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-steel/10 bg-paper shadow-[0_24px_60px_rgba(16,25,34,0.22)]">
        <div className="flex items-start justify-between gap-4 border-b border-steel/10 bg-white px-4 py-4">
          <div>
            <h2 className="text-base font-black text-steel">AI-помощник Nikaled</h2>
            <p className="mt-1 text-xs leading-5 text-steel/70">
              Поможет выбрать вывеску и подготовить расчёт
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="text-xs font-semibold text-steel/60" onClick={resetDialogState}>
              Очистить
            </button>
            <button type="button" className="text-xs font-semibold text-steel/60" onClick={onClose}>
              Закрыть
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="space-y-3">
            {messages.map((message) => (
              <AiAssistantMessage key={message.id} message={message} />
            ))}
            {isLoading ? (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-steel/10 bg-white px-4 py-3 text-sm text-steel/70">
                  Смотрю, какой вариант лучше предложить...
                </div>
              </div>
            ) : null}
          </div>

          {showContactForm ? (
            <div className="card mt-4 space-y-3 border border-steel/10 p-4">
              <h3 className="text-sm font-bold text-steel">Оставьте телефон для расчёта</h3>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Имя (опционально)"
                className="w-full rounded-lg border border-steel/15 bg-white px-3 py-2 text-sm text-steel outline-none placeholder:text-steel/45 focus:border-steel/35"
              />
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(formatPhoneRu(event.target.value))}
                placeholder="+7 (___) ___-__-__"
                className="w-full rounded-lg border border-steel/15 bg-white px-3 py-2 text-sm text-steel outline-none placeholder:text-steel/45 focus:border-steel/35"
              />
              <textarea
                rows={3}
                value={contactComment}
                onChange={(event) => setContactComment(event.target.value)}
                placeholder="Короткий комментарий (опционально)"
                className="w-full rounded-lg border border-steel/15 bg-white px-3 py-2 text-sm text-steel outline-none placeholder:text-steel/45 focus:border-steel/35"
              />
              <p className="text-xs leading-5 text-steel/65">
                Нажимая “Отправить”, вы соглашаетесь на обработку данных для связи по заявке.
              </p>
              <button
                type="button"
                className="btn-primary w-full"
                onClick={submitLead}
                disabled={isSubmittingLead}
              >
                {isSubmittingLead ? "Отправляем..." : "Отправить"}
              </button>
            </div>
          ) : null}

          {showFallbackForm ? (
            <div className="card mt-4 space-y-3 border border-steel/10 p-4">
              <h3 className="text-sm font-bold text-steel">Если удобнее, оставьте заявку сразу</h3>
              <input
                type="tel"
                value={fallbackPhone}
                onChange={(event) => setFallbackPhone(formatPhoneRu(event.target.value))}
                placeholder="+7 (___) ___-__-__"
                className="w-full rounded-lg border border-steel/15 bg-white px-3 py-2 text-sm text-steel outline-none placeholder:text-steel/45 focus:border-steel/35"
              />
              <textarea
                rows={3}
                value={fallbackContext}
                onChange={(event) => setFallbackContext(event.target.value)}
                placeholder="Например: нужна вывеска для новой точки, есть фото фасада"
                className="w-full rounded-lg border border-steel/15 bg-white px-3 py-2 text-sm text-steel outline-none placeholder:text-steel/45 focus:border-steel/35"
              />
              <button
                type="button"
                className="btn-primary w-full"
                onClick={submitFallbackLead}
                disabled={isSubmittingLead}
              >
                {isSubmittingLead ? "Отправляем..." : "Отправить заявку"}
              </button>
            </div>
          ) : null}

          <div ref={messageEndRef} />
        </div>

        <div className="border-t border-steel/10 bg-white px-4 py-4">
          <div className="mb-3 flex items-center justify-between md:hidden">
            <button
              type="button"
              className="text-xs font-semibold text-steel/65"
              onClick={() => setShowMobileQuickReplies((current) => !current)}
            >
              {showMobileQuickReplies ? "Скрыть подсказки" : "Подсказки"}
            </button>
            {userMessagesCount > 0 ? <span className="text-[11px] text-steel/45">Можно вести диалог и без кнопок</span> : null}
          </div>
          <div className={showMobileQuickReplies ? "block" : "hidden md:block"}>
            <AiAssistantQuickReplies items={quickReplies} disabled={isLoading} onSelect={handleQuickReply} />
          </div>
          <div className="mt-3 flex items-end gap-2">
            <textarea
              rows={2}
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Опишите задачу или задайте вопрос"
              className="min-h-[74px] flex-1 resize-none rounded-2xl border border-steel/15 bg-paper px-3 py-3 text-sm text-steel outline-none placeholder:text-steel/45 focus:border-steel/35"
            />
            <button
              type="button"
              className="btn-primary shrink-0 px-4 py-3"
              onClick={() => void sendMessage(inputValue)}
              disabled={isLoading}
            >
              Отправить
            </button>
          </div>
          {error ? <p className="mt-3 text-xs text-red-600">{error}</p> : null}
          {leadSuccess ? <p className="mt-3 text-xs text-emerald-700">{leadSuccess}</p> : null}
        </div>
      </div>
    </div>
  );
};
