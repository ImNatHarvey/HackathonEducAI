const audioSettings = [
  {
    title: "Use browser text-to-speech",
    description:
      "Audio Overview uses the browser's free speech engine for playback.",
    enabled: true,
  },
  {
    title: "Stop audio when modal closes",
    description:
      "Automatically stops playback when leaving the Audio Overview modal.",
    enabled: true,
  },
  {
    title: "Karaoke word highlight",
    description:
      "Highlights spoken words while the browser reads the current study card.",
    enabled: true,
  },
  {
    title: "Save generated transcript",
    description:
      "Keeps the generated audio overview script with the saved output.",
    enabled: true,
  },
];

const AudioOverviewPanel = () => {
  return (
    <section className="space-y-5">
      <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-6">
        <p className="max-w-3xl text-sm leading-6 text-aura-muted">
          Audio Overview creates study-card style narration from selected
          sources. The current version uses free browser text-to-speech instead
          of a paid voice model.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {audioSettings.map((setting) => (
            <div
              key={setting.title}
              className="rounded-2xl border border-aura-border bg-aura-panel p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-black text-aura-text">{setting.title}</p>
                  <p className="mt-2 text-sm leading-6 text-aura-muted">
                    {setting.description}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
                    setting.enabled
                      ? "border-aura-cyan/35 bg-aura-cyan/10 text-aura-cyan"
                      : "border-aura-border bg-aura-bg-soft text-aura-muted"
                  }`}
                >
                  {setting.enabled ? "On" : "Off"}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-aura-gold/30 bg-aura-gold/10 p-4 text-sm leading-6 text-aura-gold">
          Real downloadable audio can be added later with ElevenLabs or another
          TTS provider. For the hackathon demo, this free browser-based setup is
          safer and faster.
        </div>
      </div>
    </section>
  );
};

export default AudioOverviewPanel;