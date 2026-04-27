import EmptyState from "../states/EmptyState";
import ErrorState from "../states/ErrorState";
import LoadingState from "../states/LoadingState";
import type { StudySource } from "./dashboardTypes";

type SourcesPanelProps = {
  moduleTitle: string;
  sources: StudySource[];
  selectedSourceCount: number;
  isUploadingSource: boolean;
  uploadError: string;
  onUpload: () => void;
  onToggleSource: (sourceId: string) => void;
  onSelectAllSources: () => void;
  onClearSelectedSources: () => void;
  onDeleteSource: (sourceId: string) => void;
};

const sourceIcons: Record<StudySource["type"], string> = {
  text: "📝",
  youtube: "▶️",
  website: "🌐",
  pdf: "📄",
  image: "🖼️",
};

const sourceLabels: Record<StudySource["type"], string> = {
  text: "Text Note",
  youtube: "YouTube",
  website: "Website",
  pdf: "PDF",
  image: "Image",
};

const sourceAccentClasses: Record<StudySource["type"], string> = {
  text: "bg-aura-cyan/10 text-aura-cyan border-aura-cyan/30",
  youtube: "bg-red-500/10 text-red-200 border-red-400/30",
  website: "bg-emerald-500/10 text-emerald-200 border-emerald-400/30",
  pdf: "bg-aura-gold/10 text-aura-gold border-aura-gold/30",
  image: "bg-fuchsia-500/10 text-fuchsia-200 border-fuchsia-400/30",
};

const SourcesPanel = ({
  moduleTitle,
  sources,
  selectedSourceCount,
  isUploadingSource,
  uploadError,
  onUpload,
  onToggleSource,
  onSelectAllSources,
  onClearSelectedSources,
  onDeleteSource,
}: SourcesPanelProps) => {
  const hasSources = sources.length > 0;
  const allSourcesSelected = hasSources && selectedSourceCount === sources.length;

  return (
    <aside className="flex min-h-0 min-w-0 flex-col border-r border-aura-border bg-aura-panel/95">
      <div className="shrink-0 border-b border-aura-border p-4">
        <button
          type="button"
          onClick={onUpload}
          disabled={isUploadingSource}
          className="w-full rounded-2xl bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold px-4 py-3 text-sm font-black text-aura-bg transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(34,211,238,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isUploadingSource ? "Adding source..." : "+ Add Sources"}
        </button>

        <div className="mt-4 rounded-2xl border border-aura-border bg-aura-bg-soft/80 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
            Current Module
          </p>

          <p className="mt-2 line-clamp-2 text-base font-black leading-5 text-aura-text">
            {moduleTitle}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-aura-border bg-aura-panel px-3 py-2">
              <p className="text-lg font-black text-aura-text">
                {sources.length}
              </p>
              <p className="text-[9px] font-black uppercase tracking-wider text-aura-dim">
                Total
              </p>
            </div>

            <div className="rounded-xl border border-aura-cyan/30 bg-aura-cyan/10 px-3 py-2">
              <p className="text-lg font-black text-aura-text">
                {selectedSourceCount}
              </p>
              <p className="text-[9px] font-black uppercase tracking-wider text-aura-cyan">
                Active
              </p>
            </div>
          </div>
        </div>

        {isUploadingSource && (
          <div className="mt-4">
            <LoadingState
              title="Adding source..."
              description="Preparing your source as module context."
            />
          </div>
        )}

        {uploadError && (
          <div className="mt-4">
            <ErrorState
              title="Upload failed"
              description={uploadError}
              actionLabel="Try again"
              onRetry={onUpload}
            />
          </div>
        )}
      </div>

      <div className="shrink-0 border-b border-aura-border px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-aura-cyan">
              Sources
            </p>
            <p className="mt-1 text-xs text-aura-muted">
              Check sources to include in AI context.
            </p>
          </div>

          <div className="rounded-full border border-aura-border bg-aura-bg-soft px-3 py-1 text-[10px] font-black text-aura-muted">
            {selectedSourceCount}/{sources.length}
          </div>
        </div>

        {hasSources && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onSelectAllSources}
              disabled={allSourcesSelected}
              className="rounded-xl border border-aura-border bg-aura-bg-soft px-3 py-2 text-[10px] font-black uppercase tracking-wider text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text disabled:cursor-not-allowed disabled:opacity-40"
            >
              Select All
            </button>

            <button
              type="button"
              onClick={onClearSelectedSources}
              disabled={selectedSourceCount === 0}
              className="rounded-xl border border-aura-border bg-aura-bg-soft px-3 py-2 text-[10px] font-black uppercase tracking-wider text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text disabled:cursor-not-allowed disabled:opacity-40"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      <div className="aura-scrollbar min-h-0 flex-1 overflow-y-auto p-4">
        {!hasSources ? (
          <EmptyState
            icon="📚"
            title="No sources yet"
            description="Add notes, links, PDFs, or images to give Aura context for this module."
          />
        ) : (
          <div className="space-y-3 pb-4">
            {sources.map((source) => (
              <div
                key={source.id}
                className={`group rounded-2xl border p-3 transition hover:-translate-y-0.5 ${
                  source.selected
                    ? "border-aura-cyan/60 bg-aura-cyan/10 shadow-[0_0_24px_rgba(34,211,238,0.08)]"
                    : "border-aura-border bg-aura-bg-soft hover:border-aura-cyan/40"
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => onToggleSource(source.id)}
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[10px] font-black transition ${
                      source.selected
                        ? "border-aura-cyan bg-aura-cyan text-aura-bg"
                        : "border-aura-border bg-aura-panel text-transparent hover:border-aura-cyan/70"
                    }`}
                    aria-label={`Toggle ${source.title}`}
                  >
                    ✓
                  </button>

                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border text-lg ${
                      sourceAccentClasses[source.type]
                    }`}
                  >
                    {sourceIcons[source.type]}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleSource(source.id)}
                        className="min-w-0 text-left"
                      >
                        <p className="line-clamp-2 text-sm font-black leading-5 text-aura-text">
                          {source.title}
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteSource(source.id)}
                        className="shrink-0 rounded-lg px-2 py-1 text-xs text-aura-dim opacity-0 transition hover:bg-red-500/10 hover:text-red-200 group-hover:opacity-100"
                        aria-label={`Delete ${source.title}`}
                        title="Delete source"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-wider ${
                          sourceAccentClasses[source.type]
                        }`}
                      >
                        {sourceLabels[source.type]}
                      </span>

                      <span
                        className={`inline-flex rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-wider ${
                          source.selected
                            ? "border-aura-cyan/30 bg-aura-cyan/10 text-aura-cyan"
                            : "border-aura-border bg-aura-panel text-aura-dim"
                        }`}
                      >
                        {source.selected ? "Using as context" : "Not active"}
                      </span>
                    </div>

                    {source.summary && (
                      <p className="mt-3 line-clamp-3 text-xs leading-5 text-aura-muted">
                        {source.summary}
                      </p>
                    )}

                    <p className="mt-3 truncate text-[10px] font-semibold text-aura-dim">
                      {source.type === "text" ? "Text content" : source.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default SourcesPanel;