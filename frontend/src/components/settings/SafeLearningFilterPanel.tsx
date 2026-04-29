const safetyItems = [
  {
    title: "Strict safety mode",
    description: "Recommended for school and hackathon demo usage.",
    status: "Enabled",
  },
  {
    title: "Warn before sensitive topics",
    description: "Shows a warning when a topic may need careful handling.",
    status: "Enabled",
  },
  {
    title: "Block illegal instructions",
    description: "Prevents dangerous or illegal step-by-step guidance.",
    status: "Enabled",
  },
];

const SafeLearningFilterPanel = () => {
  return (
    <section className="space-y-5">
      <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-6">
        <p className="max-w-3xl text-sm leading-6 text-aura-muted">
          Manage safety controls for sensitive, harmful, or illegal topics.
          These controls help keep Study Aura appropriate for classroom and
          school-demo use.
        </p>

        <div className="mt-5 space-y-3">
          {safetyItems.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-aura-border bg-aura-panel p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-black text-aura-text">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-aura-muted">
                    {item.description}
                  </p>
                </div>

                <span className="shrink-0 rounded-full border border-aura-cyan/35 bg-aura-cyan/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-aura-cyan">
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-aura-border bg-aura-panel p-4">
          <p className="text-sm font-black text-aura-text">Demo note</p>
          <p className="mt-2 text-sm leading-6 text-aura-muted">
            These settings are currently visual controls. Production safety
            enforcement should also happen inside n8n workflows or a protected
            backend gateway.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SafeLearningFilterPanel;