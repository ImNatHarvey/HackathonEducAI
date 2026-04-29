import { useEffect, useState } from "react";

type AudioSettings = {
  useBrowserTts: boolean;
  stopWhenModalCloses: boolean;
  karaokeHighlight: boolean;
  saveGeneratedTranscript: boolean;
};

type AudioSettingKey = keyof AudioSettings;

type AudioSettingItem = {
  key: AudioSettingKey;
  title: string;
  description: string;
};

const STORAGE_KEY = "studyAura.audioSettings";

const defaultAudioSettings: AudioSettings = {
  useBrowserTts: true,
  stopWhenModalCloses: true,
  karaokeHighlight: true,
  saveGeneratedTranscript: true,
};

const audioSettingItems: AudioSettingItem[] = [
  {
    key: "useBrowserTts",
    title: "Use browser text-to-speech",
    description: "Audio Overview uses the browser's free speech engine for playback.",
  },
  {
    key: "stopWhenModalCloses",
    title: "Stop audio when modal closes",
    description: "Automatically stops playback when leaving the Audio Overview modal.",
  },
  {
    key: "karaokeHighlight",
    title: "Karaoke word highlight",
    description: "Highlights spoken words while the browser reads the current study card.",
  },
  {
    key: "saveGeneratedTranscript",
    title: "Save generated transcript",
    description: "Keeps the generated audio overview script with the saved output.",
  },
];

const loadAudioSettings = (): AudioSettings => {
  if (typeof window === "undefined") return defaultAudioSettings;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) return defaultAudioSettings;

    return {
      ...defaultAudioSettings,
      ...JSON.parse(saved),
    };
  } catch {
    return defaultAudioSettings;
  }
};

const AudioOverviewPanel = () => {
  const [settings, setSettings] = useState<AudioSettings>(loadAudioSettings);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = (key: AudioSettingKey) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  return (
    <section className="space-y-5">
      <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-6">
        <p className="max-w-3xl text-sm leading-6 text-aura-muted">
          Audio Overview creates study-card style narration from selected sources
          using free browser text-to-speech.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {audioSettingItems.map((item) => {
            const enabled = settings[item.key];

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleSetting(item.key)}
                className="rounded-2xl border border-aura-border bg-aura-panel p-5 text-left transition hover:-translate-y-0.5 hover:border-aura-cyan/50"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="font-black text-aura-text">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-aura-muted">
                      {item.description}
                    </p>
                  </div>

                  <span
                    className={`relative mt-1 h-7 w-12 shrink-0 rounded-full border transition ${
                      enabled
                        ? "border-aura-cyan/50 bg-aura-cyan/25"
                        : "border-aura-border bg-aura-bg-soft"
                    }`}
                    aria-label={item.title}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full transition ${
                        enabled
                          ? "left-6 bg-aura-cyan shadow-[0_0_18px_rgba(34,211,238,0.55)]"
                          : "left-1 bg-aura-dim"
                      }`}
                    />
                  </span>
                </div>

                <p
                  className={`mt-4 inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
                    enabled
                      ? "border-aura-cyan/35 bg-aura-cyan/10 text-aura-cyan"
                      : "border-aura-border bg-aura-bg-soft text-aura-muted"
                  }`}
                >
                  {enabled ? "On" : "Off"}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AudioOverviewPanel;