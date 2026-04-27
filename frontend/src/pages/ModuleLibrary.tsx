import type { StudyModule } from "../components/dashboard/dashboardTypes";

type ModuleLibraryProps = {
  modules: StudyModule[];
  activeModuleId?: string;
  onOpenModule: (moduleId: string) => void;
  onCreateModule: () => void;
  onBackToDashboard: () => void;
};

const formatDate = (isoDate: string) => {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoDate));
};

const getModuleIcon = (index: number) => {
  const icons = ["📘", "🧠", "⚡", "🔬", "📊", "🎧", "📝"];
  return icons[index % icons.length];
};

const ModuleLibrary = ({
  modules,
  activeModuleId,
  onOpenModule,
  onCreateModule,
  onBackToDashboard,
}: ModuleLibraryProps) => {
  const totalSources = modules.reduce(
    (total, module) => total + module.sources.length,
    0,
  );

  const totalSelectedSources = modules.reduce(
    (total, module) =>
      total + module.sources.filter((source) => source.selected).length,
    0,
  );

  return (
    <div className="min-h-dvh bg-aura-bg text-aura-text">
      <header className="sticky top-0 z-20 border-b border-aura-border bg-aura-panel/90 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="flex items-center gap-3 rounded-2xl px-2 py-1 text-left transition hover:bg-aura-bg-soft"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-aura-primary via-aura-cyan to-aura-gold text-lg font-black text-aura-bg">
              ✦
            </div>

            <div>
              <p className="text-sm font-black text-aura-text">Study Aura</p>
              <p className="text-xs font-semibold text-aura-muted">
                Module Library
              </p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToDashboard}
              className="rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-2 text-xs font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text"
            >
              Back to Workspace
            </button>

            <button
              type="button"
              onClick={onCreateModule}
              className="rounded-2xl bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold px-4 py-2 text-xs font-black text-aura-bg transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(34,211,238,0.22)]"
            >
              + Create Module
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <section className="overflow-hidden rounded-[2rem] border border-aura-border bg-aura-panel p-8 shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-aura-cyan">
                Your Study Spaces
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-tight text-aura-text md:text-5xl">
                Module Library
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-aura-muted">
                Organize each lesson, subject, or review topic into a focused
                module. Every module keeps its own sources, selected AI context,
                chat history, and generated study outputs.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-4">
                <p className="text-2xl font-black text-aura-text">
                  {modules.length}
                </p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-aura-dim">
                  Modules
                </p>
              </div>

              <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-4">
                <p className="text-2xl font-black text-aura-text">
                  {totalSources}
                </p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-aura-dim">
                  Sources
                </p>
              </div>

              <div className="rounded-2xl border border-aura-cyan/30 bg-aura-cyan/10 p-4">
                <p className="text-2xl font-black text-aura-text">
                  {totalSelectedSources}
                </p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-aura-cyan">
                  Active
                </p>
              </div>
            </div>
          </div>
        </section>

        {modules.length === 0 ? (
          <section className="mt-8 rounded-[2rem] border border-dashed border-aura-border bg-aura-panel/70 p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-aura-cyan/10 text-3xl">
              +
            </div>

            <h2 className="mt-5 text-2xl font-black text-aura-text">
              Create your first module
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-aura-muted">
              Start with one topic, then add notes, links, documents, and images
              as source context.
            </p>

            <button
              type="button"
              onClick={onCreateModule}
              className="mt-6 rounded-2xl bg-aura-cyan px-5 py-3 text-sm font-black text-aura-bg transition hover:-translate-y-0.5"
            >
              + Create Module
            </button>
          </section>
        ) : (
          <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {modules.map((module, index) => {
              const selectedSources = module.sources.filter(
                (source) => source.selected,
              ).length;

              const isActive = module.id === activeModuleId;

              return (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => onOpenModule(module.id)}
                  className={`group rounded-[1.75rem] border p-5 text-left transition hover:-translate-y-1 ${
                    isActive
                      ? "border-aura-cyan/70 bg-aura-cyan/10 shadow-[0_0_45px_rgba(34,211,238,0.12)]"
                      : "border-aura-border bg-aura-panel hover:border-aura-cyan/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-aura-bg-soft text-2xl">
                      {getModuleIcon(index)}
                    </div>

                    {isActive && (
                      <span className="rounded-full border border-aura-cyan/40 bg-aura-cyan/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-aura-cyan">
                        Active
                      </span>
                    )}
                  </div>

                  <h2 className="mt-5 line-clamp-2 text-xl font-black text-aura-text">
                    {module.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-aura-muted">
                    {module.subtitle}
                  </p>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-aura-bg-soft">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold"
                      style={{ width: `${Math.min(module.progress, 100)}%` }}
                    />
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-3">
                      <p className="text-lg font-black text-aura-text">
                        {module.sources.length}
                      </p>
                      <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-aura-dim">
                        Sources
                      </p>
                    </div>

                    <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-3">
                      <p className="text-lg font-black text-aura-text">
                        {selectedSources}
                      </p>
                      <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-aura-dim">
                        Selected
                      </p>
                    </div>

                    <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-3">
                      <p className="text-lg font-black text-aura-text">
                        {module.progress}%
                      </p>
                      <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-aura-dim">
                        Progress
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-aura-border pt-4">
                    <p className="text-xs font-semibold text-aura-dim">
                      Updated {formatDate(module.updatedAt)}
                    </p>

                    <span className="text-xs font-black text-aura-cyan transition group-hover:translate-x-1">
                      Open →
                    </span>
                  </div>
                </button>
              );
            })}

            <button
              type="button"
              onClick={onCreateModule}
              className="rounded-[1.75rem] border border-dashed border-aura-border bg-aura-panel/60 p-5 text-left transition hover:-translate-y-1 hover:border-aura-cyan/60 hover:bg-aura-cyan/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-aura-cyan/10 text-2xl">
                +
              </div>

              <h2 className="mt-5 text-xl font-black text-aura-text">
                Create a new module
              </h2>

              <p className="mt-2 text-sm leading-6 text-aura-muted">
                Start a clean study space with its own sources, chat, and AI
                outputs.
              </p>
            </button>
          </section>
        )}
      </main>
    </div>
  );
};

export default ModuleLibrary;