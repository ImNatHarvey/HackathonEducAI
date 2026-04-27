type LandingPageProps = {
  onGetStarted: () => void;
};

const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  return (
    <main className="min-h-dvh overflow-hidden bg-aura-bg text-aura-text">
      <section className="relative mx-auto flex min-h-dvh max-w-7xl flex-col px-6 py-8">
        <div className="pointer-events-none absolute left-[-10%] top-[-20%] h-96 w-96 rounded-full bg-aura-cyan/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-15%] right-[-10%] h-96 w-96 rounded-full bg-aura-primary/20 blur-3xl" />

        <nav className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-aura-primary via-aura-cyan to-aura-gold text-lg font-black text-aura-bg">
              ✦
            </div>

            <div>
              <p className="text-sm font-black text-aura-text">Study Aura</p>
              <p className="text-xs font-semibold text-aura-muted">
                HackathonEducAI
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onGetStarted}
            className="rounded-2xl border border-aura-border bg-aura-panel px-5 py-3 text-sm font-black text-aura-text transition hover:-translate-y-0.5 hover:border-aura-cyan/60"
          >
            Sign In
          </button>
        </nav>

        <div className="relative z-10 grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="inline-flex rounded-full border border-aura-cyan/40 bg-aura-cyan/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-aura-cyan">
              AI-powered modular study workspace
            </p>

            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight text-aura-text md:text-7xl">
              Turn your sources into smart study tools.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-aura-muted md:text-lg">
              Create modules, add sources, choose which sources become AI
              context, then generate quizzes, flashcards, tables, mind maps,
              slides, and audio overviews.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onGetStarted}
                className="rounded-2xl bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold px-6 py-4 text-sm font-black text-aura-bg transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(34,211,238,0.22)]"
              >
                Get Started
              </button>

              <div className="rounded-2xl border border-aura-border bg-aura-panel px-6 py-4 text-sm font-bold text-aura-muted">
                Powered by React, n8n, and Gemini
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-aura-border bg-aura-panel/80 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-aura-cyan">
                  Module
                </p>

                <span className="rounded-full bg-aura-cyan/10 px-3 py-1 text-xs font-black text-aura-cyan">
                  3 sources
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-black text-aura-text">
                Neural Networks
              </h2>

              <div className="mt-5 space-y-3">
                {["Class Notes", "YouTube Lecture", "Backpropagation Article"].map(
                  (source) => (
                    <div
                      key={source}
                      className="flex items-center gap-3 rounded-2xl border border-aura-border bg-aura-panel px-4 py-3"
                    >
                      <div className="h-4 w-4 rounded border border-aura-cyan bg-aura-cyan/30" />
                      <p className="text-sm font-bold text-aura-muted">
                        {source}
                      </p>
                    </div>
                  ),
                )}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {["Quiz", "Flashcards", "Mind Map", "Slides"].map((tool) => (
                  <div
                    key={tool}
                    className="rounded-2xl border border-aura-border bg-aura-bg px-4 py-4 text-sm font-black text-aura-text"
                  >
                    {tool}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;