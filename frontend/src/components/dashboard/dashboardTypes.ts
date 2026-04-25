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

export type GeneratedLesson = {
  title: string;
  subtitle: string;
  progress: number;
};