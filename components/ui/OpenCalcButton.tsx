"use client";

import { trackEvent } from "@/lib/analytics/events";

type Props = {
  text: string;
  className?: string;
};

export const OpenCalcButton = ({ text, className }: Props) => {
  return (
    <button
      type="button"
      className={className ?? "btn-primary"}
      onClick={() => {
        window.dispatchEvent(new CustomEvent("open-calculator"));
        trackEvent("open_calculator");
      }}
    >
      {text}
    </button>
  );
};

