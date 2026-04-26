const flashcardDefaults = [
  ["Easy", "10 cards", "Quick recall questions"],
  ["Medium", "15 cards", "Question and fill-in-the-blank mix"],
  ["Hard", "20 cards", "Reasoning and mastery review"],
];

const FlashcardsDefaults = () => {
  return (
    <div className="rounded-2xl border border-aura-border bg-aura-panel p-5">
      <p className="font-black text-aura-text">Flashcards</p>
      <p className="mt-2 text-sm leading-6 text-aura-muted">
        Interactive Study Aura cards with typed answers, hints, and flip
        reveal.
      </p>

      <div className="mt-4 grid gap-3">
        {flashcardDefaults.map(([label, count, description]) => (
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

export default FlashcardsDefaults;