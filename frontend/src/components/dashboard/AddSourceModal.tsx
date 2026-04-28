import { useMemo, useState } from "react";
import type { ChangeEvent, DragEvent, FormEvent } from "react";
import type { SourceType, SourceUploadPayload } from "./dashboardTypes";

type AddSourceModalProps = {
  isOpen: boolean;
  isUploading: boolean;
  uploadError: string;
  moduleId?: string;
  onClose: () => void;
  onSubmit: (payload: SourceUploadPayload) => void;
  onSubmitMany: (payloads: SourceUploadPayload[]) => void;
};

type SourceMode = "text" | "website" | "youtube" | "pdf" | "image" | "file";

type SourceOption = {
  mode: SourceMode;
  sourceType: SourceType;
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
  placeholder: string;
  accept?: string;
};

const sourceOptions: SourceOption[] = [
  {
    mode: "file",
    sourceType: "pdf",
    label: "Upload files",
    shortLabel: "Files",
    icon: "⬆️",
    description: "Upload PDFs, images, documents, or audio references.",
    placeholder: "Drop files here or choose files from your device.",
    accept: ".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg,.webp,.mp3,.wav,.m4a",
  },
  {
    mode: "website",
    sourceType: "website",
    label: "Websites",
    shortLabel: "Web",
    icon: "🌐",
    description: "Paste a webpage, article, or documentation link.",
    placeholder: "Paste a website URL, article link, or documentation link...",
  },
  {
    mode: "youtube",
    sourceType: "youtube",
    label: "YouTube",
    shortLabel: "Video",
    icon: "▶️",
    description: "Paste a YouTube lesson, lecture, or explainer video.",
    placeholder: "Paste a YouTube URL...",
  },
  {
    mode: "text",
    sourceType: "text",
    label: "Copied text",
    shortLabel: "Text",
    icon: "📋",
    description: "Paste copied notes, reviewers, definitions, or raw text.",
    placeholder:
      "Paste your copied text, notes, reviewer, definitions, or study material here...",
  },
  {
    mode: "pdf",
    sourceType: "pdf",
    label: "PDF link",
    shortLabel: "PDF",
    icon: "📄",
    description: "Paste a PDF link or reference a PDF source.",
    placeholder: "Paste a PDF URL or reference...",
  },
  {
    mode: "image",
    sourceType: "image",
    label: "Image link",
    shortLabel: "Image",
    icon: "🖼️",
    description: "Paste an image link or describe a diagram/screenshot.",
    placeholder: "Paste an image URL or describe the diagram/screenshot...",
  },
];

const isLikelyUrl = (value: string) => {
  return /^https?:\/\/\S+\.\S+/i.test(value.trim());
};

const isLikelyYouTubeUrl = (value: string) => {
  return /(youtube\.com|youtu\.be)/i.test(value.trim());
};

const getHostFromUrl = (value: string) => {
  try {
    return new URL(value.trim()).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

const cleanTitleText = (value: string) => {
  return value
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/[?#].*$/g, "")
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const inferTitle = ({
  mode,
  value,
  files,
}: {
  mode: SourceMode;
  value: string;
  files: File[];
}) => {
  if (files.length > 0) {
    if (files.length === 1) {
      return files[0].name.replace(/\.[^.]+$/, "");
    }

    return `${files.length} uploaded sources`;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    if (mode === "youtube") return "YouTube source";
    if (mode === "website") return "Website source";
    if (mode === "pdf") return "PDF source";
    if (mode === "image") return "Image source";
    return "Copied text source";
  }

  if (isLikelyUrl(trimmedValue)) {
    const host = getHostFromUrl(trimmedValue);
    const cleaned = cleanTitleText(trimmedValue);

    if (mode === "youtube") return "YouTube video";
    if (host) return host;
    return cleaned.slice(0, 70) || "Web source";
  }

  const firstLine = trimmedValue
    .split("\n")
    .map((line) => line.trim())
    .find(Boolean);

  return (firstLine || "Copied text source").slice(0, 70);
};

const getFileSourceType = (file: File): SourceType => {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  if (type.startsWith("image/")) return "image";
  if (name.endsWith(".pdf") || type.includes("pdf")) return "pdf";

  return "text";
};

const AddSourceModal = ({
  isOpen,
  isUploading,
  uploadError,
  onClose,
  onSubmit,
  onSubmitMany,
}: AddSourceModalProps) => {
  const [activeMode, setActiveMode] = useState<SourceMode>("text");
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const selectedOption = useMemo(() => {
    return (
      sourceOptions.find((option) => option.mode === activeMode) ??
      sourceOptions[0]
    );
  }, [activeMode]);

  const generatedTitle = useMemo(() => {
    return inferTitle({
      mode: activeMode,
      value,
      files,
    });
  }, [activeMode, value, files]);

  const validationMessage = useMemo(() => {
    const trimmedValue = value.trim();

    if (activeMode === "file") {
      if (files.length === 0) {
        return "Please choose at least one file or switch to another source type.";
      }

      return "";
    }

    if (!trimmedValue) {
      return "Please paste a link or text source.";
    }

    if (
      (activeMode === "website" ||
        activeMode === "youtube" ||
        activeMode === "pdf" ||
        activeMode === "image") &&
      !isLikelyUrl(trimmedValue)
    ) {
      return "Please paste a valid URL that starts with http:// or https://.";
    }

    if (activeMode === "youtube" && !isLikelyYouTubeUrl(trimmedValue)) {
      return "Please paste a valid YouTube link.";
    }

    return "";
  }, [activeMode, value, files.length]);

  const resetForm = () => {
    setActiveMode("text");
    setValue("");
    setFiles([]);
    setIsDragging(false);
  };

  const handleClose = () => {
    if (isUploading) return;

    resetForm();
    onClose();
  };

  const handleModeChange = (mode: SourceMode) => {
    if (isUploading) return;

    setActiveMode(mode);
    setValue("");
    setFiles([]);
    setIsDragging(false);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    setFiles(selectedFiles);
    setActiveMode("file");
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const droppedFiles = Array.from(event.dataTransfer.files ?? []);
    setFiles(droppedFiles);
    setActiveMode("file");
    setIsDragging(false);
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validationMessage || isUploading) return;

    if (activeMode === "file") {
      const payloads: SourceUploadPayload[] = files.map((file) => ({
        sourceType: getFileSourceType(file),
        title: file.name.replace(/\.[^.]+$/, ""),
        value: file.name,
        file,
        status: "pending",
        statusMessage: "Uploading file to storage...",
        fileName: file.name,
        fileType: file.type || "unknown",
        fileSize: file.size,
      }));

      onSubmitMany(payloads);
      resetForm();
      return;
    }

    const status = selectedOption.sourceType === "text" ? "ready" : "pending";

    const statusMessage =
      selectedOption.sourceType === "text"
        ? "Copied text is ready to use as context."
        : "Source reader pipeline will extract this source next.";

    const isUrlSource =
      selectedOption.sourceType === "website" ||
      selectedOption.sourceType === "youtube" ||
      selectedOption.sourceType === "pdf" ||
      selectedOption.sourceType === "image";

    onSubmit({
      sourceType: selectedOption.sourceType,
      title: generatedTitle,
      value: value.trim(),
      originalUrl: isUrlSource ? value.trim() : undefined,
      extractedText:
        selectedOption.sourceType === "text" ? value.trim() : undefined,
      summary:
        selectedOption.sourceType === "text"
          ? value.trim().slice(0, 180)
          : undefined,
      status,
      statusMessage,
      parserProvider:
        selectedOption.sourceType === "text" ? "manual-input" : undefined,
    });

    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-aura-bg/80 px-3 py-3 backdrop-blur-xl">
      <div className="flex max-h-[94vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-[2rem] border border-aura-border bg-aura-panel shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
        <div className="flex items-start justify-between gap-4 border-b border-aura-border px-6 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-aura-cyan">
              Add Context
            </p>

            <h2 className="mt-2 text-2xl font-black text-aura-text">
              Add sources to this module
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-aura-muted">
              Drop files, paste copied text, or add links. Study Aura will save
              them as module context for chat and study tools.
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

        <div className="aura-scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-4">
              <div className="flex flex-wrap gap-2">
                {sourceOptions.map((option) => {
                  const isActive = option.mode === activeMode;

                  return (
                    <button
                      key={option.mode}
                      type="button"
                      onClick={() => handleModeChange(option.mode)}
                      disabled={isUploading}
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-black transition hover:-translate-y-0.5 ${
                        isActive
                          ? "border-aura-cyan/70 bg-aura-cyan/10 text-aura-cyan shadow-[0_0_24px_rgba(34,211,238,0.1)]"
                          : "border-aura-border bg-aura-panel text-aura-muted hover:border-aura-cyan/45 hover:text-aura-text"
                      } disabled:opacity-60`}
                    >
                      <span>{option.icon}</span>
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <label
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`block cursor-pointer rounded-[1.6rem] border border-dashed p-6 transition ${
                isDragging
                  ? "border-aura-cyan bg-aura-cyan/10"
                  : "border-aura-border bg-aura-bg-soft/75 hover:border-aura-cyan/55"
              }`}
            >
              <input
                type="file"
                multiple
                accept={sourceOptions[0].accept}
                onChange={handleFileChange}
                disabled={isUploading}
                className="hidden"
              />

              <div className="flex min-h-[210px] flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-aura-cyan/10 text-3xl">
                  {activeMode === "file" ? "⬆️" : selectedOption.icon}
                </div>

                <h3 className="mt-4 text-xl font-black text-aura-text">
                  Drop your files here
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-aura-muted">
                  Upload PDFs, images, docs, audio, or click this area to choose
                  files. For links and copied text, use the input box below.
                </p>

                {files.length > 0 && (
                  <div className="mt-4 flex max-w-2xl flex-wrap justify-center gap-2">
                    {files.map((file) => (
                      <span
                        key={`${file.name}-${file.size}`}
                        className="rounded-full border border-aura-cyan/30 bg-aura-cyan/10 px-3 py-1 text-xs font-bold text-aura-cyan"
                      >
                        {file.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </label>

            <div className="rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-5">
              <div className="flex items-start gap-3">
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

              <textarea
                value={value}
                onChange={(event) => setValue(event.target.value)}
                disabled={isUploading || activeMode === "file"}
                placeholder={selectedOption.placeholder}
                rows={activeMode === "text" ? 8 : 4}
                className="aura-scrollbar mt-4 w-full resize-none rounded-2xl border border-aura-border bg-aura-panel px-4 py-3 text-sm font-medium leading-6 text-aura-text outline-none transition placeholder:text-aura-dim focus:border-aura-cyan/70 disabled:opacity-60"
              />

              <div className="mt-3 rounded-2xl border border-aura-border bg-aura-panel px-4 py-3">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-aura-dim">
                  Auto-generated source title
                </p>

                <p className="mt-1 line-clamp-1 text-sm font-black text-aura-text">
                  {generatedTitle}
                </p>
              </div>

              {(validationMessage || uploadError) && (
                <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200">
                  {uploadError || validationMessage}
                </div>
              )}

              <div className="mt-4 rounded-2xl border border-aura-gold/25 bg-aura-gold/10 px-4 py-3 text-xs font-semibold leading-5 text-aura-gold">
                Parser pipeline coming next: Web links, YouTube transcripts,
                PDFs, and image sources will be processed through n8n fallback
                readers before being saved as clean context.
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={isUploading}
                className="rounded-2xl border border-aura-border bg-aura-bg-soft px-5 py-3 text-sm font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={Boolean(validationMessage) || isUploading}
                className="rounded-2xl bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold px-5 py-3 text-sm font-black text-aura-bg transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(34,211,238,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploading ? "Adding source..." : "Add to Sources"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSourceModal;
