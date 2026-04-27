import { useMemo, useState } from "react";
import SettingsModal from "../components/settings/SettingsModal";
import AIToolModal from "../components/ai-studio/AIToolModal";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import SourcesPanel from "../components/dashboard/SourcesPanel";
import ChatPanel from "../components/dashboard/ChatPanel";
import AIStudioPanel from "../components/dashboard/AIStudioPanel";
import AddSourceModal from "../components/dashboard/AddSourceModal";
import { useDashboardActions } from "../hooks/useDashboardActions";
import type {
  AIToolName,
  SourceUploadPayload,
  StudyModule,
  StudySource,
} from "../components/dashboard/dashboardTypes";

interface DashboardProps {
  topic: string;
  modules: StudyModule[];
  onModulesChange: (modules: StudyModule[]) => void;
  onNavigate: (topic: string) => void;
  onOpenLibrary: () => void;
  onOpenCreateModule: () => void;
  onLogout: () => void;
}

const Dashboard = ({
  topic,
  modules,
  onModulesChange,
  onOpenLibrary,
  onOpenCreateModule,
  onLogout,
}: DashboardProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

  const updateCurrentModule = (
    updater: (module: StudyModule) => StudyModule,
  ) => {
    if (!currentModule) return;

    const nextModules = modules.map((module) =>
      module.id === currentModule.id ? updater(module) : module,
    );

    onModulesChange(nextModules);
  };

  const handleSourceAdded = (source: StudySource) => {
    updateCurrentModule((module) => ({
      ...module,
      progress: Math.max(module.progress, 10),
      updatedAt: new Date().toISOString(),
      sources: [
        source,
        ...module.sources.filter(
          (currentSource) => currentSource.id !== source.id,
        ),
      ],
    }));

    setIsAddSourceOpen(false);
  };

  const handleSourcesAdded = (sources: StudySource[]) => {
    updateCurrentModule((module) => {
      const incomingIds = new Set(sources.map((source) => source.id));

      return {
        ...module,
        progress: Math.max(module.progress, 10),
        updatedAt: new Date().toISOString(),
        sources: [
          ...sources,
          ...module.sources.filter((source) => !incomingIds.has(source.id)),
        ],
      };
    });

    setIsAddSourceOpen(false);
  };

  const handleToggleSource = (sourceId: string) => {
    updateCurrentModule((module) => ({
      ...module,
      updatedAt: new Date().toISOString(),
      sources: module.sources.map((source) =>
        source.id === sourceId
          ? {
              ...source,
              selected: !source.selected,
            }
          : source,
      ),
    }));
  };

  const handleSelectAllSources = () => {
    updateCurrentModule((module) => ({
      ...module,
      updatedAt: new Date().toISOString(),
      sources: module.sources.map((source) => ({
        ...source,
        selected: true,
      })),
    }));
  };

  const handleClearSelectedSources = () => {
    updateCurrentModule((module) => ({
      ...module,
      updatedAt: new Date().toISOString(),
      sources: module.sources.map((source) => ({
        ...source,
        selected: false,
      })),
    }));
  };

  const handleDeleteSource = (sourceId: string) => {
    updateCurrentModule((module) => ({
      ...module,
      updatedAt: new Date().toISOString(),
      sources: module.sources.filter((source) => source.id !== sourceId),
    }));
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
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenLibrary={onOpenLibrary}
        onOpenCreateModule={onOpenCreateModule}
        onLogout={onLogout}
      />

      <div className="grid min-h-0 flex-1 grid-cols-[20%_60%_20%] overflow-hidden">
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

        <ChatPanel
          topic={currentModule?.title ?? topic}
          selectedSourceCount={selectedSourceCount}
          inputValue={inputValue}
          onInputChange={setInputValue}
          messages={messages}
          isChatLoading={isChatLoading}
          chatError={chatError}
          onSend={handleSendMessage}
        />

        <AIStudioPanel
          selectedSourceCount={selectedSourceCount}
          onOpenTool={setActiveTool}
        />
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <AIToolModal
        activeTool={activeTool}
        topic={currentModule?.title ?? topic}
        moduleId={currentModule?.id}
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