"use client";

import { useRef, useState } from "react";

import { contacts } from "@/content/contacts";
import { trackEvent } from "@/lib/analytics/events";
import { formatPhoneRu, isValidRuPhone } from "@/lib/phone";

type Props = {
  title?: string;
  buttonText?: string;
  service?: string;
  compact?: boolean;
  analyticsSource?: string;
};

const RATE_LIMIT_MS = 45_000;

export const LeadForm = ({
  title = "Рассчитать стоимость",
  buttonText = "Отправить заявку",
  service,
  compact,
  analyticsSource = "lead_form"
}: Props) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+7");
  const [context, setContext] = useState("");
  const [company, setCompany] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const startedRef = useRef(false);

  const trackStart = () => {
    if (startedRef.current || typeof window === "undefined") return;
    startedRef.current = true;
    trackEvent("start_lead_form", {
      source: analyticsSource,
      service: service || "unknown",
      page: window.location.pathname
    });
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!isValidRuPhone(phone)) {
      setError("Введите корректный телефон в формате +7.");
      return;
    }
    if (!context.trim()) {
      setError("Опишите задачу, чтобы мы сделали точный расчет.");
      return;
    }

    const now = Date.now();
    const last = Number(window.localStorage.getItem("lead_last_submit_at") || "0");
    if (now - last < RATE_LIMIT_MS) {
      setError("Повторная отправка доступна через 45 секунд.");
      return;
    }

    const url = new URL(window.location.href);
    const pathname = url.pathname;
    const utm = {
      utm_source: url.searchParams.get("utm_source") || "",
      utm_campaign: url.searchParams.get("utm_campaign") || "",
      utm_term: url.searchParams.get("utm_term") || "",
      utm_content: url.searchParams.get("utm_content") || ""
    };

    const formData = new FormData();
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("context", context);
    formData.append("service", service || "");
    formData.append("page", pathname);
    formData.append("source", utm.utm_source || "direct");
    formData.append("referrer", document.referrer || "");
    formData.append("company", company);
    formData.append("utm_source", utm.utm_source);
    formData.append("utm_campaign", utm.utm_campaign);
    formData.append("utm_term", utm.utm_term);
    formData.append("utm_content", utm.utm_content);
    if (file) formData.append("file", file);

    try {
      setState("loading");
      const response = await fetch("/api/lead", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Lead request failed");

      window.localStorage.setItem("lead_last_submit_at", String(now));
      setState("success");
      const params = { source: analyticsSource, service: service || "unknown", page: pathname };
      trackEvent("submit_lead", params);
      trackEvent("submit_lead_form", params);
    } catch {
      setState("error");
      setError("Не удалось отправить заявку. Попробуйте еще раз или позвоните нам.");
    }
  };

  if (state === "success") {
    return (
      <div className="card">
        <h3 className="text-xl font-bold text-steel">Спасибо, заявка отправлена</h3>
        <p className="mt-2 text-sm text-steel/80">Ответим в течение 10 минут. Можете сразу выбрать удобный канал связи:</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={`tel:${contacts.phoneRaw}`}
            className="btn-secondary"
            onClick={() => trackEvent("click_call", { section: `${analyticsSource}_success` })}
          >
            Позвонить
          </a>
          <a
            href={contacts.telegramUrl}
            className="btn-secondary"
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("click_telegram", { section: `${analyticsSource}_success` })}
          >
            Написать в Telegram
          </a>
        </div>
      </div>
    );
  }

  return (
    <form className="card space-y-3" onSubmit={onSubmit}>
      <h3 className="text-xl font-bold text-steel">{title}</h3>
      <p className="text-sm text-steel/80">Ответим в течение 10 минут</p>
      <input
        type="text"
        placeholder="Ваше имя (опционально)"
        className="w-full rounded-lg border border-steel/15 bg-white px-3 py-2 text-sm text-steel caret-steel outline-none placeholder:text-steel/45 focus:border-steel/35"
        value={name}
        onFocus={trackStart}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="tel"
        required
        placeholder="+7 (___) ___-__-__"
        className="w-full rounded-lg border border-steel/15 bg-white px-3 py-2 text-sm text-steel caret-steel outline-none placeholder:text-steel/45 focus:border-steel/35"
        value={phone}
        onFocus={trackStart}
        onChange={(e) => setPhone(formatPhoneRu(e.target.value))}
      />
      <textarea
        required
        rows={compact ? 3 : 4}
        placeholder="Опишите задачу: тип вывески, размеры, адрес, сроки"
        className="w-full rounded-lg border border-steel/15 bg-white px-3 py-2 text-sm text-steel caret-steel outline-none placeholder:text-steel/45 focus:border-steel/35"
        value={context}
        onFocus={trackStart}
        onChange={(e) => setContext(e.target.value)}
      />
      <label className="block text-sm text-steel/85">
        Фото/файл (опционально)
        <input
          type="file"
          className="mt-1 block w-full text-xs text-steel file:mr-3 file:rounded-lg file:border-0 file:bg-paper file:px-3 file:py-2 file:text-steel"
          onClick={trackStart}
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        name="company"
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button type="submit" className="btn-primary w-full" disabled={state === "loading"}>
        {state === "loading" ? "Отправляем..." : buttonText}
      </button>
      <p className="text-xs text-steel/65">Пришлите размеры или фото объекта - посчитаем точнее.</p>
    </form>
  );
};
