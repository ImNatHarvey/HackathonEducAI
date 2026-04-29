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
        <p className="max-w-3xl text-sm leading-6 text-aura-muted">
          Manage safety controls for sensitive, harmful, or illegal topics.
          These controls help keep Study Aura appropriate for classroom and
          school-demo use.
        </p>

        <div className="mt-5 space-y-3">
          {safetyItems.map((item) => {
            const enabled = settings[item.key];

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => toggleSetting(item.key)}
                className="w-full rounded-2xl border border-aura-border bg-aura-panel p-5 text-left transition hover:-translate-y-0.5 hover:border-aura-cyan/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-black text-aura-text">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-aura-muted">
                      {item.description}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${
                      enabled
                        ? "border-aura-cyan/35 bg-aura-cyan/10 text-aura-cyan"
                        : "border-aura-border bg-aura-bg-soft text-aura-muted"
                    }`}
                  >
                    {enabled ? "Enabled" : "Disabled"}
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