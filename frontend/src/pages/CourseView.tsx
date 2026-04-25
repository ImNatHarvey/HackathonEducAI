interface CourseViewProps {
  topic: string;
  onBack: () => void;
}

const modules = [
  {
    title: 'Introduction',
    description: 'Understand the basic ideas and vocabulary.',
    score: '10/10',
    icon: '🌱',
  },
  {
    title: 'Core Concepts',
    description: 'Connect the key lessons into a clear mental model.',
    score: '30/30',
    icon: '🧠',
  },
  {
    title: 'Practice & Recall',
    description: 'Review using flashcards, quiz questions, and examples.',
    score: '25/25',
    icon: '⚡',
  },
];

const CourseView = ({ topic, onBack }: CourseViewProps) => {
  return (
    <main className="min-h-screen bg-aura-bg text-aura-text aura-grid-bg p-6">
      <div className="relative z-10 mx-auto max-w-5xl">
        <button
          onClick={onBack}
          className="mb-6 rounded-full border border-aura-border bg-aura-panel px-4 py-2 text-sm font-bold text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-cyan"
        >
          ← Back to Dashboard
        </button>

        <section className="rounded-[2rem] border border-aura-border bg-aura-panel/80 p-8 shadow-aura-soft">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-aura-dim">
                Study path generated
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-tight">
                <span className="aura-title">{topic}</span>
              </h1>
              <p className="mt-3 max-w-2xl leading-7 text-aura-muted">
                Study Aura converted your source material into a guided path with review,
                generated tools, and completion rewards.
              </p>
            </div>

            <div className="rounded-3xl border border-aura-gold/30 bg-aura-gold/10 p-5 text-center">
              <p className="text-3xl font-black text-aura-gold">100%</p>
              <p className="mt-1 text-xs font-black uppercase tracking-widest text-aura-muted">
                Complete
              </p>
            </div>
          </div>

          <div className="mt-8">
            <div className="h-3 overflow-hidden rounded-full bg-aura-bg-soft">
              <div className="h-full w-full rounded-full bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold shadow-[0_0_24px_rgba(34,211,238,0.45)]" />
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-aura-green">
              <span className="h-2 w-2 rounded-full bg-aura-green shadow-[0_0_15px_rgba(52,211,153,0.9)]" />
              Title earned: Dolphin Expert
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4">
          {modules.map((module, index) => (
            <div
              key={module.title}
              className="group rounded-[1.5rem] border border-aura-border bg-aura-panel/80 p-5 shadow-aura-soft transition hover:-translate-y-1 hover:border-aura-cyan/60"
            >
              <div className="flex items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-aura-bg-soft text-2xl transition group-hover:scale-110">
                    {module.icon}
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-aura-dim">
                      Module {index + 1}
                    </p>
                    <h3 className="mt-1 text-xl font-black text-aura-text">
                      {module.title}
                    </h3>
                    <p className="mt-1 text-sm text-aura-muted">
                      {module.description}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-aura-green/30 bg-aura-green/10 px-4 py-3 text-sm font-black text-aura-green">
                  {module.score}
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
};

export default CourseView;