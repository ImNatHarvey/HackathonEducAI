import type { SettingsCard, SettingsPanel } from "./settingsTypes";

type SettingsHomeProps = {
  onOpenPanel: (panel: SettingsPanel) => void;
};

const settingsCards: SettingsCard[] = [
  {
    id: "profile",
    title: "Profile",
    description: "View account details, XP, level, and earned Study Aura titles.",
    icon: "👤",
    accent: "from-aura-orange/25 to-aura-gold/10 border-aura-orange/30",
  },
  {
    id: "preferences",
    title: "Personal Preference",
    description: "Customize how Study Aura explains lessons and talks to you.",
    icon: "🧠",
    accent: "from-aura-primary/25 to-aura-cyan/10 border-aura-primary-soft/30",
  },
  {
    id: "audio",
    title: "Audio Overview",
    description: "Control text-to-speech, podcast style, and listening behavior.",
    icon: "🎧",
    accent: "from-aura-cyan/25 to-aura-blue/10 border-aura-cyan/30",
  },
  {
    id: "safety",
    title: "Safe Learning Filter",
    description: "Manage sensitive, harmful, and illegal topic filtering.",
    icon: "🛡️",
    accent: "from-aura-green/25 to-aura-cyan/10 border-aura-green/30",
  },
  {
    id: "generation",
    title: "Generation Defaults",
    description: "Set defaults for quizzes, flashcards, slides, tables, and mind maps.",
    icon: "⚙️",
    accent: "from-aura-gold/25 to-aura-orange/10 border-aura-gold/30",
  },
  {
    id: "activity",
    title: "Activity Log",
    description: "Review your chat prompts and generated learning materials.",
    icon: "📜",
    accent: "from-aura-pink/25 to-aura-primary/10 border-aura-pink/30",
  },
];

const SettingsHome = ({ onOpenPanel }: SettingsHomeProps) => {
  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-6">
        <div className="flex items-start justify-between gap-5">
          <div>
            <h3 className="text-xl font-black text-aura-text">AI Instructions</h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-aura-muted">
              Tell Study Aura how you want it to teach you. This will later be sent
              to your n8n workflow/Gemini as your learning preference.
            </p>
          </div>

          <span className="rounded-full border border-aura-cyan/30 bg-aura-cyan/10 px-3 py-1 text-xs font-black text-aura-cyan">
            Core setting
          </span>
        </div>

        <textarea
          placeholder="Example: Explain like I am a beginner. Use simple examples, Taglish if needed, and quiz me after every section."
          className="mt-5 min-h-[145px] w-full resize-none rounded-2xl border border-aura-border bg-aura-panel px-5 py-4 text-sm leading-7 text-aura-text outline-none placeholder:text-aura-dim focus:border-aura-cyan/70"
        />
      </section>

      <section>
        <div className="mb-4">
          <h3 className="text-xl font-black text-aura-text">Settings Menu</h3>
          <p className="mt-1 text-sm text-aura-muted">
            Open each section to configure it without making the modal cramped.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {settingsCards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => onOpenPanel(card.id)}
              className={`group rounded-[1.5rem] border bg-gradient-to-br ${card.accent} p-5 text-left transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(124,58,237,0.16)]`}
            >
              <div className="mb-5 flex items-center justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/8 text-2xl transition group-hover:scale-110">
                  {card.icon}
                </div>

                <span className="text-lg text-aura-muted transition group-hover:translate-x-1 group-hover:text-aura-cyan">
                  →
                </span>
              </div>

              <h4 className="text-base font-black text-aura-text">{card.title}</h4>
              <p className="mt-2 text-sm leading-6 text-aura-muted">
                {card.description}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SettingsHome;