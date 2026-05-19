"use client";

type Props = {
  items: string[];
  disabled?: boolean;
  onSelect: (value: string) => void;
};

export const AiAssistantQuickReplies = ({ items, disabled, onSelect }: Props) => {
  if (!items.length) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className="btn-secondary shrink-0 whitespace-nowrap px-3 py-2 text-xs"
          onClick={() => onSelect(item)}
          disabled={disabled}
        >
          {item}
        </button>
      ))}
    </div>
  );
};
