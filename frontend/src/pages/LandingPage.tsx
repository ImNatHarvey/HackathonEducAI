type LandingPageProps = {
  onGetStarted: () => void;
};

const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  return (
    <main className="min-h-dvh overflow-hidden bg-aura-bg text-aura-text">
      <style>
        {`
          @keyframes auraFloatOne {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.55; }
            50% { transform: translate3d(70px, 45px, 0) scale(1.18); opacity: 0.85; }
          }

          @keyframes auraFloatTwo {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.5; }
            50% { transform: translate3d(-80px, -45px, 0) scale(1.14); opacity: 0.82; }
          }

          @keyframes auraFloatThree {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.35; }
            50% { transform: translate3d(45px, -65px, 0) scale(1.2); opacity: 0.72; }
          }

          @keyframes auraFloatFour {
            0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: 0.32; }
            50% { transform: translate3d(-35px, 55px, 0) scale(1.16); opacity: 0.65; }
          }

          @keyframes auraCardTilt {
            0%, 100% { transform: perspective(1200px) rotateX(4deg) rotateY(-7deg) translateY(0) scale(0.94); }
            50% { transform: perspective(1200px) rotateX(2deg) rotateY(7deg) translateY(-8px) scale(0.94); }
          }

          .landing-aura-bubble-one {
            animation: auraFloatOne 9s ease-in-out infinite;
          }

          .landing-aura-bubble-two {
            animation: auraFloatTwo 11s ease-in-out infinite;
          }

          .landing-aura-bubble-three {
            animation: auraFloatThree 13s ease-in-out infinite;
          }

          .landing-aura-bubble-four {
            animation: auraFloatFour 15s ease-in-out infinite;
          }

          .landing-preview-3d {
            transform-style: preserve-3d;
            transform-origin: center;
            animation: auraCardTilt 8s ease-in-out infinite;
          }

          .landing-preview-3d:hover {
            animation-play-state: paused;
            transform: perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(-6px) scale(0.94);
          }

          @media (max-width: 1023px) {
            .landing-preview-3d,
            .landing-preview-3d:hover {
              transform: none;
              animation: none;
            }
          }
        `}
      </style>

      <section className="relative flex min-h-dvh flex-col px-5 py-5 md:px-6">
        <div className="landing-aura-bubble-one pointer-events-none absolute left-[-8%] top-[-16%] h-[30rem] w-[30rem] rounded-full bg-aura-cyan/25 blur-3xl" />
        <div className="landing-aura-bubble-two pointer-events-none absolute bottom-[-18%] right-[-8%] h-[32rem] w-[32rem] rounded-full bg-aura-primary/25 blur-3xl" />
        <div className="landing-aura-bubble-three pointer-events-none absolute left-[38%] top-[16%] h-[24rem] w-[24rem] rounded-full bg-aura-gold/20 blur-3xl" />
        <div className="landing-aura-bubble-four pointer-events-none absolute bottom-[10%] left-[8%] h-[22rem] w-[22rem] rounded-full bg-aura-cyan/15 blur-3xl" />

        <nav className="relative z-10 flex items-center justify-between border-b border-aura-border/70 pb-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/study-aura-logo.png"
              alt="Study Aura"
              className="h-8 w-8 object-contain"
            />

            <div>
              <p className="text-sm font-black leading-tight text-aura-text">
                Study Aura
              </p>
              <p className="text-xs font-semibold leading-tight text-aura-muted">
                AI-powered study workspace
              </p>
            </div>
          </div>
        </nav>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 items-center gap-8 pt-6 pb-10 lg:grid-cols-[1.02fr_0.98fr] lg:pt-2 lg:pb-8">
          <div className="lg:-translate-y-4">
            <p className="inline-flex rounded-full border border-aura-cyan/40 bg-aura-cyan/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-aura-cyan">
              AI-powered modular study workspace
            </p>

            <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight text-aura-text md:text-7xl">
              Forge your aura from every source.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-aura-muted md:text-lg">
              Turn notes, PDFs, images, websites, and YouTube videos into
              focused summaries, quizzes, flashcards, slides, mind maps, tables,
              and audio overviews while earning Aura XP as you learn.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onGetStarted}
                className="rounded-2xl bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold px-7 py-4 text-sm font-black text-aura-bg shadow-[0_18px_50px_rgba(34,211,238,0.24)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(34,211,238,0.32)]"
              >
                Get Started
              </button>

              <button
                type="button"
                onClick={onGetStarted}
                className="rounded-2xl border border-aura-cyan/40 bg-aura-panel/90 px-7 py-4 text-sm font-black text-aura-text shadow-[0_18px_45px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:border-aura-cyan hover:bg-aura-cyan/10"
              >
                Sign In
              </button>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="landing-preview-3d relative rounded-[2rem] border border-aura-border bg-aura-panel/80 p-4 shadow-[0_35px_110px_rgba(0,0,0,0.45)] backdrop-blur-xl transition duration-500 lg:-translate-y-6"
          >
            <div className="pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br from-aura-cyan/10 via-transparent to-aura-gold/10" />

            <div className="relative overflow-hidden rounded-[1.5rem] border border-aura-border bg-aura-bg-soft">
              <div className="border-b border-aura-border/70 px-5 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-aura-cyan">
                      Preview
                    </p>
                    <h2 className="mt-2 text-xl font-black text-aura-text md:text-2xl">
                      One source. Many study tools.
                    </h2>
                  </div>

                  <div className="rounded-full border border-aura-gold/40 bg-aura-gold/10 px-3 py-1 text-xs font-black text-aura-gold">
                    + Aura XP
                  </div>
                </div>

                <p className="mt-3 max-w-xl text-sm leading-6 text-aura-muted">
                  A visual snapshot of how Study Aura transforms your learning
                  materials into organized outputs.
                </p>
              </div>

              <div className="grid gap-4 p-5 md:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-3xl border border-aura-border bg-aura-bg/70 p-4">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-aura-primary via-aura-cyan to-aura-gold text-aura-bg">
                      ✦
                    </div>
                    <div>
                      <p className="text-sm font-black text-aura-text">
                        Neural Networks
                      </p>
                      <p className="text-xs font-bold text-aura-muted">
                        3 sources selected
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      ["Class Notes", "PDF"],
                      ["YouTube Lecture", "Video"],
                      ["Backpropagation Article", "Web"],
                    ].map(([title, type]) => (
                      <div
                        key={title}
                        className="rounded-2xl border border-aura-border/80 bg-aura-panel/80 p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-black text-aura-text">
                            {title}
                          </p>
                          <span className="rounded-full bg-aura-cyan/10 px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-[0.14em] text-aura-cyan">
                            {type}
                          </span>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-aura-border/60">
                          <div className="h-2 rounded-full bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-aura-border bg-aura-bg/70 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-aura-cyan">
                    Generated outputs
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      ["Quiz", "Practice questions"],
                      ["Flashcards", "Active recall"],
                      ["Mind Map", "Visual concepts"],
                      ["Slides", "Presentation outline"],
                      ["Tables", "Clean comparisons"],
                      ["Audio", "Narrated overview"],
                    ].map(([title, description]) => (
                      <div
                        key={title}
                        className="rounded-2xl border border-aura-border/80 bg-aura-panel/80 p-3"
                      >
                        <p className="text-sm font-black text-aura-text">
                          {title}
                        </p>
                        <p className="mt-1 text-xs font-semibold leading-5 text-aura-muted">
                          {description}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl border border-aura-gold/30 bg-aura-gold/10 p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-aura-gold">
                      Aura Progress
                    </p>
                    <div className="mt-3 h-3 rounded-full bg-aura-bg">
                      <div className="h-3 w-3/4 rounded-full bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold" />
                    </div>
                    <p className="mt-2 text-xs font-bold text-aura-muted">
                      Study actions become XP, titles, and tool proficiency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
