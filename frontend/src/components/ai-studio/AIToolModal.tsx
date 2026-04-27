import { useEffect } from "react";
import { useAIToolActions } from "../../hooks/useAIToolActions";
import AIToolResultRenderer from "./AIToolResultRenderer";
import type {
  AIToolName,
  StudySource,
} from "../dashboard/dashboardTypes";

type AIToolModalProps = {
  activeTool: AIToolName | null;
  topic: string;
  moduleId?: string;
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

const AIToolModal = ({
  activeTool,
  topic,
  moduleId,
  selectedSources,
  onClose,
}: AIToolModalProps) => {
  const { status, error, result, runTool, resetTool } = useAIToolActions({
    topic,
    moduleId,
    selectedSources,
  });

  useEffect(() => {
    if (activeTool) {
      runTool(activeTool);
    }

    return () => {
      resetTool();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTool]);

  if (!activeTool) return null;

  const selectedSourceCount = selectedSources.length;

  const handleClose = () => {
    resetTool();
    onClose();
  };

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
              Generating from{" "}
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
              only. For NotebookLM-style behavior, check at least one source in
              the left panel.
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
                Study Aura is sending your selected source context to n8n.
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
                onClick={() => runTool(activeTool)}
                className="mt-5 rounded-2xl bg-red-200 px-4 py-2 text-xs font-black text-red-950 transition hover:-translate-y-0.5"
              >
                Try Again
              </button>
            </div>
          )}

          {status === "success" && (
            <AIToolResultRenderer toolName={activeTool} result={result} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AIToolModal;