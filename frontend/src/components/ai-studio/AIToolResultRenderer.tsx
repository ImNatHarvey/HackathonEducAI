import { useMemo, useState } from "react";
import type {
  N8nAudioResponse,
  N8nFlashcardsResponse,
  N8nMindMapResponse,
  N8nQuizResponse,
  N8nSlidesResponse,
  N8nTablesResponse,
} from "../../lib/n8n";
import type { AIToolName } from "../dashboard/dashboardTypes";
import SavedFlashcardsResult from "./results/SavedFlashcardsResult";
import SavedMindMapResult from "./results/SavedMindMapResult";
import SavedQuizResult from "./results/SavedQuizResult";
import SavedSlidesResult from "./results/SavedSlidesResult";
import SavedTablesResult from "./results/SavedTablesResult";
import { FallbackJsonView, isRecord } from "./results/resultUtils";

type AIToolResultRendererProps = {
  toolName: AIToolName;
  result: unknown;
};

const isQuizResponse = (result: unknown): result is N8nQuizResponse => {
  return isRecord(result) && isRecord(result.quiz);
};

const isFlashcardsResponse = (
  result: unknown,
): result is N8nFlashcardsResponse => {
  return (
    isRecord(result) &&
    isRecord(result.deck) &&
    Array.isArray(result.deck.cards)
  );
};

const isTablesResponse = (result: unknown): result is N8nTablesResponse => {
  return (
    isRecord(result) &&
    isRecord(result.table) &&
    Array.isArray(result.table.rows)
  );
};

const isMindMapResponse = (result: unknown): result is N8nMindMapResponse => {
  return (
    isRecord(result) &&
    isRecord(result.mindMap) &&
    Array.isArray(result.mindMap.branches)
  );
};

const isSlidesResponse = (result: unknown): result is N8nSlidesResponse => {
  return (
    isRecord(result) &&
    isRecord(result.deck) &&
    Array.isArray(result.deck.slides)
  );
};

const isAudioResponse = (result: unknown): result is N8nAudioResponse => {
  return isRecord(result) && isRecord(result.audioOverview);
};

const AudioOverviewResult = ({ result }: { result: N8nAudioResponse }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const narrationText = useMemo(() => {
    return (
      result.audioOverview.script ||
      result.audioOverview.segments
        .map((segment) => `${segment.speaker}: ${segment.text}`)
        .join("\n\n")
    );
  }, [result.audioOverview.script, result.audioOverview.segments]);

  const canUseBrowserSpeech =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const handlePlayBrowserSpeech = () => {
    if (!canUseBrowserSpeech || !narrationText.trim()) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopBrowserSpeech = () => {
    if (!canUseBrowserSpeech) return;

    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-aura-cyan">
              Audio Overview
            </p>

            <h3 className="mt-2 text-2xl font-black text-aura-text">
              {result.audioOverview.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-aura-muted">
              {result.audioOverview.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-2 text-xs font-black uppercase tracking-wider text-aura-dim">
              <span>Duration: {result.audioOverview.estimatedDuration}</span>
              {result.provider && <span>• Provider: {result.provider}</span>}
              {result.fallback && <span>• Fallback mode</span>}
            </div>
          </div>

          {canUseBrowserSpeech && (
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={handlePlayBrowserSpeech}
                disabled={isSpeaking}
                className="rounded-2xl border border-aura-cyan/50 bg-aura-cyan/15 px-4 py-2 text-sm font-black text-aura-text transition hover:border-aura-cyan disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSpeaking ? "Playing..." : "Play Narration"}
              </button>

              <button
                type="button"
                onClick={handleStopBrowserSpeech}
                disabled={!isSpeaking}
                className="rounded-2xl border border-aura-border bg-aura-bg px-4 py-2 text-sm font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text disabled:cursor-not-allowed disabled:opacity-50"
              >
                Stop
              </button>
            </div>
          )}
        </div>

        {result.audioOverview.audioUrl && (
          <audio
            className="mt-5 w-full"
            controls
            src={result.audioOverview.audioUrl}
          >
            <track kind="captions" />
          </audio>
        )}
      </div>

      <div className="rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-aura-cyan">
          Narration Script
        </p>

        <div className="mt-4 space-y-3">
          {result.audioOverview.segments.map((segment, index) => (
            <div
              key={`${segment.speaker}-${index}`}
              className="rounded-2xl border border-aura-border bg-aura-bg/60 p-4"
            >
              <p className="text-xs font-black uppercase tracking-wider text-aura-cyan">
                {segment.speaker}
              </p>

              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-aura-muted">
                {segment.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-aura-cyan/40 bg-aura-cyan/10 p-4">
        <p className="text-xs font-black uppercase tracking-wider text-aura-cyan">
          Recap
        </p>

        <ul className="mt-3 space-y-2">
          {result.audioOverview.recap.map((item) => (
            <li key={item} className="text-sm leading-6 text-aura-muted">
              • {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const AIToolResultRenderer = ({
  toolName,
  result,
}: AIToolResultRendererProps) => {
  if (!result) return null;

  if (toolName === "Quiz" && isQuizResponse(result)) {
    return <SavedQuizResult result={result} />;
  }

  if (toolName === "Cards" && isFlashcardsResponse(result)) {
    return <SavedFlashcardsResult result={result} />;
  }

  if (toolName === "Tables" && isTablesResponse(result)) {
    return <SavedTablesResult data={result} />;
  }

  if (toolName === "Mind Map" && isMindMapResponse(result)) {
    return <SavedMindMapResult result={result} />;
  }

  if (toolName === "Slides" && isSlidesResponse(result)) {
    return <SavedSlidesResult data={result} />;
  }

  if (toolName === "Audio" && isAudioResponse(result)) {
    return <AudioOverviewResult result={result} />;
  }

  return <FallbackJsonView result={result} />;
};

export default AIToolResultRenderer;