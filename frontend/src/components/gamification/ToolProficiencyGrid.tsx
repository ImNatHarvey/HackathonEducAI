import type { AuraStats } from "../../lib/xp";
import type { AuraToolKey } from "../../lib/xp";

type ToolProficiencyGridProps = {
  stats: AuraStats;
  toolProgress: Record<
    string,
    {
      current: number;
      needed: number;
      percent: number;
    }
  >;
};

const toolOrder: AuraToolKey[] = [
  "quiz",
  "flashcards",
  "audio",
  "slides",
  "tables",
  "mindMap",
];

const ToolProficiencyGrid = ({
  stats,
  toolProgress,
}: ToolProficiencyGridProps) => {
  return (
    <div className="rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-4">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-cyan">
          Tool Proficiencies
        </p>

        <h3 className="mt-2 text-lg font-black text-aura-text">
          Study Mastery
        </h3>
      </div>

      <div className="mt-4 grid gap-3">
        {toolOrder.map((toolKey) => {
          const tool = stats.tools[toolKey];
          const progress = toolProgress[toolKey];

          return (
            <div
              key={toolKey}
              className="rounded-2xl border border-aura-border bg-aura-panel p-3"
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black text-aura-text">
                    {tool.label}
                  </p>
                  <p className="text-[11px] font-bold text-aura-muted">
                    Proficiency Level {tool.level}
                  </p>
                </div>

                <p className="text-xs font-black text-aura-cyan">
                  {progress.current}/{progress.needed}
                </p>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-aura-bg-soft">
                <div
                  className="h-full rounded-full bg-aura-cyan transition-all"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ToolProficiencyGrid;