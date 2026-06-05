import { useEffect, useState } from "react";
import ActivityLogPanel from "./ActivityLogPanel";
import AudioOverviewPanel, {
  loadAudioSettings,
  saveAudioSettings,
  type AudioSettings,
} from "./AudioOverviewPanel";
import ProfilePanel from "./ProfilePanel";
import SafeLearningFilterPanel, {
  loadSafetySettings,
  saveSafetySettings,
  type SafetySettings,
} from "./SafeLearningFilterPanel";
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
  onEquipTitle?: (title: string) => boolean;
};

const panelTitles: Record<SettingsPanel, string> = {
  home: "Personal Learning Space",
  profile: "Learner Profile",
  audio: "Audio Overview",
  safety: "Safe Learning Filter",
  generation: "Personal Learning Space",
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
  onEquipTitle,
}: ExtendedSettingsModalProps) => {
  const [activePanel, setActivePanel] = useState<SettingsPanel>(initialPanel);
  const [draftAudioSettings, setDraftAudioSettings] =
    useState<AudioSettings>(loadAudioSettings);
  const [draftSafetySettings, setDraftSafetySettings] =
    useState<SafetySettings>(loadSafetySettings);

  useEffect(() => {
    if (isOpen) {
      setActivePanel(initialPanel === "generation" ? "home" : initialPanel);
      setDraftAudioSettings(loadAudioSettings());
      setDraftSafetySettings(loadSafetySettings());
    }
  }, [isOpen, initialPanel]);

  if (!isOpen) return null;

  const showSettingsSavedToast = () => {
    window.dispatchEvent(
      new CustomEvent("studyAura.toast", {
        detail: {
          type: "success",
          title: "Settings saved",
          message: "Your Study Aura settings have been updated.",
        },
      }),
    );
  };

  const goHome = () => {
    setActivePanel("home");
  };

  const handleClose = () => {
    setActivePanel("home");
    setDraftAudioSettings(loadAudioSettings());
    setDraftSafetySettings(loadSafetySettings());
    onClose();
  };

  const handleSave = () => {
    saveAudioSettings(draftAudioSettings);
    saveSafetySettings(draftSafetySettings);
    window.dispatchEvent(new Event("studyAura.settingsSaved"));
    showSettingsSavedToast();
    handleClose();
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
            onEquipTitle={onEquipTitle}
          />
        );
      case "audio":
        return (
          <AudioOverviewPanel
            settings={draftAudioSettings}
            onChange={setDraftAudioSettings}
          />
        );
      case "safety":
        return (
          <SafeLearningFilterPanel
            settings={draftSafetySettings}
            onChange={setDraftSafetySettings}
          />
        );
      case "activity":
        return <ActivityLogPanel />;
      case "generation":
      case "home":
      default:
        return <SettingsHome onOpenPanel={setActivePanel} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-aura-bg/80 px-2 py-2 backdrop-blur-xl sm:px-4 sm:py-4">
      <div className="flex max-h-[96vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-[1.5rem] border border-aura-border bg-aura-panel shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:rounded-[2rem]">
        <header className="flex shrink-0 items-center justify-between border-b border-aura-border bg-aura-bg-soft/80 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-3 sm:gap-4">
            {activePanel !== "home" && (
              <button
                type="button"
                onClick={goHome}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-aura-border bg-aura-panel text-aura-muted transition hover:-translate-y-0.5 hover:border-aura-cyan/60 hover:text-aura-cyan sm:h-10 sm:w-10 sm:rounded-2xl"
                aria-label="Back to settings"
              >
                ←
              </button>
            )}

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-cyan sm:text-xs sm:tracking-[0.28em]">
                Study Aura Settings
              </p>

              <h2 className="mt-1 truncate text-lg font-black text-aura-text sm:mt-2 sm:text-2xl">
                {panelTitles[activePanel]}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close settings"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-aura-border bg-aura-bg-soft text-aura-muted transition hover:border-aura-pink/60 hover:bg-aura-pink/10 hover:text-aura-pink sm:h-10 sm:w-10 sm:rounded-2xl"
          >
            ✕
          </button>
        </header>

        <main className="aura-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
          {renderPanel()}
        </main>

        <footer className="flex shrink-0 flex-col items-center justify-between gap-4 border-t border-aura-border bg-aura-bg-soft/80 px-4 py-3 sm:flex-row sm:gap-3 sm:px-6 sm:py-4">
          <p className="hidden text-sm font-semibold text-aura-muted sm:block">
            Changes are only applied after clicking Save Settings.
          </p>

          <div className="flex w-full items-center justify-center gap-2 sm:w-auto sm:gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-xl border border-aura-border bg-aura-panel px-4 py-2.5 text-xs font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text sm:flex-none sm:rounded-2xl sm:px-5 sm:py-3 sm:text-sm"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex-1 rounded-xl bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold px-4 py-2.5 text-xs font-black text-aura-bg transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(34,211,238,0.22)] sm:flex-none sm:rounded-2xl sm:px-6 sm:py-3 sm:text-sm"
            >
              Save Settings
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SettingsModal;