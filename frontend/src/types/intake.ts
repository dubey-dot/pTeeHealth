export type Gender = "Male" | "Female" | "Other" | "Prefer not to say";

export interface ChiefComplaint {
  raw_text: string;
  body_part?: string | null;
  side?: string | null;
  location?: string | null;
  duration?: string | null;
  primary_complaint?: string | null;
}

export interface RedFlagOption {
  key: string;
  label: string;
}

export interface IntakeOptions {
  genders: string[];
  aggravating_factors: string[];
  relieving_factors: string[];
  red_flags: RedFlagOption[];
  duration_presets: string[];
}

export interface IntakeFormState {
  chiefComplaint: string;
  age: string;
  gender: Gender | "";
  occupation: string;
  activityLevel: string;
  painScore: number;
  duration: string;
  previousInjuries: string;
  aggravatingFactors: string[];
  relievingFactors: string[];
  redFlags: Record<string, boolean>;
}

export const createEmptyIntakeForm = (): IntakeFormState => ({
  chiefComplaint: "",
  age: "",
  gender: "",
  occupation: "",
  activityLevel: "",
  painScore: 0,
  duration: "",
  previousInjuries: "",
  aggravatingFactors: [],
  relievingFactors: [],
  redFlags: {},
});
