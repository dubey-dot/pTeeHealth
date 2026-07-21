const STEPS = [
  "Intake",
  "Hypothesis",
  "Assessment",
  "Reasoning",
  "Treatment",
  "Home",
  "Evaluation",
];

interface JourneyTabsProps {
  activeStep: string;
}

export function JourneyTabs({ activeStep }: JourneyTabsProps) {
  return (
    <div className="border-b border-teal-accent/20">
      <nav className="flex items-center gap-2 py-3">
        {STEPS.map((step) => {
          const isActive = step === activeStep;
          return (
            <button
              key={step}
              type="button"
              className={
                isActive
                  ? "rounded-full bg-navy px-4 py-1.5 text-sm font-medium text-white"
                  : "rounded-full px-4 py-1.5 text-sm font-medium text-slate-400 hover:text-slate-600"
              }
            >
              {step}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
