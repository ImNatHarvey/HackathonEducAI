export type SourceType = "text" | "youtube" | "website" | "pdf" | "image";

export type SourceStatus = "pending" | "reading" | "ready" | "failed";

export type StudySource = {
  id: string;
  type: SourceType;
  title: string;
  value: string;
  selected: boolean;
  createdAt: string;

  summary?: string;
  extractedText?: string;
  originalUrl?: string;
  status?: SourceStatus;
  statusMessage?: string;
  parserProvider?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
};

export type SourceUploadPayload = {
  sourceType: SourceType;
  title: string;
  value: string;

  file?: File;

  summary?: string;
  extractedText?: string;
  originalUrl?: string;
  status?: SourceStatus;
  statusMessage?: string;
  parserProvider?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
};

export type StudyModule = {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  sources: StudySource[];
};

export type GeneratedLesson = StudyModule;

export type AIToolName =
  | "Audio"
  | "Slides"
  | "Mind Map"
  | "Cards"
  | "Tables"
  | "Quiz";

export type StudioTool = {
  name: AIToolName;
  label: string;
  description: string;
  icon: string;
  color: string;
};

export type SourceUploadMode = SourceType;

export type SourceUploadDraft = {
  sourceType: SourceType;
  title: string;
  value: string;
};