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
  text: "Text note",
  youtube: "YouTube",
  website: "Website",
  pdf: "PDF",
  image: "Image",
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
          className="w-full rounded-2xl bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold px-4 py-3 text-sm font-black text-aura-bg transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(34,211,238,0.22)] disabled:opacity-60"
        >
          {isUploadingSource ? "Adding source..." : "+ Add Sources"}
        </button>

        <div className="mt-4 rounded-2xl border border-dashed border-aura-border bg-aura-bg-soft/70 p-4 text-center transition hover:border-aura-cyan/70 hover:bg-aura-cyan/5">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-aura-cyan/10 text-xl">
            📥
          </div>

          <p className="mt-3 text-sm font-bold text-aura-text">
            Sources for this module
          </p>

          <p className="mt-1 text-xs leading-5 text-aura-muted">
            Add notes, YouTube links, websites, PDFs, or images as AI context.
          </p>
        </div>

        {isUploadingSource && (
          <div className="mt-4">
            <LoadingState
              title="Adding source..."
              description="Study Aura is preparing your material."
            />
          </div>
        )}

        {uploadError && (
          <div className="mt-4">
            <ErrorState
              title="Upload failed"
              description={uploadError}
              actionLabel="Try upload again"
              onRetry={onUpload}
            />
          </div>
        )}
      </div>

      <div className="shrink-0 border-b border-aura-border px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
              Context Sources
            </p>

            <p className="mt-1 max-w-[210px] truncate text-sm font-black text-aura-text">
              {moduleTitle}
            </p>
          </div>

          <div className="rounded-full border border-aura-cyan/30 bg-aura-cyan/10 px-3 py-1 text-[10px] font-black text-aura-cyan">
            {selectedSourceCount}/{sources.length} selected
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
            description="Add sources to give Study Aura context for chat, quizzes, flashcards, slides, mind maps, tables, and audio overviews."
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
                  <input
                    type="checkbox"
                    checked={source.selected}
                    onChange={() => onToggleSource(source.id)}
                    className="mt-1 h-4 w-4 shrink-0 accent-aura-cyan"
                    aria-label={`Use ${source.title} as AI context`}
                  />

                  <button
                    type="button"
                    onClick={() => onToggleSource(source.id)}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-aura-panel text-base"
                    aria-label={`Toggle ${source.title}`}
                  >
                    {sourceIcons[source.type]}
                  </button>

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
                      >
                        ✕
                      </button>
                    </div>

                    <span className="mt-2 inline-flex rounded-full border border-aura-border bg-aura-panel px-2 py-1 text-[9px] font-black uppercase tracking-wider text-aura-dim">
                      {sourceLabels[source.type]}
                    </span>

                    {source.summary && (
                      <p className="mt-2 line-clamp-3 text-xs leading-5 text-aura-muted">
                        {source.summary}
                      </p>
                    )}

                    <p className="mt-2 truncate text-[10px] font-semibold text-aura-dim">
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