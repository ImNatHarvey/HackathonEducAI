type SettingRowProps = {
  label: string;
  description: string;
  enabled?: boolean;
};

const SettingRow = ({ label, description, enabled = true }: SettingRowProps) => (
  <div className="flex items-center justify-between gap-5 rounded-2xl border border-aura-border bg-aura-panel p-4">
    <div>
      <p className="font-black text-aura-text">{label}</p>
      <p className="mt-1 text-sm leading-6 text-aura-muted">{description}</p>
    </div>

    <button
      type="button"
      className={`relative h-7 w-12 shrink-0 rounded-full border transition ${
        enabled
          ? "border-aura-cyan/50 bg-aura-cyan/25"
          : "border-aura-border bg-aura-bg-soft"
      }`}
      aria-label={label}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full transition ${
          enabled
            ? "left-6 bg-aura-cyan shadow-[0_0_18px_rgba(34,211,238,0.55)]"
            : "left-1 bg-aura-dim"
        }`}
      />
    </button>
  </div>
);

const PersonalPreferencePanel = () => {
  return (
    <section className="space-y-5">
      <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-6">
        <p className="max-w-3xl text-sm leading-6 text-aura-muted">
          Choose how Study Aura should communicate and guide your study
          sessions. These preferences will later be used as custom AI
          instructions for every module.
        </p>

        <div className="mt-5 space-y-3">
          <SettingRow
            label="Use beginner-friendly explanations"
            description="Makes dense documents easier to understand."
          />
          <SettingRow
            label="Include examples in every answer"
            description="Adds practical examples after explanations."
          />
          <SettingRow
            label="Ask follow-up questions"
            description="Encourages active learning after each answer."
          />
          <SettingRow
            label="Allow Taglish explanations"
            description="Useful when you want natural Filipino-English study explanations."
            enabled={false}
          />
        </div>
      </div>
    </section>
  );
};

export default PersonalPreferencePanel;