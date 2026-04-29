import { useState } from "react";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import type { StudyModule } from "../components/dashboard/dashboardTypes";
import type { AuthProfile } from "../services/authService";
import type { AuraStats } from "../lib/xp";
import type { SettingsPanel } from "../components/settings/settingsTypes";

type ModuleLibraryProps = {
  modules: StudyModule[];
  activeModuleId?: string;
  profile: AuthProfile | null;
  auraStats?: AuraStats;
  onOpenModule: (moduleId: string) => void;
  onCreateModule: () => void;
  onDeleteModule: (moduleId: string) => Promise<void>;
  onBackToDashboard: () => void;
  onOpenSettings: (panel?: SettingsPanel) => void;
  onLogout: () => void;
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
  profile,
  auraStats,
  onOpenModule,
  onCreateModule,
  onDeleteModule,
  onBackToDashboard,
  onOpenSettings,
  onLogout,
}: ModuleLibraryProps) => {
  const [moduleToDelete, setModuleToDelete] = useState<StudyModule | null>(
    null,
  );
  const [deletingModuleId, setDeletingModuleId] = useState<string | null>(null);

  const totalSources = modules.reduce(
    (total, module) => total + module.sources.length,
    0,
  );

  const totalSelectedSources = modules.reduce(
    (total, module) =>
      total + module.sources.filter((source) => source.selected).length,
    0,
  );

  const handleOpenDeleteDialog = (
    event: React.MouseEvent<HTMLButtonElement>,
    module: StudyModule,
  ) => {
    event.stopPropagation();
    setModuleToDelete(module);
  };

  const handleCloseDeleteDialog = () => {
    if (deletingModuleId) return;
    setModuleToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!moduleToDelete) return;

    setDeletingModuleId(moduleToDelete.id);

    try {
      await onDeleteModule(moduleToDelete.id);
      setModuleToDelete(null);
    } finally {
      setDeletingModuleId(null);
    }
  };

  const isDeletingSelectedModule =
    moduleToDelete && deletingModuleId === moduleToDelete.id;

  return (
    <div className="flex h-dvh max-h-dvh w-full flex-col overflow-hidden bg-aura-bg text-aura-text">
      <DashboardNavbar
        profile={profile}
        auraStats={auraStats}
        libraryButtonLabel="Workspace"
        onOpenSettings={onOpenSettings}
        onOpenLibrary={onBackToDashboard}
        onOpenCreateModule={onCreateModule}
        onLogout={onLogout}
      />

      <main className="aura-scrollbar w-full max-w-none flex-1 overflow-y-auto px-5 py-8 pb-16 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-aura-border bg-aura-panel p-8 shadow-[0_30px_90px_rgba(0,0,0,0.25)]">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-aura-cyan">
                Your Study Spaces
              </p>

              <h1 className="mt-3 text-4xl font-black tracking-tight text-aura-text md:text-5xl">
                Module Library
              </h1>

              <p className="mt-4 max-w-4xl text-base leading-7 text-aura-muted">
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
          <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
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

            {modules.map((module, index) => {
              const selectedSources = module.sources.filter(
                (source) => source.selected,
              ).length;

              const isActive = module.id === activeModuleId;
              const isDeleting = deletingModuleId === module.id;

              return (
                <div
                  key={module.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpenModule(module.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      onOpenModule(module.id);
                    }
                  }}
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

                    <div className="flex items-center gap-2">
                      {isActive && (
                        <span className="rounded-full border border-aura-cyan/40 bg-aura-cyan/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-aura-cyan">
                          Active
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(event) =>
                          handleOpenDeleteDialog(event, module)
                        }
                        disabled={isDeleting}
                        className="rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-red-200 opacity-80 transition hover:bg-red-500/20 hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Delete module"
                      >
                        {isDeleting ? "Deleting" : "Delete"}
                      </button>
                    </div>
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
                </div>
              );
            })}
          </section>
        )}
      </main>

      {moduleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-aura-bg/80 px-5 backdrop-blur-xl">
          <div className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-red-400/30 bg-aura-panel shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
            <div className="relative border-b border-aura-border p-6">
              <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-red-500/10 blur-3xl" />

              <div className="relative z-10 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-red-400/30 bg-red-500/10 text-2xl">
                  ⚠️
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-red-200">
                    Delete Module
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-aura-text">
                    Are you sure?
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-aura-muted">
                    This action will permanently delete this module and all
                    connected data.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
                  Module
                </p>

                <h3 className="mt-2 line-clamp-2 text-lg font-black text-aura-text">
                  {moduleToDelete.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-sm leading-6 text-aura-muted">
                  {moduleToDelete.subtitle}
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-xl border border-aura-border bg-aura-panel px-3 py-2">
                    <p className="text-lg font-black text-aura-text">
                      {moduleToDelete.sources.length}
                    </p>
                    <p className="text-[9px] font-black uppercase tracking-wider text-aura-dim">
                      Sources
                    </p>
                  </div>

                  <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2">
                    <p className="text-lg font-black text-red-100">All</p>
                    <p className="text-[9px] font-black uppercase tracking-wider text-red-200">
                      Chats
                    </p>
                  </div>

                  <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2">
                    <p className="text-lg font-black text-red-100">All</p>
                    <p className="text-[9px] font-black uppercase tracking-wider text-red-200">
                      Outputs
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold leading-6 text-red-100">
                This cannot be undone. Sources, chat history, and generated
                study outputs connected to this module will also be removed.
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-aura-border bg-aura-bg-soft/80 px-6 py-4">
              <button
                type="button"
                onClick={handleCloseDeleteDialog}
                disabled={Boolean(isDeletingSelectedModule)}
                className="rounded-2xl border border-aura-border bg-aura-panel px-5 py-3 text-sm font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={Boolean(isDeletingSelectedModule)}
                className="rounded-2xl bg-red-400 px-5 py-3 text-sm font-black text-red-950 transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(248,113,113,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeletingSelectedModule ? "Deleting..." : "Delete Module"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleLibrary;