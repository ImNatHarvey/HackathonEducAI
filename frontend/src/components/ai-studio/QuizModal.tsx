const QuizModal = () => {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-black text-aura-text">
          Generate Quiz
        </h3>
        <p className="text-sm text-aura-muted mt-1">
          Create practice questions from your current topic.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <button className="p-4 rounded-2xl border border-aura-border bg-aura-panel hover:border-aura-cyan">
          Easy (Recall)
        </button>

        <button className="p-4 rounded-2xl border border-aura-border bg-aura-panel hover:border-aura-cyan">
          Medium (Understanding)
        </button>

        <button className="p-4 rounded-2xl border border-aura-border bg-aura-panel hover:border-aura-cyan">
          Hard (Application)
        </button>

        <button className="p-4 rounded-2xl border border-aura-border bg-aura-panel hover:border-aura-cyan">
          Mixed Difficulty
        </button>
      </div>

      <button className="w-full py-3 rounded-2xl bg-gradient-to-r from-aura-primary to-aura-cyan text-white font-black">
        Generate Quiz
      </button>
    </div>
  );
};

export default QuizModal;