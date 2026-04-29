import { useEffect, useRef, useState } from "react";
import type { SettingsPanel } from "../settings/settingsTypes";
import type { AuthProfile } from "../../services/authService";
import type { AuraStats } from "../../lib/xp";

type DashboardNavbarProps = {
  profile: AuthProfile | null;
  auraStats?: AuraStats;
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
  auraStats,
  onOpenSettings,
  onOpenLibrary,
  onOpenCreateModule,
  onLogout,
}: DashboardNavbarProps) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  const displayName =
    auraStats?.username || profile?.displayName || "Study Aura User";
  const title = auraStats?.activeTitle || profile?.title || "New Learner";
  const initials = getInitials(displayName);

  const level = auraStats?.level ?? profile?.level ?? 1;
  const currentXp = auraStats?.xp ?? profile?.xp ?? 0;
  const neededXp = profile?.xpToNextLevel ?? 100;
  const totalXp = auraStats?.totalXp ?? currentXp;
  const energy = auraStats?.energy ?? 100;
  const maxEnergy = auraStats?.maxEnergy ?? 100;

  const xpPercent = neededXp > 0 ? Math.min(100, (currentXp / neededXp) * 100) : 0;
  const energyPercent =
    maxEnergy > 0 ? Math.min(100, (energy / maxEnergy) * 100) : 0;

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!profileMenuRef.current) return;

      if (!profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const openProfileSettings = () => {
    setIsProfileMenuOpen(false);
    onOpenSettings("profile");
  };

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

          <div ref={profileMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((current) => !current)}
              className="flex h-11 min-w-[210px] items-center gap-3 rounded-2xl border border-aura-border bg-aura-bg-soft px-3 py-2 text-left transition hover:border-aura-cyan/60 hover:bg-aura-cyan/5 max-sm:min-w-0"
              aria-label="Open profile menu"
              aria-expanded={isProfileMenuOpen}
              title={`${displayName} • ${title}`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-aura-primary to-aura-cyan text-xs font-black text-white shadow-[0_0_22px_rgba(34,211,238,0.18)]">
                {initials}
              </div>

              <div className="min-w-0 flex-1 max-sm:hidden">
                <p className="truncate text-sm font-black leading-4 text-aura-text">
                  {displayName}
                </p>
              </div>

              <span className="shrink-0 text-xs font-black text-aura-muted transition group-hover:text-aura-cyan">
                {isProfileMenuOpen ? "▲" : "▼"}
              </span>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+0.7rem)] z-[80] w-[330px] overflow-hidden rounded-[1.5rem] border border-aura-border bg-aura-panel shadow-[0_28px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl">
                <div className="border-b border-aura-border bg-aura-bg-soft/80 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-aura-primary via-aura-cyan to-aura-gold text-sm font-black text-white shadow-[0_0_24px_rgba(34,211,238,0.2)]">
                      {initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="inline-flex max-w-full rounded-full border border-aura-gold/35 bg-aura-gold/10 px-2 py-0.5 text-[10px] font-black uppercase leading-3 tracking-[0.12em] text-aura-gold">
                        <span className="truncate">{title}</span>
                      </p>

                      <p className="mt-1.5 truncate text-base font-black text-aura-text">
                        {displayName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-aura-dim">
                        Level
                      </p>
                      <p className="mt-1 text-lg font-black text-aura-text">
                        Lv. {level}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-aura-dim">
                        Total XP
                      </p>
                      <p className="mt-1 text-lg font-black text-aura-text">
                        {totalXp}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-3">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-aura-dim">
                        Aura XP
                      </p>

                      <p className="text-xs font-black text-aura-cyan">
                        {currentXp}/{neededXp}
                      </p>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-aura-panel">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold transition-all"
                        style={{ width: `${xpPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-3">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-aura-dim">
                        Energy
                      </p>

                      <p className="text-xs font-black text-aura-cyan">
                        ⚡ {energy}/{maxEnergy}
                      </p>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-aura-panel">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-aura-cyan to-aura-gold transition-all"
                        style={{ width: `${energyPercent}%` }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={openProfileSettings}
                    className="w-full rounded-2xl bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold px-4 py-3 text-sm font-black text-aura-bg transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(34,211,238,0.22)]"
                  >
                    Open Profile Settings
                  </button>
                </div>
              </div>
            )}
          </div>

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