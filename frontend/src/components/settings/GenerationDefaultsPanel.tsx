const generationItems = [
  ["Quiz", "5 questions, mixed difficulty"],
  ["Flashcards", "10 cards, concise answers"],
  ["Mind Map", "Main topic with 4 to 6 branches"],
  ["Tables", "Illustration table with examples"],
  ["Slides", "6-slide presentation outline"],
  ["YouTube", "Use pasted videos as extra context"],
];

const GenerationDefaultsPanel = () => {
  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-6">
        <h3 className="text-xl font-black text-aura-text">Generation Defaults</h3>
        <p className="mt-2 text-sm leading-6 text-aura-muted">
          Default behavior for quizzes, flashcards, tables, slides, and mind maps.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {generationItems.map(([title, description]) => (
            <div
              key={title}
              className="rounded-2xl border border-aura-border bg-aura-panel p-5"
            >
              <p className="font-black text-aura-text">{title}</p>
              <p className="mt-2 text-sm text-aura-muted">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenerationDefaultsPanel;