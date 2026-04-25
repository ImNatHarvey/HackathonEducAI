const safetyItems = [
  {
    title: "Strict safety mode",
    description: "Recommended for school and hackathon demo usage.",
  },
  {
    title: "Warn before sensitive topics",
    description: "Shows a warning when a topic may need careful handling.",
  },
  {
    title: "Block illegal instructions",
    description: "Prevents dangerous or illegal step-by-step guidance.",
  },
];

const SafeLearningFilterPanel = () => {
  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-6">
        <h3 className="text-xl font-black text-aura-text">Safe Learning Filter</h3>
        <p className="mt-2 text-sm leading-6 text-aura-muted">
          Manage safety controls for sensitive, harmful, or illegal topics.
        </p>

        <div className="mt-5 space-y-3">
          {safetyItems.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-aura-border bg-aura-panel p-5"
            >
              <p className="font-black text-aura-text">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-aura-muted">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SafeLearningFilterPanel;