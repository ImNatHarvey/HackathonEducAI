import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, DragEvent, FormEvent } from "react";
import type { SourceType, SourceUploadPayload } from "./dashboardTypes";
import { useToast } from "../toast/ToastProvider";
import { InlineErrorState } from "../states/ErrorState";
import { LoadingOverlay } from "../states/LoadingState";

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

const acceptedFileTypes =
  ".pdf,.doc,.docx,.txt,.md,.png,.jpg,.jpeg,.webp,.mp3,.wav,.m4a";

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

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
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

const getSourceIcon = (sourceType: SourceType) => {
  if (sourceType === "youtube") return "▶️";
  if (sourceType === "pdf") return "📄";
  if (sourceType === "image") return "🖼️";
  if (sourceType === "website") return "🌐";
  return "📋";
};

const AddSourceModal = ({
  isOpen,
  isUploading,
  uploadError,
  onClose,
  onSubmit,
  onSubmitMany,
}: AddSourceModalProps) => {
  const { showToast } = useToast();

  const [inputMode, setInputMode] = useState<InputMode>("auto");
  const [value, setValue] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const resetForm = () => {
    setInputMode("auto");
    setValue("");
    setFiles([]);
    setIsDragging(false);
  };

  useEffect(() => {
    if (isOpen && !isUploading) {
      resetForm();
    }
  }, [isOpen, isUploading]);

  useEffect(() => {
    if (!uploadError || isUploading || !isOpen) return;

    showToast({
      type: "error",
      title: "Source upload warning",
      message: uploadError,
      duration: 6500,
    });
  }, [isOpen, isUploading, showToast, uploadError]);

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

  const handleClose = () => {
    if (isUploading) return;

    resetForm();
    onClose();
  };

  const addFiles = (nextFiles: File[]) => {
    if (isUploading || nextFiles.length === 0) return;

    let addedCount = 0;
    let duplicateCount = 0;

    setFiles((currentFiles) => {
      const existingKeys = new Set(
        currentFiles.map(
          (file) => `${file.name}-${file.size}-${file.lastModified}`,
        ),
      );

      const uniqueNewFiles = nextFiles.filter((file) => {
        const key = `${file.name}-${file.size}-${file.lastModified}`;
        const isDuplicate = existingKeys.has(key);

        if (isDuplicate) duplicateCount += 1;
        return !isDuplicate;
      });

      addedCount = uniqueNewFiles.length;

      return [...currentFiles, ...uniqueNewFiles];
    });

    setValue("");

    if (addedCount > 0) {
      showToast({
        type: "success",
        title: "Files selected",
        message: `${addedCount} file${addedCount === 1 ? "" : "s"} ready to add.`,
        duration: 2800,
      });
    }

    if (duplicateCount > 0) {
      showToast({
        type: "warning",
        title: "Duplicate files skipped",
        message: `${duplicateCount} duplicate file${
          duplicateCount === 1 ? "" : "s"
        } already selected.`,
        duration: 4200,
      });
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  const handleRemoveFile = (fileToRemove: File) => {
    if (isUploading) return;

    setFiles((currentFiles) =>
      currentFiles.filter(
        (file) =>
          !(
            file.name === fileToRemove.name &&
            file.size === fileToRemove.size &&
            file.lastModified === fileToRemove.lastModified
          ),
      ),
    );

    showToast({
      type: "info",
      title: "File removed",
      message: `${fileToRemove.name} was removed from the upload list.`,
      duration: 2800,
    });
  };

  const handleClearFiles = () => {
    if (isUploading) return;

    setFiles([]);

    showToast({
      type: "info",
      title: "Files cleared",
      message: "All selected files were removed.",
      duration: 2800,
    });
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();

    addFiles(Array.from(event.dataTransfer.files ?? []));
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

    showToast({
      type: "info",
      title: "Copied text mode",
      message: "Paste notes, reviewers, or definitions as a text source.",
      duration: 2400,
    });
  };

  const handleUseLinks = () => {
    if (isUploading) return;

    setInputMode("auto");
    setFiles([]);

    showToast({
      type: "info",
      title: "Link mode",
      message: "Paste a website, YouTube, PDF, or image link.",
      duration: 2400,
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isUploading) return;

    if (validationMessage) {
      showToast({
        type: "warning",
        title: "Source required",
        message: validationMessage,
      });
      return;
    }

    if (files.length > 0) {
      const payloads: SourceUploadPayload[] = files.map((file) => ({
        sourceType: getFileSourceType(file),
        title: file.name.replace(/\.[^.]+$/, ""),
        value: file.name,
        file,
        status: "pending",
        statusMessage: "Waiting to upload...",
        fileName: file.name,
        fileType: file.type || "unknown",
        fileSize: file.size,
      }));

      showToast({
        type: "info",
        title: "Adding files",
        message: `${payloads.length} file${
          payloads.length === 1 ? "" : "s"
        } sent to Study Aura.`,
        duration: 2600,
      });

      onSubmitMany(payloads);
      return;
    }

    const trimmedValue = value.trim();
    const sourceType = inferredSourceType;
    const isTextSource = sourceType === "text";
    const isUrlSource = sourceType !== "text";

    showToast({
      type: "info",
      title: isTextSource ? "Adding text source" : "Reading source link",
      message: isTextSource
        ? "Your copied text is being added as context."
        : "Study Aura is preparing this link as a source.",
      duration: 2600,
    });

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
        : "Waiting to read source...",
      parserProvider: isTextSource ? "manual-input" : undefined,
    });
  };

  if (!isOpen) return null;

  const hasFiles = files.length > 0;
  const currentSourceIcon = hasFiles ? "⬆️" : getSourceIcon(inferredSourceType);
  const currentSourceLabel = hasFiles
    ? `${files.length} file${files.length > 1 ? "s" : ""}`
    : getSourceBadgeLabel(inferredSourceType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-aura-bg/80 px-3 py-3 backdrop-blur-xl">
      <div className="relative flex max-h-[94vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-[2rem] border border-aura-border bg-aura-panel shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
        {isUploading && (
          <LoadingOverlay
            label="Reading source"
            title="Adding source..."
            description="Study Aura is uploading and preparing your source as module context. This may take a moment for PDFs, images, or videos."
          />
        )}

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
                    disabled={isUploading}
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
                      inputMode === "auto" && !hasFiles
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
                      inputMode === "text" && !hasFiles
                        ? "border-aura-cyan/60 bg-aura-cyan/10 text-aura-cyan"
                        : "border-aura-border bg-aura-bg-soft text-aura-muted hover:border-aura-cyan/45 hover:text-aura-text"
                    } disabled:opacity-60`}
                  >
                    📋 Copied text
                  </button>

                  <span className="inline-flex items-center gap-2 rounded-full border border-aura-border bg-aura-bg-soft px-3 py-2 text-xs font-black text-aura-muted">
                    {currentSourceIcon} Detected: {currentSourceLabel}
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
                  accept={acceptedFileTypes}
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                />

                <div
                  className={`flex flex-col items-center justify-center text-center ${
                    hasFiles ? "min-h-[140px]" : "min-h-[210px]"
                  }`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-aura-cyan/10 text-3xl">
                    ⬆️
                  </div>

                  <h3 className="mt-4 text-xl font-black text-aura-text">
                    {hasFiles ? "Files ready to add" : "Drop your files here"}
                  </h3>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-aura-muted">
                    Upload PDFs, images, documents, audio, or click this area to
                    choose files.
                  </p>

                  {!hasFiles && (
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
                  )}
                </div>
              </label>

              {hasFiles && (
                <div className="mt-4 rounded-[1.4rem] border border-aura-border bg-aura-panel p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-black text-aura-text">
                        Selected sources
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-aura-muted">
                        Review your files before adding them to this module.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleClearFiles}
                      disabled={isUploading}
                      className="rounded-full border border-aura-border bg-aura-bg-soft px-3 py-2 text-xs font-black text-aura-muted transition hover:border-red-300/50 hover:text-red-200 disabled:opacity-50"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="grid max-h-[150px] gap-2 overflow-y-auto pr-1 aura-scrollbar md:grid-cols-2">
                    {files.map((file) => {
                      const sourceType = getFileSourceType(file);

                      return (
                        <div
                          key={`${file.name}-${file.size}-${file.lastModified}`}
                          className="flex items-center gap-3 rounded-2xl border border-aura-border bg-aura-bg-soft px-3 py-3"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-aura-cyan/10 text-lg">
                            {getSourceIcon(sourceType)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-black text-aura-text">
                              {file.name}
                            </p>
                            <p className="mt-0.5 text-xs font-semibold text-aura-muted">
                              {getSourceBadgeLabel(sourceType)} •{" "}
                              {formatFileSize(file.size)}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveFile(file)}
                            disabled={isUploading}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-aura-border bg-aura-panel text-xs font-black text-aura-muted transition hover:border-red-300/50 hover:text-red-200 disabled:opacity-50"
                            aria-label={`Remove ${file.name}`}
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {(validationMessage || uploadError) && !isUploading && (
              <InlineErrorState
                title={uploadError ? "Source warning" : "Missing source"}
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
                disabled={isUploading}
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