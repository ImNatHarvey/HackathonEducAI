import { useMemo, useState } from "react";
import type { AuthProfile } from "../../services/authService";
import {
  AURA_TITLE_DEFINITIONS,
  type AuraStats,
  type AuraToolKey,
} from "../../lib/xp";

type ProgressInfo = {
  current: number;
  needed: number;
  percent: number;
};

type ProfilePanelProps = {
  profile?: AuthProfile | null;
  auraStats?: AuraStats;
  accountProgress?: ProgressInfo;
  toolProgress?: Record<string, ProgressInfo>;
  onEquipTitle?: (title: string) => boolean;
};

const toolOrder: AuraToolKey[] = [
  "quiz",
  "flashcards",
  "audio",
  "slides",
  "tables",
  "mindMap",
];

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 0 || !parts[0]) return "SA";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const ProfilePanel = ({
  profile = null,
  auraStats,
  accountProgress,
  toolProgress = {},
  onEquipTitle,
}: ProfilePanelProps) => {
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);

  const displayName =
    auraStats?.username || profile?.displayName || "Study Aura User";
  const email = profile?.email ?? "No email available";
  const title = auraStats?.activeTitle || profile?.title || "Fresh Spawn";
  const level = auraStats?.level ?? profile?.level ?? 1;
  const xp = accountProgress?.current ?? profile?.xp ?? 0;
  const xpToNextLevel =
    accountProgress?.needed ?? profile?.xpToNextLevel ?? 100;
  const progressPercent =
    accountProgress?.percent ??
    (xpToNextLevel > 0 ? Math.min((xp / xpToNextLevel) * 100, 100) : 0);
  const initials = getInitials(displayName);

  const unlockedTitleSet = useMemo(() => {
    return new Set(auraStats?.titles ?? [title]);
  }, [auraStats?.titles, title]);

  const unlockedCount = auraStats?.titles.length ?? 1;

  const handleEquipTitle = (nextTitle: string) => {
    onEquipTitle?.(nextTitle);
  };

  return (
    <section className="space-y-5">
      <div className="rounded-[2rem] border border-aura-border bg-aura-bg-soft p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-aura-primary via-aura-cyan to-aura-gold text-2xl font-black text-white shadow-[0_0_40px_rgba(34,211,238,0.2)]">
              {initials}
            </div>

            <div className="min-w-0">
              <p className="inline-flex max-w-full rounded-full border border-aura-gold/35 bg-aura-gold/10 px-3 py-1 text-[10px] font-black uppercase leading-3 tracking-[0.14em] text-aura-gold">
                <span className="truncate">{title}</span>
              </p>

              <h3 className="mt-3 truncate text-2xl font-black text-aura-text">
                {displayName}
              </h3>

              <p className="mt-1 truncate text-sm font-semibold text-aura-muted">
                {email}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 md:min-w-[420px]">
            <div className="rounded-2xl border border-aura-border bg-aura-panel p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-aura-dim">
                Level
              </p>
              <p className="mt-1 text-xl font-black text-aura-text">
                Lv. {level}
              </p>
            </div>

            <div className="rounded-2xl border border-aura-border bg-aura-panel p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-aura-dim">
                Energy
              </p>
              <p className="mt-1 text-xl font-black text-aura-text">
                {auraStats
                  ? `${auraStats.energy}/${auraStats.maxEnergy}`
                  : "100/100"}
              </p>
            </div>

            <div className="rounded-2xl border border-aura-border bg-aura-panel p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-aura-dim">
                Titles
              </p>
              <p className="mt-1 text-xl font-black text-aura-text">
                {unlockedCount}/{AURA_TITLE_DEFINITIONS.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[1.7rem] border border-aura-border bg-aura-bg-soft p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-cyan">
              Aura Progress
            </p>

            <h3 className="mt-2 text-3xl font-black text-aura-text">
              Level {level}
            </h3>

            <p className="mt-2 text-sm font-semibold text-aura-muted">
              Level up by chatting, adding sources, searching web sources, and
              generating study tools.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsTitleModalOpen(true)}
            className="rounded-2xl border border-aura-gold/40 bg-aura-gold/10 px-4 py-3 text-sm font-black text-aura-gold transition hover:-translate-y-0.5 hover:border-aura-gold"
          >
            🏅 Title Inventory
          </button>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs font-bold text-aura-muted">
            <span>
              {xp} / {xpToNextLevel} XP
            </span>
            <span>{Math.round(progressPercent)}%</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-aura-panel">
            <div
              className="h-full rounded-full bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-aura-border bg-aura-panel p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-aura-dim">
              Total XP
            </p>
            <p className="mt-1 text-2xl font-black text-aura-text">
              {auraStats?.totalXp ?? xp}
            </p>
          </div>

          <div className="rounded-2xl border border-aura-border bg-aura-panel p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-aura-dim">
              Today
            </p>
            <p className="mt-1 text-2xl font-black text-aura-text">
              {auraStats?.dailyXp ?? 0} XP
            </p>
          </div>
        </div>
      </div>

      {auraStats && (
        <div className="rounded-[1.7rem] border border-aura-border bg-aura-bg-soft p-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-cyan">
              Tool Mastery
            </p>

            <h3 className="mt-2 text-xl font-black text-aura-text">
              Proficiency Progress
            </h3>

            <p className="mt-2 text-sm leading-6 text-aura-muted">
              Each tool has its own level. Stronger generations give more
              proficiency XP and unlock specialized titles.
            </p>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {toolOrder.map((toolKey) => {
              const tool = auraStats.tools[toolKey];
              const progress = toolProgress[toolKey];

              return (
                <div
                  key={toolKey}
                  className="rounded-2xl border border-aura-border bg-aura-panel p-4"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black text-aura-text">
                        {tool.label}
                      </p>

                      <p className="mt-1 text-xs font-bold text-aura-muted">
                        Level {tool.level}
                      </p>
                    </div>

                    <span className="rounded-full border border-aura-cyan/30 bg-aura-cyan/10 px-3 py-1 text-xs font-black text-aura-cyan">
                      Lv. {tool.level}
                    </span>
                  </div>

                  <div className="mb-2 flex items-center justify-between text-[11px] font-bold text-aura-muted">
                    <span>
                      {progress?.current ?? tool.xp} /{" "}
                      {progress?.needed ?? 100} XP
                    </span>
                    <span>{Math.round(progress?.percent ?? 0)}%</span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-aura-bg-soft">
                    <div
                      className="h-full rounded-full bg-aura-cyan transition-all"
                      style={{ width: `${progress?.percent ?? 0}%` }}
                    />
                  </div>

                  <p className="mt-3 text-xs font-bold text-aura-muted">
                    {tool.generations} generation
                    {tool.generations === 1 ? "" : "s"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isTitleModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-aura-bg/85 px-3 py-3 backdrop-blur-xl">
          <div className="flex max-h-[92vh] w-full max-w-[1400px] flex-col overflow-hidden rounded-[2rem] border border-aura-border bg-aura-panel shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-aura-border bg-aura-bg-soft/80 px-6 py-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-aura-gold">
                  Achievement Vault
                </p>

                <h2 className="mt-2 text-2xl font-black text-aura-text">
                  Title Inventory
                </h2>

                <p className="mt-2 max-w-3xl text-sm leading-6 text-aura-muted">
                  Unlock titles from levels, sources, web research, chat prompts,
                  AI Studio generations, and tool mastery. Equip one title to
                  display on your profile.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsTitleModalOpen(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-aura-border bg-aura-bg-soft text-aura-muted transition hover:border-aura-pink/60 hover:bg-aura-pink/10 hover:text-aura-pink"
                aria-label="Close title inventory"
              >
                ✕
              </button>
            </header>

            <div className="shrink-0 border-b border-aura-border px-6 py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-black text-aura-text">
                    {unlockedCount} unlocked / {AURA_TITLE_DEFINITIONS.length}{" "}
                    total
                  </p>

                  <p className="mt-1 text-xs font-bold text-aura-muted">
                    Active title:{" "}
                    <span className="text-aura-gold">{title}</span>
                  </p>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-aura-dim">
                      Chat
                    </p>
                    <p className="mt-1 text-sm font-black text-aura-text">
                      {auraStats?.activityCounts.chatMessages ?? 0} prompts
                    </p>
                  </div>

                  <div className="rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-aura-dim">
                      Sources
                    </p>
                    <p className="mt-1 text-sm font-black text-aura-text">
                      {auraStats?.activityCounts.sourcesAdded ?? 0} added
                    </p>
                  </div>

                  <div className="rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-aura-dim">
                      Outputs
                    </p>
                    <p className="mt-1 text-sm font-black text-aura-text">
                      {auraStats?.activityCounts.aiOutputsGenerated ?? 0} made
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <main className="aura-scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-5">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {AURA_TITLE_DEFINITIONS.map((titleDefinition) => {
                  const isUnlocked = unlockedTitleSet.has(titleDefinition.title);
                  const isActive = titleDefinition.title === title;

                  return (
                    <div
                      key={titleDefinition.id}
                      className={`rounded-2xl border p-4 transition ${
                        isUnlocked
                          ? "border-aura-border bg-aura-bg-soft"
                          : "border-aura-border/70 bg-aura-bg/40 opacity-70"
                      } ${
                        isActive
                          ? "shadow-[0_0_0_1px_rgba(245,158,11,0.55)]"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border text-2xl ${
                            isUnlocked
                              ? "border-aura-gold/35 bg-aura-gold/10"
                              : "border-aura-border bg-aura-panel grayscale"
                          }`}
                        >
                          {isUnlocked ? titleDefinition.icon : "🔒"}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4
                            className={`text-sm font-black ${
                              isUnlocked ? "text-aura-text" : "text-aura-muted"
                            }`}
                          >
                            {titleDefinition.title}
                          </h4>

                          <p className="mt-2 text-xs leading-5 text-aura-muted">
                            {titleDefinition.requirement}
                          </p>

                          <div className="mt-4">
                            {isUnlocked ? (
                              <button
                                type="button"
                                onClick={() =>
                                  handleEquipTitle(titleDefinition.title)
                                }
                                disabled={isActive}
                                className={`w-full rounded-xl px-3 py-2 text-xs font-black transition ${
                                  isActive
                                    ? "cursor-default border border-aura-gold/40 bg-aura-gold/10 text-aura-gold"
                                    : "border border-aura-cyan/40 bg-aura-cyan/10 text-aura-cyan hover:border-aura-cyan hover:bg-aura-cyan/15"
                                }`}
                              >
                                {isActive ? "Equipped" : "Equip Title"}
                              </button>
                            ) : (
                              <div className="rounded-xl border border-aura-border bg-aura-panel px-3 py-2 text-center text-xs font-black text-aura-dim">
                                Locked
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </main>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProfilePanel;