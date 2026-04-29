import { useState } from "react";
import type { AuthProfile } from "../../services/authService";
import type { AuraStats, AuraToolKey } from "../../lib/xp";

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
}: ProfilePanelProps) => {
  const [isTitleInventoryOpen, setIsTitleInventoryOpen] = useState(false);

  const displayName =
    auraStats?.username || profile?.displayName || "Study Aura User";
  const email = profile?.email ?? "No email available";
  const title = auraStats?.activeTitle || profile?.title || "New Learner";
  const level = auraStats?.level ?? profile?.level ?? 1;
  const xp = accountProgress?.current ?? profile?.xp ?? 0;
  const xpToNextLevel =
    accountProgress?.needed ?? profile?.xpToNextLevel ?? 1000;
  const progressPercent =
    accountProgress?.percent ??
    (xpToNextLevel > 0 ? Math.min((xp / xpToNextLevel) * 100, 100) : 0);
  const initials = getInitials(displayName);

  const earnedTitles = auraStats?.titles ?? [title];

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
                Today
              </p>
              <p className="mt-1 text-xl font-black text-aura-text">
                {auraStats?.dailyXp ?? 0} XP
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

          <div className="grid h-16 w-16 place-items-center rounded-2xl border border-aura-gold/40 bg-aura-gold/10 text-2xl font-black text-aura-gold">
            ✦
          </div>
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

        <div className="mt-4 rounded-2xl border border-aura-border bg-aura-panel p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-aura-dim">
            Total XP
          </p>
          <p className="mt-1 text-2xl font-black text-aura-text">
            {auraStats?.totalXp ?? xp}
          </p>
        </div>
      </div>

      {auraStats && (
        <div className="rounded-[1.7rem] border border-aura-border bg-aura-bg-soft p-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-cyan">
              Study Tool Proficiencies
            </p>

            <h3 className="mt-2 text-xl font-black text-aura-text">
              Mastery by Tool
            </h3>

            <p className="mt-2 text-sm leading-6 text-aura-muted">
              Each study tool has its own proficiency level. Harder presets give
              more proficiency EXP.
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
                        Proficiency Level {tool.level}
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
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-[1.7rem] border border-aura-border bg-aura-bg-soft p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-cyan">
              Earned Titles
            </p>

            <h3 className="mt-2 text-xl font-black text-aura-text">
              Title Inventory
            </h3>

            <p className="mt-2 text-sm leading-6 text-aura-muted">
              Titles are unlocked through Aura Level milestones. Your active
              title is shown beside your profile.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsTitleInventoryOpen((current) => !current)}
            className="rounded-2xl border border-aura-gold/40 bg-aura-gold/10 px-4 py-3 text-sm font-black text-aura-gold transition hover:-translate-y-0.5 hover:border-aura-gold"
          >
            {isTitleInventoryOpen ? "Hide Inventory" : "Title Inventory"}
          </button>
        </div>

        {isTitleInventoryOpen && (
          <div className="mt-4 rounded-[1.4rem] border border-aura-border bg-aura-panel p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-black text-aura-text">
                Available Titles
              </p>

              <p className="text-xs font-bold text-aura-muted">
                {earnedTitles.length} unlocked
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {earnedTitles.map((earnedTitle) => (
                <span
                  key={earnedTitle}
                  className={`rounded-full border px-3 py-2 text-xs font-black ${
                    earnedTitle === title
                      ? "border-aura-gold/40 bg-aura-gold/15 text-aura-gold"
                      : "border-aura-border bg-aura-bg-soft text-aura-muted"
                  }`}
                >
                  {earnedTitle}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProfilePanel;