import { useMemo, useState } from "react";
import ErrorState from "../states/ErrorState";
import LoadingState from "../states/LoadingState";
import { currentUser } from "../user/userMock";
import { generateAudioOverviewWithN8n } from "../../lib/n8n";
import type {
  AudioOverviewLength,
  AudioOverviewStyle,
  AudioSegment,
} from "../../lib/n8n";

type Props = {
  topic: string;
};

const styleOptions: {
  label: string;
  value: AudioOverviewStyle;
  description: string;
}[] = [
  {
    label: "Calm Tutor",
    value: "calm",
    description: "Slow, clear, and relaxing explanation",
  },
  {
    label: "Energetic Coach",
    value: "energetic",
    description: "Motivating and lively study narration",
  },
  {
    label: "Podcast Duo",
    value: "podcast",
    description: "Conversational host-style overview",
  },
];

const lengthOptions: {
  label: string;
  value: AudioOverviewLength;
  description: string;
}[] = [
  {
    label: "Short",
    value: "short",
    description: "Quick 1-minute recap",
  },
  {
    label: "Standard",
    value: "standard",
    description: "Balanced 2–3 minute overview",
  },
  {
    label: "Deep",
    value: "deep",
    description: "Longer guided explanation",
  },
];

const AudioModal = ({ topic }: Props) => {
  const [style, setStyle] = useState<AudioOverviewStyle>("podcast");
  const [length, setLength] = useState<AudioOverviewLength>("standard");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [segments, setSegments] = useState<AudioSegment[]>([]);
  const [recap, setRecap] = useState<string[]>([]);
  const [fallback, setFallback] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const selectedStyle = useMemo(() => {
    return (
      styleOptions.find((option) => option.value === style) ?? styleOptions[0]
    );
  }, [style]);

  const selectedLength = useMemo(() => {
    return (
      lengthOptions.find((option) => option.value === length) ??
      lengthOptions[0]
    );
  }, [length]);

  const hasAudioScript = segments.length > 0;

  const handleGenerateAudio = async () => {
    setError("");
    setFallback(false);
    setIsGenerating(true);

    try {
      const response = await generateAudioOverviewWithN8n({
        topic,
        style,
        length,
        userId: currentUser.id,
      });

      setTitle(response.audioOverview.title);
      setDescription(response.audioOverview.description);
      setEstimatedDuration(response.audioOverview.estimatedDuration);
      setSegments(response.audioOverview.segments);
      setRecap(response.audioOverview.recap);
      setFallback(Boolean(response.fallback));
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate audio overview.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewAudio = () => {
    setTitle("");
    setDescription("");
    setEstimatedDuration("");
    setSegments([]);
    setRecap([]);
    setFallback(false);
    setError("");
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-black text-aura-text">
          Generate Audio Overview
        </h3>
        <p className="mt-1 text-sm text-aura-muted">
          Create a podcast-style narration script for your current topic. This
          can be connected to ElevenLabs later for real audio output.
        </p>
      </div>

      {!hasAudioScript && (
        <>
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
              Narration Style
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {styleOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStyle(option.value)}
                  className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                    style === option.value
                      ? "border-aura-cyan/70 bg-aura-cyan/10 text-aura-cyan shadow-[0_0_24px_rgba(34,211,238,0.12)]"
                      : "border-aura-border bg-aura-panel text-aura-muted hover:border-aura-cyan/50"
                  }`}
                >
                  <p className="font-black">{option.label}</p>
                  <p className="mt-1 text-sm text-aura-muted">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
              Overview Length
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {lengthOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setLength(option.value)}
                  className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                    length === option.value
                      ? "border-aura-gold/70 bg-aura-gold/10 text-aura-gold shadow-[0_0_24px_rgba(250,204,21,0.1)]"
                      : "border-aura-border bg-aura-panel text-aura-muted hover:border-aura-gold/50"
                  }`}
                >
                  <p className="font-black">{option.label}</p>
                  <p className="mt-1 text-sm text-aura-muted">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-4">
            <p className="text-sm font-black text-aura-text">
              Selected: {selectedStyle.label} • {selectedLength.label}
            </p>
            <p className="mt-1 text-sm text-aura-muted">
              Study Aura will generate an audio overview script for {topic}.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateAudio}
            disabled={isGenerating}
            className="w-full rounded-2xl bg-gradient-to-r from-aura-primary to-aura-cyan py-3 font-black text-white transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isGenerating
              ? "Generating Audio Overview..."
              : "Generate Audio Script"}
          </button>

          {isGenerating && (
            <LoadingState
              title="Generating audio overview..."
              description="Study Aura is writing a narration script through n8n."
            />
          )}

          {error && (
            <ErrorState
              title="Audio overview failed"
              description={error}
              actionLabel="Try Again"
              onRetry={handleGenerateAudio}
            />
          )}
        </>
      )}

      {fallback && hasAudioScript && (
        <div className="rounded-2xl border border-aura-gold/30 bg-aura-gold/10 p-4 text-sm leading-6 text-aura-gold">
          Demo fallback mode is active. Study Aura returned a safe audio overview
          script.
        </div>
      )}

      {hasAudioScript && (
        <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-5">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
                Audio Overview Script
              </p>
              <h4 className="mt-1 text-xl font-black text-aura-text">
                {title}
              </h4>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-aura-muted">
                {description}
              </p>
              <p className="mt-2 text-sm font-black text-aura-cyan">
                Topic: {topic} • Estimated duration: {estimatedDuration}
              </p>
            </div>

            <button
              type="button"
              onClick={handleNewAudio}
              className="rounded-2xl border border-aura-pink/40 bg-aura-pink/10 px-4 py-2 text-sm font-black text-aura-pink transition hover:-translate-y-0.5"
            >
              New Audio Script
            </button>
          </div>

          <div className="space-y-3">
            {segments.map((segment, index) => (
              <div
                key={`${segment.speaker}-${index}`}
                className="rounded-2xl border border-aura-border bg-aura-panel p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-full border border-aura-cyan/30 bg-aura-cyan/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-aura-cyan">
                    {segment.speaker}
                  </span>
                  <span className="text-xs font-bold text-aura-dim">
                    Segment {index + 1}
                  </span>
                </div>

                <p className="text-sm leading-7 text-aura-muted">
                  {segment.text}
                </p>
              </div>
            ))}
          </div>

          {recap.length > 0 && (
            <div className="mt-5 rounded-2xl border border-aura-gold/25 bg-aura-gold/10 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-aura-gold">
                Key Recap
              </p>

              <ul className="mt-3 space-y-2">
                {recap.map((item) => (
                  <li
                    key={item}
                    className="rounded-xl border border-aura-border bg-aura-bg-soft px-3 py-2 text-sm leading-6 text-aura-muted"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioModal;