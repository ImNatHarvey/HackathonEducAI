const audioStyles = ["Calm Tutor", "Energetic Coach", "Podcast Duo"];
const audioLengths = ["Short", "Standard", "Deep"];

const AudioDefaults = () => {
  return (
    <div className="rounded-2xl border border-aura-border bg-aura-panel p-5">
      <p className="font-black text-aura-text">Audio Overview</p>
      <p className="mt-2 text-sm leading-6 text-aura-muted">
        Generate narration scripts for podcast-style study overviews. ElevenLabs
        voice generation can be connected later.
      </p>

      <div className="mt-4">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-aura-dim">
          Styles
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {audioStyles.map((style) => (
            <span
              key={style}
              className="rounded-full border border-aura-cyan/30 bg-aura-cyan/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-aura-cyan"
            >
              {style}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-aura-dim">
          Lengths
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {audioLengths.map((length) => (
            <span
              key={length}
              className="rounded-full border border-aura-gold/30 bg-aura-gold/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-aura-gold"
            >
              {length}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioDefaults;