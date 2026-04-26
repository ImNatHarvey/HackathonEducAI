const tableDefaults = [
  ["Easy", "5 rows", "Quick beginner-friendly table"],
  ["Medium", "8 rows", "Balanced explanation table"],
  ["Hard", "12 rows", "Detailed mastery table"],
];

const tableModes = [
  "Concept Comparison",
  "Term Definition",
  "Process Steps",
  "Cause and Effect",
];

const TablesDefaults = () => {
  return (
    <div className="rounded-2xl border border-aura-border bg-aura-panel p-5">
      <p className="font-black text-aura-text">Tables</p>
      <p className="mt-2 text-sm leading-6 text-aura-muted">
        Generate illustration tables for comparisons, definitions, processes,
        and cause-effect learning.
      </p>

      <div className="mt-4 grid gap-3">
        {tableDefaults.map(([label, count, description]) => (
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

      <div className="mt-4 flex flex-wrap gap-2">
        {tableModes.map((mode) => (
          <span
            key={mode}
            className="rounded-full border border-aura-cyan/30 bg-aura-cyan/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-aura-cyan"
          >
            {mode}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TablesDefaults;