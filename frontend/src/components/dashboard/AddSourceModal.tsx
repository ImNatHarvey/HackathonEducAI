import { useState } from "react";
import type { SourceType } from "./dashboardTypes";

type AddSourceModalProps = {
  isOpen: boolean;
  isUploading: boolean;
  uploadError: string;
  onClose: () => void;
  onSubmit: (payload: {
    sourceType: SourceType;
    value: string;
    title: string;
  }) => void;
};

const sourceOptions: {
  label: string;
  value: SourceType;
  icon: string;
  description: string;
  placeholder: string;
}[] = [
  {
    label: "Text Notes",
    value: "text",
    icon: "📝",
    description: "Paste notes, reviewers, or lesson content.",
    placeholder: "Paste your study notes here...",
  },
  {
    label: "YouTube Link",
    value: "youtube",
    icon: "▶️",
    description: "Paste a YouTube lesson link.",
    placeholder: "https://www.youtube.com/watch?v=...",
  },
  {
    label: "PDF",
    value: "pdf",
    icon: "📄",
    description: "Add a PDF source placeholder for parsing later.",
    placeholder: "Enter PDF filename or description for now...",
  },
  {
    label: "Image",
    value: "image",
    icon: "🖼️",
    description: "Add an image source placeholder for OCR later.",
    placeholder: "Enter image filename or description for now...",
  },
];

const AddSourceModal = ({
  isOpen,
  isUploading,
  uploadError,
  onClose,
  onSubmit,
}: AddSourceModalProps) => {
  const [sourceType, setSourceType] = useState<SourceType>("text");
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");

  if (!isOpen) return null;

  const selectedSource = sourceOptions.find(
    (option) => option.value === sourceType,
  );

  const handleSubmit = () => {
    const trimmedValue = value.trim();
    const trimmedTitle = title.trim();

    if (!trimmedValue || isUploading) return;

    onSubmit({
      sourceType,
      value: trimmedValue,
      title:
        trimmedTitle ||
        `${selectedSource?.label ?? "Study"} Source ${new Date().toLocaleTimeString()}`,
    });
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div className="aura-scrollbar max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[2rem] border border-aura-border bg-aura-panel shadow-[0_30px_90px_rgba(0,0,0,0.55)]">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-aura-border bg-aura-panel/95 px-6 py-5 backdrop-blur">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
              Source Ingestion
            </p>
            <h2 className="mt-1 text-2xl font-black text-aura-text">
              Add Sources
            </h2>
            <p className="mt-1 text-sm leading-6 text-aura-muted">
              Add notes, links, PDFs, or images. Study Aura will send the source
              to n8n and create a generated module entry.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-2 text-sm font-black text-aura-muted transition hover:border-aura-pink/60 hover:text-aura-pink disabled:opacity-50"
          >
            Close
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
              Source Type
            </p>

            <div className="grid gap-3 md:grid-cols-2">
              {sourceOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSourceType(option.value)}
                  disabled={isUploading}
                  className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 disabled:opacity-50 ${
                    sourceType === option.value
                      ? "border-aura-cyan/70 bg-aura-cyan/10 text-aura-cyan shadow-[0_0_24px_rgba(34,211,238,0.12)]"
                      : "border-aura-border bg-aura-bg-soft text-aura-muted hover:border-aura-cyan/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-aura-panel text-xl">
                      {option.icon}
                    </span>

                    <div>
                      <p className="font-black">{option.label}</p>
                      <p className="mt-1 text-sm leading-6 text-aura-muted">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
              Module Title
            </label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={isUploading}
              placeholder="Example: Photosynthesis Reviewer"
              className="w-full rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-3 text-sm text-aura-text outline-none transition placeholder:text-aura-dim focus:border-aura-cyan/70 disabled:opacity-60"
            />
          </div>

          <div>
            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
              Source Content
            </label>

            <textarea
              value={value}
              onChange={(event) => setValue(event.target.value)}
              disabled={isUploading}
              rows={8}
              placeholder={selectedSource?.placeholder}
              className="aura-scrollbar w-full resize-none rounded-2xl border border-aura-border bg-aura-bg-soft px-4 py-3 text-sm leading-6 text-aura-text outline-none transition placeholder:text-aura-dim focus:border-aura-cyan/70 disabled:opacity-60"
            />
          </div>

          {uploadError && (
            <div className="rounded-2xl border border-aura-pink/40 bg-aura-pink/10 p-4 text-sm leading-6 text-aura-pink">
              {uploadError}
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isUploading || !value.trim()}
            className="w-full rounded-2xl bg-gradient-to-r from-aura-primary to-aura-cyan py-3 font-black text-white transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isUploading ? "Sending source to n8n..." : "Add Source"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSourceModal;