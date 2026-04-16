"use client";

import { trackEvent } from "@/lib/analytics/events";

type Props = {
  text: string;
  className?: string;
  analyticsSource?: string;
};

export const OpenCalcButton = ({ text, className, analyticsSource = "calculator_button" }: Props) => {
  return (
    <button
      type="button"
      className={className ?? "btn-primary"}
      onClick={() => {
        window.dispatchEvent(new CustomEvent("open-calculator"));
        trackEvent("open_calculator", { source: analyticsSource });
      }}
    >
      {text}
    </button>
  );
};
