const activityItems = [
  {
    action: "Asked Study Aura about Marine Biology 101",
    time: "Just now",
    icon: "💬",
  },
  {
    action: "Generated flashcards from current topic",
    time: "12 minutes ago",
    icon: "🃏",
  },
  {
    action: "Opened YouTube learning space",
    time: "20 minutes ago",
    icon: "▶️",
  },
  {
    action: "Updated AI instruction preference",
    time: "Today",
    icon: "🧠",
  },
];

const ActivityLogPanel = () => {
  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-6">
        <h3 className="text-xl font-black text-aura-text">Activity Log</h3>
        <p className="mt-2 text-sm leading-6 text-aura-muted">
          This will later show saved user prompts and generated outputs from Supabase.
        </p>

        <div className="mt-5 space-y-3">
          {activityItems.map((item) => (
            <div
              key={item.action}
              className="flex items-center gap-4 rounded-2xl border border-aura-border bg-aura-panel p-4"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-aura-cyan/10 text-xl">
                {item.icon}
              </div>

              <div>
                <p className="font-black text-aura-text">{item.action}</p>
                <p className="mt-1 text-sm text-aura-muted">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActivityLogPanel;