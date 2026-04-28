import { useEffect, useMemo, useState } from "react";
import type { StudySource } from "./dashboardTypes";

type SourcePreviewModalProps = {
  source: StudySource | null;
  onClose: () => void;
  onToggleSource?: (sourceId: string) => void;
  onDeleteSource?: (sourceId: string) => void;
};

type DisplaySourceStatus = NonNullable<StudySource["status"]> | "used";
type PreviewTab = "summary" | "original";

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

const statusLabels: Record<DisplaySourceStatus, string> = {
  pending: "Pending",
  reading: "Reading",
  ready: "Ready",
  failed: "Failed",
  used: "Used as context",
};

const statusClasses: Record<DisplaySourceStatus, string> = {
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

const normalizeText = (value?: string) => {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`{1,3}/g, "")
    .replace(/#+\s*/g, "")
    .replace(/\n{4,}/g, "\n\n")
    .trim();
};

const isUrlLike = (value?: string) => {
  return /^https?:\/\//i.test(String(value || "").trim());
};

const getOriginalSourceText = (source: StudySource) => {
  if (source.type === "text") {
    return normalizeText(source.value || source.extractedText || source.summary);
  }

  if (source.fileName) {
    return [
      `File name: ${source.fileName}`,
      source.fileType ? `File type: ${source.fileType}` : "",
      source.fileSize ? `File size: ${formatFileSize(source.fileSize)}` : "",
      source.originalUrl ? `Storage URL: ${source.originalUrl}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  return source.originalUrl || source.value || "No original source is available.";
};

const SourcePreviewModal = ({
  source,
  onClose,
  onToggleSource,
  onDeleteSource,
}: SourcePreviewModalProps) => {
  const [activeTab, setActiveTab] = useState<PreviewTab>("summary");

  useEffect(() => {
    setActiveTab("summary");
  }, [source?.id]);

  const sourceDebug = useMemo(() => {
    if (!source) return null;

    return {
      id: source.id,
      title: source.title,
      type: source.type,
      summaryLength: source.summary?.length ?? 0,
      extractedTextLength: source.extractedText?.length ?? 0,
      valueLength: source.value?.length ?? 0,
      hasOriginalUrl: Boolean(source.originalUrl),
    };
  }, [source]);

  useEffect(() => {
    if (sourceDebug) {
      console.log("[Study Aura] Source preview source:", sourceDebug);
    }
  }, [sourceDebug]);

  if (!source) return null;

  const displayStatus: DisplaySourceStatus = source.selected
    ? "used"
    : source.status ?? "ready";

  const valueAsText = !isUrlLike(source.value) ? normalizeText(source.value) : "";

  const summaryText =
    normalizeText(source.summary) ||
    normalizeText(source.extractedText) ||
    valueAsText ||
    normalizeText(source.statusMessage) ||
    "No summary is available yet. This source may still be processing or the reader did not return enough content.";

  const originalSourceText = getOriginalSourceText(source);
  const sourceUrl = source.originalUrl || source.value;

  const panelTitle = activeTab === "summary" ? "Summary" : "Original Source";
  const panelDescription =
    activeTab === "summary"
      ? "Clean study summary generated from this source."
      : "Raw source saved before Study Aura processed it.";
  const panelBadge = activeTab === "summary" ? "Study Context" : "Source";
  const panelContent = activeTab === "summary" ? summaryText : originalSourceText;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-aura-bg/80 px-3 py-3 backdrop-blur-xl">
      <div className="flex h-[90vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-[2rem] border border-aura-border bg-aura-panel shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-4 border-b border-aura-border px-7 py-5">
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
                    className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.1em] ${statusClasses[displayStatus]}`}
                  >
                    {statusLabels[displayStatus]}
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

        <div className="min-h-0 flex-1 px-7 py-5">
          <div
            className="grid h-full min-h-0 gap-5"
            style={{ gridTemplateColumns: "minmax(320px, 420px) minmax(0, 1fr)" }}
          >
            <aside className="flex min-h-0 flex-col gap-4">
              <div className="rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-5">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-aura-cyan">
                  Details
                </p>

                <div className="mt-4 space-y-4 text-sm">
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

                  {sourceUrl?.startsWith("http") && (
                    <a
                      href={sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-full border border-aura-cyan/30 bg-aura-cyan/10 px-3 py-1 text-xs font-bold text-aura-cyan transition hover:border-aura-cyan/60 hover:text-aura-text"
                    >
                      Open source ↗
                    </a>
                  )}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-3">
                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("summary")}
                    className={`rounded-2xl border px-4 py-3 text-sm font-black transition ${
                      activeTab === "summary"
                        ? "border-aura-cyan/60 bg-aura-cyan/10 text-aura-cyan"
                        : "border-aura-border bg-aura-panel text-aura-muted hover:border-aura-cyan/45 hover:text-aura-text"
                    }`}
                  >
                    Summary
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("original")}
                    className={`rounded-2xl border px-4 py-3 text-sm font-black transition ${
                      activeTab === "original"
                        ? "border-aura-cyan/60 bg-aura-cyan/10 text-aura-cyan"
                        : "border-aura-border bg-aura-panel text-aura-muted hover:border-aura-cyan/45 hover:text-aura-text"
                    }`}
                  >
                    Original Source
                  </button>
                </div>
              </div>

              <div className="mt-auto grid gap-2">
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
            </aside>

            <section className="flex min-h-0 flex-col rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-5">
              <div className="flex items-start justify-between gap-3 border-b border-aura-border pb-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-aura-cyan">
                    {panelTitle}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-aura-muted">
                    {panelDescription}
                  </p>
                </div>

                <span className="rounded-full border border-aura-border bg-aura-panel px-3 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-aura-muted">
                  {panelBadge}
                </span>
              </div>

              <div className="aura-scrollbar mt-4 min-h-0 flex-1 overflow-y-auto rounded-2xl border border-aura-border bg-aura-panel p-5">
                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-aura-muted">
                  {panelContent}
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourcePreviewModal;