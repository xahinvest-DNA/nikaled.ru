"use client";

export type AnalyticsEvent =
  | "start_lead_form"
  | "submit_lead"
  | "submit_lead_form"
  | "submit_calculator"
  | "click_call"
  | "click_telegram"
  | "open_calculator"
  | "open_ai_assistant"
  | "start_ai_dialog"
  | "ai_quick_reply_click"
  | "ai_contact_requested"
  | "ai_lead_submitted"
  | "ai_dialog_error";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    ym?: (id: number, method: string, target: string, params?: Record<string, unknown>) => void;
  }
}

export const trackEvent = (eventName: AnalyticsEvent, params?: Record<string, unknown>) => {
  if (typeof window === "undefined") return;

  if (window.gtag) {
    window.gtag("event", eventName, params ?? {});
  }

  const ymId = process.env.NEXT_PUBLIC_YM_ID ? Number(process.env.NEXT_PUBLIC_YM_ID) : null;
  if (ymId && typeof window.ym === "function") {
    window.ym(ymId, "reachGoal", eventName, params);
  }
};
