import { useState } from "react";
import {
  useAIToolActions,
  type AIToolGenerationOptions,
} from "../../hooks/useAIToolActions";
import AIToolResultRenderer from "./AIToolResultRenderer";
import type {
  AIToolName,
  StudySource,
} from "../dashboard/dashboardTypes";
import type {
  AudioOverviewLength,
  AudioOverviewStyle,
  QuizDifficulty,
  StudyTableType,
} from "../../lib/n8n";

type AIToolModalProps = {
  activeTool: AIToolName | null;
  topic: string;
  moduleId?: string;
  userId?: string;
  selectedSources: StudySource[];
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
  audioStyle: "podcast",
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

const audioStyleOptions: {
  value: AudioOverviewStyle;
  label: string;
}[] = [
  { value: "calm", label: "Calm" },
  { value: "energetic", label: "Energetic" },
  { value: "podcast", label: "Podcast" },
];

const audioLengthOptions: {
  value: AudioOverviewLength;
  label: string;
}[] = [
  { value: "short", label: "Short" },
  { value: "standard", label: "Standard" },
  { value: "deep", label: "Deep" },
];

const AIToolModal = ({
  activeTool,
  topic,
  moduleId,
  userId,
  selectedSources,
  onClose,
}: AIToolModalProps) => {
  const [options, setOptions] =
    useState<AIToolGenerationOptions>(defaultOptions);

  const {
    status,
    error,
    result,
    savedOutputId,
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

  if (!activeTool) return null;

  const selectedSourceCount = selectedSources.length;
  const isLoading = status === "loading";
  const hasResult = status === "success";

  const updateOptions = (updates: Partial<AIToolGenerationOptions>) => {
    setOptions((currentOptions) => ({
      ...currentOptions,
      ...updates,
    }));
  };

  const handleGenerate = () => {
    runTool(activeTool, options);
  };

  const handleClose = () => {
    resetTool();
    onClose();
  };

  const activeCountLabel = getLockedCountLabel(
    activeTool,
    options.difficulty,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-aura-bg/80 px-4 py-6 backdrop-blur-xl">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-aura-border bg-aura-panel shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-4 border-b border-aura-border px-6 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-aura-cyan">
              AI Studio Output
            </p>

            <h2 className="mt-2 text-2xl font-black text-aura-text">
              {toolTitles[activeTool]}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-aura-muted">
              Choose a generation preset, then generate from{" "}
              <span className="font-bold text-aura-text">{topic}</span> using{" "}
              {selectedSourceCount} selected source
              {selectedSourceCount === 1 ? "" : "s"}.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-aura-border bg-aura-bg-soft text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text"
            aria-label="Close AI tool modal"
          >
            ✕
          </button>
        </div>

        <div className="aura-scrollbar min-h-0 flex-1 overflow-y-auto p-6">
          {selectedSourceCount === 0 && (
            <div className="mb-5 rounded-2xl border border-yellow-400/30 bg-yellow-500/10 px-4 py-3 text-sm font-semibold leading-6 text-yellow-100">
              No sources are selected. Aura will generate from the module topic
              only. Select sources in the left panel for better context.
            </div>
          )}

          {!hasResult && (
            <div className="mb-5 rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-5">
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
                          onClick={() =>
                            updateOptions({ difficulty: difficulty.value })
                          }
                          className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
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
                    options={tableTypeOptions}
                    onChange={(value) =>
                      updateOptions({ tableType: value as StudyTableType })
                    }
                  />
                </div>
              )}

              {activeTool === "Audio" && (
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <SelectControl
                    label="Audio Style"
                    value={options.audioStyle}
                    options={audioStyleOptions}
                    onChange={(value) =>
                      updateOptions({
                        audioStyle: value as AudioOverviewStyle,
                      })
                    }
                  />

                  <SelectControl
                    label="Audio Length"
                    value={options.audioLength}
                    options={audioLengthOptions}
                    onChange={(value) =>
                      updateOptions({
                        audioLength: value as AudioOverviewLength,
                      })
                    }
                  />
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

          {status === "loading" && (
            <div className="rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-6 text-center">
              <div className="mx-auto flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-aura-cyan/10 text-2xl">
                ✦
              </div>

              <h3 className="mt-4 text-lg font-black text-aura-text">
                Generating {toolTitles[activeTool]}...
              </h3>

              <p className="mt-2 text-sm leading-6 text-aura-muted">
                Study Aura is sending the selected preset and source context to
                n8n.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="rounded-[1.5rem] border border-red-400/30 bg-red-500/10 p-6">
              <h3 className="text-lg font-black text-red-100">
                Generation failed
              </h3>

              <p className="mt-2 text-sm leading-6 text-red-200">{error}</p>

              <button
                type="button"
                onClick={handleGenerate}
                className="mt-5 rounded-2xl bg-red-200 px-4 py-2 text-xs font-black text-red-950 transition hover:-translate-y-0.5"
              >
                Try Again
              </button>
            </div>
          )}

          {status === "success" && (
            <div>
              <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-aura-border bg-aura-bg-soft p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-aura-cyan">
                    Generated Result
                  </p>
                  <p className="mt-1 text-sm text-aura-muted">
                    Preset:{" "}
                    <span className="font-bold text-aura-text">
                      {activeTool === "Audio"
                        ? `${options.audioStyle} / ${options.audioLength}`
                        : `${options.difficulty} • ${activeCountLabel}`}
                    </span>
                  </p>

                  {saveNotice && (
                    <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-aura-gold">
                      {saveNotice}
                    </p>
                  )}

                  {savedOutputId && (
                    <p className="mt-1 text-[10px] font-semibold text-aura-dim">
                      Output ID: {savedOutputId.slice(0, 8)}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isLoading}
                  className="rounded-2xl border border-aura-border bg-aura-panel px-4 py-2 text-xs font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text disabled:opacity-50"
                >
                  Regenerate
                </button>
              </div>

              <AIToolResultRenderer toolName={activeTool} result={result} />
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
  options: {
    value: string;
    label: string;
  }[];
  onChange: (value: string) => void;
};

const SelectControl = ({
  label,
  value,
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
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-aura-border bg-aura-panel px-4 py-3 text-sm font-semibold text-aura-text outline-none transition focus:border-aura-cyan/70"
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