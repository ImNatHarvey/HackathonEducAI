import { useEffect, useMemo, useState } from "react";
import type { StudySlide } from "../../../lib/n8n";

type SavedSlidesDeck = {
  title?: string;
  description?: string;
  slides?: StudySlide[];
};

type SavedSlidesResultProps = {
  data?: {
    deck?: SavedSlidesDeck;
    result?: {
      deck?: SavedSlidesDeck;
    };
    provider?: string;
    fallback?: boolean;
    [key: string]: unknown;
  };
};

function getDeckPayload(
  data?: SavedSlidesResultProps["data"],
): SavedSlidesDeck {
  if (!data) return {};
  if (data.deck && typeof data.deck === "object") return data.deck;

  if (
    data.result &&
    typeof data.result === "object" &&
    data.result.deck &&
    typeof data.result.deck === "object"
  ) {
    return data.result.deck;
  }

  return {};
}

function normalizeSlide(slide: StudySlide, index: number): StudySlide {
  return {
    ...slide,
    slideNumber: Number(slide.slideNumber) || index + 1,
    title: slide.title || `Slide ${index + 1}`,
    subtitle: slide.subtitle || "",
    bullets: Array.isArray(slide.bullets) ? slide.bullets.filter(Boolean) : [],
    speakerNotes: "",
    visualIdea: "",
  };
}

export default function SavedSlidesResult({ data }: SavedSlidesResultProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const deck = getDeckPayload(data);

  const slides = useMemo(() => {
    return Array.isArray(deck.slides)
      ? deck.slides.map((slide, index) => normalizeSlide(slide, index))
      : [];
  }, [deck.slides]);

  const activeSlide = slides[activeIndex];
  const totalSlides = slides.length;

  const progressPercent =
    totalSlides > 0 ? ((activeIndex + 1) / totalSlides) * 100 : 0;

  const deckTitle =
    typeof deck.title === "string" && deck.title.trim()
      ? deck.title.trim()
      : "Generated Slide Deck";

  const goToPrevious = () => {
    setActiveIndex((current) => Math.max(current - 1, 0));
  };

  const goToNext = () => {
    setActiveIndex((current) => Math.min(current + 1, totalSlides - 1));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!totalSlides) return;

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
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [totalSlides]);

  if (!activeSlide) {
    return (
      <section className="rounded-[1.75rem] border border-aura-border bg-aura-panel p-6">
        <h3 className="text-xl font-black text-aura-text">No slides found.</h3>
        <p className="mt-2 text-sm leading-6 text-aura-muted">
          The saved output exists, but no valid slide list was found.
        </p>
      </section>
    );
  }

  return (
    <section className="flex h-full min-h-[620px] flex-col overflow-hidden rounded-[1.75rem] border border-aura-border bg-aura-panel p-5">
      <div className="mb-4 flex shrink-0 items-center justify-between gap-4">
        <div>
          <p className="inline-flex rounded-md bg-aura-cyan/20 px-2 py-1 text-xs font-black text-aura-text">
            Slide {activeIndex + 1} of {totalSlides}
          </p>
          <p className="mt-1 text-[11px] font-bold text-aura-muted">
            Use ← and → keys or buttons.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={goToPrevious}
            disabled={activeIndex === 0}
            className="rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-2 text-xs font-black text-aura-muted transition hover:border-aura-cyan/50 hover:text-aura-text disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <button
            type="button"
            onClick={goToNext}
            disabled={activeIndex === totalSlides - 1}
            className="rounded-2xl border border-aura-gold/40 bg-aura-gold px-5 py-2 text-xs font-black text-aura-bg transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <div className="mb-4 h-1.5 shrink-0 overflow-hidden rounded-full bg-aura-bg-soft">
        <div
          className="h-full rounded-full bg-aura-gold transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <article className="relative aspect-[16/9] h-auto w-full max-w-[1080px] origin-center scale-[0.65] overflow-hidden rounded-[1.5rem] border border-aura-border bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.16),transparent_30%),linear-gradient(135deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] px-6 py-6 shadow-[0_24px_70px_rgba(0,0,0,0.25)] sm:h-full sm:max-h-[470px] sm:scale-100 sm:rounded-[2rem] sm:px-12 sm:py-12">
          <div className="absolute left-6 top-5 text-[9px] font-black tracking-[0.22em] text-aura-dim sm:left-8 sm:top-7 sm:text-[10px]">
            Slide {activeSlide.slideNumber}
          </div>

          <div className="absolute right-6 top-5 max-w-[160px] truncate text-[9px] font-black tracking-[0.22em] text-aura-dim sm:right-8 sm:top-7 sm:max-w-[320px] sm:text-[10px]">
            {deckTitle}
          </div>

          <div className="flex h-full flex-col items-center justify-center px-4 pt-2 text-center sm:px-8 sm:pt-4">
            <h4 className="max-w-4xl text-2xl font-black leading-tight text-aura-text sm:text-4xl">
              {activeSlide.title}
            </h4>

            {activeSlide.subtitle && (
              <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-aura-muted sm:mt-4 sm:text-base sm:leading-7">
                {activeSlide.subtitle}
              </p>
            )}

            <ul className="mt-6 grid w-full max-w-3xl gap-2 text-left sm:mt-8 sm:gap-3">
              {activeSlide.bullets.slice(0, 4).map((bullet, index) => (
                <li
                  key={`${activeSlide.slideNumber}-bullet-${index}`}
                  className="rounded-xl border border-aura-border bg-aura-bg-soft/75 px-4 py-2.5 text-xs font-semibold leading-5 text-aura-text sm:rounded-2xl sm:px-5 sm:py-3.5 sm:text-sm sm:leading-6"
                >
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>

      <div className="mt-4 flex shrink-0 justify-center">
        <div className="flex max-w-full justify-center gap-2 overflow-hidden">
          {slides.map((slide, index) => (
            <button
              key={`${slide.slideNumber}-${slide.title}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`flex h-[58px] w-[220px] flex-col justify-center rounded-2xl border px-4 py-2 text-left transition hover:-translate-y-0.5 ${
                activeIndex === index
                  ? "border-aura-gold/70 bg-aura-gold/15 text-aura-text"
                  : "border-aura-border bg-aura-bg-soft text-aura-muted hover:border-aura-cyan/40 hover:text-aura-text"
              }`}
            >
              <span className="text-[9px] font-black uppercase tracking-wider text-aura-dim">
                {index + 1}
              </span>
              <p className="mt-1 line-clamp-1 text-xs font-black leading-4">
                {slide.title}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
