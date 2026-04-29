import { useMemo, useState } from "react";
import type { N8nQuizResponse, QuizQuestion } from "../../../lib/n8n";
import {
  FallbackJsonView,
  normalizeAnswer,
  ProviderBadge,
  shuffleArray,
} from "./resultUtils";

const SavedQuizResult = ({ result }: { result: N8nQuizResponse }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    result.quiz.questions,
  );
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(
    {},
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;
  const selectedAnswer = selectedAnswers[currentQuestionIndex];
  const canSubmit = answeredCount === questions.length;

  const score = useMemo(() => {
    return questions.reduce((total, question, index) => {
      const selectedAnswerForQuestion = selectedAnswers[index];

      if (
        selectedAnswerForQuestion &&
        normalizeAnswer(selectedAnswerForQuestion) ===
          normalizeAnswer(question.answer)
      ) {
        return total + 1;
      }

      return total;
    }, 0);
  }, [questions, selectedAnswers]);

  const accuracy = questions.length
    ? Math.round((score / questions.length) * 100)
    : 0;

  const progressPercentage = questions.length
    ? Math.round(((currentQuestionIndex + 1) / questions.length) * 100)
    : 0;

  const handleSelectAnswer = (answer: string) => {
    if (isSubmitted) return;

    setSelectedAnswers((currentAnswers) => ({
      ...currentAnswers,
      [currentQuestionIndex]: answer,
    }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
  };

  const handleShuffle = () => {
    setQuestions((currentQuestions) => shuffleArray(currentQuestions));
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    setIsSubmitted(true);
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((current) => Math.max(current - 1, 0));
  };

  const handleNext = () => {
    setCurrentQuestionIndex((current) =>
      Math.min(current + 1, questions.length - 1),
    );
  };

  if (!currentQuestion) {
    return <FallbackJsonView result={result} />;
  }

  return (
    <div className="space-y-4">
      {isSubmitted && (
        <div className="rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-cyan">
                Interactive Saved Quiz
              </p>

              <h3 className="mt-1 text-xl font-black text-aura-text">
                {result.quiz.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-aura-muted">
                Quiz completed. Review your score, accuracy, correct answers,
                and explanations.
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="rounded-2xl border border-aura-border bg-aura-panel px-5 py-3 text-sm font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text"
            >
              Try Again
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-aura-border bg-aura-panel p-4">
              <p className="text-2xl font-black text-aura-text">
                {answeredCount}/{questions.length}
              </p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-aura-dim">
                Answered
              </p>
            </div>

            <div className="rounded-2xl border border-aura-border bg-aura-panel p-4">
              <p className="text-2xl font-black text-aura-text">
                {score}/{questions.length}
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

      <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-cyan">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>

            <h3 className="mt-3 text-2xl font-black leading-9 text-aura-text">
              {currentQuestion.question}
            </h3>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <ProviderBadge result={result} />

              <span className="rounded-full border border-aura-border bg-aura-panel px-3 py-1 text-[10px] font-black uppercase tracking-wider text-aura-dim">
                {answeredCount}/{questions.length} answered
              </span>

              <span className="rounded-full border border-aura-cyan/35 bg-aura-cyan/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-aura-cyan">
                {progressPercentage}% progress
              </span>
            </div>
          </div>

          <div className="grid min-w-full gap-2 sm:grid-cols-2 lg:min-w-[360px]">
            <button
              type="button"
              onClick={handleShuffle}
              disabled={isSubmitted}
              className="rounded-2xl border border-aura-cyan/40 bg-aura-cyan/10 px-4 py-3 text-sm font-black text-aura-cyan transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Randomize
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="rounded-2xl border border-aura-border bg-aura-panel px-4 py-3 text-sm font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text"
            >
              Reset
            </button>

            {!isSubmitted && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="rounded-2xl bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold px-4 py-3 text-sm font-black text-aura-bg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2"
                title={
                  canSubmit
                    ? "Submit answers"
                    : "Answer all questions before submitting"
                }
              >
                {canSubmit
                  ? "Submit Answers"
                  : `Answer all questions (${answeredCount}/${questions.length})`}
              </button>
            )}
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[10px] font-black uppercase tracking-wider text-aura-dim">
              Focus Mode
            </p>

            <p className="text-[10px] font-black uppercase tracking-wider text-aura-cyan">
              {canSubmit ? "Ready to Submit" : "Keep Going"}
            </p>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-aura-panel">
            <div
              className="h-full rounded-full bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          {currentQuestion.choices.map((choice) => {
            const isSelected = selectedAnswer === choice;
            const isCorrectChoice =
              normalizeAnswer(choice) === normalizeAnswer(currentQuestion.answer);

            const submittedClass =
              isSubmitted && isCorrectChoice
                ? "border-emerald-400/60 bg-emerald-500/10 text-emerald-100"
                : isSubmitted && isSelected && !isCorrectChoice
                  ? "border-red-400/60 bg-red-500/10 text-red-100"
                  : "";

            const idleClass = isSelected
              ? "border-aura-cyan/70 bg-aura-cyan/10 text-aura-text"
              : "border-aura-border bg-aura-panel text-aura-muted hover:border-aura-cyan/50 hover:text-aura-text";

            return (
              <button
                key={choice}
                type="button"
                onClick={() => handleSelectAnswer(choice)}
                disabled={isSubmitted}
                className={`rounded-2xl border px-4 py-4 text-left text-sm font-semibold transition ${
                  submittedClass || idleClass
                } disabled:cursor-default`}
              >
                {choice}
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div className="mt-5 rounded-2xl border border-aura-border bg-aura-panel p-4">
            <p className="text-sm leading-6 text-aura-muted">
              <span className="font-black text-aura-text">Correct answer:</span>{" "}
              {currentQuestion.answer}
            </p>

            <p className="mt-2 text-sm leading-6 text-aura-muted">
              <span className="font-black text-aura-text">Explanation:</span>{" "}
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="rounded-2xl border border-aura-border bg-aura-panel px-5 py-3 text-sm font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Previous
          </button>

          <div className="flex flex-wrap justify-center gap-2">
            {questions.map((question, index) => {
              const isActive = index === currentQuestionIndex;
              const isAnswered = selectedAnswers[index];

              return (
                <button
                  key={`${question.question}-${index}`}
                  type="button"
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`h-3 w-3 rounded-full transition ${
                    isActive
                      ? "bg-aura-cyan"
                      : isAnswered
                        ? "bg-aura-gold"
                        : "bg-aura-border"
                  }`}
                  aria-label={`Go to question ${index + 1}`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentQuestionIndex === questions.length - 1}
            className="rounded-2xl border border-aura-cyan/40 bg-aura-cyan/10 px-5 py-3 text-sm font-black text-aura-cyan transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedQuizResult;