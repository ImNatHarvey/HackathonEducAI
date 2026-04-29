import { useEffect, useState } from "react";
import ActivityLogPanel from "./ActivityLogPanel";
import AudioOverviewPanel from "./AudioOverviewPanel";
import GenerationDefaultsPanel from "./GenerationDefaultsPanel";
import PersonalPreferencePanel from "./PersonalPreferencePanel";
import ProfilePanel from "./ProfilePanel";
import SafeLearningFilterPanel from "./SafeLearningFilterPanel";
import SettingsHome from "./SettingsHome";
import type { AuthProfile } from "../../services/authService";
import type { AuraStats } from "../../lib/xp";
import type { SettingsModalProps, SettingsPanel } from "./settingsTypes";

type ProgressInfo = {
  current: number;
  needed: number;
  percent: number;
};

type ExtendedSettingsModalProps = SettingsModalProps & {
  initialPanel?: SettingsPanel;
  profile?: AuthProfile | null;
  auraStats?: AuraStats;
  accountProgress?: ProgressInfo;
  toolProgress?: Record<string, ProgressInfo>;
};

const panelTitles: Record<SettingsPanel, string> = {
  home: "Personal Learning Space",
  profile: "Learner Profile",
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
  profile = null,
  auraStats,
  accountProgress,
  toolProgress,
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
        return (
          <ProfilePanel
            profile={profile}
            auraStats={auraStats}
            accountProgress={accountProgress}
            toolProgress={toolProgress}
          />
        );
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-aura-bg/80 px-3 py-3 backdrop-blur-xl">
      <div className="flex max-h-[94vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-[2rem] border border-aura-border bg-aura-panel shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
        <header className="flex shrink-0 items-center justify-between border-b border-aura-border bg-aura-bg-soft/80 px-6 py-4">
          <div className="flex min-w-0 items-center gap-4">
            {activePanel !== "home" && (
              <button
                type="button"
                onClick={goHome}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-aura-border bg-aura-panel text-aura-muted transition hover:-translate-y-0.5 hover:border-aura-cyan/60 hover:text-aura-cyan"
                aria-label="Back to settings"
              >
                ←
              </button>
            )}

            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-aura-cyan">
                Study Aura Settings
              </p>
              <h2 className="mt-2 truncate text-2xl font-black text-aura-text">
                {panelTitles[activePanel]}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close settings"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-aura-border bg-aura-bg-soft text-aura-muted transition hover:border-aura-pink/60 hover:bg-aura-pink/10 hover:text-aura-pink"
          >
            ✕
          </button>
        </header>

        <main className="aura-scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {renderPanel()}
        </main>

        <footer className="flex shrink-0 justify-end border-t border-aura-border bg-aura-bg-soft/80 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-2xl bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold px-5 py-3 text-sm font-black text-aura-bg transition hover:-translate-y-0.5"
          >
            Save Changes
          </button>
        </footer>
      </div>
    </div>
  );
};

export default SettingsModal;
