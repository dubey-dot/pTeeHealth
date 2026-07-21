import { ArrowLeft, ArrowRight, Mic, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

import { FactorChipsCard } from "@/components/intake/FactorChipsCard";
import { PatientInformationCard } from "@/components/intake/PatientInformationCard";
import { RedFlagsCard } from "@/components/intake/RedFlagsCard";
import { JourneyTabs } from "@/components/layout/JourneyTabs";
import { intakeApi } from "@/lib/api";
import { DEFAULT_INTAKE_OPTIONS } from "@/lib/defaultOptions";
import type { IntakeFormState, IntakeOptions } from "@/types/intake";
import { createEmptyIntakeForm } from "@/types/intake";

function toggleInList(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export function IntakePage() {
  const [options, setOptions] = useState<IntakeOptions>(
    DEFAULT_INTAKE_OPTIONS
  );
  const [form, setForm] = useState<IntakeFormState>(createEmptyIntakeForm());
  const [isSaving, setIsSaving] = useState(false);

  // The form renders immediately with the local default vocabulary; if the
  // backend is reachable we refresh it with the live (mocked) options so
  // this screen never blocks on a network round trip.
  useEffect(() => {
    intakeApi
      .getOptions()
      .then(setOptions)
      .catch(() => {
        /* keep the local defaults if the API isn't running yet */
      });
  }, []);

  const updateField = <K extends keyof IntakeFormState>(
    field: K,
    value: IntakeFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAggravating = (factor: string) =>
    setForm((prev) => ({
      ...prev,
      aggravatingFactors: toggleInList(prev.aggravatingFactors, factor),
    }));

  const toggleRelieving = (factor: string) =>
    setForm((prev) => ({
      ...prev,
      relievingFactors: toggleInList(prev.relievingFactors, factor),
    }));

  const toggleRedFlag = (key: string) =>
    setForm((prev) => ({
      ...prev,
      redFlags: { ...prev.redFlags, [key]: !prev.redFlags[key] },
    }));

  const handleWrapIntake = async () => {
    setIsSaving(true);
    try {
      await intakeApi.create({
        chief_complaint: { raw_text: form.chiefComplaint },
        age: form.age ? Number(form.age) : null,
        gender: form.gender || null,
        occupation: form.occupation || null,
        activity_level: form.activityLevel || null,
        pain_score: form.painScore,
        duration: form.duration || null,
        previous_injuries: form.previousInjuries || null,
        aggravating_factors: form.aggravatingFactors,
        relieving_factors: form.relievingFactors,
        red_flags: form.redFlags,
      });
    } catch {
      /* mock backend may not be running; form state is preserved either way */
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1440px] px-8 pb-16 pt-6">
      <div className="mb-2 flex justify-end">
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full border border-sky-100 bg-sky-50 px-4 py-1.5 text-sm font-medium text-sky-700 hover:bg-sky-100"
        >
          <UserPlus className="h-4 w-4" />
          Request senior review
        </button>
      </div>

      <JourneyTabs activeStep="Intake" />

      <div className="mb-6 mt-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Patient Intake</h1>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
        >
          <Mic className="h-4 w-4" />
          Voice-first intake
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PatientInformationCard
          form={form}
          genders={options.genders}
          onChange={updateField}
        />

        <div className="space-y-6">
          <FactorChipsCard
            title="AGGRAVATING FACTORS"
            options={options.aggravating_factors}
            selected={form.aggravatingFactors}
            onToggle={toggleAggravating}
          />
          <FactorChipsCard
            title="RELIEVING FACTORS"
            options={options.relieving_factors}
            selected={form.relievingFactors}
            onToggle={toggleRelieving}
          />
          <RedFlagsCard
            redFlags={options.red_flags}
            checked={form.redFlags}
            onToggle={toggleRedFlag}
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </button>
        <button
          type="button"
          onClick={handleWrapIntake}
          disabled={isSaving}
          className="flex items-center gap-1.5 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-navy-light disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Wrap intake"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
