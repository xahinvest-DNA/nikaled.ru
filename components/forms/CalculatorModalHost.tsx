"use client";

import { useEffect, useState } from "react";

import { trackEvent } from "@/lib/analytics/events";
import { formatPhoneRu, isValidRuPhone } from "@/lib/phone";

const steps = ["Тип изделия", "Размеры", "Фото", "Монтаж", "Сроки", "Контакт"];

export const CalculatorModalHost = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState({
    service: "Вывеска",
    size: "",
    mount: "",
    deadline: "",
    name: "",
    phone: "+7",
    context: ""
  });

  useEffect(() => {
    const openHandler = () => {
      setOpen(true);
      setStep(0);
      setState("idle");
      setError("");
    };
    window.addEventListener("open-calculator", openHandler);
    return () => window.removeEventListener("open-calculator", openHandler);
  }, []);

  if (!open) return null;

  const submit = async () => {
    setError("");
    if (!isValidRuPhone(data.phone)) {
      setError("Введите корректный телефон +7.");
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

    const context = [data.context, `Тип: ${data.service}`, `Размеры: ${data.size}`, `Монтаж/высота: ${data.mount}`, `Срок: ${data.deadline}`]
      .filter(Boolean)
      .join(". ");

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("context", context);
    formData.append("service", data.service);
    formData.append("page", pathname);
    formData.append("source", utm.utm_source || "direct");
    formData.append("referrer", document.referrer || "");
    formData.append("company", "");
    formData.append("utm_source", utm.utm_source);
    formData.append("utm_campaign", utm.utm_campaign);
    formData.append("utm_term", utm.utm_term);
    formData.append("utm_content", utm.utm_content);
    if (file) formData.append("file", file);

    try {
      setState("loading");
      const response = await fetch("/api/lead", { method: "POST", body: formData });
      if (!response.ok) throw new Error("failed");
      setState("success");
      trackEvent("submit_lead", { source: "calculator", page: pathname });
    } catch {
      setState("error");
      setError("Не удалось отправить заявку.");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/60 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-steel">Мини-калькулятор стоимости</h3>
          <button type="button" onClick={() => setOpen(false)} className="text-sm text-steel/70">
            Закрыть
          </button>
        </div>
        {state === "success" ? (
          <div className="space-y-2">
            <p className="font-semibold text-steel">Спасибо, расчет принят.</p>
            <p className="text-sm text-steel/80">Ответим в течение 10 минут.</p>
            <button className="btn-primary mt-2" onClick={() => setOpen(false)} type="button">
              Готово
            </button>
          </div>
        ) : (
          <>
            <p className="mb-3 text-xs text-steel/70">
              Шаг {step + 1} из {steps.length}: {steps[step]}
            </p>

            {step === 0 ? (
              <select
                className="w-full rounded-lg border border-steel/15 px-3 py-2"
                value={data.service}
                onChange={(e) => setData((prev) => ({ ...prev, service: e.target.value }))}
              >
                <option>Вывеска</option>
                <option>Объёмные буквы</option>
                <option>Лайтбокс</option>
                <option>Согласование вывески</option>
              </select>
            ) : null}

            {step === 1 ? (
              <input
                className="w-full rounded-lg border border-steel/15 px-3 py-2"
                placeholder="Например: 3200 x 800 мм"
                value={data.size}
                onChange={(e) => setData((prev) => ({ ...prev, size: e.target.value }))}
              />
            ) : null}

            {step === 2 ? (
              <label className="block rounded-lg border border-dashed border-steel/25 p-4 text-sm text-steel/80">
                Прикрепите фото объекта
                <input type="file" className="mt-2 block w-full text-xs" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </label>
            ) : null}

            {step === 3 ? (
              <input
                className="w-full rounded-lg border border-steel/15 px-3 py-2"
                placeholder="Монтаж/высота: например 2 этаж, через люльку"
                value={data.mount}
                onChange={(e) => setData((prev) => ({ ...prev, mount: e.target.value }))}
              />
            ) : null}

            {step === 4 ? (
              <input
                className="w-full rounded-lg border border-steel/15 px-3 py-2"
                placeholder="Желаемый срок"
                value={data.deadline}
                onChange={(e) => setData((prev) => ({ ...prev, deadline: e.target.value }))}
              />
            ) : null}

            {step === 5 ? (
              <div className="space-y-2">
                <input
                  className="w-full rounded-lg border border-steel/15 px-3 py-2"
                  placeholder="Ваше имя (опционально)"
                  value={data.name}
                  onChange={(e) => setData((prev) => ({ ...prev, name: e.target.value }))}
                />
                <input
                  className="w-full rounded-lg border border-steel/15 px-3 py-2"
                  placeholder="+7 (___) ___-__-__"
                  value={data.phone}
                  onChange={(e) => setData((prev) => ({ ...prev, phone: formatPhoneRu(e.target.value) }))}
                />
                <textarea
                  className="w-full rounded-lg border border-steel/15 px-3 py-2"
                  rows={3}
                  placeholder="Коротко опишите задачу"
                  value={data.context}
                  onChange={(e) => setData((prev) => ({ ...prev, context: e.target.value }))}
                />
              </div>
            ) : null}

            {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
            <div className="mt-4 flex items-center justify-between gap-2">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setStep((prev) => Math.max(0, prev - 1))}
                disabled={step === 0}
              >
                Назад
              </button>
              {step < steps.length - 1 ? (
                <button type="button" className="btn-primary" onClick={() => setStep((prev) => Math.min(steps.length - 1, prev + 1))}>
                  Далее
                </button>
              ) : (
                <button type="button" className="btn-primary" disabled={state === "loading"} onClick={submit}>
                  {state === "loading" ? "Отправляем..." : "Отправить расчет"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

