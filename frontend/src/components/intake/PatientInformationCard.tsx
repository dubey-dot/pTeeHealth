import type { ChangeEvent } from "react";

import type { Gender, IntakeFormState } from "@/types/intake";

interface PatientInformationCardProps {
  form: IntakeFormState;
  genders: string[];
  onChange: <K extends keyof IntakeFormState>(
    field: K,
    value: IntakeFormState[K]
  ) => void;
}

const inputClasses =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/10";

export function PatientInformationCard({
  form,
  genders,
  onChange,
}: PatientInformationCardProps) {
  const handlePainScore = (event: ChangeEvent<HTMLInputElement>) => {
    onChange("painScore", Number(event.target.value));
  };

  return (
    <section className="rounded-card border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xs font-semibold tracking-wider text-slate-400">
        PATIENT INFORMATION
      </h2>

      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Chief Complaint
          </label>
          <textarea
            rows={3}
            placeholder="Will fill from your conversation..."
            className={inputClasses}
            value={form.chiefComplaint}
            onChange={(e) => onChange("chiefComplaint", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Age
            </label>
            <input
              type="number"
              min={1}
              max={120}
              className={inputClasses}
              value={form.age}
              onChange={(e) => onChange("age", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Gender
            </label>
            <select
              className={inputClasses}
              value={form.gender}
              onChange={(e) =>
                onChange("gender", e.target.value as Gender | "")
              }
            >
              <option value="">—</option>
              {genders.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Occupation
            </label>
            <input
              type="text"
              className={inputClasses}
              value={form.occupation}
              onChange={(e) => onChange("occupation", e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Sport / Activity
            </label>
            <input
              type="text"
              className={inputClasses}
              value={form.activityLevel}
              onChange={(e) => onChange("activityLevel", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Pain Score
          </label>
          <div className="rounded-lg border border-slate-200 p-4">
            <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
              <span>No pain</span>
              <span className="text-sm font-semibold text-slate-700">
                {form.painScore}/10
              </span>
              <span>Worst</span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={form.painScore}
              onChange={handlePainScore}
              className="pain-slider"
              style={
                {
                  "--slider-fill": `${(form.painScore / 10) * 100}%`,
                } as React.CSSProperties
              }
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Duration
          </label>
          <input
            type="text"
            placeholder="e.g. 3 weeks"
            className={inputClasses}
            value={form.duration}
            onChange={(e) => onChange("duration", e.target.value)}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Previous Injuries
          </label>
          <textarea
            rows={3}
            placeholder="Any prior episodes, surgeries, or relevant history..."
            className={inputClasses}
            value={form.previousInjuries}
            onChange={(e) => onChange("previousInjuries", e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
