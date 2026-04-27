import { useMemo, useState } from "react";
import SettingsModal from "../components/settings/SettingsModal";
import AIToolModal from "../components/ai-studio/AIToolModal";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import SourcesPanel from "../components/dashboard/SourcesPanel";
import ChatPanel from "../components/dashboard/ChatPanel";
import AIStudioPanel from "../components/dashboard/AIStudioPanel";
import AddSourceModal from "../components/dashboard/AddSourceModal";
import { useDashboardActions } from "../hooks/useDashboardActions";
import type { SettingsPanel } from "../components/settings/settingsTypes";
import type { AuthProfile } from "../services/authService";
import type {
  AIToolName,
  SourceUploadPayload,
  StudyModule,
  StudySource,
} from "../components/dashboard/dashboardTypes";

interface DashboardProps {
  topic: string;
  modules: StudyModule[];
  profile: AuthProfile | null;
  userId?: string;
  onModulesChange: (modules: StudyModule[]) => void;
  onNavigate: (topic: string) => void;
  onAddSourceToModule: (params: {
    moduleId: string;
    source: StudySource;
  }) => Promise<StudySource>;
  onAddSourcesToModule: (params: {
    moduleId: string;
    sources: StudySource[];
  }) => Promise<StudySource[]>;
  onUpdateSourceSelected: (params: {
    moduleId: string;
    sourceId: string;
    selected: boolean;
  }) => Promise<void>;
  onUpdateAllSourcesSelected: (params: {
    moduleId: string;
    selected: boolean;
  }) => Promise<void>;
  onDeleteSource: (params: {
    moduleId: string;
    sourceId: string;
  }) => Promise<void>;
  onOpenLibrary: () => void;
  onOpenCreateModule: () => void;
  onLogout: () => void;
}

const Dashboard = ({
  topic,
  modules,
  profile,
  userId,
  onModulesChange,
  onAddSourceToModule,
  onAddSourcesToModule,
  onUpdateSourceSelected,
  onUpdateAllSourcesSelected,
  onDeleteSource,
  onOpenLibrary,
  onOpenCreateModule,
  onLogout,
}: DashboardProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsInitialPanel, setSettingsInitialPanel] =
    useState<SettingsPanel>("home");
  const [activeTool, setActiveTool] = useState<AIToolName | null>(null);
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);

  const currentModule = useMemo(() => {
    const matchedModule = modules.find(
      (module) => module.title.toLowerCase() === topic.toLowerCase(),
    );

    return matchedModule ?? modules[0];
  }, [modules, topic]);

  const currentSources = currentModule?.sources ?? [];

  const selectedSources = useMemo(() => {
    return currentSources.filter((source) => source.selected);
  }, [currentSources]);

  const selectedSourceCount = selectedSources.length;

  const openSettings = (panel: SettingsPanel = "home") => {
    setSettingsInitialPanel(panel);
    setIsSettingsOpen(true);
  };

  const updateCurrentModule = (
    updater: (module: StudyModule) => StudyModule,
  ) => {
    if (!currentModule) return;

    const nextModules = modules.map((module) =>
      module.id === currentModule.id ? updater(module) : module,
    );

    onModulesChange(nextModules);
  };

  const handleSourceAdded = async (source: StudySource) => {
    if (!currentModule) return;

    const savedSource = await onAddSourceToModule({
      moduleId: currentModule.id,
      source,
    });

    updateCurrentModule((module) => ({
      ...module,
      progress: Math.max(module.progress, 10),
      updatedAt: new Date().toISOString(),
      sources: [
        savedSource,
        ...module.sources.filter(
          (currentSource) => currentSource.id !== savedSource.id,
        ),
      ],
    }));

    setIsAddSourceOpen(false);
  };

  const handleSourcesAdded = async (sources: StudySource[]) => {
    if (!currentModule) return;

    const savedSources = await onAddSourcesToModule({
      moduleId: currentModule.id,
      sources,
    });

    updateCurrentModule((module) => {
      const incomingIds = new Set(savedSources.map((source) => source.id));

      return {
        ...module,
        progress: Math.max(module.progress, 10),
        updatedAt: new Date().toISOString(),
        sources: [
          ...savedSources,
          ...module.sources.filter((source) => !incomingIds.has(source.id)),
        ],
      };
    });

    setIsAddSourceOpen(false);
  };

  const handleToggleSource = async (sourceId: string) => {
    if (!currentModule) return;

    const source = currentModule.sources.find(
      (currentSource) => currentSource.id === sourceId,
    );

    if (!source) return;

    const nextSelected = !source.selected;

    updateCurrentModule((module) => ({
      ...module,
      updatedAt: new Date().toISOString(),
      sources: module.sources.map((currentSource) =>
        currentSource.id === sourceId
          ? {
              ...currentSource,
              selected: nextSelected,
            }
          : currentSource,
      ),
    }));

    await onUpdateSourceSelected({
      moduleId: currentModule.id,
      sourceId,
      selected: nextSelected,
    });
  };

  const handleSelectAllSources = async () => {
    if (!currentModule) return;

    updateCurrentModule((module) => ({
      ...module,
      updatedAt: new Date().toISOString(),
      sources: module.sources.map((source) => ({
        ...source,
        selected: true,
      })),
    }));

    await onUpdateAllSourcesSelected({
      moduleId: currentModule.id,
      selected: true,
    });
  };

  const handleClearSelectedSources = async () => {
    if (!currentModule) return;

    updateCurrentModule((module) => ({
      ...module,
      updatedAt: new Date().toISOString(),
      sources: module.sources.map((source) => ({
        ...source,
        selected: false,
      })),
    }));

    await onUpdateAllSourcesSelected({
      moduleId: currentModule.id,
      selected: false,
    });
  };

  const handleDeleteSource = async (sourceId: string) => {
    if (!currentModule) return;

    updateCurrentModule((module) => ({
      ...module,
      updatedAt: new Date().toISOString(),
      sources: module.sources.filter((source) => source.id !== sourceId),
    }));

    await onDeleteSource({
      moduleId: currentModule.id,
      sourceId,
    });
  };

  const {
    messages,
    isChatLoading,
    chatError,
    uploadError,
    isUploadingSource,
    handleUploadSource,
    handleUploadSources,
    handleSendMessage,
  } = useDashboardActions({
    inputValue,
    topic: currentModule?.title ?? topic,
    userId,
    activeModule: currentModule,
    selectedSources,
    onInputClear: () => setInputValue(""),
    onSourceAdded: handleSourceAdded,
    onSourcesAdded: handleSourcesAdded,
  });

  const handleSubmitSource = (payload: SourceUploadPayload) => {
    handleUploadSource(payload);
  };

  const handleSubmitSources = (payloads: SourceUploadPayload[]) => {
    handleUploadSources(payloads);
  };

  return (
    <div className="flex h-dvh max-h-dvh w-full flex-col overflow-hidden bg-aura-bg text-aura-text">
      <DashboardNavbar
        profile={profile}
        onOpenSettings={openSettings}
        onOpenLibrary={onOpenLibrary}
        onOpenCreateModule={onOpenCreateModule}
        onLogout={onLogout}
      />

      <div className="aura-scrollbar grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[25%_50%_25%] xl:overflow-hidden">
        <div className="min-h-[420px] overflow-hidden xl:min-h-0">
          <SourcesPanel
            moduleTitle={currentModule?.title ?? topic}
            sources={currentSources}
            selectedSourceCount={selectedSourceCount}
            isUploadingSource={isUploadingSource}
            uploadError={uploadError}
            onUpload={() => setIsAddSourceOpen(true)}
            onToggleSource={handleToggleSource}
            onSelectAllSources={handleSelectAllSources}
            onClearSelectedSources={handleClearSelectedSources}
            onDeleteSource={handleDeleteSource}
          />
        </div>

        <div className="min-h-[620px] overflow-hidden xl:min-h-0">
          <ChatPanel
            topic={currentModule?.title ?? topic}
            selectedSourceCount={selectedSourceCount}
            profile={profile}
            inputValue={inputValue}
            onInputChange={setInputValue}
            messages={messages}
            isChatLoading={isChatLoading}
            chatError={chatError}
            onSend={handleSendMessage}
          />
        </div>

        <div className="min-h-[420px] overflow-hidden lg:col-span-2 xl:col-span-1 xl:min-h-0">
          <AIStudioPanel
            selectedSourceCount={selectedSourceCount}
            onOpenTool={setActiveTool}
          />
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        initialPanel={settingsInitialPanel}
        profile={profile}
        onClose={() => setIsSettingsOpen(false)}
      />

      <AIToolModal
        activeTool={activeTool}
        topic={currentModule?.title ?? topic}
        moduleId={currentModule?.id}
        userId={userId}
        selectedSources={selectedSources}
        onClose={() => setActiveTool(null)}
      />

      <AddSourceModal
        isOpen={isAddSourceOpen}
        isUploading={isUploadingSource}
        uploadError={uploadError}
        moduleId={currentModule?.id}
        onClose={() => setIsAddSourceOpen(false)}
        onSubmit={handleSubmitSource}
        onSubmitMany={handleSubmitSources}
      />
    </div>
  );
};

export default Dashboard;