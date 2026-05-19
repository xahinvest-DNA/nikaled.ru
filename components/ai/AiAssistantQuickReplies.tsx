"use client";

type Props = {
  items: string[];
  disabled?: boolean;
  onSelect: (value: string) => void;
};

export const AiAssistantQuickReplies = ({ items, disabled, onSelect }: Props) => {
  if (!items.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          className="btn-secondary px-3 py-2 text-xs"
          onClick={() => onSelect(item)}
          disabled={disabled}
        >
          {item}
        </button>
      ))}
    </div>
  );
};
