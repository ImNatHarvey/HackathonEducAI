import { useMemo, useState } from "react";
import ErrorState from "../states/ErrorState";
import LoadingState from "../states/LoadingState";
import { currentUser } from "../user/userMock";
import { generateFlashcardsWithN8n } from "../../lib/n8n";
import type { FlashcardDifficulty, FlashcardItem } from "../../lib/n8n";

const difficultyOptions: {
  label: string;
  value: FlashcardDifficulty;
  cardCount: number;
  description: string;
}[] = [
  {
    label: "Easy",
    value: "easy",
    cardCount: 10,
    description: "10 quick recall cards",
  },
  {
    label: "Medium",
    value: "medium",
    cardCount: 15,
    description: "15 concept and fill-in cards",
  },
  {
    label: "Hard",
    value: "hard",
    cardCount: 20,
    description: "20 reasoning and mastery cards",
  },
];

const normalize = (value: string) => {
  return value.trim().toLowerCase().replace(/[^\w\s]/g, "");
};

const shuffleArray = <T,>(items: T[]) => {
  return [...items].sort(() => Math.random() - 0.5);
};

const FlashcardsModal = () => {
  const [difficulty, setDifficulty] = useState<FlashcardDifficulty>("easy");
  const [deckTitle, setDeckTitle] = useState("");
  const [cards, setCards] = useState<FlashcardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [fallback, setFallback] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCards, setAnsweredCards] = useState<Record<number, boolean>>(
    {},
  );

  const selectedDifficulty = useMemo(() => {
    return (
      difficultyOptions.find((option) => option.value === difficulty) ??
      difficultyOptions[0]
    );
  }, [difficulty]);

  const currentCard = cards[currentIndex];

  const isAnswerCorrect = useMemo(() => {
    if (!currentCard) return false;

    const userAnswer = normalize(typedAnswer);
    const correctAnswer = normalize(currentCard.answer);

    return userAnswer.length > 0 && correctAnswer.includes(userAnswer);
  }, [currentCard, typedAnswer]);

  const resetStudyProgress = () => {
    setCurrentIndex(0);
    setTypedAnswer("");
    setIsFlipped(false);
    setScore(0);
    setAnsweredCards({});
  };

  const handleGenerateFlashcards = async () => {
    setError("");
    setFallback(false);
    setIsGenerating(true);

    try {
      const response = await generateFlashcardsWithN8n({
        topic: "Marine Biology 101",
        difficulty,
        cardCount: selectedDifficulty.cardCount,
        userId: currentUser.id,
      });

      setDeckTitle(response.deck.title);
      setCards(response.deck.cards);
      setFallback(Boolean(response.fallback));
      resetStudyProgress();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate flashcards.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCheckAnswer = () => {
    if (!currentCard) return;

    setIsFlipped(true);

    if (answeredCards[currentIndex]) return;

    setAnsweredCards((current) => ({
      ...current,
      [currentIndex]: true,
    }));

    if (isAnswerCorrect) {
      setScore((current) => current + 1);
    }
  };

  const handleShuffleDeck = () => {
    if (cards.length <= 1) return;

    setCards((current) => shuffleArray(current));
    resetStudyProgress();
  };

  const handleNewDeck = () => {
    setCards([]);
    setDeckTitle("");
    setCurrentIndex(0);
    setTypedAnswer("");
    setIsFlipped(false);
    setScore(0);
    setAnsweredCards({});
    setFallback(false);
    setError("");
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

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-black text-aura-text">
          Generate Flashcards
        </h3>
        <p className="mt-1 text-sm text-aura-muted">
          Create interactive flip cards with typed answers, hints, and
          explanations.
        </p>
      </div>

      {cards.length === 0 && (
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
                    {option.cardCount}
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
              Study Aura will generate {selectedDifficulty.cardCount} flashcards
              for Marine Biology 101.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateFlashcards}
            disabled={isGenerating}
            className="w-full rounded-2xl bg-gradient-to-r from-aura-primary to-aura-cyan py-3 font-black text-white transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isGenerating
              ? "Generating Flashcards..."
              : `Generate ${selectedDifficulty.cardCount} Flashcards`}
          </button>

          {isGenerating && (
            <LoadingState
              title="Generating flashcards..."
              description="Study Aura is creating a flashcard deck through n8n."
            />
          )}

          {error && (
            <ErrorState
              title="Flashcard generation failed"
              description={error}
              actionLabel="Try Again"
              onRetry={handleGenerateFlashcards}
            />
          )}
        </>
      )}

      {fallback && cards.length > 0 && (
        <div className="rounded-2xl border border-aura-gold/30 bg-aura-gold/10 p-4 text-sm leading-6 text-aura-gold">
          Demo fallback mode is active. Gemini may have reached its quota, so
          Study Aura returned a safe flashcard deck.
        </div>
      )}

      {currentCard && (
        <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
                Flashcard Deck
              </p>
              <h4 className="mt-1 text-lg font-black text-aura-text">
                {deckTitle || "Study Aura Flashcards"}
              </h4>
              <p className="mt-1 text-sm text-aura-muted">
                Card {currentIndex + 1} of {cards.length} • Score {score}/
                {Object.keys(answeredCards).length}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleShuffleDeck}
                className="rounded-2xl border border-aura-gold/40 bg-aura-gold/10 px-4 py-2 text-sm font-black text-aura-gold transition hover:-translate-y-0.5"
              >
                Shuffle Deck
              </button>

              <button
                type="button"
                onClick={resetStudyProgress}
                className="rounded-2xl border border-aura-border bg-aura-panel px-4 py-2 text-sm font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-cyan"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={handleNewDeck}
                className="rounded-2xl border border-aura-pink/40 bg-aura-pink/10 px-4 py-2 text-sm font-black text-aura-pink transition hover:-translate-y-0.5"
              >
                New Deck
              </button>
            </div>
          </div>

          <div className="[perspective:1200px]">
            <button
              type="button"
              onClick={() => setIsFlipped((current) => !current)}
              className="group min-h-[260px] w-full text-left outline-none"
            >
              <div
                className={`relative min-h-[260px] w-full transition-transform duration-500 [transform-style:preserve-3d] ${
                  isFlipped ? "[transform:rotateY(180deg)]" : ""
                }`}
              >
                <div className="absolute inset-0 rounded-[1.75rem] border border-aura-border bg-gradient-to-br from-aura-panel to-aura-bg-soft p-6 shadow-aura-soft transition group-hover:border-aura-cyan/50 [backface-visibility:hidden]">
                  <div className="flex h-full min-h-[210px] flex-col justify-between">
                    <div>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <span className="rounded-full border border-aura-cyan/30 bg-aura-cyan/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-aura-cyan">
                          {currentCard.type === "fill_blank"
                            ? "Fill in the blank"
                            : "Question"}
                        </span>

                        <span className="text-xs font-bold text-aura-dim">
                          Click card to reveal
                        </span>
                      </div>

                      <p className="text-xl font-black leading-8 text-aura-text">
                        {currentCard.prompt}
                      </p>

                      <p className="mt-4 text-sm leading-6 text-aura-muted">
                        Hint: {currentCard.hint}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 rounded-[1.75rem] border border-aura-cyan/40 bg-gradient-to-br from-aura-bg-soft to-aura-panel p-6 shadow-[0_0_40px_rgba(34,211,238,0.12)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  <div className="flex h-full min-h-[210px] flex-col justify-between">
                    <div>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <span className="rounded-full border border-aura-green/30 bg-aura-green/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-aura-green">
                          Answer Revealed
                        </span>

                        <span className="text-xs font-bold text-aura-dim">
                          Click card to hide
                        </span>
                      </div>

                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
                        Correct Answer
                      </p>
                      <p className="mt-2 text-2xl font-black text-aura-cyan">
                        {currentCard.answer}
                      </p>
                      <p className="mt-4 text-sm leading-6 text-aura-muted">
                        {currentCard.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              value={typedAnswer}
              onChange={(event) => setTypedAnswer(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleCheckAnswer();
                }
              }}
              placeholder="Type your answer before revealing..."
              className="rounded-2xl border border-aura-border bg-aura-panel px-4 py-3 text-sm text-aura-text outline-none transition placeholder:text-aura-dim focus:border-aura-cyan/60"
            />

            <button
              type="button"
              onClick={handleCheckAnswer}
              className="rounded-2xl bg-gradient-to-r from-aura-primary to-aura-cyan px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
            >
              Check Answer
            </button>
          </div>

          {isFlipped && (
            <div
              className={`mt-4 rounded-2xl border p-4 text-sm font-bold ${
                isAnswerCorrect
                  ? "border-aura-green/40 bg-aura-green/10 text-aura-green"
                  : "border-aura-pink/40 bg-aura-pink/10 text-aura-pink"
              }`}
            >
              {isAnswerCorrect
                ? "Nice! Your typed answer matches the correct answer."
                : "Not quite. Review the revealed answer and try the next card."}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="rounded-2xl border border-aura-border bg-aura-panel px-4 py-2 text-sm font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-cyan disabled:opacity-40"
            >
              Previous
            </button>

            <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-aura-primary to-aura-cyan"
                style={{
                  width: `${((currentIndex + 1) / cards.length) * 100}%`,
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
              className="rounded-2xl border border-aura-border bg-aura-panel px-4 py-2 text-sm font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-cyan disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardsModal;