import { useEffect, useMemo, useState } from "react";
import ErrorState from "../states/ErrorState";
import LoadingState from "../states/LoadingState";
import { currentUser } from "../user/userMock";
import { generateSlidesWithN8n } from "../../lib/n8n";
import type { SlidesDifficulty, StudySlide } from "../../lib/n8n";

type Props = {
  topic: string;
};

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
    description: "Simple review deck",
  },
  {
    label: "Medium",
    value: "medium",
    slideCount: 8,
    description: "Balanced lesson deck",
  },
  {
    label: "Hard",
    value: "hard",
    slideCount: 12,
    description: "Detailed presentation deck",
  },
];

function normalizeSlide(slide: StudySlide, index: number): StudySlide {
  return {
    ...slide,
    slideNumber: Number(slide.slideNumber) || index + 1,
    title: slide.title || `Slide ${index + 1}`,
    subtitle: slide.subtitle || "",
    bullets: Array.isArray(slide.bullets) ? slide.bullets.filter(Boolean) : [],
    speakerNotes: slide.speakerNotes || "",
    visualIdea: slide.visualIdea || "",
  };
}

const SlidesModal = ({ topic }: Props) => {
  const [difficulty, setDifficulty] = useState<SlidesDifficulty>("easy");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slides, setSlides] = useState<StudySlide[]>([]);
  const [fallback, setFallback] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(false);

  const selectedDifficulty = useMemo(() => {
    return (
      difficultyOptions.find((option) => option.value === difficulty) ??
      difficultyOptions[0]
    );
  }, [difficulty]);

  const normalizedSlides = useMemo(() => {
    return slides.map((slide, index) => normalizeSlide(slide, index));
  }, [slides]);

  const hasSlides = normalizedSlides.length > 0;
  const activeSlide = normalizedSlides[activeIndex];
  const totalSlides = normalizedSlides.length;
  const progressPercent =
    totalSlides > 0 ? ((activeIndex + 1) / totalSlides) * 100 : 0;

  const handleGenerateSlides = async () => {
    setError("");
    setFallback(false);
    setIsGenerating(true);
    setActiveIndex(0);
    setShowSpeakerNotes(false);

    try {
      const response = await generateSlidesWithN8n({
        topic,
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
    setActiveIndex(0);
    setShowSpeakerNotes(false);
  };

  const goToPrevious = () => {
    setShowSpeakerNotes(false);
    setActiveIndex((current) => Math.max(current - 1, 0));
  };

  const goToNext = () => {
    setShowSpeakerNotes(false);
    setActiveIndex((current) => Math.min(current + 1, totalSlides - 1));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!hasSlides) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [hasSlides, totalSlides]);

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-black text-aura-text">Generate Slides</h3>
        <p className="mt-1 text-sm text-aura-muted">
          Turn the lesson into a presentation-style deck with bullets, topic
          descriptions, speaker notes, and visual ideas.
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
                    {option.slideCount} slides
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
              outlines for {topic}.
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
              description="Study Aura is creating a presentation-style deck through n8n."
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

      {hasSlides && activeSlide && (
        <div className="slides-live-result">
          <div className="slides-live-header">
            <div>
              <p className="slides-live-kicker">Generated Slide Deck</p>
              <h4>{title || `${topic} Slide Deck`}</h4>
              <p>{description || `A generated slide deck about ${topic}.`}</p>
              <strong>Topic: {topic}</strong>
            </div>

            <button
              type="button"
              onClick={handleNewSlides}
              className="slides-new-button"
            >
              New Slides
            </button>
          </div>

          <div className="slides-viewer-shell">
            <div className="slides-viewer-toolbar">
              <div>
                <p className="slides-viewer-count">
                  Slide {activeIndex + 1} of {totalSlides}
                </p>
                <p className="slides-viewer-hint">
                  Use ← and → keys to navigate
                </p>
              </div>

              <div className="slides-viewer-actions">
                <button
                  type="button"
                  onClick={goToPrevious}
                  disabled={activeIndex === 0}
                  className="slides-nav-button"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={goToNext}
                  disabled={activeIndex === totalSlides - 1}
                  className="slides-nav-button slides-nav-button-primary"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="slides-progress-track">
              <div
                className="slides-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <article className="slides-presentation-card">
              <div className="slides-card-topline">
                <span>Slide {activeSlide.slideNumber}</span>
                <span>{title || "Study Aura Deck"}</span>
              </div>

              <div className="slides-card-content">
                <div className="slides-main-panel">
                  <h4>{activeSlide.title}</h4>

                  {activeSlide.subtitle && (
                    <p className="slides-topic-description">
                      {activeSlide.subtitle}
                    </p>
                  )}

                  <ul className="slides-bullet-list">
                    {activeSlide.bullets.map((bullet, index) => (
                      <li key={`${activeSlide.slideNumber}-bullet-${index}`}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>

                <aside className="slides-side-panel">
                  <div className="slides-visual-card">
                    <p className="slides-panel-label">Visual Idea</p>
                    <p>{activeSlide.visualIdea || "No visual idea provided."}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowSpeakerNotes((current) => !current)}
                    className="slides-speaker-button"
                  >
                    {showSpeakerNotes
                      ? "Hide Speaker Notes"
                      : "Show Speaker Notes"}
                  </button>

                  {showSpeakerNotes && (
                    <div className="slides-speaker-notes-card">
                      <p className="slides-panel-label">Speaker Notes</p>
                      <p>
                        {activeSlide.speakerNotes ||
                          "No speaker notes were generated for this slide."}
                      </p>
                    </div>
                  )}
                </aside>
              </div>
            </article>

            <div className="slides-thumbnail-strip">
              {normalizedSlides.map((slide, index) => (
                <button
                  key={`${slide.slideNumber}-${slide.title}`}
                  type="button"
                  onClick={() => {
                    setActiveIndex(index);
                    setShowSpeakerNotes(false);
                  }}
                  className={`slides-thumbnail ${
                    activeIndex === index ? "slides-thumbnail-active" : ""
                  }`}
                >
                  <span>{index + 1}</span>
                  <p>{slide.title}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlidesModal;