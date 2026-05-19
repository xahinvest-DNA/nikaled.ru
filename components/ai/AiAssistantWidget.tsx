"use client";

import { useEffect, useState } from "react";

import { trackEvent } from "@/lib/analytics/events";

import { AiAssistantButton } from "@/components/ai/AiAssistantButton";
import { AiAssistantPanel } from "@/components/ai/AiAssistantPanel";

type OpenAssistantEvent = CustomEvent<{
  source?: string;
}>;

export const AiAssistantWidget = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openHandler = (event: Event) => {
      const customEvent = event as OpenAssistantEvent;
      const source = customEvent.detail?.source || "external_trigger";

      setOpen(true);

      if (source === "external_trigger") {
        trackEvent("open_ai_assistant", {
          source,
          page: typeof window !== "undefined" ? window.location.pathname : "/"
        });
      }
    };

    window.addEventListener("open-ai-assistant", openHandler);

    return () => window.removeEventListener("open-ai-assistant", openHandler);
  }, []);

  const handleOpenFromFloatingButton = () => {
    setOpen(true);
    trackEvent("open_ai_assistant", {
      source: "floating_button",
      page: typeof window !== "undefined" ? window.location.pathname : "/"
    });
  };

  return (
    <>
      {!open ? <AiAssistantButton onOpen={handleOpenFromFloatingButton} /> : null}
      <AiAssistantPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
};
