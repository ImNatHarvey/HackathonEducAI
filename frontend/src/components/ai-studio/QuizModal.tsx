import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import ErrorState from "../states/ErrorState";
import LoadingState from "../states/LoadingState";
import { generateQuizWithN8n } from "../../lib/n8n";
import { currentUser } from "../user/userMock";
import type { QuizDifficulty, QuizQuestion } from "../../lib/n8n";

type Props = {
  topic: string;
};

const difficultyOptions: {
  label: string;
  value: QuizDifficulty;
  questionCount: number;
  description: string;
}[] = [
  {
    label: "Easy",
    value: "easy",
    questionCount: 10,
    description: "10 recall and basic understanding questions",
  },
  {
    label: "Medium",
    value: "medium",
    questionCount: 20,
    description: "20 concept check and explanation questions",
  },
  {
    label: "Hard",
    value: "hard",
    questionCount: 30,
    description: "30 application and reasoning questions",
  },
];

const shuffleArray = <T,>(items: T[]) => {
  return [...items].sort(() => Math.random() - 0.5);
};

const normalizeAnswer = (value: string) => {
  return value.trim().toLowerCase();
};

const formatProviderName = (provider: string) => {
  return provider
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const QuizModal = ({ topic }: Props) => {
  const [difficulty, setDifficulty] = useState<QuizDifficulty>("easy");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [fallback, setFallback] = useState(false);
  const [provider, setProvider] = useState("");
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(
    {},
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedDifficulty = useMemo(() => {
    return (
      difficultyOptions.find((option) => option.value === difficulty) ??
      difficultyOptions[0]
    );
  }, [difficulty]);

  const answeredCount = Object.keys(selectedAnswers).length;

  const score = useMemo(() => {
    return questions.reduce((total, question, index) => {
      const selectedAnswer = selectedAnswers[index];

      if (
        selectedAnswer &&
        normalizeAnswer(selectedAnswer) === normalizeAnswer(question.answer)
      ) {
        return total + 1;
      }

      return total;
    }, 0);
  }, [questions, selectedAnswers]);

  const accuracy = questions.length
    ? Math.round((score / questions.length) * 100)
    : 0;

  const providerLabel = provider ? formatProviderName(provider) : "";

  const handleGenerateQuiz = async () => {
    setError("");
    setFallback(false);
    setProvider("");
    setIsGenerating(true);
    setSelectedAnswers({});
    setIsSubmitted(false);

    try {
      const response = await generateQuizWithN8n({
        topic,
        difficulty,
        questionCount: selectedDifficulty.questionCount,
        userId: currentUser.id,
      });

      setQuizTitle(response.quiz.title);
      setQuestions(response.quiz.questions);
      setFallback(Boolean(response.fallback));
      setProvider(response.provider ?? "");
      setIsResultOpen(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to generate quiz.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShuffleQuestions = () => {
    setQuestions((current) => shuffleArray(current));
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const handleSelectAnswer = (questionIndex: number, answer: string) => {
    if (isSubmitted) return;

    setSelectedAnswers((currentAnswers) => ({
      ...currentAnswers,
      [questionIndex]: answer,
    }));
  };

  const handleResetAnswers = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    const title = quizTitle || "Study Aura Generated Quiz";

    let y = 18;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title, 14, y);

    y += 9;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(
      `Topic: ${topic} • Difficulty: ${selectedDifficulty.label} • Questions: ${questions.length}`,
      14,
      y,
    );

    y += 10;

    questions.forEach((item, index) => {
      const questionLines = doc.splitTextToSize(
        `${index + 1}. ${item.question}`,
        180,
      );

      if (y + questionLines.length * 6 > 270) {
        doc.addPage();
        y = 18;
      }

      doc.setFont("helvetica", "bold");
      doc.text(questionLines, 14, y);
      y += questionLines.length * 6 + 2;

      doc.setFont("helvetica", "normal");

      item.choices.forEach((choice, choiceIndex) => {
        const label = String.fromCharCode(65 + choiceIndex);
        const choiceLines = doc.splitTextToSize(`${label}. ${choice}`, 170);

        if (y + choiceLines.length * 5 > 270) {
          doc.addPage();
          y = 18;
        }

        doc.text(choiceLines, 18, y);
        y += choiceLines.length * 5 + 1;
      });

      const answerLines = doc.splitTextToSize(`Answer: ${item.answer}`, 170);
      const explanationLines = doc.splitTextToSize(
        `Explanation: ${item.explanation}`,
        170,
      );

      if (y + answerLines.length * 5 + explanationLines.length * 5 > 270) {
        doc.addPage();
        y = 18;
      }

      doc.setFont("helvetica", "bold");
      doc.text(answerLines, 18, y);
      y += answerLines.length * 5 + 1;

      doc.setFont("helvetica", "normal");
      doc.text(explanationLines, 18, y);
      y += explanationLines.length * 5 + 8;
    });

    doc.save(`${title.replaceAll(" ", "-").toLowerCase()}.pdf`);
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-black text-aura-text">Generate Quiz</h3>
        <p className="mt-1 text-sm text-aura-muted">
          Choose a difficulty, then Study Aura will generate an answerable quiz
          through your n8n workflow.
        </p>
      </div>

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
                {option.questionCount}
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
          Study Aura will generate {selectedDifficulty.questionCount} questions
          for {topic}.
        </p>
      </div>

      <button
        type="button"
        onClick={handleGenerateQuiz}
        disabled={isGenerating}
        className="w-full rounded-2xl bg-gradient-to-r from-aura-primary to-aura-cyan py-3 font-black text-white transition hover:-translate-y-0.5 disabled:opacity-50"
      >
        {isGenerating
          ? "Generating Quiz..."
          : `Generate ${selectedDifficulty.questionCount}-Item Quiz`}
      </button>

      {isGenerating && (
        <LoadingState
          title="Generating quiz..."
          description="Study Aura is creating practice questions through n8n."
        />
      )}

      {error && (
        <ErrorState
          title="Quiz generation failed"
          description={error}
          actionLabel="Try Again"
          onRetry={handleGenerateQuiz}
        />
      )}

      {isResultOpen && questions.length > 0 && (
        <div className="fixed inset-0 z-[80] overflow-y-auto bg-black/75 px-6 py-8 backdrop-blur-sm">
          <div className="mx-auto flex min-h-full w-full max-w-6xl items-start justify-center">
            <div className="w-full overflow-hidden rounded-[2rem] border border-aura-border bg-aura-panel shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
              <div className="sticky top-0 z-10 border-b border-aura-border bg-aura-panel/95 px-6 py-5 backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
                      Interactive Quiz
                    </p>

                    <h4 className="mt-1 text-2xl font-black text-aura-text">
                      {quizTitle || "Practice Quiz"}
                    </h4>

                    <p className="mt-1 text-sm text-aura-muted">
                      {topic} • {selectedDifficulty.label} • {questions.length}{" "}
                      questions
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {providerLabel && (
                        <span className="rounded-full border border-aura-cyan/40 bg-aura-cyan/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-aura-cyan">
                          {fallback
                            ? `Generated by ${providerLabel} fallback`
                            : `Generated by ${providerLabel}`}
                        </span>
                      )}

                      {fallback && (
                        <span className="rounded-full border border-aura-gold/40 bg-aura-gold/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-aura-gold">
                          Safe fallback output
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleShuffleQuestions}
                      className="rounded-2xl border border-aura-cyan/40 bg-aura-cyan/10 px-4 py-2 text-sm font-black text-aura-cyan transition hover:-translate-y-0.5"
                    >
                      Shuffle
                    </button>

                    <button
                      type="button"
                      onClick={handleExportPdf}
                      className="rounded-2xl border border-aura-gold/40 bg-aura-gold/10 px-4 py-2 text-sm font-black text-aura-gold transition hover:-translate-y-0.5"
                    >
                      Export PDF
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsResultOpen(false)}
                      className="rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-2 text-sm font-black text-aura-muted transition hover:border-aura-pink/60 hover:text-aura-pink"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-4">
                  <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-4">
                    <p className="text-2xl font-black text-aura-text">
                      {answeredCount}/{questions.length}
                    </p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-aura-dim">
                      Answered
                    </p>
                  </div>

                  <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-4">
                    <p className="text-2xl font-black text-aura-text">
                      {isSubmitted ? `${score}/${questions.length}` : "--"}
                    </p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-aura-dim">
                      Score
                    </p>
                  </div>

                  <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-4">
                    <p className="text-2xl font-black text-aura-text">
                      {isSubmitted ? `${accuracy}%` : "--"}
                    </p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-aura-dim">
                      Accuracy
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleResetAnswers}
                      className="flex-1 rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-3 text-sm font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text"
                    >
                      Reset
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsSubmitted(true)}
                      disabled={answeredCount === 0}
                      className="flex-1 rounded-2xl bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold px-4 py-3 text-sm font-black text-aura-bg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6">
                {questions.map((question, index) => {
                  const selectedAnswer = selectedAnswers[index];
                  const isCorrect =
                    selectedAnswer &&
                    normalizeAnswer(selectedAnswer) ===
                      normalizeAnswer(question.answer);

                  return (
                    <div
                      key={`${question.question}-${index}`}
                      className="rounded-2xl border border-aura-border bg-aura-bg-soft p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-black uppercase tracking-wider text-aura-cyan">
                            Question {index + 1}
                          </p>

                          <p className="mt-2 font-black leading-7 text-aura-text">
                            {question.question}
                          </p>
                        </div>

                        {isSubmitted && (
                          <span
                            className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                              isCorrect
                                ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                                : "border-red-400/40 bg-red-500/10 text-red-200"
                            }`}
                          >
                            {isCorrect ? "Correct" : "Review"}
                          </span>
                        )}
                      </div>

                      <div className="mt-4 grid gap-2 md:grid-cols-2">
                        {question.choices.map((choice) => {
                          const isSelected = selectedAnswer === choice;
                          const isCorrectChoice =
                            normalizeAnswer(choice) ===
                            normalizeAnswer(question.answer);

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
                              onClick={() => handleSelectAnswer(index, choice)}
                              disabled={isSubmitted}
                              className={`rounded-xl border px-3 py-3 text-left text-sm font-semibold transition ${
                                submittedClass || idleClass
                              } disabled:cursor-default`}
                            >
                              {choice}
                            </button>
                          );
                        })}
                      </div>

                      {isSubmitted && (
                        <div className="mt-4 rounded-xl border border-aura-border bg-aura-panel p-4">
                          <p className="text-sm leading-6 text-aura-muted">
                            <span className="font-black text-aura-text">
                              Correct answer:
                            </span>{" "}
                            {question.answer}
                          </p>

                          <p className="mt-2 text-sm leading-6 text-aura-muted">
                            <span className="font-black text-aura-text">
                              Explanation:
                            </span>{" "}
                            {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizModal;