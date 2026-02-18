"use client";

export type AnalyticsEvent = "submit_lead" | "click_call" | "click_whatsapp" | "click_telegram" | "open_calculator";

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
  if (ymId && window.ym) {
    window.ym(ymId, "reachGoal", eventName, params);
  }
};

