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
    description:
      "Uses the browser's free speech engine as a fallback when premium narration is unavailable.",
  },
  {
    key: "stopWhenModalCloses",
    title: "Stop audio when modal closes",
    description:
      "Automatically stops playback when leaving the Audio Overview modal.",
  },
  {
    key: "karaokeHighlight",
    title: "Karaoke word highlight",
    description:
      "Highlights spoken words while the current study card is being read.",
  },
  {
    key: "saveGeneratedTranscript",
    title: "Save generated transcript",
    description:
      "Keeps the generated audio overview script with the saved output.",
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
        <p className="max-w-4xl text-sm leading-6 text-aura-muted">
          Manage Audio Overview playback behavior, transcript saving, and browser
          text-to-speech fallback options.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {audioSettingItems.map((item) => {
            const enabled = settings[item.key];

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleSetting(item.key)}
                className="w-full rounded-2xl border border-aura-border bg-aura-panel p-5 text-left transition hover:-translate-y-0.5 hover:border-aura-cyan/50"
                aria-pressed={enabled}
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="min-w-0">
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
                    aria-label={enabled ? "Enabled" : "Disabled"}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full transition-all duration-200 ${
                        enabled
                          ? "left-6 bg-aura-cyan shadow-[0_0_18px_rgba(34,211,238,0.55)]"
                          : "left-1 bg-aura-dim"
                      }`}
                    />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AudioOverviewPanel;