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
  icon: string;
  color: string;
  description: string;
};

export type SourceType = "pdf" | "image" | "text" | "youtube";

export type StudySource = {
  id: string;
  title: string;
  type: SourceType;
  value: string;
  createdAt: string;
};

export type StudyModule = {
  id: string;
  title: string;
  subtitle: string;
  progress: number;
  sources: StudySource[];
};

export type SourceUploadPayload = {
  sourceType: SourceType;
  value: string;
  title: string;
};

export type GeneratedLesson = StudyModule;