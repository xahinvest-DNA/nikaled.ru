"use client";

import { trackEvent } from "@/lib/analytics/events";

type Props = {
  text: string;
  className?: string;
  analyticsSource?: string;
};

export const OpenAiAssistantButton = ({
  text,
  className,
  analyticsSource = "ai_assistant_button"
}: Props) => {
  return (
    <button
      type="button"
      className={className ?? "btn-secondary"}
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent("open-ai-assistant", {
            detail: {
              source: analyticsSource
            }
          })
        );
        trackEvent("open_ai_assistant", { source: analyticsSource });
      }}
    >
      {text}
    </button>
  );
};
