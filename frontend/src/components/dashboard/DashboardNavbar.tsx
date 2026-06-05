import { useEffect, useMemo, useRef, useState } from "react";
import type { SettingsPanel } from "../settings/settingsTypes";
import type { AuthProfile } from "../../services/authService";
import { getXpNeededForLevel, type AuraStats } from "../../lib/xp";
import {
  formatRelativeActivityTime,
  getActivityLog,
  subscribeToActivityLog,
  type ActivityLogItem,
} from "../../lib/activityLog";

type DashboardNavbarProps = {
  profile: AuthProfile | null;
  auraStats?: AuraStats;
  libraryButtonLabel?: string;
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

const getEnergyAmountFromActivity = (item: ActivityLogItem) => {
  const searchableText = `${item.action} ${item.detail}`.toLowerCase();

  const explicitEnergyMatch = searchableText.match(
    /(?:energy|cost|used|spent|consume|consumed)\D{0,12}(\d+)/i,
  );

  if (explicitEnergyMatch?.[1]) {
    return Number(explicitEnergyMatch[1]);
  }

  const minusEnergyMatch = searchableText.match(/-(\d+)/);

  if (minusEnergyMatch?.[1]) {
    return Number(minusEnergyMatch[1]);
  }

  switch (item.type) {
    case "chat":
      return 2;
    case "source":
      return searchableText.includes("youtube") ? 6 : 5;
    case "web":
      return 6;
    case "quiz":
      return 10;
    case "flashcards":
      return 8;
    case "slides":
      return 12;
    case "tables":
      return 8;
    case "mindmap":
      return 10;
    case "audio":
      return 14;
    default:
      return 0;
  }
};

const getEnergyActionLabel = (item: ActivityLogItem) => {
  const text = `${item.action} ${item.detail}`.toLowerCase();

  if (item.type === "chat") return "Chat message";
  if (item.type === "web") return "Web search";
  if (item.type === "quiz") return "Generate Quiz";
  if (item.type === "flashcards") return "Generate Flashcards";
  if (item.type === "slides") return "Generate Slides";
  if (item.type === "tables") return "Generate Tables";
  if (item.type === "mindmap") return "Generate Mind Map";
  if (item.type === "audio") return "Generate Audio Overview";

  if (item.type === "source") {
    if (text.includes("youtube")) return "Add Source: YouTube";
    if (text.includes("pdf")) return "Add Source: PDF";
    if (text.includes("image")) return "Add Source: Image";
    if (
      text.includes("website") ||
      text.includes("url") ||
      text.includes("link")
    ) {
      return "Add Source: Website";
    }

    return "Add Source";
  }

  if (item.type === "energy") return item.action;

  return item.action;
};

const DashboardNavbar = ({
  profile,
  auraStats,
  libraryButtonLabel = "Module Library",
  onOpenSettings,
  onOpenLibrary,
  onOpenCreateModule,
  onLogout,
}: DashboardNavbarProps) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isEnergyMenuOpen, setIsEnergyMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEnergyAnimating, setIsEnergyAnimating] = useState(false);
  const [activityItems, setActivityItems] = useState<ActivityLogItem[]>(() =>
    getActivityLog(),
  );

  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const energyMenuRef = useRef<HTMLDivElement | null>(null);
  const previousEnergyRef = useRef<number | null>(null);

  const displayName =
    auraStats?.username || profile?.displayName || "Study Aura User";
  const title = auraStats?.activeTitle || profile?.title || "Fresh Spawn";
  const initials = getInitials(displayName);

  const level = auraStats?.level ?? profile?.level ?? 1;
  const currentXp = auraStats?.xp ?? profile?.xp ?? 0;
  const neededXp = auraStats ? getXpNeededForLevel(auraStats.level) : 100;
  const totalXp = auraStats?.totalXp ?? currentXp;
  const energy = auraStats?.energy ?? 100;
  const maxEnergy = auraStats?.maxEnergy ?? 100;

  const xpPercent =
    neededXp > 0 ? Math.min(100, (currentXp / neededXp) * 100) : 0;

  const energyPercent =
    maxEnergy > 0 ? Math.min(100, (energy / maxEnergy) * 100) : 0;

  const recentEnergyActivities = useMemo(() => {
    return activityItems
      .map((item) => ({
        item,
        energy: getEnergyAmountFromActivity(item),
        label: getEnergyActionLabel(item),
      }))
      .filter((entry) => entry.energy > 0)
      .slice(0, 5);
  }, [activityItems]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setIsProfileMenuOpen(false);
      }

      if (energyMenuRef.current && !energyMenuRef.current.contains(target)) {
        setIsEnergyMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    return subscribeToActivityLog(() => {
      setActivityItems(getActivityLog());
    });
  }, []);

  useEffect(() => {
    if (previousEnergyRef.current === null) {
      previousEnergyRef.current = energy;
      return;
    }

    if (energy < previousEnergyRef.current) {
      setIsEnergyAnimating(true);

      window.setTimeout(() => {
        setIsEnergyAnimating(false);
      }, 750);
    }

    previousEnergyRef.current = energy;
  }, [energy]);

  const openProfileSettings = () => {
    setIsProfileMenuOpen(false);
    onOpenSettings("profile");
  };

  return (
    <header className="relative z-40 shrink-0 border-b border-aura-border bg-aura-panel/90 px-3 py-2 backdrop-blur-xl sm:px-5 sm:py-3">
      <div className="flex min-h-[2.5rem] items-center justify-between gap-2 sm:min-h-[3rem] sm:gap-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenLibrary}
            className="flex h-10 items-center gap-2 rounded-2xl px-1 text-left transition hover:bg-aura-bg-soft sm:h-12 sm:w-[260px] sm:min-w-[260px] sm:px-2"
            aria-label={libraryButtonLabel}
          >
            <img
              src="/assets/study-aura-logo.png"
              alt="Study Aura"
              className="h-7 w-7 object-contain sm:h-8 sm:w-8"
            />

            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-black leading-4 text-aura-text">
                Study Aura
              </p>
              <p className="truncate text-xs font-semibold leading-4 text-aura-muted">
                AI-powered study workspace
              </p>
            </div>

            <div className="min-w-0 sm:hidden">
              <p className="truncate text-xs font-black leading-tight text-aura-text">
                Study Aura
              </p>
            </div>
          </button>

          <div className="hidden h-8 w-px shrink-0 bg-aura-border lg:block" />

          <button
            type="button"
            onClick={onOpenLibrary}
            className="hidden h-11 w-[190px] items-center justify-center rounded-2xl border border-aura-border bg-aura-bg-soft px-4 text-xs font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text md:inline-flex"
          >
            {libraryButtonLabel}
          </button>

          <button
            type="button"
            onClick={onOpenCreateModule}
            className="hidden h-11 w-[172px] items-center justify-center rounded-2xl bg-aura-cyan px-4 text-xs font-black text-aura-bg transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(34,211,238,0.2)] md:inline-flex"
          >
            + Create Module
          </button>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <div ref={energyMenuRef} className="relative hidden min-[450px]:block">
            <button
              type="button"
              onClick={() => {
                setIsEnergyMenuOpen((current) => !current);
                setIsProfileMenuOpen(false);
              }}
              className={`flex h-9 items-center gap-2 rounded-xl border bg-aura-bg-soft px-2 text-left transition hover:bg-aura-gold/5 sm:h-11 sm:rounded-2xl sm:px-3 ${
                isEnergyAnimating
                  ? "animate-aura-energy-spend border-aura-gold/80 shadow-[0_0_24px_rgba(250,204,21,0.26)]"
                  : "border-aura-border hover:border-aura-gold/60"
              }`}
              aria-label="Open energy usage"
              aria-expanded={isEnergyMenuOpen}
              title={`Energy ${energy}/${maxEnergy}`}
            >
              <span
                className={`grid h-6 w-6 place-items-center rounded-lg border text-xs transition sm:h-7 sm:w-7 sm:rounded-xl sm:text-sm ${
                  isEnergyAnimating
                    ? "border-aura-gold/70 bg-aura-gold/20"
                    : "border-aura-gold/35 bg-aura-gold/10"
                }`}
              >
                ⚡
              </span>

              <span className="text-[10px] font-black text-aura-text sm:text-xs">
                {energy}
                <span className="hidden sm:inline">/{maxEnergy}</span>
              </span>

              <span className="hidden text-[10px] font-black text-aura-muted sm:inline">
                {isEnergyMenuOpen ? "▲" : "▼"}
              </span>
            </button>

            {isEnergyMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+0.85rem)] z-[9999] w-[calc(100vw-2rem)] max-w-[330px] overflow-hidden rounded-[1.5rem] border border-aura-border bg-aura-panel shadow-[0_28px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:w-[330px]">
                <div className="border-b border-aura-border bg-aura-bg-soft/90 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-aura-gold">
                        Aura Energy
                      </p>
                      <p className="mt-1 text-lg font-black text-aura-text">
                        {energy}/{maxEnergy}
                      </p>
                    </div>

                    <div className="grid h-10 w-10 place-items-center rounded-2xl border border-aura-gold/35 bg-aura-gold/10 text-lg">
                      ⚡
                    </div>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-aura-panel">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-aura-gold via-aura-cyan to-aura-primary transition-all"
                      style={{ width: `${energyPercent}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2.5 p-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-aura-dim">
                    Recent energy use
                  </p>

                  <div className="space-y-2">
                    {recentEnergyActivities.length > 0 ? (
                      recentEnergyActivities.map(
                        ({ item, energy: spent, label }) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-3 rounded-2xl border border-aura-border bg-aura-bg-soft px-3 py-2"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-black text-aura-text">
                                {label}
                              </p>
                              <p className="mt-0.5 text-[10px] font-semibold text-aura-dim">
                                {formatRelativeActivityTime(item.createdAt)}
                              </p>
                            </div>

                            <p className="shrink-0 text-sm font-black text-aura-gold">
                              -{spent}
                            </p>
                          </div>
                        ),
                      )
                    ) : (
                      <div className="rounded-2xl border border-dashed border-aura-border bg-aura-bg-soft px-3 py-4 text-sm leading-6 text-aura-muted">
                        No energy activity yet. Generate tools, add sources, or
                        chat with Aura to start tracking.
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-aura-cyan/25 bg-aura-cyan/10 p-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-aura-cyan">
                      Save energy
                    </p>
                    <p className="mt-2 text-xs leading-5 text-aura-muted">
                      Check only the sources you need before generating tools.
                      Smaller context means lower energy use and cleaner output.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div ref={profileMenuRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setIsProfileMenuOpen((current) => !current);
                setIsEnergyMenuOpen(false);
              }}
              className="flex h-9 items-center gap-2 rounded-xl border border-aura-border bg-aura-bg-soft px-2 py-1 text-left transition hover:border-aura-cyan/60 hover:bg-aura-cyan/5 sm:h-11 sm:min-w-[210px] sm:rounded-2xl sm:gap-3 sm:px-3 sm:py-2"
              aria-label="Open profile menu"
              aria-expanded={isProfileMenuOpen}
              title={`${displayName} • ${title}`}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-aura-primary to-aura-cyan text-[10px] font-black text-white shadow-[0_0_18px_rgba(34,211,238,0.18)] sm:h-9 sm:w-9 sm:rounded-xl sm:text-xs">
                {initials}
              </div>

              <div className="hidden min-w-0 flex-1 sm:block">
                <p className="truncate text-sm font-black leading-4 text-aura-text">
                  {displayName}
                </p>
              </div>

              <span className="shrink-0 text-[10px] font-black text-aura-muted sm:text-xs">
                {isProfileMenuOpen ? "▲" : "▼"}
              </span>
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+0.85rem)] z-[9999] w-[calc(100vw-2rem)] max-w-[330px] overflow-hidden rounded-[1.5rem] border border-aura-border bg-aura-panel shadow-[0_28px_80px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:w-[330px]">
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

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => onOpenSettings("home")}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-aura-border bg-aura-bg-soft text-sm text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text sm:h-11 sm:w-11 sm:rounded-2xl sm:text-base"
              aria-label="Open settings"
              title="Settings"
            >
              ⚙️
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-aura-border bg-aura-bg-soft text-sm text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text md:hidden"
              aria-label="Open mobile menu"
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="group hidden h-11 w-11 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-300 transition hover:-translate-y-0.5 hover:border-red-400/70 hover:bg-red-500/20 hover:text-red-100 hover:shadow-[0_16px_36px_rgba(239,68,68,0.18)] md:flex"
              aria-label="Logout"
              title="Logout"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5 transition group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 6H7.5A2.5 2.5 0 0 0 5 8.5v7A2.5 2.5 0 0 0 7.5 18H10" />
                <path d="M14 8l4 4-4 4" />
                <path d="M18 12H9" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full z-[50] border-b border-aura-border bg-aura-panel p-4 shadow-xl md:hidden">
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => {
                onOpenLibrary();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-between rounded-xl border border-aura-border bg-aura-bg-soft p-4 text-sm font-black text-aura-text"
            >
              <span>{libraryButtonLabel}</span>
              <span>→</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenCreateModule();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-between rounded-xl bg-aura-cyan p-4 text-sm font-black text-aura-bg"
            >
              <span>+ Create Module</span>
              <span>→</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onLogout();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-black text-red-300"
            >
              <span>Logout</span>
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 6H7.5A2.5 2.5 0 0 0 5 8.5v7A2.5 2.5 0 0 0 7.5 18H10" />
                <path d="M14 8l4 4-4 4" />
                <path d="M18 12H9" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardNavbar;
