import { useEffect, useState } from "react";
import ActivityLogPanel from "./ActivityLogPanel";
import AudioOverviewPanel from "./AudioOverviewPanel";
import GenerationDefaultsPanel from "./GenerationDefaultsPanel";
import PersonalPreferencePanel from "./PersonalPreferencePanel";
import ProfilePanel from "./ProfilePanel";
import SafeLearningFilterPanel from "./SafeLearningFilterPanel";
import SettingsHome from "./SettingsHome";
import type { SettingsModalProps, SettingsPanel } from "./settingsTypes";

type ExtendedSettingsModalProps = SettingsModalProps & {
  initialPanel?: SettingsPanel;
};

const panelTitles: Record<SettingsPanel, string> = {
  home: "Personal Learning Space",
  profile: "Profile",
  preferences: "Personal Preference",
  audio: "Audio Overview",
  safety: "Safe Learning Filter",
  generation: "Generation Defaults",
  activity: "Activity Log",
};

const SettingsModal = ({
  isOpen,
  onClose,
  initialPanel = "home",
}: ExtendedSettingsModalProps) => {
  const [activePanel, setActivePanel] = useState<SettingsPanel>(initialPanel);

  useEffect(() => {
    if (isOpen) {
      setActivePanel(initialPanel);
    }
  }, [isOpen, initialPanel]);

  if (!isOpen) return null;

  const goHome = () => setActivePanel("home");

  const handleClose = () => {
    setActivePanel("home");
    onClose();
  };

  const renderPanel = () => {
    switch (activePanel) {
      case "profile":
        return <ProfilePanel />;
      case "preferences":
        return <PersonalPreferencePanel />;
      case "audio":
        return <AudioOverviewPanel />;
      case "safety":
        return <SafeLearningFilterPanel />;
      case "generation":
        return <GenerationDefaultsPanel />;
      case "activity":
        return <ActivityLogPanel />;
      default:
        return <SettingsHome onOpenPanel={setActivePanel} />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-md">
      <div className="flex h-[88dvh] w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-aura-border bg-aura-panel shadow-aura-soft">
        <header className="flex shrink-0 items-center justify-between border-b border-aura-border bg-aura-bg-soft/80 px-7 py-5">
          <div className="flex items-center gap-4">
            {activePanel !== "home" && (
              <button
                type="button"
                onClick={goHome}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-aura-border bg-aura-panel text-aura-muted transition hover:-translate-y-0.5 hover:border-aura-cyan/60 hover:text-aura-cyan"
                aria-label="Back to settings"
              >
                ←
              </button>
            )}

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-aura-dim">
                Study Aura Settings
              </p>
              <h2 className="mt-1 text-2xl font-black aura-title">
                {panelTitles[activePanel]}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close settings"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-aura-border bg-aura-panel text-aura-muted transition hover:-translate-y-0.5 hover:border-aura-pink/60 hover:bg-aura-pink/10 hover:text-aura-pink"
          >
            ✕
          </button>
        </header>

        <main className="aura-scrollbar min-h-0 flex-1 overflow-y-auto p-7">
          {renderPanel()}
        </main>

        <footer className="flex shrink-0 justify-end gap-3 border-t border-aura-border bg-aura-bg-soft/80 px-7 py-4">
          {activePanel !== "home" && (
            <button
              type="button"
              onClick={goHome}
              className="rounded-2xl border border-aura-border bg-aura-panel px-5 py-3 text-sm font-bold text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-cyan"
            >
              Back to Settings
            </button>
          )}

          <button
            type="button"
            onClick={handleClose}
            className="rounded-2xl border border-aura-border bg-aura-panel px-5 py-3 text-sm font-bold text-aura-muted transition hover:border-aura-pink/60 hover:text-aura-pink"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-2xl bg-gradient-to-r from-aura-primary to-aura-cyan px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5"
          >
            Save Changes
          </button>
        </footer>
      </div>
    </div>
  );
};

export default SettingsModal;