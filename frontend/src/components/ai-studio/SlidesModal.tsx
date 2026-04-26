import { useMemo, useState } from "react";
import ErrorState from "../states/ErrorState";
import LoadingState from "../states/LoadingState";
import { currentUser } from "../user/userMock";
import { generateSlidesWithN8n } from "../../lib/n8n";
import type { SlidesDifficulty, StudySlide } from "../../lib/n8n";

const difficultyOptions: {
  label: string;
  value: SlidesDifficulty;
  slideCount: number;
  description: string;
}[] = [
  {
    label: "Easy",
    value: "easy",
    slideCount: 5,
    description: "5 simple review slides",
  },
  {
    label: "Medium",
    value: "medium",
    slideCount: 8,
    description: "8 balanced lesson slides",
  },
  {
    label: "Hard",
    value: "hard",
    slideCount: 12,
    description: "12 detailed presentation slides",
  },
];

const SlidesModal = () => {
  const [difficulty, setDifficulty] = useState<SlidesDifficulty>("easy");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slides, setSlides] = useState<StudySlide[]>([]);
  const [fallback, setFallback] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const selectedDifficulty = useMemo(() => {
    return (
      difficultyOptions.find((option) => option.value === difficulty) ??
      difficultyOptions[0]
    );
  }, [difficulty]);

  const hasSlides = slides.length > 0;

  const handleGenerateSlides = async () => {
    setError("");
    setFallback(false);
    setIsGenerating(true);

    try {
      const response = await generateSlidesWithN8n({
        topic: "Marine Biology 101",
        difficulty,
        slideCount: selectedDifficulty.slideCount,
        userId: currentUser.id,
      });

      setTitle(response.deck.title);
      setDescription(response.deck.description);
      setSlides(response.deck.slides);
      setFallback(Boolean(response.fallback));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to generate slides.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewSlides = () => {
    setTitle("");
    setDescription("");
    setSlides([]);
    setFallback(false);
    setError("");
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-black text-aura-text">
          Generate Slides
        </h3>
        <p className="mt-1 text-sm text-aura-muted">
          Turn the lesson into a clean slide outline with bullets, speaker
          notes, and visual ideas.
        </p>
      </div>

      {!hasSlides && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {difficultyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDifficulty(option.value)}
                className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                  difficulty === option.value
                    ? "border-aura-cyan/70 bg-aura-cyan/10 text-aura-cyan shadow-[0_0_24px_rgba(34,211,238,0.12)]"
                    : "border-aura-border bg-aura-panel text-aura-muted hover:border-aura-cyan/50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-black">{option.label}</p>
                    <p className="mt-1 text-sm text-aura-muted">
                      {option.description}
                    </p>
                  </div>

                  <span className="rounded-full border border-aura-gold/30 bg-aura-gold/10 px-2 py-1 text-xs font-black text-aura-gold">
                    {option.slideCount}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-4">
            <p className="text-sm font-black text-aura-text">
              Selected: {selectedDifficulty.label}
            </p>
            <p className="mt-1 text-sm text-aura-muted">
              Study Aura will generate {selectedDifficulty.slideCount} slide
              outlines for Marine Biology 101.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateSlides}
            disabled={isGenerating}
            className="w-full rounded-2xl bg-gradient-to-r from-aura-primary to-aura-cyan py-3 font-black text-white transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isGenerating
              ? "Generating Slides..."
              : `Generate ${selectedDifficulty.slideCount} Slides`}
          </button>

          {isGenerating && (
            <LoadingState
              title="Generating slides..."
              description="Study Aura is creating a slide outline through n8n."
            />
          )}

          {error && (
            <ErrorState
              title="Slide generation failed"
              description={error}
              actionLabel="Try Again"
              onRetry={handleGenerateSlides}
            />
          )}
        </>
      )}

      {fallback && hasSlides && (
        <div className="rounded-2xl border border-aura-gold/30 bg-aura-gold/10 p-4 text-sm leading-6 text-aura-gold">
          Demo fallback mode is active. Study Aura returned a safe fallback slide
          deck.
        </div>
      )}

      {hasSlides && (
        <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-5">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
                Generated Slide Deck
              </p>
              <h4 className="mt-1 text-xl font-black text-aura-text">
                {title}
              </h4>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-aura-muted">
                {description}
              </p>
            </div>

            <button
              type="button"
              onClick={handleNewSlides}
              className="rounded-2xl border border-aura-pink/40 bg-aura-pink/10 px-4 py-2 text-sm font-black text-aura-pink transition hover:-translate-y-0.5"
            >
              New Slides
            </button>
          </div>

          <div className="grid gap-4">
            {slides.map((slide) => (
              <div
                key={`${slide.slideNumber}-${slide.title}`}
                className="overflow-hidden rounded-[1.5rem] border border-aura-border bg-aura-panel shadow-aura-soft"
              >
                <div className="border-b border-aura-border bg-aura-bg-soft px-5 py-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-aura-gold/40 bg-aura-gold/10 text-xs font-black text-aura-gold">
                      {slide.slideNumber}
                    </span>

                    <div>
                      <p className="text-lg font-black text-aura-text">
                        {slide.title}
                      </p>
                      <p className="mt-1 text-sm text-aura-muted">
                        {slide.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 p-5 lg:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
                      Slide Bullets
                    </p>
                    <ul className="mt-3 space-y-2">
                      {slide.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="rounded-xl border border-aura-border bg-aura-bg-soft px-3 py-2 text-sm leading-6 text-aura-muted"
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-2xl border border-aura-cyan/25 bg-aura-cyan/10 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-aura-cyan">
                        Visual Idea
                      </p>
                      <p className="mt-2 text-sm leading-6 text-aura-muted">
                        {slide.visualIdea}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-aura-gold/25 bg-aura-gold/10 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-aura-gold">
                        Speaker Notes
                      </p>
                      <p className="mt-2 text-sm leading-6 text-aura-muted">
                        {slide.speakerNotes}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SlidesModal;