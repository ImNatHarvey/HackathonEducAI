import { useMemo, useState } from "react";
import EmptyState from "../states/EmptyState";
import ErrorState from "../states/ErrorState";
import LoadingState from "../states/LoadingState";
import SourcePreviewModal from "./SourcePreviewModal";
import WebSearchSourceModal from "./WebSearchSourceModal";
import type {
  SourceStatus,
  SourceUploadPayload,
  StudySource,
} from "./dashboardTypes";

type SourcesPanelProps = {
  moduleTitle: string;
  moduleId?: string;
  sources: StudySource[];
  selectedSourceCount: number;
  isUploadingSource: boolean;
  uploadError: string;
  onUpload: () => void;
  onUploadWebSources: (payloads: SourceUploadPayload[]) => void;
  onToggleSource: (sourceId: string) => void;
  onSelectAllSources: () => void;
  onClearSelectedSources: () => void;
  onDeleteSource: (sourceId: string) => void;
};

type DisplaySourceStatus = SourceStatus | "used";

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

const sourceStatusLabels: Record<DisplaySourceStatus, string> = {
  pending: "Pending",
  reading: "Reading",
  ready: "Ready",
  failed: "Failed",
  used: "Used as context",
};

const sourceStatusClasses: Record<DisplaySourceStatus, string> = {
  pending: "border-aura-gold/30 bg-aura-gold/10 text-aura-gold",
  reading: "border-aura-cyan/30 bg-aura-cyan/10 text-aura-cyan",
  ready: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  failed: "border-red-400/30 bg-red-500/10 text-red-200",
  used: "border-violet-400/30 bg-violet-500/10 text-violet-200",
};

const SourcesPanel = ({
  moduleTitle,
  moduleId,
  sources,
  selectedSourceCount,
  isUploadingSource,
  uploadError,
  onUpload,
  onUploadWebSources,
  onToggleSource,
  onSelectAllSources,
  onClearSelectedSources,
  onDeleteSource,
}: SourcesPanelProps) => {
  const [webSearchValue, setWebSearchValue] = useState("");
  const [webSearchQuery, setWebSearchQuery] = useState("");
  const [isWebSearchOpen, setIsWebSearchOpen] = useState(false);
  const [previewSourceId, setPreviewSourceId] = useState<string | null>(null);

  const hasSources = sources.length > 0;
  const allSourcesSelected = hasSources && selectedSourceCount === sources.length;

  const previewSource = useMemo(() => {
    if (!previewSourceId) return null;
    return sources.find((source) => source.id === previewSourceId) ?? null;
  }, [previewSourceId, sources]);

  const handleWebSearchSubmit = () => {
    const query = webSearchValue.trim();

    if (!query) return;

    setWebSearchQuery(query);
    setIsWebSearchOpen(true);
  };

  return (
    <>
      <aside className="flex h-full min-h-0 min-w-0 flex-col border-r border-aura-border bg-aura-panel/95">
        <div className="shrink-0 border-b border-aura-border p-4">
          <button
            type="button"
            onClick={onUpload}
            disabled={isUploadingSource}
            className="w-full rounded-2xl bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold px-4 py-3 text-sm font-black text-aura-bg transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(34,211,238,0.22)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploadingSource ? "Adding source..." : "+ Add Sources"}
          </button>

          <div className="mt-3 rounded-2xl border border-aura-border bg-aura-bg-soft p-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-aura-muted">🔎</span>

              <input
                value={webSearchValue}
                onChange={(event) => setWebSearchValue(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleWebSearchSubmit();
                  }
                }}
                placeholder="Search web sources..."
                className="min-w-0 flex-1 bg-transparent text-xs font-semibold text-aura-text outline-none placeholder:text-aura-dim"
              />

              <button
                type="button"
                onClick={handleWebSearchSubmit}
                disabled={!webSearchValue.trim()}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-aura-border bg-aura-panel text-xs font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-cyan disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Search web sources"
                title="Search web sources"
              >
                →
              </button>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-full border border-aura-border bg-aura-panel px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-aura-muted">
                Web
              </span>

              <span className="rounded-full border border-aura-cyan/25 bg-aura-cyan/10 px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-aura-cyan">
                Fast Research
              </span>
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
                title="Upload warning"
                description={uploadError}
                actionLabel="Add another"
                onRetry={onUpload}
              />
            </div>
          )}
        </div>

        <div className="shrink-0 border-b border-aura-border px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-aura-cyan">
                Sources
              </p>

              <p className="mt-1 line-clamp-1 text-xs text-aura-muted">
                Context for{" "}
                <span className="font-bold text-aura-text">{moduleTitle}</span>
              </p>
            </div>

            <div className="shrink-0 rounded-full border border-aura-border bg-aura-bg-soft px-3 py-1 text-[10px] font-black text-aura-muted">
              {selectedSourceCount}/{sources.length}
            </div>
          </div>

          {hasSources && (
            <div className="mt-2 flex items-center gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={onSelectAllSources}
                disabled={allSourcesSelected}
                className="text-aura-cyan transition hover:text-aura-text disabled:cursor-not-allowed disabled:text-aura-dim disabled:opacity-50"
              >
                Select all
              </button>

              <span className="text-aura-dim">·</span>

              <button
                type="button"
                onClick={onClearSelectedSources}
                disabled={selectedSourceCount === 0}
                className="text-aura-cyan transition hover:text-aura-text disabled:cursor-not-allowed disabled:text-aura-dim disabled:opacity-50"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        <div className="aura-scrollbar min-h-0 flex-1 overflow-y-auto p-3">
          {!hasSources ? (
            <EmptyState
              icon="📚"
              title="No sources yet"
              description="Add notes, links, PDFs, or images to give Aura context for this module."
            />
          ) : (
            <div className="space-y-2 pb-6">
              {sources.map((source) => {
                const displayStatus: DisplaySourceStatus = source.selected
                  ? "used"
                  : source.status ?? "ready";

                return (
                  <div
                    key={source.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => setPreviewSourceId(source.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setPreviewSourceId(source.id);
                      }
                    }}
                    className={`group cursor-pointer rounded-xl border px-3 py-2.5 transition hover:-translate-y-0.5 ${
                      source.selected
                        ? "border-aura-cyan/55 bg-aura-cyan/10 shadow-[0_0_20px_rgba(34,211,238,0.07)]"
                        : "border-aura-border bg-aura-bg-soft/80 hover:border-aura-cyan/35"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onToggleSource(source.id);
                        }}
                        className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[9px] font-black transition ${
                          source.selected
                            ? "border-aura-cyan bg-aura-cyan text-aura-bg"
                            : "border-aura-border bg-aura-panel text-transparent hover:border-aura-cyan/70"
                        }`}
                        aria-label={`Toggle ${source.title}`}
                      >
                        ✓
                      </button>

                      <div
                        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs ${
                          sourceAccentClasses[source.type]
                        }`}
                      >
                        {sourceIcons[source.type]}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="line-clamp-2 min-w-0 flex-1 text-[13px] font-black leading-5 text-aura-text transition group-hover:text-aura-cyan">
                            {source.title}
                          </p>

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              onDeleteSource(source.id);
                            }}
                            className="shrink-0 rounded-lg px-1.5 py-0.5 text-xs text-aura-dim opacity-0 transition hover:bg-red-500/10 hover:text-red-200 group-hover:opacity-100"
                            aria-label={`Delete ${source.title}`}
                            title="Delete source"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                          <span
                            className={`inline-flex rounded-full border px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.08em] ${
                              sourceAccentClasses[source.type]
                            }`}
                          >
                            {sourceLabels[source.type]}
                          </span>

                          <span
                            className={`inline-flex rounded-full border px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[0.08em] ${
                              sourceStatusClasses[displayStatus]
                            }`}
                          >
                            {sourceStatusLabels[displayStatus]}
                          </span>
                        </div>

                        {source.summary && (
                          <p className="mt-1.5 line-clamp-2 text-[11px] leading-4 text-aura-muted">
                            {source.summary}
                          </p>
                        )}

                        {source.statusMessage && (
                          <p className="mt-1 line-clamp-1 text-[10px] font-semibold text-aura-dim">
                            {source.statusMessage}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      <WebSearchSourceModal
        isOpen={isWebSearchOpen}
        initialQuery={webSearchQuery}
        moduleId={moduleId}
        isImporting={isUploadingSource}
        onClose={() => setIsWebSearchOpen(false)}
        onImportSources={onUploadWebSources}
      />

      <SourcePreviewModal
        source={previewSource}
        onClose={() => setPreviewSourceId(null)}
        onToggleSource={onToggleSource}
        onDeleteSource={(sourceId) => {
          onDeleteSource(sourceId);
          setPreviewSourceId(null);
        }}
      />
    </>
  );
};

export default SourcesPanel;