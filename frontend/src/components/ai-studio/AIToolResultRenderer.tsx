import { useEffect, useMemo, useRef, useState } from "react";
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

const cleanAudioText = (text: string) => {
  return text
    .replace(/^\s*(Narrator|Host A|Host B|Audio|Speaker)\s*:\s*/i, "")
    .trim();
};

const splitWords = (text: string) => {
  return text
    .split(/(\s+)/)
    .filter((part) => part.length > 0)
    .map((part) => ({
      value: part,
      isWord: /\S/.test(part),
    }));
};

const getWordCount = (text: string) => {
  return splitWords(text).filter((part) => part.isWord).length;
};

const AudioOverviewResult = ({ result }: { result: N8nAudioResponse }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [highlightedWordIndex, setHighlightedWordIndex] = useState(-1);
  const intervalRef = useRef<number | null>(null);

  const audioOverview = result.audioOverview;

  const segments = useMemo(() => {
    const rawSegments = audioOverview.segments || [];

    return rawSegments
      .map((segment) => cleanAudioText(segment.text || ""))
      .filter(Boolean);
  }, [audioOverview.segments]);

  const safeSegments =
    segments.length > 0
      ? segments
      : ["Review this topic carefully and focus on the most important ideas."];

  const currentText = safeSegments[activeIndex] || safeSegments[0];
  const currentWords = useMemo(() => splitWords(currentText), [currentText]);

  const recap = useMemo(() => {
    return (audioOverview.recap || [])
      .map((item) => cleanAudioText(String(item)))
      .filter(Boolean);
  }, [audioOverview.recap]);

  const canGoPrevious = activeIndex > 0;
  const canGoNext = activeIndex < safeSegments.length - 1;

  const clearHighlightTimer = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const stopSpeech = () => {
    clearHighlightTimer();

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setIsSpeaking(false);
    setHighlightedWordIndex(-1);
  };

  const startHighlighting = (text: string) => {
    clearHighlightTimer();

    const wordCount = getWordCount(text);

    if (wordCount <= 0) {
      setHighlightedWordIndex(-1);
      return;
    }

    const estimatedDurationMs = Math.max(2500, wordCount * 390);
    const stepMs = Math.max(120, estimatedDurationMs / wordCount);

    let currentWord = 0;
    setHighlightedWordIndex(0);

    intervalRef.current = window.setInterval(() => {
      currentWord += 1;

      if (currentWord >= wordCount) {
        clearHighlightTimer();
        return;
      }

      setHighlightedWordIndex(currentWord);
    }, stepMs);
  };

  const playCurrentSegment = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(currentText);
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      startHighlighting(currentText);
    };

    utterance.onend = () => {
      clearHighlightTimer();
      setIsSpeaking(false);
      setHighlightedWordIndex(-1);
    };

    utterance.onerror = () => {
      clearHighlightTimer();
      setIsSpeaking(false);
      setHighlightedWordIndex(-1);
    };

    window.speechSynthesis.speak(utterance);
  };

  const goPrevious = () => {
    stopSpeech();
    setActiveIndex((current) => Math.max(0, current - 1));
  };

  const goNext = () => {
    stopSpeech();
    setActiveIndex((current) => Math.min(safeSegments.length - 1, current + 1));
  };

  const goToCard = (index: number) => {
    stopSpeech();
    setActiveIndex(index);
  };

  useEffect(() => {
    return () => {
      stopSpeech();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderKaraokeText = () => {
    let wordPosition = -1;

    return currentWords.map((part, index) => {
      if (!part.isWord) {
        return <span key={`${part.value}-${index}`}>{part.value}</span>;
      }

      wordPosition += 1;

      const isActive = wordPosition === highlightedWordIndex;
      const isPast = highlightedWordIndex > wordPosition;

      return (
        <span
          key={`${part.value}-${index}`}
          className={
            isActive
              ? "rounded-lg bg-aura-cyan/25 px-1 text-aura-text shadow-[0_0_18px_rgba(34,211,238,0.18)]"
              : isPast
                ? "text-aura-text"
                : "text-aura-muted"
          }
        >
          {part.value}
        </span>
      );
    });
  };

  return (
    <div className="flex h-full min-h-[620px] flex-col overflow-hidden">
      <div className="mb-4 flex flex-col gap-3 rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-aura-cyan">
            Audio Overview
          </p>

          <h3 className="mt-2 text-2xl font-black text-aura-text">
            {audioOverview.title}
          </h3>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-aura-muted">
            {audioOverview.description}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2 text-xs font-black uppercase tracking-wider text-aura-dim sm:justify-end">
          <span className="rounded-full border border-aura-border bg-aura-panel px-3 py-1">
            {audioOverview.estimatedDuration}
          </span>

          {result.provider && (
            <span className="rounded-full border border-aura-border bg-aura-panel px-3 py-1">
              {result.provider}
            </span>
          )}

          {result.fallback && (
            <span className="rounded-full border border-aura-gold/40 bg-aura-gold/10 px-3 py-1 text-aura-gold">
              fallback
            </span>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[2rem] border border-aura-border bg-aura-bg-soft p-5 shadow-inner">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-aura-cyan">
              Study Card
            </p>

            <p className="mt-1 text-xs font-bold text-aura-dim">
              {activeIndex + 1} / {safeSegments.length}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={playCurrentSegment}
              disabled={isSpeaking}
              className="grid h-11 w-11 place-items-center rounded-full border border-aura-cyan/50 bg-aura-cyan/15 text-base font-black text-aura-text transition hover:border-aura-cyan hover:bg-aura-cyan/20 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Play audio segment"
              title="Play"
            >
              ▶
            </button>

            <button
              type="button"
              onClick={stopSpeech}
              disabled={!isSpeaking}
              className="grid h-11 w-11 place-items-center rounded-full border border-aura-border bg-aura-panel text-sm font-black text-aura-muted transition hover:border-aura-cyan hover:text-aura-text disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Stop audio segment"
              title="Stop"
            >
              ■
            </button>
          </div>
        </div>

        <div className="grid min-h-0 flex-1 place-items-center overflow-hidden">
          <div
            key={activeIndex}
            className="flex h-full max-h-[360px] w-full items-center justify-center rounded-[1.5rem] border border-aura-border bg-aura-panel/80 p-6 transition"
          >
            <p className="max-w-5xl text-center text-xl font-black leading-9 text-aura-muted sm:text-2xl sm:leading-10">
              {renderKaraokeText()}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goPrevious}
            disabled={!canGoPrevious}
            className="rounded-2xl border border-aura-border bg-aura-panel px-4 py-2 text-sm font-black text-aura-muted transition hover:border-aura-cyan hover:text-aura-text disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Previous
          </button>

          <div className="flex max-w-[45%] flex-wrap items-center justify-center gap-2">
            {safeSegments.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToCard(index)}
                className={
                  index === activeIndex
                    ? "h-2.5 w-8 rounded-full bg-aura-cyan"
                    : "h-2.5 w-2.5 rounded-full bg-aura-border transition hover:bg-aura-cyan/60"
                }
                aria-label={`Go to audio card ${index + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            className="rounded-2xl border border-aura-border bg-aura-panel px-4 py-2 text-sm font-black text-aura-muted transition hover:border-aura-cyan hover:text-aura-text disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>

      {recap.length > 0 && (
        <div className="mt-4 rounded-2xl border border-aura-cyan/30 bg-aura-cyan/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-aura-cyan">
              Quick Recap
            </p>

            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-aura-dim">
              Key takeaways
            </p>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {recap.slice(0, 3).map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="rounded-xl border border-aura-border bg-aura-panel/70 p-3 text-xs font-semibold leading-5 text-aura-muted"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
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