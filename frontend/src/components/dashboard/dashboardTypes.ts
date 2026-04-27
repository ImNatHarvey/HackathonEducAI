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

export type SourceType = "text" | "youtube" | "website" | "pdf" | "image";

export type StudySource = {
  id: string;
  title: string;
  type: SourceType;
  value: string;
  selected: boolean;
  summary?: string;
  createdAt: string;
};

export type StudyModule = {
  id: string;
  title: string;
  subtitle: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  sources: StudySource[];
};

export type SourceUploadPayload = {
  sourceType: SourceType;
  value: string;
  title: string;
};

export type SelectedSourceContext = {
  sourceIds: string[];
  sourceTitles: string[];
  sourceSummaries: string[];
  combinedContext: string;
};

export type GeneratedLesson = StudyModule;