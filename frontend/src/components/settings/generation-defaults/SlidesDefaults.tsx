const slideDefaults = [
  ["Short Deck", "5 slides", "Small review deck"],
  ["Standard Deck", "8 slides", "Balanced lesson deck"],
  ["Full Deck", "12 slides", "Expanded presentation deck"],
];

const SlidesDefaults = () => {
  return (
    <div className="rounded-2xl border border-aura-border bg-aura-panel p-5">
      <p className="font-black text-aura-text">Slides</p>
      <p className="mt-2 text-sm leading-6 text-aura-muted">
        Generate focused presentation decks with slide titles, subtitles, and
        clean bullet points.
      </p>

      <div className="mt-4 grid gap-3">
        {slideDefaults.map(([label, count, description]) => (
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

export default SlidesDefaults;