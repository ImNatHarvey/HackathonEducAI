import { useEffect, useState } from "react";

type SafetySettings = {
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

const STORAGE_KEY = "studyAura.safetySettings";

const defaultSafetySettings: SafetySettings = {
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

const loadSafetySettings = (): SafetySettings => {
  if (typeof window === "undefined") return defaultSafetySettings;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) return defaultSafetySettings;

    return {
      ...defaultSafetySettings,
      ...JSON.parse(saved),
    };
  } catch {
    return defaultSafetySettings;
  }
};

const SafeLearningFilterPanel = () => {
  const [settings, setSettings] = useState<SafetySettings>(loadSafetySettings);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = (key: SafetySettingKey) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
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