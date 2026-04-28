import type { StudySource } from "./dashboardTypes";

type SourcePreviewModalProps = {
  source: StudySource | null;
  onClose: () => void;
  onToggleSource?: (sourceId: string) => void;
  onDeleteSource?: (sourceId: string) => void;
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

const statusLabels = {
  pending: "Pending",
  reading: "Reading",
  ready: "Ready",
  failed: "Failed",
  used: "Used as context",
};

const statusClasses = {
  pending: "border-aura-gold/30 bg-aura-gold/10 text-aura-gold",
  reading: "border-aura-cyan/30 bg-aura-cyan/10 text-aura-cyan",
  ready: "border-emerald-400/30 bg-emerald-500/10 text-emerald-200",
  failed: "border-red-400/30 bg-red-500/10 text-red-200",
  used: "border-violet-400/30 bg-violet-500/10 text-violet-200",
};

const formatFileSize = (size?: number) => {
  if (!size) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const SourcePreviewModal = ({
  source,
  onClose,
  onToggleSource,
  onDeleteSource,
}: SourcePreviewModalProps) => {
  if (!source) return null;

  const status = source.selected ? "used" : source.status ?? "ready";
  const previewText =
    source.extractedText ||
    source.summary ||
    source.statusMessage ||
    source.value ||
    "No extracted preview is available yet.";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-aura-bg/80 px-3 py-3 backdrop-blur-xl">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-aura-border bg-aura-panel shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-4 border-b border-aura-border px-6 py-5">
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-aura-cyan">
              Source Preview
            </p>

            <div className="mt-3 flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-aura-border bg-aura-bg-soft text-2xl">
                {sourceIcons[source.type]}
              </div>

              <div className="min-w-0">
                <h2 className="line-clamp-2 text-2xl font-black leading-8 text-aura-text">
                  {source.title}
                </h2>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-full border border-aura-border bg-aura-bg-soft px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-aura-muted">
                    {sourceLabels[source.type]}
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${statusClasses[status]}`}
                  >
                    {statusLabels[status]}
                  </span>

                  {source.parserProvider && (
                    <span className="rounded-full border border-aura-border bg-aura-bg-soft px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-aura-muted">
                      {source.parserProvider}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-aura-border bg-aura-bg-soft text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text"
            aria-label="Close source preview"
          >
            ✕
          </button>
        </div>

        <div className="aura-scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="grid gap-4 lg:grid-cols-[0.75fr_1.25fr]">
            <div className="space-y-4">
              <div className="rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-4">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-aura-cyan">
                  Details
                </p>

                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-aura-dim">
                      Type
                    </p>
                    <p className="mt-1 font-bold text-aura-text">
                      {sourceLabels[source.type]}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-aura-dim">
                      Created
                    </p>
                    <p className="mt-1 font-bold text-aura-text">
                      {new Date(source.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {source.fileName && (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-aura-dim">
                        File
                      </p>
                      <p className="mt-1 break-words font-bold text-aura-text">
                        {source.fileName}
                      </p>
                      {source.fileSize && (
                        <p className="mt-1 text-xs font-semibold text-aura-muted">
                          {formatFileSize(source.fileSize)}
                        </p>
                      )}
                    </div>
                  )}

                  {(source.originalUrl || source.value) && (
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-aura-dim">
                        Original Source
                      </p>
                      <p className="mt-1 break-words text-xs font-semibold leading-5 text-aura-muted">
                        {source.originalUrl || source.value}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {source.summary && (
                <div className="rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-aura-cyan">
                    Summary
                  </p>
                  <p className="mt-3 text-sm leading-6 text-aura-muted">
                    {source.summary}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {onToggleSource && (
                  <button
                    type="button"
                    onClick={() => onToggleSource(source.id)}
                    className="rounded-2xl border border-aura-cyan/40 bg-aura-cyan/10 px-4 py-3 text-sm font-black text-aura-cyan transition hover:border-aura-cyan/70"
                  >
                    {source.selected ? "Remove from Context" : "Use as Context"}
                  </button>
                )}

                {onDeleteSource && (
                  <button
                    type="button"
                    onClick={() => onDeleteSource(source.id)}
                    className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-black text-red-200 transition hover:border-red-300/60"
                  >
                    Delete Source
                  </button>
                )}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-aura-cyan">
                  Extracted Text
                </p>

                <span className="rounded-full border border-aura-border bg-aura-panel px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-aura-muted">
                  Preview
                </span>
              </div>

              <div className="aura-scrollbar mt-4 max-h-[56vh] overflow-y-auto rounded-2xl border border-aura-border bg-aura-panel p-4">
                <p className="whitespace-pre-wrap text-sm leading-7 text-aura-muted">
                  {previewText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourcePreviewModal;