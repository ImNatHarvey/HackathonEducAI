import { useEffect, useMemo, useState } from "react";
import {
  clearActivityLog,
  formatRelativeActivityTime,
  getActivityLog,
  subscribeToActivityLog,
  type ActivityLogItem,
  type ActivityType,
} from "../../lib/activityLog";

type ActivityFilter = "all" | ActivityType;

const activityTypes: { label: string; value: ActivityFilter }[] = [
  { label: "All", value: "all" },
  { label: "Chat", value: "chat" },
  { label: "Source", value: "source" },
  { label: "Web", value: "web" },
  { label: "Quiz", value: "quiz" },
  { label: "Cards", value: "flashcards" },
  { label: "Slides", value: "slides" },
  { label: "Tables", value: "tables" },
  { label: "Mind Map", value: "mindmap" },
  { label: "Audio", value: "audio" },
  { label: "XP", value: "xp" },
  { label: "Energy", value: "energy" },
  { label: "Output", value: "output" },
  { label: "Settings", value: "settings" },
];

const ActivityLogPanel = () => {
  const [activityItems, setActivityItems] = useState<ActivityLogItem[]>(() =>
    getActivityLog(),
  );
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ActivityFilter>("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const refreshActivity = () => {
      setActivityItems(getActivityLog());
    };

    return subscribeToActivityLog(refreshActivity);
  }, []);

  const filteredActivities = useMemo(() => {
    return activityItems.filter((item) => {
      const searchableText =
        `${item.action} ${item.detail} ${item.type} ${item.moduleTitle ?? ""}`.toLowerCase();

      const matchesSearch = searchableText.includes(search.toLowerCase());
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesFromDate = !fromDate || item.date >= fromDate;
      const matchesToDate = !toDate || item.date <= toDate;

      return matchesSearch && matchesType && matchesFromDate && matchesToDate;
    });
  }, [activityItems, search, typeFilter, fromDate, toDate]);

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setFromDate("");
    setToDate("");
  };

  const handleClearActivity = () => {
    clearActivityLog();
    clearFilters();
  };

  return (
    <section className="space-y-5">
      <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-3xl text-sm leading-6 text-aura-muted">
            Review real Study Aura actions from this browser, including prompts,
            source uploads, web imports, generated outputs, XP, and energy use.
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-2xl border border-aura-border bg-aura-panel px-4 py-3 text-sm font-bold text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-cyan"
            >
              Clear Filters
            </button>

            <button
              type="button"
              onClick={handleClearActivity}
              className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-200 transition hover:bg-red-500/20"
            >
              Clear Activity
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1.3fr_0.7fr_0.7fr_0.7fr]">
          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
              Search activity
            </label>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search prompts, sources, outputs..."
              className="w-full rounded-2xl border border-aura-border bg-aura-panel px-4 py-3 text-sm text-aura-text outline-none placeholder:text-aura-dim focus:border-aura-cyan/70"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
              Type
            </label>

            <select
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value as ActivityFilter)
              }
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
            Stored locally for demo speed
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

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-aura-border bg-aura-bg-soft px-3 py-1 text-[10px] font-black uppercase tracking-wider text-aura-muted">
                      {item.type}
                    </span>

                    <span className="text-xs text-aura-dim">{item.date}</span>
                  </div>
                </div>

                <p className="mt-2 text-sm leading-6 text-aura-muted">
                  {item.detail}
                </p>

                {item.moduleTitle && (
                  <p className="mt-2 text-xs font-bold text-aura-muted">
                    Module:{" "}
                    <span className="text-aura-text">{item.moduleTitle}</span>
                  </p>
                )}

                <p className="mt-2 text-xs font-semibold text-aura-cyan">
                  {formatRelativeActivityTime(item.createdAt)}
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
              Generate outputs, add sources, chat with Aura, or change filters.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ActivityLogPanel;