export type AiRole = "user" | "assistant";

export type AiQualification = "hot" | "warm" | "cold";
export type AiProbability = "high" | "medium" | "low";
export type AiSpinStage = "situation" | "problem" | "implication" | "need_payoff" | "close";
export type AiInquiryType = "calculation" | "selection" | "timing" | "approval" | "photo" | "question";

export type AiMessage = {
  id: string;
  role: AiRole;
  content: string;
  createdAt: string;
};

export type AiLeadState = {
  name?: string;
  phone?: string;
  service?: string;
  businessType?: string;
  objectType?: string;
  city?: string;
  size?: string;
  hasPhoto?: boolean;
  inquiryType?: AiInquiryType;
  productType?: string;
  illumination?: string;
  mountingNeeded?: boolean;
  designPreference?: string;
  deadline?: string;
  budget?: string;
  goal?: string;
  pain?: string;
  implication?: string;
  needPayoff?: string;
  priority?: string;
  needsApproval?: boolean;
  situation?: string;
  summary?: string;
  spinStage?: AiSpinStage;
  qualification?: AiQualification;
  probability?: AiProbability;
  recommendedNextStep?: string;
  page?: string;
  source?: string;
  referrer?: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
};

export type AiAssistantRequest = {
  sessionId: string;
  message: string;
  history: AiMessage[];
  leadState: AiLeadState;
  page: string;
  referrer?: string;
  utm?: Record<string, string>;
};

export type AiAssistantResponse = {
  reply: string;
  leadState: AiLeadState;
  quickReplies?: string[];
  shouldAskContact?: boolean;
  shouldSubmitLead?: boolean;
};

export type AiAssistantChatRouteResponse =
  | ({ ok: true } & AiAssistantResponse)
  | {
      ok: false;
      message: string;
      fallbackReply?: string;
      quickReplies?: string[];
      leadState?: AiLeadState;
      shouldAskContact?: boolean;
    };

export type AiAssistantLeadRequest = {
  sessionId: string;
  history: AiMessage[];
  leadState: AiLeadState;
};

export type AiAssistantLeadResponse =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      message: string;
    };

export type AiStoredSession = {
  sessionId: string;
  messages: AiMessage[];
  leadState: AiLeadState;
  leadSubmittedAt?: string;
  lastActiveAt: string;
};
