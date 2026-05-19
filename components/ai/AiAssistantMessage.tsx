"use client";

import type { AiMessage } from "@/lib/ai-assistant/types";

type Props = {
  message: AiMessage;
};

export const AiAssistantMessage = ({ message }: Props) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
          isUser ? "bg-accent text-white" : "border border-steel/10 bg-white text-steel"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};
