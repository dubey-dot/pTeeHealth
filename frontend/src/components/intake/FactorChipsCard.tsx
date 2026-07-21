import { Plus, X } from "lucide-react";

interface FactorChipsCardProps {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}

export function FactorChipsCard({
  title,
  options,
  selected,
  onToggle,
}: FactorChipsCardProps) {
  return (
    <section className="rounded-card border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xs font-semibold tracking-wider text-slate-400">
        {title}
      </h2>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={
                isSelected
                  ? "flex items-center gap-1.5 rounded-full border border-navy bg-navy px-4 py-2 text-sm font-medium text-white transition-colors"
                  : "flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300"
              }
            >
              {isSelected ? (
                <X className="h-3.5 w-3.5" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              {option}
            </button>
          );
        })}
      </div>
    </section>
  );
}
