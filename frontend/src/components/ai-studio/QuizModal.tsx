import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import ErrorState from "../states/ErrorState";
import LoadingState from "../states/LoadingState";
import { generateQuizWithN8n } from "../../lib/n8n";
import { currentUser } from "../user/userMock";
import type { QuizDifficulty, QuizQuestion } from "../../lib/n8n";

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

const QuizModal = () => {
  const [difficulty, setDifficulty] = useState<QuizDifficulty>("easy");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [fallback, setFallback] = useState(false);
  const [isResultOpen, setIsResultOpen] = useState(false);

  const selectedDifficulty = useMemo(() => {
    return (
      difficultyOptions.find((option) => option.value === difficulty) ??
      difficultyOptions[0]
    );
  }, [difficulty]);

  const handleGenerateQuiz = async () => {
    setError("");
    setFallback(false);
    setIsGenerating(true);

    try {
      const response = await generateQuizWithN8n({
        topic: "Marine Biology 101",
        difficulty,
        questionCount: selectedDifficulty.questionCount,
        userId: currentUser.id,
      });

      setQuizTitle(response.quiz.title);
      setQuestions(response.quiz.questions);
      setFallback(Boolean(response.fallback));
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
      `Difficulty: ${selectedDifficulty.label} • Questions: ${questions.length}`,
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
          Choose a difficulty, then Study Aura will generate a quiz through your
          n8n workflow.
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
          for Marine Biology 101.
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
          <div className="mx-auto flex min-h-full w-full max-w-5xl items-start justify-center">
            <div className="w-full overflow-hidden rounded-[2rem] border border-aura-border bg-aura-panel shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
              <div className="sticky top-0 z-10 border-b border-aura-border bg-aura-panel/95 px-6 py-5 backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
                      Generated Quiz
                    </p>
                    <h4 className="mt-1 text-2xl font-black text-aura-text">
                      {quizTitle || "Practice Quiz"}
                    </h4>
                    <p className="mt-1 text-sm text-aura-muted">
                      {selectedDifficulty.label} • {questions.length} questions
                    </p>
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
              </div>

              <div className="space-y-4 p-6">
                {fallback && (
                  <div className="rounded-2xl border border-aura-gold/30 bg-aura-gold/10 p-4 text-sm leading-6 text-aura-gold">
                    Demo fallback mode is active. Gemini may have reached its
                    quota, so Study Aura returned a safe fallback quiz.
                  </div>
                )}

                {questions.map((question, index) => (
                  <div
                    key={`${question.question}-${index}`}
                    className="rounded-2xl border border-aura-border bg-aura-bg-soft p-5"
                  >
                    <p className="font-black leading-7 text-aura-text">
                      {index + 1}. {question.question}
                    </p>

                    <div className="mt-4 grid gap-2 md:grid-cols-2">
                      {question.choices.map((choice) => (
                        <div
                          key={choice}
                          className={`rounded-xl border px-3 py-2 text-sm ${
                            choice === question.answer
                              ? "border-aura-green/40 bg-aura-green/10 text-aura-green"
                              : "border-aura-border bg-aura-panel text-aura-muted"
                          }`}
                        >
                          {choice}
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 text-sm leading-6 text-aura-muted">
                      <span className="font-black text-aura-cyan">
                        Explanation:
                      </span>{" "}
                      {question.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizModal;