import { ShieldCheck } from "lucide-react";

import type { RedFlagOption } from "@/types/intake";

interface RedFlagsCardProps {
  redFlags: RedFlagOption[];
  checked: Record<string, boolean>;
  onToggle: (key: string) => void;
}

export function RedFlagsCard({ redFlags, checked, onToggle }: RedFlagsCardProps) {
  return (
    <section className="rounded-card border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xs font-semibold tracking-wider text-slate-400">
          RED FLAGS
        </h2>
        <span className="flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          <ShieldCheck className="h-3.5 w-3.5" />
          Safety screen
        </span>
      </div>

      <div className="space-y-2.5">
        {redFlags.map((flag) => {
          const isChecked = Boolean(checked[flag.key]);
          return (
            <label
              key={flag.key}
              className={
                isChecked
                  ? "flex cursor-pointer items-center gap-3 rounded-lg border border-red-200 bg-red-50/60 px-4 py-3 transition-colors"
                  : "flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 transition-colors hover:border-slate-300"
              }
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => onToggle(flag.key)}
                className="h-4 w-4 rounded border-slate-300 text-navy focus:ring-navy/30"
              />
              <span className="text-sm text-slate-700">{flag.label}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
