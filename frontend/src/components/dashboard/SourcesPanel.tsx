import EmptyState from "../states/EmptyState";
import ErrorState from "../states/ErrorState";
import LoadingState from "../states/LoadingState";
import type { StudyModule, StudySource } from "./dashboardTypes";

type SourcesPanelProps = {
  search: string;
  onSearchChange: (value: string) => void;
  lessons: StudyModule[];
  sources: StudySource[];
  currentTopic: string;
  onNavigate: (topic: string) => void;
  isUploadingSource: boolean;
  uploadError: string;
  onUpload: () => void;
};

const sourceIcons: Record<StudySource["type"], string> = {
  text: "📝",
  youtube: "▶️",
  pdf: "📄",
  image: "🖼️",
};

const SourcesPanel = ({
  search,
  onSearchChange,
  lessons,
  sources,
  currentTopic,
  onNavigate,
  isUploadingSource,
  uploadError,
  onUpload,
}: SourcesPanelProps) => {
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
            Drag & drop sources
          </p>

          <p className="mt-1 text-xs leading-5 text-aura-muted">
            PDFs, images, notes, or YouTube links.
          </p>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
              Sources
            </p>

            <span className="text-[10px] font-black text-aura-cyan">
              {sources.length}
            </span>
          </div>

          {sources.length === 0 ? (
            <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-3 text-xs leading-5 text-aura-muted">
              No sources in <span className="font-black">{currentTopic}</span>{" "}
              yet. Add notes, links, PDFs, or images.
            </div>
          ) : (
            <div className="aura-scrollbar max-h-44 space-y-2 overflow-y-auto pr-1">
              {sources.map((source) => (
                <div
                  key={source.id}
                  className="rounded-2xl border border-aura-border bg-aura-bg-soft p-3"
                >
                  <div className="flex items-start gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-aura-panel text-sm">
                      {sourceIcons[source.type]}
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-xs font-black text-aura-text">
                        {source.title}
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-aura-dim">
                        {source.type}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

      <div className="shrink-0 border-b border-aura-border p-4">
        <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
          Study modules
        </label>

        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search modules..."
          className="w-full rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-3 text-sm text-aura-text outline-none transition placeholder:text-aura-dim focus:border-aura-cyan/70"
        />
      </div>

      <div className="aura-scrollbar min-h-0 flex-1 overflow-y-scroll p-4">
        {lessons.length === 0 ? (
          <EmptyState
            icon="📚"
            title="No modules yet"
            description="Add a source to create your first study module."
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-4">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => onNavigate(lesson.title)}
                className="group min-h-[140px] rounded-2xl border border-aura-border bg-aura-card p-3 text-left transition hover:-translate-y-1 hover:border-aura-cyan/60 hover:bg-aura-panel-2"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-aura-primary/15 px-2 py-1 text-[9px] font-black text-aura-primary-soft">
                    MODULE
                  </span>

                  <span className="text-[10px] font-black text-aura-gold">
                    {lesson.progress}%
                  </span>
                </div>

                <h3 className="line-clamp-2 text-[13px] font-black leading-5 text-aura-text">
                  {lesson.title}
                </h3>

                <p className="mt-2 line-clamp-2 text-[11px] leading-4 text-aura-muted">
                  {lesson.subtitle}
                </p>

                <p className="mt-2 text-[10px] font-bold text-aura-cyan">
                  {lesson.sources.length} source
                  {lesson.sources.length === 1 ? "" : "s"}
                </p>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-aura-bg">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-aura-primary to-aura-cyan"
                    style={{ width: `${lesson.progress}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default SourcesPanel;