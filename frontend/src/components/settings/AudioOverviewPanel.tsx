const audioPresets = ["Calm Tutor", "Podcast Host", "Fast Review", "Story Mode"];

const AudioOverviewPanel = () => {
  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-6">
        <h3 className="text-xl font-black text-aura-text">Audio Overview</h3>
        <p className="mt-2 text-sm leading-6 text-aura-muted">
          Set how text-to-speech and podcast-style summaries should behave.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {audioPresets.map((voice) => (
            <button
              key={voice}
              type="button"
              className="rounded-2xl border border-aura-border bg-aura-panel p-5 text-left transition hover:-translate-y-0.5 hover:border-aura-cyan/60"
            >
              <p className="font-black text-aura-text">{voice}</p>
              <p className="mt-2 text-sm text-aura-muted">
                Audio style preset for generated lesson overviews.
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudioOverviewPanel;