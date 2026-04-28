import { useEffect, useRef, useState } from "react";
import {
  useAIToolActions,
  type AIToolGenerationOptions,
} from "../../hooks/useAIToolActions";
import AIToolResultRenderer from "./AIToolResultRenderer";
import ErrorState from "../states/ErrorState";
import { GeneratingState } from "../states/LoadingState";
import { useToast } from "../toast/ToastProvider";
import type { AIToolName, StudySource } from "../dashboard/dashboardTypes";
import type {
  AudioOverviewLength,
  QuizDifficulty,
  StudyTableType,
} from "../../lib/n8n";
import type { GeneratedOutput } from "../../services/generatedOutputService";

type AIToolModalProps = {
  activeTool: AIToolName | null;
  topic: string;
  moduleId?: string;
  userId?: string;
  selectedSources: StudySource[];
  savedOutput?: GeneratedOutput | null;
  onClose: () => void;
};

const toolTitles: Record<AIToolName, string> = {
  Audio: "Audio Overview",
  Slides: "Presentation Slides",
  "Mind Map": "Mind Map",
  Cards: "Flashcards",
  Tables: "Study Table",
  Quiz: "Practice Quiz",
};

const defaultOptions: AIToolGenerationOptions = {
  difficulty: "medium",
  tableType: "concept_comparison",
  audioLength: "standard",
};

const difficultyOptions: {
  value: QuizDifficulty;
  label: string;
  description: string;
}[] = [
  {
    value: "easy",
    label: "Easy",
    description: "Lower token use and faster generation.",
  },
  {
    value: "medium",
    label: "Medium",
    description: "Balanced output for normal review sessions.",
  },
  {
    value: "hard",
    label: "Hard",
    description: "Longer and deeper output for mastery review.",
  },
];

const tableTypeOptions: {
  value: StudyTableType;
  label: string;
}[] = [
  { value: "concept_comparison", label: "Concept Comparison" },
  { value: "term_definition", label: "Term Definition" },
  { value: "process_steps", label: "Process Steps" },
  { value: "cause_effect", label: "Cause and Effect" },
];

const audioLengthOptions: {
  value: AudioOverviewLength;
  label: string;
  description: string;
}[] = [
  {
    value: "short",
    label: "Short",
    description: "Fast review with fewer study cards.",
  },
  {
    value: "standard",
    label: "Standard",
    description: "Balanced overview for normal review.",
  },
  {
    value: "deep",
    label: "Deep",
    description: "More detailed explanation with more cards.",
  },
];

const AIToolModal = ({
  activeTool,
  topic,
  moduleId,
  userId,
  selectedSources,
  savedOutput = null,
  onClose,
}: AIToolModalProps) => {
  const [options, setOptions] =
    useState<AIToolGenerationOptions>(defaultOptions);

  const { showToast } = useToast();

  const lastStatusRef = useRef<string>("idle");
  const viewedSavedOutputRef = useRef<string | null>(null);

  const {
    status,
    error,
    result,
    saveNotice,
    runTool,
    resetTool,
    getLockedCountLabel,
  } = useAIToolActions({
    topic,
    moduleId,
    userId,
    selectedSources,
  });

  const savedResult = savedOutput?.payload?.result;
  const isViewingSavedOutput = Boolean(savedOutput && savedResult);
  const selectedSourceCount = selectedSources.length;
  const isLoading = status === "loading";
  const hasResult = status === "success" || isViewingSavedOutput;
  const isAudioResult = activeTool === "Audio" && hasResult;

  useEffect(() => {
    if (!activeTool) return;

    if (isViewingSavedOutput && savedOutput?.id) {
      if (viewedSavedOutputRef.current !== savedOutput.id) {
        viewedSavedOutputRef.current = savedOutput.id;

        showToast({
          type: "info",
          title: "Saved output opened",
          message: `${toolTitles[activeTool]} is ready to view.`,
        });
      }
    }
  }, [activeTool, isViewingSavedOutput, savedOutput?.id, showToast]);

  useEffect(() => {
    if (!activeTool) return;

    const previousStatus = lastStatusRef.current;

    if (status === "loading" && previousStatus !== "loading") {
      showToast({
        type: "info",
        title: `Generating ${toolTitles[activeTool]}`,
        message: "Study Aura is preparing your AI Studio output.",
        duration: 2600,
      });
    }

    if (status === "success" && previousStatus === "loading") {
      showToast({
        type: activeTool === "Audio" ? "xp" : "success",
        title: `${toolTitles[activeTool]} ready`,
        message:
          activeTool === "Audio"
            ? "Your audio study cards are ready to play."
            : saveNotice || "Your generated output is ready.",
      });
    }

    if (status === "error" && previousStatus === "loading") {
      showToast({
        type: "error",
        title: `${toolTitles[activeTool]} failed`,
        message: error || "Study Aura could not generate this output.",
        duration: 6500,
      });
    }

    lastStatusRef.current = status;
  }, [activeTool, error, saveNotice, showToast, status]);

  if (!activeTool) return null;

  const updateOptions = (updates: Partial<AIToolGenerationOptions>) => {
    setOptions((currentOptions) => ({
      ...currentOptions,
      ...updates,
    }));
  };

  const handleGenerate = () => {
    if (selectedSourceCount === 0) {
      showToast({
        type: "warning",
        title: "No sources selected",
        message: "Aura will use the module topic only. Select sources for better results.",
      });
    }

    runTool(activeTool, options);
  };

  const handleClose = () => {
    resetTool();
    lastStatusRef.current = "idle";
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-aura-bg/80 px-3 py-3 backdrop-blur-xl">
      <div className="flex max-h-[94vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-[2rem] border border-aura-border bg-aura-panel shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-4 border-b border-aura-border px-6 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-aura-cyan">
              AI Studio Output
            </p>

            <h2 className="mt-2 text-2xl font-black text-aura-text">
              {toolTitles[activeTool]}
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-aura-muted">
              {isViewingSavedOutput ? (
                <>
                  Viewing a saved output from{" "}
                  <span className="font-bold text-aura-text">{topic}</span>.
                </>
              ) : (
                <>
                  Choose a generation preset, then generate from{" "}
                  <span className="font-bold text-aura-text">{topic}</span>{" "}
                  using {selectedSourceCount} selected source
                  {selectedSourceCount === 1 ? "" : "s"}.
                </>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-aura-border bg-aura-bg-soft text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close AI tool modal"
          >
            ✕
          </button>
        </div>

        <div
          className={
            isAudioResult
              ? "min-h-0 flex-1 overflow-hidden px-6 py-5"
              : "aura-scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-5"
          }
        >
          {selectedSourceCount === 0 && !isViewingSavedOutput && (
            <div className="mb-4 rounded-2xl border border-yellow-400/30 bg-yellow-500/10 px-4 py-3 text-sm font-semibold leading-6 text-yellow-100">
              No sources are selected. Aura will generate from the module topic
              only. Select sources in the left panel for better context.
            </div>
          )}

          {!hasResult && (
            <div className="mb-4 rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-aura-cyan">
                  Generation Presets
                </p>

                <p className="mt-2 text-sm leading-6 text-aura-muted">
                  Select a preset. Output size is fixed to keep generation
                  predictable.
                </p>
              </div>

              {activeTool !== "Audio" && (
                <div className="mt-5">
                  <p className="text-sm font-black text-aura-text">
                    Difficulty
                  </p>

                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    {difficultyOptions.map((difficulty) => {
                      const isActive = options.difficulty === difficulty.value;

                      return (
                        <button
                          key={difficulty.value}
                          type="button"
                          disabled={isLoading}
                          onClick={() =>
                            updateOptions({ difficulty: difficulty.value })
                          }
                          className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${
                            isActive
                              ? "border-aura-cyan/70 bg-aura-cyan/10"
                              : "border-aura-border bg-aura-panel hover:border-aura-cyan/50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-black text-aura-text">
                              {difficulty.label}
                            </p>

                            <span className="shrink-0 rounded-full border border-aura-gold/40 bg-aura-gold/15 px-3 py-1 text-[11px] font-black normal-case tracking-normal text-aura-gold shadow-[0_0_18px_rgba(245,158,11,0.08)]">
                              {getLockedCountLabel(
                                activeTool,
                                difficulty.value,
                              )}
                            </span>
                          </div>

                          <p className="mt-3 text-xs leading-5 text-aura-muted">
                            {difficulty.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTool === "Tables" && (
                <div className="mt-5">
                  <SelectControl
                    label="Table Type"
                    value={options.tableType}
                    disabled={isLoading}
                    options={tableTypeOptions}
                    onChange={(value) =>
                      updateOptions({ tableType: value as StudyTableType })
                    }
                  />
                </div>
              )}

              {activeTool === "Audio" && (
                <div className="mt-5">
                  <p className="text-sm font-black text-aura-text">
                    Audio Length
                  </p>

                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                    {audioLengthOptions.map((audioLength) => {
                      const isActive =
                        options.audioLength === audioLength.value;

                      return (
                        <button
                          key={audioLength.value}
                          type="button"
                          disabled={isLoading}
                          onClick={() =>
                            updateOptions({
                              audioLength: audioLength.value,
                            })
                          }
                          className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${
                            isActive
                              ? "border-aura-cyan/70 bg-aura-cyan/10"
                              : "border-aura-border bg-aura-panel hover:border-aura-cyan/50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-black text-aura-text">
                              {audioLength.label}
                            </p>

                            <span className="shrink-0 rounded-full border border-aura-gold/40 bg-aura-gold/15 px-3 py-1 text-[11px] font-black normal-case tracking-normal text-aura-gold shadow-[0_0_18px_rgba(245,158,11,0.08)]">
                              {getLockedCountLabel(
                                activeTool,
                                options.difficulty,
                                audioLength.value,
                              )}
                            </span>
                          </div>

                          <p className="mt-3 text-xs leading-5 text-aura-muted">
                            {audioLength.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="rounded-2xl bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold px-5 py-3 text-sm font-black text-aura-bg transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(34,211,238,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading
                    ? "Generating..."
                    : `Generate ${toolTitles[activeTool]}`}
                </button>
              </div>
            </div>
          )}

          {isLoading && (
            <GeneratingState
              label="Generating"
              title={`Generating ${toolTitles[activeTool]}...`}
              description="Study Aura is sending the selected preset and source context to n8n."
            />
          )}

          {status === "error" && (
            <ErrorState
              title="Generation failed"
              description={error || "Study Aura could not generate this output."}
              actionLabel="Retry"
              onRetry={handleGenerate}
            />
          )}

          {hasResult && (
            <div className={isAudioResult ? "h-full" : "space-y-4"}>
              {!isViewingSavedOutput && saveNotice && !isAudioResult && (
                <div className="rounded-2xl border border-aura-gold/30 bg-aura-gold/10 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-aura-gold">
                  {saveNotice}
                </div>
              )}

              <AIToolResultRenderer
                toolName={activeTool}
                result={isViewingSavedOutput ? savedResult : result}
              />

              {!isViewingSavedOutput && !isAudioResult && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="rounded-2xl border border-aura-border bg-aura-panel px-4 py-2 text-xs font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text disabled:opacity-50"
                  >
                    Regenerate
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

type SelectControlProps = {
  label: string;
  value: string;
  disabled?: boolean;
  options: {
    value: string;
    label: string;
  }[];
  onChange: (value: string) => void;
};

const SelectControl = ({
  label,
  value,
  disabled = false,
  options,
  onChange,
}: SelectControlProps) => {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-aura-dim">
        {label}
      </span>

      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-aura-border bg-aura-panel px-4 py-3 text-sm font-semibold text-aura-text outline-none transition focus:border-aura-cyan/70 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-aura-panel text-aura-text"
          >
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};

export default AIToolModal;