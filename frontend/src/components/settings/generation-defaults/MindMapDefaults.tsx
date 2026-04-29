const mindMapDefaults = [
  ["Simple Map", "4 branches", "Focused overview map"],
  ["Balanced Map", "6 branches", "Standard concept map"],
  ["Deep Map", "8 branches", "Expanded mastery map"],
];

const MindMapDefaults = () => {
  return (
    <div className="rounded-2xl border border-aura-border bg-aura-panel p-5">
      <p className="font-black text-aura-text">Mind Map</p>
      <p className="mt-2 text-sm leading-6 text-aura-muted">
        Generate visual concept maps with a core topic, connected branches,
        summaries, and keywords.
      </p>

      <div className="mt-4 grid gap-3">
        {mindMapDefaults.map(([label, count, description]) => (
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

export default MindMapDefaults;