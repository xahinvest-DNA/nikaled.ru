"use client";

type Props = {
  onOpen: () => void;
};

export const AiAssistantButton = ({ onOpen }: Props) => {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="fixed bottom-[5.5rem] right-3 z-[55] w-[calc(100vw-1.5rem)] max-w-[21rem] rounded-2xl border border-steel/10 bg-white px-4 py-3 text-left shadow-[0_18px_40px_rgba(16,25,34,0.18)] transition hover:-translate-y-0.5 md:bottom-6 md:right-6 md:w-auto md:max-w-none md:min-w-[20rem]"
    >
      <span className="block text-sm font-black text-steel md:text-base">AI-помощник</span>
      <span className="mt-1 block text-xs leading-5 text-steel/70 md:hidden">Помощник</span>
      <span className="mt-1 hidden text-xs leading-5 text-steel/70 md:block">
        Подберёт вывеску и соберёт данные для расчёта
      </span>
    </button>
  );
};
