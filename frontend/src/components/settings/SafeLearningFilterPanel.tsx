export type SafetySettings = {
  strictSafetyMode: boolean;
  warnBeforeSensitiveTopics: boolean;
  blockIllegalInstructions: boolean;
};

type SafetySettingKey = keyof SafetySettings;

type SafetySettingItem = {
  key: SafetySettingKey;
  title: string;
  description: string;
};

type SafeLearningFilterPanelProps = {
  settings: SafetySettings;
  onChange: (settings: SafetySettings) => void;
};

export const SAFETY_SETTINGS_STORAGE_KEY = "studyAura.safetySettings";
export const SAFETY_SETTINGS_EVENT_NAME = "studyAura.safetySettingsUpdated";

export const defaultSafetySettings: SafetySettings = {
  strictSafetyMode: true,
  warnBeforeSensitiveTopics: true,
  blockIllegalInstructions: true,
};

const safetyItems: SafetySettingItem[] = [
  {
    key: "strictSafetyMode",
    title: "Strict safety mode",
    description: "Recommended for school and learning usage.",
  },
  {
    key: "warnBeforeSensitiveTopics",
    title: "Warn before sensitive topics",
    description: "Shows a warning when a topic may need careful handling.",
  },
  {
    key: "blockIllegalInstructions",
    title: "Block illegal instructions",
    description: "Prevents dangerous or illegal step-by-step guidance.",
  },
];

export const loadSafetySettings = (): SafetySettings => {
  if (typeof window === "undefined") return defaultSafetySettings;

  try {
    const saved = window.localStorage.getItem(SAFETY_SETTINGS_STORAGE_KEY);

    if (!saved) return defaultSafetySettings;

    const parsed = JSON.parse(saved) as Partial<SafetySettings>;

    return {
      strictSafetyMode:
        typeof parsed.strictSafetyMode === "boolean"
          ? parsed.strictSafetyMode
          : defaultSafetySettings.strictSafetyMode,
      warnBeforeSensitiveTopics:
        typeof parsed.warnBeforeSensitiveTopics === "boolean"
          ? parsed.warnBeforeSensitiveTopics
          : defaultSafetySettings.warnBeforeSensitiveTopics,
      blockIllegalInstructions:
        typeof parsed.blockIllegalInstructions === "boolean"
          ? parsed.blockIllegalInstructions
          : defaultSafetySettings.blockIllegalInstructions,
    };
  } catch {
    return defaultSafetySettings;
  }
};

export const saveSafetySettings = (settings: SafetySettings) => {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(
    SAFETY_SETTINGS_STORAGE_KEY,
    JSON.stringify(settings),
  );

  window.dispatchEvent(
    new CustomEvent<SafetySettings>(SAFETY_SETTINGS_EVENT_NAME, {
      detail: settings,
    }),
  );
};

export const subscribeToSafetySettings = (
  callback: (settings: SafetySettings) => void,
) => {
  if (typeof window === "undefined") return () => {};

  const handleSettingsUpdate = (event: Event) => {
    const customEvent = event as CustomEvent<SafetySettings>;
    callback(customEvent.detail ?? loadSafetySettings());
  };

  const handleStorageUpdate = (event: StorageEvent) => {
    if (event.key !== SAFETY_SETTINGS_STORAGE_KEY) return;
    callback(loadSafetySettings());
  };

  window.addEventListener(SAFETY_SETTINGS_EVENT_NAME, handleSettingsUpdate);
  window.addEventListener("storage", handleStorageUpdate);

  return () => {
    window.removeEventListener(SAFETY_SETTINGS_EVENT_NAME, handleSettingsUpdate);
    window.removeEventListener("storage", handleStorageUpdate);
  };
};

const SafeLearningFilterPanel = ({
  settings,
  onChange,
}: SafeLearningFilterPanelProps) => {
  const toggleSetting = (key: SafetySettingKey) => {
    onChange({
      ...settings,
      [key]: !settings[key],
    });
  };

  return (
    <section className="space-y-5">
      <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-6">
        <p className="max-w-4xl text-sm leading-6 text-aura-muted">
          Manage safety controls for sensitive, harmful, or illegal topics.
          These controls help keep Study Aura appropriate for classroom and
          school-demo use.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {safetyItems.map((item) => {
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

export default SafeLearningFilterPanel;