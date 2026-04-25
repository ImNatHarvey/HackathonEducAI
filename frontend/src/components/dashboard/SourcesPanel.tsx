import EmptyState from "../states/EmptyState";
import ErrorState from "../states/ErrorState";
import LoadingState from "../states/LoadingState";
import type { GeneratedLesson } from "./dashboardTypes";

type SourcesPanelProps = {
  search: string;
  onSearchChange: (value: string) => void;
  lessons: GeneratedLesson[];
  onNavigate: (topic: string) => void;
  isUploadingSource: boolean;
  uploadError: string;
  onUpload: () => void;
};

const SourcesPanel = ({
  search,
  onSearchChange,
  lessons,
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
          {isUploadingSource ? "Uploading source..." : "+ Add Sources"}
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

        {isUploadingSource && (
          <div className="mt-4">
            <LoadingState
              title="Uploading source..."
              description="Study Aura is preparing your material for parsing."
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
          Generated modules
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
            title="No modules found"
            description="Try another keyword or add a new source to generate lessons."
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-4">
            {lessons.map((lesson) => (
              <button
                key={lesson.title}
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