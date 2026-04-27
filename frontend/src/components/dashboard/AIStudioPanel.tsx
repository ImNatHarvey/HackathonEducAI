import { useState } from "react";
import { studioTools } from "../../mocks/dashboardMockData";
import type { GeneratedOutput } from "../../services/generatedOutputService";
import type { AIToolName } from "./dashboardTypes";

type AIStudioPanelProps = {
  selectedSourceCount: number;
  recentOutputs: GeneratedOutput[];
  isLoadingOutputs: boolean;
  outputError: string;
  deletingOutputId?: string | null;
  onOpenTool: (toolName: AIToolName) => void;
  onOpenSavedOutput: (output: GeneratedOutput) => void;
  onDeleteSavedOutput: (outputId: string) => Promise<void>;
};

const formatOutputDate = (isoDate: string) => {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoDate));
};

const getToolMeta = (toolName: AIToolName) => {
  return studioTools.find((tool) => tool.name === toolName);
};

const AIStudioPanel = ({
  selectedSourceCount,
  recentOutputs,
  isLoadingOutputs,
  outputError,
  deletingOutputId = null,
  onOpenTool,
  onOpenSavedOutput,
  onDeleteSavedOutput,
}: AIStudioPanelProps) => {
  const [isOutputsModalOpen, setIsOutputsModalOpen] = useState(false);
  const [outputToDelete, setOutputToDelete] = useState<GeneratedOutput | null>(
    null,
  );

  const hasSelectedSources = selectedSourceCount > 0;
  const isDeletingSelectedOutput =
    outputToDelete && deletingOutputId === outputToDelete.id;

  const handleOpenOutputsModal = () => {
    setIsOutputsModalOpen(true);
  };

  const handleCloseOutputsModal = () => {
    if (isDeletingSelectedOutput) return;
    setIsOutputsModalOpen(false);
    setOutputToDelete(null);
  };

  const handleOpenSavedOutput = (output: GeneratedOutput) => {
    setIsOutputsModalOpen(false);
    onOpenSavedOutput(output);
  };

  const handleOpenDeleteDialog = (
    event: React.MouseEvent<HTMLButtonElement>,
    output: GeneratedOutput,
  ) => {
    event.stopPropagation();
    setOutputToDelete(output);
  };

  const handleCloseDeleteDialog = () => {
    if (isDeletingSelectedOutput) return;
    setOutputToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!outputToDelete) return;

    await onDeleteSavedOutput(outputToDelete.id);
    setOutputToDelete(null);
  };

  return (
    <aside className="flex h-full min-h-0 min-w-0 flex-col border-l border-aura-border bg-aura-panel/95">
      <div className="shrink-0 border-b border-aura-border p-4">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-aura-cyan">
          AI Studio
        </p>

        <h2 className="mt-2 text-xl font-black text-aura-text">
          Generate outputs
        </h2>

        <p className="mt-2 text-sm leading-6 text-aura-muted">
          Create study materials from the current module and selected sources.
        </p>

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-stretch gap-3">
          <button
            type="button"
            onClick={handleOpenOutputsModal}
            className="group rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-aura-gold/60 hover:bg-aura-gold/5"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-aura-gold">
                  Recent Outputs
                </p>

                <p className="mt-1 text-sm font-semibold text-aura-muted">
                  {recentOutputs.length > 0
                    ? `${recentOutputs.length} saved result${
                        recentOutputs.length === 1 ? "" : "s"
                      }`
                    : "View saved generations"}
                </p>
              </div>

              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-aura-gold/30 bg-aura-gold/10 text-xs font-black text-aura-gold transition group-hover:scale-105">
                {recentOutputs.length}
              </span>
            </div>
          </button>

          <div
            className={`flex min-w-[86px] flex-col items-center justify-center rounded-2xl border px-3 py-3 ${
              hasSelectedSources
                ? "border-aura-cyan/30 bg-aura-cyan/10"
                : "border-yellow-400/30 bg-yellow-500/10"
            }`}
            title={
              hasSelectedSources
                ? "Selected context sources"
                : "Outputs will use the module title only until you check sources on the left."
            }
          >
            <p className="text-2xl font-black text-aura-text">
              {selectedSourceCount}
            </p>

            <p
              className={`mt-1 text-center text-[9px] font-black uppercase tracking-wider ${
                hasSelectedSources ? "text-aura-cyan" : "text-yellow-100"
              }`}
            >
              {hasSelectedSources ? "Active" : "No Sources"}
            </p>
          </div>
        </div>
      </div>

      <div className="aura-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
            Tools
          </p>

          <span className="rounded-full border border-aura-border bg-aura-bg-soft px-2 py-1 text-[9px] font-black uppercase tracking-wider text-aura-dim">
            {studioTools.length} available
          </span>
        </div>

        <div className="space-y-3 pb-6">
          {studioTools.map((tool) => (
            <button
              key={tool.name}
              type="button"
              onClick={() => onOpenTool(tool.name)}
              className="group w-full rounded-2xl border border-aura-border bg-aura-bg-soft p-4 text-left transition hover:-translate-y-0.5 hover:border-aura-cyan/60 hover:bg-aura-cyan/5"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.color} text-xl shadow-[0_12px_35px_rgba(0,0,0,0.22)]`}
                >
                  {tool.icon}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-black text-aura-text">
                    {tool.label}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-aura-muted">
                    {tool.description}
                  </p>

                  <p className="mt-3 text-[10px] font-black uppercase tracking-wider text-aura-cyan opacity-0 transition group-hover:opacity-100">
                    Configure and generate →
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {isOutputsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-aura-bg/80 px-5 py-6 backdrop-blur-xl">
          <div className="flex max-h-[88dvh] w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border border-aura-border bg-aura-panel shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
            <header className="flex shrink-0 items-start justify-between gap-4 border-b border-aura-border px-6 py-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.26em] text-aura-gold">
                  Saved Generations
                </p>

                <h2 className="mt-2 text-2xl font-black text-aura-text">
                  Recent Outputs
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-aura-muted">
                  Review previously generated quizzes, flashcards, tables, mind
                  maps, slides, and audio overviews from this module.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseOutputsModal}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-aura-border bg-aura-bg-soft text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text"
                aria-label="Close recent outputs"
              >
                ✕
              </button>
            </header>

            <main className="aura-scrollbar min-h-0 flex-1 overflow-y-auto p-6">
              {isLoadingOutputs && (
                <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-5 text-sm font-semibold text-aura-muted">
                  Loading saved outputs...
                </div>
              )}

              {outputError && !isLoadingOutputs && (
                <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-5 text-sm font-semibold leading-6 text-red-200">
                  {outputError}
                </div>
              )}

              {!isLoadingOutputs && !outputError && recentOutputs.length === 0 && (
                <div className="rounded-[1.5rem] border border-dashed border-aura-border bg-aura-bg-soft/70 p-8 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-aura-gold/10 text-2xl">
                    ✦
                  </div>

                  <h3 className="mt-4 text-xl font-black text-aura-text">
                    No saved outputs yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-aura-muted">
                    Generate from one of the six tools and your saved result
                    will appear here.
                  </p>
                </div>
              )}

              {!isLoadingOutputs && !outputError && recentOutputs.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {recentOutputs.map((output) => {
                    const toolMeta = getToolMeta(output.toolName);
                    const isDeleting = deletingOutputId === output.id;

                    return (
                      <div
                        key={output.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleOpenSavedOutput(output)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            handleOpenSavedOutput(output);
                          }
                        }}
                        className="group rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-5 text-left transition hover:-translate-y-0.5 hover:border-aura-gold/60 hover:bg-aura-gold/5"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${
                              toolMeta?.color ??
                              "from-aura-primary to-aura-cyan"
                            } text-xl shadow-[0_12px_35px_rgba(0,0,0,0.2)]`}
                          >
                            {toolMeta?.icon ?? "✦"}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="line-clamp-2 text-base font-black text-aura-text">
                                  {output.title}
                                </p>

                                <p className="mt-1 text-xs font-semibold text-aura-muted">
                                  {formatOutputDate(output.createdAt)}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={(event) =>
                                  handleOpenDeleteDialog(event, output)
                                }
                                disabled={isDeleting}
                                className="shrink-0 rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-red-200 opacity-75 transition hover:bg-red-500/20 hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40"
                                title="Delete saved output"
                              >
                                {isDeleting ? "..." : "Delete"}
                              </button>
                            </div>

                            <p className="mt-3 text-xs font-black uppercase tracking-wider text-aura-gold opacity-0 transition group-hover:opacity-100">
                              Open saved output →
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </main>
          </div>
        </div>
      )}

      {outputToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-aura-bg/80 px-5 backdrop-blur-xl">
          <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-red-400/30 bg-aura-panel shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
            <div className="border-b border-aura-border p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-red-400/30 bg-red-500/10 text-xl">
                  🗑️
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-red-200">
                    Delete Output
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-aura-text">
                    Remove saved result?
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-aura-muted">
                    This will delete the saved AI output from this module.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
                  Saved Output
                </p>

                <h3 className="mt-2 line-clamp-2 text-base font-black text-aura-text">
                  {outputToDelete.title}
                </h3>

                <p className="mt-2 text-xs font-semibold text-aura-muted">
                  {formatOutputDate(outputToDelete.createdAt)}
                </p>
              </div>

              <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold leading-6 text-red-100">
                This cannot be undone.
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-aura-border bg-aura-bg-soft/80 px-6 py-4">
              <button
                type="button"
                onClick={handleCloseDeleteDialog}
                disabled={Boolean(isDeletingSelectedOutput)}
                className="rounded-2xl border border-aura-border bg-aura-panel px-5 py-3 text-sm font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={Boolean(isDeletingSelectedOutput)}
                className="rounded-2xl bg-red-400 px-5 py-3 text-sm font-black text-red-950 transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(248,113,113,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeletingSelectedOutput ? "Deleting..." : "Delete Output"}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AIStudioPanel;