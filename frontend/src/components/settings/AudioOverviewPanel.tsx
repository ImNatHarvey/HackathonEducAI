export type AudioSettings = {
  useBrowserTts: boolean;
  karaokeHighlight: boolean;
};

type AudioSettingKey = keyof AudioSettings;

type AudioSettingItem = {
  key: AudioSettingKey;
  title: string;
  description: string;
};

type AudioOverviewPanelProps = {
  settings: AudioSettings;
  onChange: (settings: AudioSettings) => void;
};

export const AUDIO_SETTINGS_STORAGE_KEY = "studyAura.audioSettings";
export const AUDIO_SETTINGS_EVENT_NAME = "studyAura.audioSettingsUpdated";

export const defaultAudioSettings: AudioSettings = {
  useBrowserTts: true,
  karaokeHighlight: true,
};

const audioSettingItems: AudioSettingItem[] = [
  {
    key: "useBrowserTts",
    title: "Use browser text-to-speech",
    description:
      "Allows Study Aura to use the browser voice as a fallback when premium narration is unavailable.",
  },
  {
    key: "karaokeHighlight",
    title: "Karaoke word highlight",
    description:
      "Highlights the spoken words while the audio overview is playing.",
  },
];

export const loadAudioSettings = (): AudioSettings => {
  if (typeof window === "undefined") return defaultAudioSettings;

  try {
    const saved = window.localStorage.getItem(AUDIO_SETTINGS_STORAGE_KEY);

    if (!saved) return defaultAudioSettings;

    const parsed = JSON.parse(saved) as Partial<AudioSettings>;

    return {
      useBrowserTts:
        typeof parsed.useBrowserTts === "boolean"
          ? parsed.useBrowserTts
          : defaultAudioSettings.useBrowserTts,
      karaokeHighlight:
        typeof parsed.karaokeHighlight === "boolean"
          ? parsed.karaokeHighlight
          : defaultAudioSettings.karaokeHighlight,
    };
  } catch {
    return defaultAudioSettings;
  }
};

export const saveAudioSettings = (settings: AudioSettings) => {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    AUDIO_SETTINGS_STORAGE_KEY,
    JSON.stringify(settings),
  );

  window.dispatchEvent(
    new CustomEvent<AudioSettings>(AUDIO_SETTINGS_EVENT_NAME, {
      detail: settings,
    }),
  );
};

export const subscribeToAudioSettings = (
  callback: (settings: AudioSettings) => void,
) => {
  if (typeof window === "undefined") return () => {};

  const handleSettingsUpdate = (event: Event) => {
    const customEvent = event as CustomEvent<AudioSettings>;
    callback(customEvent.detail ?? loadAudioSettings());
  };

  const handleStorageUpdate = (event: StorageEvent) => {
    if (event.key !== AUDIO_SETTINGS_STORAGE_KEY) return;
    callback(loadAudioSettings());
  };

  window.addEventListener(AUDIO_SETTINGS_EVENT_NAME, handleSettingsUpdate);
  window.addEventListener("storage", handleStorageUpdate);

  return () => {
    window.removeEventListener(AUDIO_SETTINGS_EVENT_NAME, handleSettingsUpdate);
    window.removeEventListener("storage", handleStorageUpdate);
  };
};

const AudioOverviewPanel = ({ settings, onChange }: AudioOverviewPanelProps) => {
  const toggleSetting = (key: AudioSettingKey) => {
    onChange({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <section className="space-y-5">
      <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-6">
        <p className="max-w-4xl text-sm leading-6 text-aura-muted">
          Manage Audio Overview playback fallback and spoken-content
          highlighting.
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