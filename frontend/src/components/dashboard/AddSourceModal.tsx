import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import WebSearchSourceImporter from "./WebSearchSourceImporter";
import type {
  SourceType,
  SourceUploadPayload,
} from "./dashboardTypes";

type AddSourceModalProps = {
  isOpen: boolean;
  isUploading: boolean;
  uploadError: string;
  moduleId?: string;
  onClose: () => void;
  onSubmit: (payload: SourceUploadPayload) => void;
  onSubmitMany: (payloads: SourceUploadPayload[]) => void;
};

type SourceOption = {
  type: SourceType;
  label: string;
  icon: string;
  description: string;
  placeholder: string;
  titlePlaceholder: string;
};

const sourceOptions: SourceOption[] = [
  {
    type: "text",
    label: "Text Note",
    icon: "📝",
    description: "Paste or write notes directly into this module.",
    placeholder:
      "Paste your lesson notes, reviewer, definitions, or any study material here...",
    titlePlaceholder: "Example: Biology reviewer notes",
  },
  {
    type: "youtube",
    label: "YouTube",
    icon: "▶️",
    description: "Add a YouTube lesson, lecture, or explainer video link.",
    placeholder: "https://www.youtube.com/watch?v=...",
    titlePlaceholder: "Example: Photosynthesis video lecture",
  },
  {
    type: "website",
    label: "Website",
    icon: "🌐",
    description: "Use a webpage or article as study context.",
    placeholder: "https://example.com/article",
    titlePlaceholder: "Example: Article about neural networks",
  },
  {
    type: "pdf",
    label: "PDF",
    icon: "📄",
    description: "Attach a PDF file or paste a PDF reference link.",
    placeholder: "Paste PDF link or file name for now...",
    titlePlaceholder: "Example: Chapter 3 Research PDF",
  },
  {
    type: "image",
    label: "Image",
    icon: "🖼️",
    description: "Attach diagrams, screenshots, or visual references.",
    placeholder: "Paste image link or image description for now...",
    titlePlaceholder: "Example: Cell diagram screenshot",
  },
];

const isLikelyUrl = (value: string) => {
  return /^https?:\/\/.+/i.test(value.trim());
};

const AddSourceModal = ({
  isOpen,
  isUploading,
  uploadError,
  moduleId,
  onClose,
  onSubmit,
  onSubmitMany,
}: AddSourceModalProps) => {
  const [sourceType, setSourceType] = useState<SourceType>("text");
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");

  const selectedOption = useMemo(() => {
    return sourceOptions.find((option) => option.type === sourceType)!;
  }, [sourceType]);

  const validationMessage = useMemo(() => {
    const trimmedTitle = title.trim();
    const trimmedValue = value.trim();

    if (!trimmedTitle) return "Please add a source title.";
    if (!trimmedValue) return "Please add source content or a source link.";

    if (
      (sourceType === "youtube" ||
        sourceType === "website" ||
        sourceType === "pdf" ||
        sourceType === "image") &&
      trimmedValue.startsWith("http") &&
      !isLikelyUrl(trimmedValue)
    ) {
      return "Please enter a valid link.";
    }

    return "";
  }, [sourceType, title, value]);

  const resetForm = () => {
    setSourceType("text");
    setTitle("");
    setValue("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validationMessage || isUploading) return;

    onSubmit({
      sourceType,
      title: title.trim(),
      value: value.trim(),
    });

    resetForm();
  };

  const handleClose = () => {
    if (isUploading) return;

    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-aura-bg/80 px-4 py-6 backdrop-blur-xl">
      <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-aura-border bg-aura-panel shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-4 border-b border-aura-border px-6 py-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-aura-cyan">
              Add Context
            </p>

            <h2 className="mt-2 text-2xl font-black text-aura-text">
              Add sources to this module
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-aura-muted">
              Sources are scoped only to the current module. Checked sources
              will be used as AI context for chat and study tools.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isUploading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-aura-border bg-aura-bg-soft text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text disabled:opacity-50"
            aria-label="Close add source modal"
          >
            ✕
          </button>
        </div>

        <div className="aura-scrollbar min-h-0 flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-3 md:grid-cols-5">
              {sourceOptions.map((option) => {
                const isActive = option.type === sourceType;

                return (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => setSourceType(option.type)}
                    disabled={isUploading}
                    className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                      isActive
                        ? "border-aura-cyan/70 bg-aura-cyan/10 shadow-[0_0_30px_rgba(34,211,238,0.1)]"
                        : "border-aura-border bg-aura-bg-soft hover:border-aura-cyan/40"
                    } disabled:opacity-60`}
                  >
                    <span className="text-2xl">{option.icon}</span>

                    <p className="mt-3 text-sm font-black text-aura-text">
                      {option.label}
                    </p>

                    <p className="mt-1 line-clamp-3 text-xs leading-5 text-aura-muted">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-5">
              <div className="mb-5 flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-aura-cyan/10 text-2xl">
                  {selectedOption.icon}
                </div>

                <div>
                  <h3 className="text-base font-black text-aura-text">
                    {selectedOption.label}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-aura-muted">
                    {selectedOption.description}
                  </p>
                </div>
              </div>

              <label className="block">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-aura-dim">
                  Source Title
                </span>

                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  disabled={isUploading}
                  placeholder={selectedOption.titlePlaceholder}
                  className="mt-2 w-full rounded-2xl border border-aura-border bg-aura-panel px-4 py-3 text-sm font-semibold text-aura-text outline-none transition placeholder:text-aura-dim focus:border-aura-cyan/70 disabled:opacity-60"
                />
              </label>

              <label className="mt-4 block">
                <span className="text-xs font-black uppercase tracking-[0.18em] text-aura-dim">
                  {sourceType === "text"
                    ? "Source Content"
                    : "Source Link / Reference"}
                </span>

                <textarea
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  disabled={isUploading}
                  placeholder={selectedOption.placeholder}
                  rows={sourceType === "text" ? 9 : 5}
                  className="mt-2 w-full resize-none rounded-2xl border border-aura-border bg-aura-panel px-4 py-3 text-sm font-medium leading-6 text-aura-text outline-none transition placeholder:text-aura-dim focus:border-aura-cyan/70 disabled:opacity-60"
                />
              </label>

              {(validationMessage || uploadError) && (
                <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
                  {uploadError || validationMessage}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={isUploading}
                className="rounded-2xl border border-aura-border bg-aura-bg-soft px-5 py-3 text-sm font-black text-aura-muted transition hover:border-aura-cyan/50 hover:text-aura-text disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={Boolean(validationMessage) || isUploading}
                className="rounded-2xl bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold px-5 py-3 text-sm font-black text-aura-bg transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(34,211,238,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploading ? "Adding Source..." : "Add to Current Module"}
              </button>
            </div>
          </form>

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-aura-border" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-aura-dim">
              Or
            </span>
            <div className="h-px flex-1 bg-aura-border" />
          </div>

          <WebSearchSourceImporter
            moduleId={moduleId}
            isImporting={isUploading}
            onImportSources={onSubmitMany}
          />
        </div>
      </div>
    </div>
  );
};

export default AddSourceModal;