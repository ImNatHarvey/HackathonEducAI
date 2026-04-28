import { useMemo, useState } from "react";
import type { ChangeEvent, DragEvent, FormEvent } from "react";
import type { SourceType, SourceUploadPayload } from "./dashboardTypes";
import { GeneratingState } from "../states/LoadingState";
import { InlineErrorState } from "../states/ErrorState";

type AddSourceModalProps = {
  isOpen: boolean;
  isUploading: boolean;
  uploadError: string;
  moduleId?: string;
  onClose: () => void;
  onSubmit: (payload: SourceUploadPayload) => void;
  onSubmitMany: (payloads: SourceUploadPayload[]) => void;
};

type InputMode = "auto" | "text";

const isLikelyUrl = (value: string) => {
  return /^https?:\/\/\S+\.\S+/i.test(value.trim());
};

const isLikelyYouTubeUrl = (value: string) => {
  return /(youtube\.com|youtu\.be)/i.test(value.trim());
};

const isLikelyPdfUrl = (value: string) => {
  return /\.pdf($|[?#])/i.test(value.trim());
};

const isLikelyImageUrl = (value: string) => {
  return /\.(png|jpe?g|webp|gif|bmp|svg)($|[?#])/i.test(value.trim());
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

const inferSourceType = (value: string, inputMode: InputMode): SourceType => {
  const trimmedValue = value.trim();

  if (inputMode === "text" || !isLikelyUrl(trimmedValue)) {
    return "text";
  }

  if (isLikelyYouTubeUrl(trimmedValue)) return "youtube";
  if (isLikelyPdfUrl(trimmedValue)) return "pdf";
  if (isLikelyImageUrl(trimmedValue)) return "image";

  return "website";
};

const inferTitle = ({
  value,
  files,
  inputMode,
}: {
  value: string;
  files: File[];
  inputMode: InputMode;
}) => {
  if (files.length > 0) {
    if (files.length === 1) {
      return files[0].name.replace(/\.[^.]+$/, "");
    }

    return `${files.length} uploaded sources`;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return inputMode === "text" ? "Copied text source" : "New source";
  }

  if (isLikelyUrl(trimmedValue)) {
    const host = getHostFromUrl(trimmedValue);
    const cleaned = cleanTitleText(trimmedValue);

    if (isLikelyYouTubeUrl(trimmedValue)) return "YouTube video";
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

const getSourceBadgeLabel = (sourceType: SourceType) => {
  if (sourceType === "youtube") return "YouTube";
  if (sourceType === "pdf") return "PDF";
  if (sourceType === "image") return "Image";
  if (sourceType === "website") return "Web";
  return "Text";
};

const AddSourceModal = ({
  isOpen,
  isUploading,
  uploadError,
  onClose,
  onSubmit,
  onSubmitMany,
}: AddSourceModalProps) => {
  const [inputMode, setInputMode] = useState<InputMode>("auto");
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const inferredSourceType = useMemo(() => {
    return inferSourceType(value, inputMode);
  }, [value, inputMode]);

  const generatedTitle = useMemo(() => {
    return inferTitle({
      value,
      files,
      inputMode,
    });
  }, [value, files, inputMode]);

  const validationMessage = useMemo(() => {
    const trimmedValue = value.trim();

    if (files.length > 0) return "";

    if (!trimmedValue) {
      return "Add a file, paste a link, or paste copied text.";
    }

    if (
      inputMode === "auto" &&
      trimmedValue.includes("http") &&
      !isLikelyUrl(trimmedValue)
    ) {
      return "Please use a valid link that starts with http:// or https://.";
    }

    return "";
  }, [value, files.length, inputMode]);

  const resetForm = () => {
    setInputMode("auto");
    setValue("");
    setFiles([]);
    setIsDragging(false);
  };

  const handleClose = () => {
    if (isUploading) return;

    resetForm();
    onClose();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);

    setFiles(selectedFiles);
    setValue("");
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const droppedFiles = Array.from(event.dataTransfer.files ?? []);

    setFiles(droppedFiles);
    setValue("");
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

  const handleUseCopiedText = () => {
    if (isUploading) return;

    setInputMode("text");
    setFiles([]);
  };

  const handleUseLinks = () => {
    if (isUploading) return;

    setInputMode("auto");
    setFiles([]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validationMessage || isUploading) return;

    if (files.length > 0) {
      const payloads: SourceUploadPayload[] = files.map((file) => ({
        sourceType: getFileSourceType(file),
        title: file.name.replace(/\.[^.]+$/, ""),
        value: file.name,
        file,
        status: "pending",
        statusMessage: "Uploading file...",
        fileName: file.name,
        fileType: file.type || "unknown",
        fileSize: file.size,
      }));

      onSubmitMany(payloads);
      resetForm();
      return;
    }

    const trimmedValue = value.trim();
    const sourceType = inferredSourceType;
    const isTextSource = sourceType === "text";
    const isUrlSource = sourceType !== "text";

    onSubmit({
      sourceType,
      title: generatedTitle,
      value: trimmedValue,
      originalUrl: isUrlSource ? trimmedValue : undefined,
      extractedText: isTextSource ? trimmedValue : undefined,
      summary: isTextSource ? trimmedValue.slice(0, 180) : undefined,
      status: isTextSource ? "ready" : "pending",
      statusMessage: isTextSource
        ? "Copied text is ready to use as context."
        : "Reading source...",
      parserProvider: isTextSource ? "manual-input" : undefined,
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
              Upload files, paste links, or add copied text. Study Aura will use
              them as context for chat and study tools.
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

        <div className="min-h-0 flex-1 px-6 py-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-[1.7rem] border border-aura-border bg-aura-bg-soft p-4">
              <div className="rounded-[1.5rem] border border-aura-cyan/45 bg-aura-panel px-4 py-4 shadow-[0_0_40px_rgba(34,211,238,0.06)]">
                <div className="flex items-start gap-3">
                  <span className="mt-3 text-lg text-aura-muted">⌕</span>

                  <textarea
                    value={value}
                    onChange={(event) => {
                      setValue(event.target.value);
                      setFiles([]);
                    }}
                    disabled={isUploading}
                    placeholder={
                      inputMode === "text"
                        ? "Paste copied notes, reviewers, definitions, or raw study material..."
                        : "Paste a website, YouTube, PDF, or image link..."
                    }
                    rows={inputMode === "text" ? 4 : 2}
                    className="aura-scrollbar min-h-[58px] flex-1 resize-none bg-transparent py-2 text-sm font-semibold leading-6 text-aura-text outline-none placeholder:text-aura-dim disabled:opacity-60"
                  />

                  <button
                    type="submit"
                    disabled={Boolean(validationMessage) || isUploading}
                    className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-aura-bg-soft text-lg font-black text-aura-text transition hover:-translate-y-0.5 hover:border-aura-cyan/60 hover:text-aura-cyan disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Add source"
                  >
                    →
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleUseLinks}
                    disabled={isUploading}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-black transition ${
                      inputMode === "auto"
                        ? "border-aura-cyan/60 bg-aura-cyan/10 text-aura-cyan"
                        : "border-aura-border bg-aura-bg-soft text-aura-muted hover:border-aura-cyan/45 hover:text-aura-text"
                    } disabled:opacity-60`}
                  >
                    🌐 Links
                  </button>

                  <button
                    type="button"
                    onClick={handleUseCopiedText}
                    disabled={isUploading}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-black transition ${
                      inputMode === "text"
                        ? "border-aura-cyan/60 bg-aura-cyan/10 text-aura-cyan"
                        : "border-aura-border bg-aura-bg-soft text-aura-muted hover:border-aura-cyan/45 hover:text-aura-text"
                    } disabled:opacity-60`}
                  >
                    📋 Copied text
                  </button>

                  <span className="inline-flex items-center gap-2 rounded-full border border-aura-border bg-aura-bg-soft px-3 py-2 text-xs font-black text-aura-muted">
                    Detected: {getSourceBadgeLabel(inferredSourceType)}
                  </span>

                  <span className="min-w-0 flex-1 truncate text-right text-xs font-bold text-aura-dim">
                    {generatedTitle}
                  </span>
                </div>
              </div>

              <label
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`mt-4 block cursor-pointer rounded-[1.6rem] border border-dashed p-5 transition ${
                  isDragging
                    ? "border-aura-cyan bg-aura-cyan/10"
                    : "border-aura-border bg-aura-bg-soft/75 hover:border-aura-cyan/55"
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg,.webp,.mp3,.wav,.m4a"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                />

                <div className="flex min-h-[210px] flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-aura-cyan/10 text-3xl">
                    ⬆️
                  </div>

                  <h3 className="mt-4 text-xl font-black text-aura-text">
                    Drop your files here
                  </h3>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-aura-muted">
                    Upload PDFs, images, documents, audio, or click this area to
                    choose files.
                  </p>

                  <div className="mt-5 flex flex-wrap justify-center gap-2">
                    <span className="rounded-full border border-aura-border bg-aura-panel px-3 py-2 text-xs font-black text-aura-muted">
                      ⬆️ Upload files
                    </span>
                    <span className="rounded-full border border-aura-border bg-aura-panel px-3 py-2 text-xs font-black text-aura-muted">
                      🌐 Websites
                    </span>
                    <span className="rounded-full border border-aura-border bg-aura-panel px-3 py-2 text-xs font-black text-aura-muted">
                      ▶️ YouTube
                    </span>
                    <span className="rounded-full border border-aura-border bg-aura-panel px-3 py-2 text-xs font-black text-aura-muted">
                      🖼️ Images
                    </span>
                    <span className="rounded-full border border-aura-border bg-aura-panel px-3 py-2 text-xs font-black text-aura-muted">
                      📄 PDFs
                    </span>
                  </div>

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
            </div>

            {isUploading && (
              <GeneratingState
                title="Adding source..."
                description="Study Aura is saving your source and preparing it for module context."
                label="Reading source"
                compact
              />
            )}

            {(validationMessage || uploadError) && !isUploading && (
              <InlineErrorState
                title={uploadError ? "Upload failed" : "Missing source"}
                description={uploadError || validationMessage}
              />
            )}

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