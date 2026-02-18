"use client";

import { useState } from "react";

import { type FaqItem } from "@/content/faq";
import { OpenCalcButton } from "@/components/ui/OpenCalcButton";

type Props = {
  items: FaqItem[];
};

export const FaqSection = ({ items }: Props) => {
  const [opened, setOpened] = useState<string | null>(items[0]?.id ?? null);

  return (
    <section className="section-space bg-white">
      <div className="container-narrow">
        <h2 className="text-2xl font-bold text-steel md:text-3xl">Часто задаваемые вопросы</h2>
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <article key={item.id} className="card p-0">
              <button
                className="flex w-full items-center justify-between px-5 py-4 text-left text-base font-semibold text-steel"
                type="button"
                onClick={() => setOpened((prev) => (prev === item.id ? null : item.id))}
              >
                {item.question}
                <span>{opened === item.id ? "-" : "+"}</span>
              </button>
              {opened === item.id ? <p className="px-5 pb-5 text-sm text-steel/80">{item.answer}</p> : null}
            </article>
          ))}
        </div>
        <div className="mt-6">
          <OpenCalcButton text="Получить консультацию" />
        </div>
      </div>
    </section>
  );
};

