import type { AuraStats } from "../../lib/xp";

type AuraProgressCardProps = {
  stats: AuraStats;
  currentXp: number;
  neededXp: number;
  progressPercent: number;
};

const AuraProgressCard = ({
  stats,
  currentXp,
  neededXp,
  progressPercent,
}: AuraProgressCardProps) => {
  return (
    <div className="rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-cyan">
            Aura Level
          </p>

          <h3 className="mt-2 text-2xl font-black text-aura-text">
            Level {stats.level}
          </h3>

          <p className="mt-1 text-xs font-bold text-aura-gold">
            {stats.activeTitle}
          </p>
        </div>

        <img
          src="/assets/study-aura-logo.png"
          alt="Study Aura"
          className="h-8 w-8 object-contain"
        />
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs font-bold text-aura-muted">
          <span>
            {currentXp} / {neededXp} XP
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

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-aura-border bg-aura-panel p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-aura-dim">
            Energy
          </p>
          <p className="mt-1 text-sm font-black text-aura-text">
            {stats.energy}/{stats.maxEnergy}
          </p>
        </div>

        <div className="rounded-2xl border border-aura-border bg-aura-panel p-3">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-aura-dim">
            Today
          </p>
          <p className="mt-1 text-sm font-black text-aura-text">
            {stats.dailyXp} XP
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuraProgressCard;
