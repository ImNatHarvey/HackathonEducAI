import { useMemo, useState } from "react";

type StatKey = "focus" | "memory" | "logic" | "creativity" | "discipline";

type PlayerStat = {
  key: StatKey;
  label: string;
  description: string;
  value: number;
  icon: string;
};

type EarnedTitle = {
  id: string;
  name: string;
  rarity: "Common" | "Rare" | "Epic" | "Legendary";
  description: string;
  unlocked: boolean;
};

const initialStats: PlayerStat[] = [
  {
    key: "focus",
    label: "Focus",
    description: "Improves study streaks and deep work sessions.",
    value: 8,
    icon: "🎯",
  },
  {
    key: "memory",
    label: "Memory",
    description: "Boosts flashcard recall and review performance.",
    value: 6,
    icon: "🧠",
  },
  {
    key: "logic",
    label: "Logic",
    description: "Improves quiz reasoning and problem solving.",
    value: 7,
    icon: "🧩",
  },
  {
    key: "creativity",
    label: "Creativity",
    description: "Improves mind maps, tables, and generated study outputs.",
    value: 5,
    icon: "🎨",
  },
  {
    key: "discipline",
    label: "Discipline",
    description: "Improves consistency, completion rate, and XP growth.",
    value: 9,
    icon: "🔥",
  },
];

const titleInventory: EarnedTitle[] = [
  {
    id: "aura-farmer",
    name: "Aura Farmer",
    rarity: "Common",
    description: "Started cultivating your first learning path.",
    unlocked: true,
  },
  {
    id: "dolphin-expert",
    name: "Dolphin Expert",
    rarity: "Rare",
    description: "Completed a marine biology topic with high progress.",
    unlocked: true,
  },
  {
    id: "quiz-sprinter",
    name: "Quiz Sprinter",
    rarity: "Rare",
    description: "Generated and completed multiple practice quizzes.",
    unlocked: true,
  },
  {
    id: "mind-map-architect",
    name: "Mind Map Architect",
    rarity: "Epic",
    description: "Created advanced visual learning maps.",
    unlocked: false,
  },
  {
    id: "aura-scholar",
    name: "Aura Scholar",
    rarity: "Legendary",
    description: "Mastered several topics across different sources.",
    unlocked: false,
  },
];

const rarityClass: Record<EarnedTitle["rarity"], string> = {
  Common: "text-aura-muted border-aura-border bg-aura-panel",
  Rare: "text-aura-cyan border-aura-cyan/35 bg-aura-cyan/10",
  Epic: "text-aura-primary-soft border-aura-primary-soft/35 bg-aura-primary/10",
  Legendary: "text-aura-gold border-aura-gold/35 bg-aura-gold/10",
};

const ProfilePanel = () => {
  const [stats, setStats] = useState(initialStats);
  const [statPoints, setStatPoints] = useState(5);
  const [equippedTitle, setEquippedTitle] = useState("Aura Farmer");

  const totalStats = useMemo(() => {
    return stats.reduce((sum, stat) => sum + stat.value, 0);
  }, [stats]);

  const allocatePoint = (key: StatKey) => {
    if (statPoints <= 0) return;

    setStats((currentStats) =>
      currentStats.map((stat) =>
        stat.key === key ? { ...stat, value: stat.value + 1 } : stat,
      ),
    );

    setStatPoints((points) => points - 1);
  };

  return (
    <section className="mx-auto max-w-6xl space-y-5">
      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-6">
          <div className="flex items-center gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-aura-gold to-aura-orange text-3xl font-black text-aura-bg shadow-[0_0_28px_rgba(250,204,21,0.25)]">
              JD
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-aura-dim">
                Student Profile
              </p>
              <h3 className="mt-1 text-3xl font-black text-aura-text">
                John Doe
              </h3>
              <p className="mt-1 font-bold text-aura-gold">
                Equipped: {equippedTitle}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-aura-border bg-aura-panel p-4">
            <div className="flex items-center justify-between">
              <p className="font-black text-aura-text">Level 1</p>
              <p className="text-sm font-bold text-aura-cyan">150 / 500 XP</p>
            </div>

            <div className="mt-3 h-3 overflow-hidden rounded-full bg-aura-bg">
              <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-aura-primary to-aura-cyan" />
            </div>

            <p className="mt-2 text-xs text-aura-muted">
              350 XP until Level 2 and next stat reward.
            </p>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-aura-border bg-aura-panel p-4">
              <p className="text-sm text-aura-muted">HP</p>
              <p className="mt-1 text-2xl font-black text-aura-green">100</p>
              <div className="mt-3 h-2 rounded-full bg-aura-bg">
                <div className="h-full w-full rounded-full bg-aura-green" />
              </div>
            </div>

            <div className="rounded-2xl border border-aura-border bg-aura-panel p-4">
              <p className="text-sm text-aura-muted">Focus Energy</p>
              <p className="mt-1 text-2xl font-black text-aura-cyan">72</p>
              <div className="mt-3 h-2 rounded-full bg-aura-bg">
                <div className="h-full w-[72%] rounded-full bg-aura-cyan" />
              </div>
            </div>

            <div className="rounded-2xl border border-aura-border bg-aura-panel p-4">
              <p className="text-sm text-aura-muted">Aura Power</p>
              <p className="mt-1 text-2xl font-black text-aura-gold">
                {totalStats}
              </p>
              <div className="mt-3 h-2 rounded-full bg-aura-bg">
                <div className="h-full w-[70%] rounded-full bg-aura-gold" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-black text-aura-text">
                Stats Allocation
              </h3>
              <p className="mt-1 text-sm leading-6 text-aura-muted">
                Spend points to shape your Study Aura learning build.
              </p>
            </div>

            <div className="rounded-2xl border border-aura-gold/30 bg-aura-gold/10 px-4 py-3 text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-aura-muted">
                Available Points
              </p>
              <p className="text-2xl font-black text-aura-gold">{statPoints}</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {stats.map((stat) => (
              <div
                key={stat.key}
                className="rounded-2xl border border-aura-border bg-aura-panel p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-aura-cyan/10 text-xl">
                      {stat.icon}
                    </div>

                    <div>
                      <p className="font-black text-aura-text">
                        {stat.label}{" "}
                        <span className="text-aura-cyan">+{stat.value}</span>
                      </p>
                      <p className="mt-1 text-sm leading-5 text-aura-muted">
                        {stat.description}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={statPoints <= 0}
                    onClick={() => allocatePoint(stat.key)}
                    className="rounded-xl border border-aura-border bg-aura-bg-soft px-4 py-2 text-sm font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-cyan disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    +1
                  </button>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-aura-bg">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-aura-primary to-aura-cyan"
                    style={{ width: `${Math.min(stat.value * 8, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-xl font-black text-aura-text">
              Title Inventory
            </h3>
            <p className="mt-1 text-sm leading-6 text-aura-muted">
              View earned titles and equip one to show on your profile.
            </p>
          </div>

          <p className="text-sm font-bold text-aura-cyan">
            Equipped: {equippedTitle}
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {titleInventory.map((title) => (
            <button
              key={title.id}
              type="button"
              disabled={!title.unlocked}
              onClick={() => setEquippedTitle(title.name)}
              className={`rounded-2xl border p-5 text-left transition ${
                title.unlocked
                  ? `${rarityClass[title.rarity]} hover:-translate-y-1 hover:border-aura-cyan/60`
                  : "cursor-not-allowed border-aura-border bg-aura-panel opacity-45"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-black">{title.name}</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-widest">
                    {title.rarity}
                  </p>
                </div>

                {equippedTitle === title.name && (
                  <span className="rounded-full bg-aura-cyan/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-aura-cyan">
                    Equipped
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm leading-6 text-aura-muted">
                {title.description}
              </p>

              {!title.unlocked && (
                <p className="mt-3 text-xs font-bold text-aura-dim">
                  Locked — complete more topics to unlock.
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfilePanel;