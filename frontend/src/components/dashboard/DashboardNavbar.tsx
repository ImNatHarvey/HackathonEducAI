import type { SettingsPanel } from "../settings/settingsTypes";
import { currentUser } from "../user/userMock";

type DashboardNavbarProps = {
  onOpenSettings: (panel?: SettingsPanel) => void;
  onOpenLibrary: () => void;
  onOpenCreateModule: () => void;
  onLogout: () => void;
};

const DashboardNavbar = ({
  onOpenSettings,
  onOpenLibrary,
  onOpenCreateModule,
  onLogout,
}: DashboardNavbarProps) => {
  return (
    <header className="shrink-0 border-b border-aura-border bg-aura-panel/90 px-3 py-3 backdrop-blur-xl sm:px-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenLibrary}
            className="flex min-w-0 items-center gap-3 rounded-2xl px-2 py-1 text-left transition hover:bg-aura-bg-soft"
            aria-label="Open module library"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-aura-primary via-aura-cyan to-aura-gold text-lg font-black text-aura-bg shadow-[0_0_30px_rgba(34,211,238,0.22)]">
              ✦
            </div>

            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-black text-aura-text">
                Study Aura
              </p>
              <p className="truncate text-xs font-semibold text-aura-muted">
                AI-powered study workspace
              </p>
            </div>
          </button>

          <div className="ml-1 hidden h-8 w-px bg-aura-border lg:block" />

          <button
            type="button"
            onClick={onOpenLibrary}
            className="hidden rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-2 text-xs font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text md:inline-flex"
          >
            Module Library
          </button>

          <button
            type="button"
            onClick={onOpenCreateModule}
            className="hidden rounded-2xl bg-aura-cyan px-4 py-2 text-xs font-black text-aura-bg transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(34,211,238,0.2)] md:inline-flex"
          >
            + Create Module
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenCreateModule}
            className="rounded-2xl bg-aura-cyan px-3 py-2 text-xs font-black text-aura-bg transition hover:-translate-y-0.5 md:hidden"
            aria-label="Create module"
            title="Create module"
          >
            +
          </button>

          <button
            type="button"
            onClick={onOpenLibrary}
            className="rounded-2xl border border-aura-border bg-aura-bg-soft px-3 py-2 text-xs font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text md:hidden"
          >
            Library
          </button>

          <button
            type="button"
            onClick={() => onOpenSettings("profile")}
            className="flex min-w-[210px] items-center gap-3 rounded-2xl border border-aura-border bg-aura-bg-soft px-3 py-2 transition hover:border-aura-cyan/60 hover:bg-aura-cyan/5 max-sm:min-w-0"
            aria-label="Open profile settings"
            title={`${currentUser.name} • ${currentUser.title}`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-aura-primary to-aura-cyan text-xs font-black text-white">
              {currentUser.initials}
            </div>

            <div className="min-w-0 text-left max-sm:hidden">
              <p className="truncate text-sm font-black leading-4 text-aura-text">
                {currentUser.name}
              </p>
              <p className="mt-1 truncate text-[11px] font-black leading-3 text-aura-gold">
                {currentUser.title}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onOpenSettings("home")}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-aura-border bg-aura-bg-soft text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text"
            aria-label="Open settings"
            title="Settings"
          >
            ⚙️
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-aura-border bg-aura-bg-soft text-lg text-aura-muted transition hover:border-red-400/50 hover:bg-red-500/10 hover:text-red-200"
            aria-label="Logout"
            title="Logout"
          >
            ↪
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;