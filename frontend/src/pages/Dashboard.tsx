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
  GeneratedLesson,
  SourceUploadPayload,
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
  const [lessons, setLessons] = useState<GeneratedLesson[]>(generatedLessons);

  const handleLessonCreated = (lesson: GeneratedLesson) => {
    setLessons((currentLessons) => {
      const alreadyExists = currentLessons.some(
        (currentLesson) =>
          currentLesson.title.toLowerCase() === lesson.title.toLowerCase(),
      );

      if (alreadyExists) {
        return currentLessons.map((currentLesson) =>
          currentLesson.title.toLowerCase() === lesson.title.toLowerCase()
            ? lesson
            : currentLesson,
        );
      }

      return [lesson, ...currentLessons];
    });

    onNavigate(lesson.title);
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
    onInputClear: () => setInputValue(""),
    onLessonCreated: handleLessonCreated,
  });

  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) =>
      `${lesson.title} ${lesson.subtitle}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [lessons, search]);

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
          lessons={filteredLessons}
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

      <AIToolModal activeTool={activeTool} onClose={() => setActiveTool(null)} />

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