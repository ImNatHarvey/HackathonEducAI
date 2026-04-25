export type SettingsPanel =
  | "home"
  | "profile"
  | "preferences"
  | "audio"
  | "safety"
  | "generation"
  | "activity";

export type SettingsCard = {
  id: Exclude<SettingsPanel, "home">;
  title: string;
  description: string;
  icon: string;
  accent: string;
};

export type SettingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};