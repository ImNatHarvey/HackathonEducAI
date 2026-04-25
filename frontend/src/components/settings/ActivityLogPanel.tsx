import { useMemo, useState } from "react";

type ActivityType = "all" | "chat" | "quiz" | "flashcards" | "youtube" | "settings";

type ActivityItem = {
  id: number;
  action: string;
  detail: string;
  type: Exclude<ActivityType, "all">;
  date: string;
  time: string;
  icon: string;
};

const activityItems: ActivityItem[] = [
  {
    id: 1,
    action: "Asked Study Aura about Marine Biology 101",
    detail: "Prompt: Explain coral reef ecosystems in simple words.",
    type: "chat",
    date: "2026-04-25",
    time: "Just now",
    icon: "💬",
  },
  {
    id: 2,
    action: "Generated flashcards from current topic",
    detail: "Created 10 recall cards for Marine Biology 101.",
    type: "flashcards",
    date: "2026-04-25",
    time: "12 minutes ago",
    icon: "🃏",
  },
  {
    id: 3,
    action: "Opened YouTube learning space",
    detail: "Added a video as extra learning context.",
    type: "youtube",
    date: "2026-04-24",
    time: "Yesterday",
    icon: "▶️",
  },
  {
    id: 4,
    action: "Generated practice quiz",
    detail: "Created 5 multiple-choice questions.",
    type: "quiz",
    date: "2026-04-23",
    time: "2 days ago",
    icon: "⚡",
  },
  {
    id: 5,
    action: "Updated AI instruction preference",
    detail: "Changed Study Aura to explain with examples.",
    type: "settings",
    date: "2026-04-22",
    time: "3 days ago",
    icon: "🧠",
  },
];

const activityTypes: { label: string; value: ActivityType }[] = [
  { label: "All", value: "all" },
  { label: "Chat", value: "chat" },
  { label: "Quiz", value: "quiz" },
  { label: "Cards", value: "flashcards" },
  { label: "YouTube", value: "youtube" },
  { label: "Settings", value: "settings" },
];

const ActivityLogPanel = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ActivityType>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const filteredActivities = useMemo(() => {
    return activityItems.filter((item) => {
      const searchableText = `${item.action} ${item.detail} ${item.type}`.toLowerCase();
      const matchesSearch = searchableText.includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesFromDate = !fromDate || item.date >= fromDate;
      const matchesToDate = !toDate || item.date <= toDate;

      return matchesSearch && matchesType && matchesFromDate && matchesToDate;
    });
  }, [search, typeFilter, fromDate, toDate]);

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setFromDate("");
    setToDate("");
  };

  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-xl font-black text-aura-text">Activity Log</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-aura-muted">
              Search your chat prompts, generated quizzes, flashcards, YouTube context,
              and settings changes. Later, this will come from Supabase.
            </p>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="rounded-2xl border border-aura-border bg-aura-panel px-4 py-3 text-sm font-bold text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-cyan"
          >
            Clear Filters
          </button>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr]">
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
              Search activity
            </label>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search prompts, quiz, flashcards..."
              className="w-full rounded-2xl border border-aura-border bg-aura-panel px-4 py-3 text-sm text-aura-text outline-none placeholder:text-aura-dim focus:border-aura-cyan/70"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
              Type
            </label>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value as ActivityType)}
              className="w-full rounded-2xl border border-aura-border bg-aura-panel px-4 py-3 text-sm text-aura-text outline-none focus:border-aura-cyan/70"
            >
              {activityTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
              From
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              className="w-full rounded-2xl border border-aura-border bg-aura-panel px-4 py-3 text-sm text-aura-text outline-none focus:border-aura-cyan/70"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
              To
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
              className="w-full rounded-2xl border border-aura-border bg-aura-panel px-4 py-3 text-sm text-aura-text outline-none focus:border-aura-cyan/70"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-aura-border pt-4">
          <p className="text-sm font-bold text-aura-muted">
            Showing{" "}
            <span className="text-aura-cyan">{filteredActivities.length}</span>{" "}
            result{filteredActivities.length === 1 ? "" : "s"}
          </p>

          <p className="text-xs text-aura-dim">
            Date format: YYYY-MM-DD
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-4 rounded-2xl border border-aura-border bg-aura-panel p-4 transition hover:-translate-y-0.5 hover:border-aura-cyan/50"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-aura-cyan/10 text-xl">
                {item.icon}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <p className="font-black text-aura-text">{item.action}</p>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-aura-border bg-aura-bg-soft px-3 py-1 text-[10px] font-black uppercase tracking-wider text-aura-muted">
                      {item.type}
                    </span>
                    <span className="text-xs text-aura-dim">{item.date}</span>
                  </div>
                </div>

                <p className="mt-2 text-sm leading-6 text-aura-muted">
                  {item.detail}
                </p>

                <p className="mt-2 text-xs font-semibold text-aura-cyan">
                  {item.time}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-aura-border bg-aura-bg-soft p-8 text-center">
            <div className="text-4xl">🔎</div>
            <h4 className="mt-3 text-lg font-black text-aura-text">
              No activity found
            </h4>
            <p className="mt-2 text-sm text-aura-muted">
              Try changing the search keyword, type filter, or date range.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ActivityLogPanel;