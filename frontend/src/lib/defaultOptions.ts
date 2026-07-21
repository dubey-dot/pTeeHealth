import type { IntakeOptions } from "@/types/intake";

export const DEFAULT_INTAKE_OPTIONS: IntakeOptions = {
  genders: ["Male", "Female", "Other", "Prefer not to say"],
  aggravating_factors: [
    "Running",
    "Stairs",
    "Sitting",
    "Squatting",
    "Jumping",
    "Walking Downhill",
  ],
  relieving_factors: ["Rest", "Ice", "Stretching", "Heat", "NSAIDs", "Bracing"],
  red_flags: [
    { key: "weight_loss", label: "Unexplained weight loss" },
    { key: "night_pain", label: "Night pain unrelated to position" },
    { key: "fever", label: "Fever or systemic symptoms" },
    { key: "history_of_cancer", label: "History of cancer" },
    { key: "recent_trauma", label: "Recent significant trauma" },
    { key: "neurological_deficit", label: "Progressive neurological deficit" },
    {
      key: "bowel_bladder_dysfunction",
      label: "Bowel or bladder dysfunction",
    },
  ],
  duration_presets: ["Days", "Weeks", "Months", "Years"],
};
