const quizDefaults = [
  ["Easy", "10 questions", "Recall and basic understanding"],
  ["Medium", "20 questions", "Concept checks and explanation"],
  ["Hard", "30 questions", "Application and reasoning"],
];

const QuizDefaults = () => {
  return (
    <div className="rounded-2xl border border-aura-border bg-aura-panel p-5">
      <p className="font-black text-aura-text">Quiz</p>
      <p className="mt-2 text-sm leading-6 text-aura-muted">
        Default quiz sizes are based on difficulty.
      </p>

      <div className="mt-4 grid gap-3">
        {quizDefaults.map(([label, count, description]) => (
          <div
            key={label}
            className="rounded-xl border border-aura-border bg-aura-bg-soft p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-black text-aura-text">{label}</p>
              <span className="rounded-full border border-aura-gold/30 bg-aura-gold/10 px-2 py-1 text-xs font-black text-aura-gold">
                {count}
              </span>
            </div>
            <p className="mt-1 text-xs text-aura-muted">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizDefaults;