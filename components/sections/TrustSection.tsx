import Image from "next/image";

import { trustStats } from "@/content/stats";

export const TrustSection = () => {
  return (
    <section className="section-space">
      <div className="container-narrow grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="card">
          <h2 className="text-2xl font-bold text-steel md:text-3xl">Почему нам доверяют</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {trustStats.map((item) => (
              <article key={item.label} className="rounded-xl border border-steel/10 bg-paper px-4 py-3">
                <p className="text-xl font-black text-steel">{item.value}</p>
                <p className="text-sm text-steel/75">{item.label}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="relative min-h-72 overflow-hidden rounded-2xl border border-steel/10 bg-white shadow-card">
          <Image src="/images/workshop.svg" alt="Фото цеха и процесса монтажа" fill className="object-cover" />
        </div>
      </div>
    </section>
  );
};

