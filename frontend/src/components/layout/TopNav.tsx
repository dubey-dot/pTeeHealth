import { Bell, Search, Sparkles } from "lucide-react";

const NAV_LINKS = [
  { label: "Journey", active: true },
  { label: "Patients", active: false },
  { label: "Dashboard", active: false },
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-100 bg-white">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
              B
            </span>
            <span className="text-[15px] font-semibold text-slate-900">
              Physiofit
            </span>
          </div>

          <nav className="flex items-center gap-1.5">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                type="button"
                className={
                  link.active
                    ? "rounded-full bg-navy px-4 py-1.5 text-sm font-medium text-white"
                    : "rounded-full px-4 py-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
                }
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-400">
            <Search className="h-4 w-4" />
            <span>Search...</span>
            <kbd className="ml-6 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-400">
              ⌘K
            </kbd>
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="relative text-slate-500 hover:text-slate-800"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-navy" />
          </button>

          <button
            type="button"
            aria-label="AI assistant"
            className="text-teal-accent hover:opacity-80"
          >
            <Sparkles className="h-[18px] w-[18px]" />
          </button>

          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            AR
          </span>
        </div>
      </div>
    </header>
  );
}
