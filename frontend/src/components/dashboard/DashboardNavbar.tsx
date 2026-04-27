import type { SettingsPanel } from "../settings/settingsTypes";
import type { AuthProfile } from "../../services/authService";

type DashboardNavbarProps = {
  profile: AuthProfile | null;
  onOpenSettings: (panel?: SettingsPanel) => void;
  onOpenLibrary: () => void;
  onOpenCreateModule: () => void;
  onLogout: () => void;
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 0 || !parts[0]) return "SA";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const DashboardNavbar = ({
  profile,
  onOpenSettings,
  onOpenLibrary,
  onOpenCreateModule,
  onLogout,
}: DashboardNavbarProps) => {
  const displayName = profile?.displayName ?? "Study Aura User";
  const title = profile?.title ?? "Aura Farmer";
  const initials = getInitials(displayName);

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
            className="flex min-w-[240px] items-center gap-3 rounded-2xl border border-aura-border bg-aura-bg-soft px-3 py-2 transition hover:border-aura-cyan/60 hover:bg-aura-cyan/5 max-sm:min-w-0"
            aria-label="Open profile settings"
            title={`${displayName} • ${title}`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-aura-primary to-aura-cyan text-xs font-black text-white shadow-[0_0_22px_rgba(34,211,238,0.18)]">
              {initials}
            </div>

            <div className="min-w-0 text-left max-sm:hidden">
              <p className="truncate text-sm font-black leading-4 text-aura-text">
                {displayName}
              </p>

              <p className="mt-1 inline-flex max-w-full rounded-full border border-aura-gold/35 bg-aura-gold/10 px-2 py-0.5 text-[10px] font-black uppercase leading-3 tracking-[0.12em] text-aura-gold shadow-[0_0_18px_rgba(250,204,21,0.08)]">
                <span className="truncate">{title}</span>
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
