import { useMemo, useState } from "react";
import type { FlashcardItem, N8nFlashcardsResponse } from "../../../lib/n8n";
import {
  FallbackJsonView,
  normalizeAnswer,
  ProviderBadge,
  shuffleArray,
} from "./resultUtils";

const SavedFlashcardsResult = ({
  result,
}: {
  result: N8nFlashcardsResponse;
}) => {
  const [cards, setCards] = useState<FlashcardItem[]>(result.deck.cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [answeredCards, setAnsweredCards] = useState<Record<number, boolean>>(
    {},
  );
  const [correctCards, setCorrectCards] = useState<Record<number, boolean>>({});

  const currentCard = cards[currentIndex];
  const answeredCount = Object.keys(answeredCards).length;
  const score = Object.values(correctCards).filter(Boolean).length;
  const isDeckComplete = answeredCount === cards.length;

  const progressPercentage = cards.length
    ? Math.round(((currentIndex + 1) / cards.length) * 100)
    : 0;

  const studyProgressPercentage = cards.length
    ? Math.round((answeredCount / cards.length) * 100)
    : 0;

  const accuracy = answeredCount ? Math.round((score / answeredCount) * 100) : 0;

  const isAnswerCorrect = useMemo(() => {
    if (!currentCard) return false;

    const userAnswer = normalizeAnswer(typedAnswer);
    const correctAnswer = normalizeAnswer(currentCard.answer);

    if (!userAnswer) return false;

    return (
      userAnswer === correctAnswer ||
      correctAnswer.includes(userAnswer) ||
      userAnswer.includes(correctAnswer)
    );
  }, [currentCard, typedAnswer]);

  const resetStudyProgress = () => {
    setCurrentIndex(0);
    setTypedAnswer("");
    setIsFlipped(false);
    setAnsweredCards({});
    setCorrectCards({});
  };

  const handleCheckAnswer = () => {
    if (!currentCard) return;

    setIsFlipped(true);

    setAnsweredCards((current) => ({
      ...current,
      [currentIndex]: true,
    }));

    setCorrectCards((current) => ({
      ...current,
      [currentIndex]: isAnswerCorrect,
    }));
  };

  const handleRevealAnswer = () => {
    if (!currentCard) return;

    setIsFlipped(true);

    if (!answeredCards[currentIndex]) {
      setAnsweredCards((current) => ({
        ...current,
        [currentIndex]: true,
      }));

      setCorrectCards((current) => ({
        ...current,
        [currentIndex]: false,
      }));
    }
  };

  const handleShuffleDeck = () => {
    if (cards.length <= 1) return;

    setCards((current) => shuffleArray(current));
    resetStudyProgress();
  };

  const handleNext = () => {
    if (currentIndex >= cards.length - 1) return;

    setCurrentIndex((current) => current + 1);
    setTypedAnswer("");
    setIsFlipped(false);
  };

  const handlePrevious = () => {
    if (currentIndex <= 0) return;

    setCurrentIndex((current) => current - 1);
    setTypedAnswer("");
    setIsFlipped(false);
  };

  if (!currentCard) {
    return <FallbackJsonView result={result} />;
  }

  return (
    <div className="space-y-4">
      {isDeckComplete && (
        <div className="rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-cyan">
                Interactive Saved Flashcards
              </p>

              <h3 className="mt-1 text-xl font-black text-aura-text">
                {result.deck.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-aura-muted">
                Deck completed. Review your answered cards, score, and accuracy.
              </p>
            </div>

            <button
              type="button"
              onClick={resetStudyProgress}
              className="rounded-2xl border border-aura-border bg-aura-panel px-5 py-3 text-sm font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text"
            >
              Try Again
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-aura-border bg-aura-panel p-4">
              <p className="text-2xl font-black text-aura-text">
                {answeredCount}/{cards.length}
              </p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-aura-dim">
                Answered
              </p>
            </div>

            <div className="rounded-2xl border border-aura-border bg-aura-panel p-4">
              <p className="text-2xl font-black text-aura-text">
                {score}/{cards.length}
              </p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-aura-dim">
                Score
              </p>
            </div>

            <div className="rounded-2xl border border-aura-border bg-aura-panel p-4">
              <p className="text-2xl font-black text-aura-text">{accuracy}%</p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-aura-dim">
                Accuracy
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-5">
        <div className="mb-5 grid gap-4 xl:grid-cols-[1fr_360px]">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-cyan">
              Card {currentIndex + 1} of {cards.length}
            </p>

            <h3 className="mt-1 text-2xl font-black text-aura-text">
              {result.deck.title}
            </h3>

            <p className="mt-1 text-sm text-aura-muted">
              Answer every card to unlock your flashcard score.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <ProviderBadge result={result} />

              <span className="rounded-full border border-aura-border bg-aura-panel px-3 py-1 text-[10px] font-black uppercase tracking-wider text-aura-dim">
                {answeredCount}/{cards.length} answered
              </span>

              <span className="rounded-full border border-aura-cyan/35 bg-aura-cyan/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-aura-cyan">
                {studyProgressPercentage}% study progress
              </span>
            </div>
          </div>

          <div className="grid min-w-full gap-2 sm:grid-cols-2 xl:min-w-[360px]">
            <button
              type="button"
              onClick={handleShuffleDeck}
              className="rounded-2xl border border-aura-cyan/40 bg-aura-cyan/10 px-4 py-3 text-sm font-black text-aura-cyan transition hover:-translate-y-0.5"
            >
              Randomize
            </button>

            <button
              type="button"
              onClick={resetStudyProgress}
              className="rounded-2xl border border-aura-border bg-aura-panel px-4 py-3 text-sm font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
          <div>
            <div className="[perspective:1200px]">
              <button
                type="button"
                onClick={() => setIsFlipped((current) => !current)}
                className="group min-h-[340px] w-full text-left outline-none"
              >
                <div
                  className={`relative min-h-[340px] w-full transition-transform duration-500 [transform-style:preserve-3d] ${
                    isFlipped ? "[transform:rotateY(180deg)]" : ""
                  }`}
                >
                  <div className="absolute inset-0 rounded-[1.75rem] border border-aura-border bg-gradient-to-br from-aura-panel to-aura-bg-soft p-7 shadow-aura-soft transition group-hover:border-aura-cyan/50 [backface-visibility:hidden]">
                    <div className="flex h-full min-h-[286px] flex-col justify-between">
                      <div>
                        <div className="mb-5 flex items-center justify-between gap-3">
                          <span className="rounded-full border border-aura-cyan/30 bg-aura-cyan/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-aura-cyan">
                            {currentCard.type === "fill_blank"
                              ? "Fill in the blank"
                              : "Question"}
                          </span>

                          <span className="text-xs font-bold text-aura-dim">
                            Click card to flip
                          </span>
                        </div>

                        <p className="text-2xl font-black leading-9 text-aura-text">
                          {currentCard.prompt}
                        </p>
                      </div>

                      <p className="rounded-2xl border border-aura-border bg-aura-bg-soft p-4 text-sm leading-6 text-aura-muted">
                        <span className="font-black text-aura-text">Hint:</span>{" "}
                        {currentCard.hint}
                      </p>
                    </div>
                  </div>

                  <div className="absolute inset-0 rounded-[1.75rem] border border-aura-cyan/40 bg-gradient-to-br from-aura-bg-soft to-aura-panel p-7 shadow-[0_0_40px_rgba(34,211,238,0.12)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className="flex h-full min-h-[286px] flex-col justify-between">
                      <div>
                        <div className="mb-5 flex items-center justify-between gap-3">
                          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">
                            Answer Revealed
                          </span>

                          <span className="text-xs font-bold text-aura-dim">
                            Click card to hide
                          </span>
                        </div>

                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
                          Correct Answer
                        </p>

                        <p className="mt-2 text-3xl font-black text-aura-cyan">
                          {currentCard.answer}
                        </p>

                        <p className="mt-5 text-sm leading-7 text-aura-muted">
                          {currentCard.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="rounded-2xl border border-aura-border bg-aura-panel px-5 py-3 text-sm font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-cyan disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Previous
              </button>

              <div className="flex flex-wrap justify-center gap-2">
                {cards.map((card, index) => {
                  const isActive = index === currentIndex;
                  const isAnswered = answeredCards[index];
                  const isCorrectCard = correctCards[index];

                  return (
                    <button
                      key={`${card.prompt}-${index}`}
                      type="button"
                      onClick={() => {
                        setCurrentIndex(index);
                        setTypedAnswer("");
                        setIsFlipped(false);
                      }}
                      className={`h-3 w-3 rounded-full transition ${
                        isActive
                          ? "bg-aura-cyan"
                          : isAnswered && isCorrectCard
                            ? "bg-emerald-400"
                            : isAnswered
                              ? "bg-aura-pink"
                              : "bg-aura-border"
                      }`}
                      aria-label={`Go to card ${index + 1}`}
                    />
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex === cards.length - 1}
                className="rounded-2xl border border-aura-cyan/40 bg-aura-cyan/10 px-5 py-3 text-sm font-black text-aura-cyan transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-aura-border bg-aura-panel p-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-aura-cyan">
              Answer Check
            </p>

            <p className="mt-2 text-sm leading-6 text-aura-muted">
              Type your answer before flipping. You can also reveal the card if
              you want to review.
            </p>

            <textarea
              value={typedAnswer}
              onChange={(event) => setTypedAnswer(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  handleCheckAnswer();
                }
              }}
              placeholder="Type your answer here..."
              className="mt-4 min-h-[130px] w-full resize-none rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-3 text-sm leading-6 text-aura-text outline-none transition placeholder:text-aura-dim focus:border-aura-cyan/60"
            />

            <div className="mt-3 grid gap-2">
              <button
                type="button"
                onClick={handleCheckAnswer}
                disabled={!typedAnswer.trim()}
                className="rounded-2xl bg-gradient-to-r from-aura-primary to-aura-cyan px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Check Answer
              </button>

              <button
                type="button"
                onClick={handleRevealAnswer}
                className="rounded-2xl border border-aura-border bg-aura-bg-soft px-5 py-3 text-sm font-black text-aura-muted transition hover:border-aura-gold/50 hover:text-aura-gold"
              >
                Reveal Answer
              </button>
            </div>

            {isFlipped && (
              <div
                className={`mt-4 rounded-2xl border p-4 text-sm font-bold leading-6 ${
                  isAnswerCorrect
                    ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                    : "border-aura-pink/40 bg-aura-pink/10 text-aura-pink"
                }`}
              >
                {isAnswerCorrect
                  ? "Nice! Your typed answer matches the correct answer."
                  : "Review the revealed answer. You can continue to the next card when ready."}
              </div>
            )}

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-aura-bg-soft">
              <div
                className="h-full rounded-full bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold transition-all"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <p className="mt-2 text-center text-[10px] font-black uppercase tracking-wider text-aura-dim">
              Card {currentIndex + 1} of {cards.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedFlashcardsResult;