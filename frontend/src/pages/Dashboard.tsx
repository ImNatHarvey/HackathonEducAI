import { useMemo, useState } from "react";
import SettingsModal from "../components/settings/SettingsModal";
import AIToolModal from "../components/ai-studio/AIToolModal";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import SourcesPanel from "../components/dashboard/SourcesPanel";
import ChatPanel from "../components/dashboard/ChatPanel";
import AIStudioPanel from "../components/dashboard/AIStudioPanel";
import AddSourceModal from "../components/dashboard/AddSourceModal";
import { generatedLessons } from "../mocks/dashboardMockData";
import { useDashboardActions } from "../hooks/useDashboardActions";
import type {
  AIToolName,
  SourceUploadPayload,
  StudyModule,
  StudySource,
} from "../components/dashboard/dashboardTypes";

interface DashboardProps {
  topic: string;
  onNavigate: (topic: string) => void;
  onLogout: () => void;
}

const Dashboard = ({ topic, onNavigate, onLogout }: DashboardProps) => {
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<AIToolName | null>(null);
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [modules, setModules] = useState<StudyModule[]>(generatedLessons);

  const currentModule = useMemo(() => {
    return modules.find(
      (module) => module.title.toLowerCase() === topic.toLowerCase(),
    );
  }, [modules, topic]);

  const currentSources = currentModule?.sources ?? [];

  const upsertModule = (module: StudyModule) => {
    setModules((currentModules) => {
      const exists = currentModules.some(
        (currentModule) =>
          currentModule.id === module.id ||
          currentModule.title.toLowerCase() === module.title.toLowerCase(),
      );

      if (!exists) return [module, ...currentModules];

      return currentModules.map((currentModule) =>
        currentModule.id === module.id ||
        currentModule.title.toLowerCase() === module.title.toLowerCase()
          ? module
          : currentModule,
      );
    });
  };

  const handleSourceAdded = (module: StudyModule, source: StudySource) => {
    const existingModule = modules.find(
      (currentModule) =>
        currentModule.id === module.id ||
        currentModule.title.toLowerCase() === module.title.toLowerCase(),
    );

    const targetModule = existingModule ?? module;

    const updatedModule: StudyModule = {
      ...targetModule,
      progress: Math.max(targetModule.progress, 5),
      sources: [
        source,
        ...targetModule.sources.filter(
          (currentSource) => currentSource.id !== source.id,
        ),
      ],
    };

    upsertModule(updatedModule);
    onNavigate(updatedModule.title);
    setIsAddSourceOpen(false);
  };

  const {
    messages,
    isChatLoading,
    chatError,
    uploadError,
    isUploadingSource,
    handleUploadSource,
    handleSendMessage,
  } = useDashboardActions({
    inputValue,
    topic,
    activeModule: currentModule,
    onInputClear: () => setInputValue(""),
    onSourceAdded: handleSourceAdded,
  });

  const filteredModules = useMemo(() => {
    return modules.filter((module) =>
      `${module.title} ${module.subtitle}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [modules, search]);

  const handleSubmitSource = (payload: SourceUploadPayload) => {
    handleUploadSource(payload);
  };

  return (
    <div className="flex h-dvh max-h-dvh w-full flex-col overflow-hidden bg-aura-bg text-aura-text">
      <DashboardNavbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={onLogout}
      />

      <div className="grid min-h-0 flex-1 grid-cols-[20%_60%_20%] overflow-hidden">
        <SourcesPanel
          search={search}
          onSearchChange={setSearch}
          lessons={filteredModules}
          sources={currentSources}
          currentTopic={topic}
          onNavigate={onNavigate}
          isUploadingSource={isUploadingSource}
          uploadError={uploadError}
          onUpload={() => setIsAddSourceOpen(true)}
        />

        <ChatPanel
          topic={topic}
          inputValue={inputValue}
          onInputChange={setInputValue}
          messages={messages}
          isChatLoading={isChatLoading}
          chatError={chatError}
          onSend={handleSendMessage}
        />

        <AIStudioPanel onOpenTool={setActiveTool} />
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <AIToolModal
        activeTool={activeTool}
        topic={topic}
        onClose={() => setActiveTool(null)}
      />

      <AddSourceModal
        isOpen={isAddSourceOpen}
        isUploading={isUploadingSource}
        uploadError={uploadError}
        onClose={() => setIsAddSourceOpen(false)}
        onSubmit={handleSubmitSource}
      />
    </div>
  );
};

export default Dashboard;