import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ModuleLibrary from "./pages/ModuleLibrary";
import CreateModuleModal from "./components/dashboard/CreateModuleModal";
import { generatedLessons } from "./mocks/dashboardMockData";
import type { StudyModule } from "./components/dashboard/dashboardTypes";

type AppView = "landing" | "login" | "dashboard" | "library";

const createModule = (title: string, subtitle: string): StudyModule => {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    title,
    subtitle,
    progress: 0,
    createdAt: now,
    updatedAt: now,
    sources: [],
  };
};

function App() {
  const [view, setView] = useState<AppView>("landing");
  const [selectedTopic, setSelectedTopic] = useState(
    generatedLessons[0]?.title ?? "Neural Networks",
  );
  const [modules, setModules] = useState<StudyModule[]>(generatedLessons);
  const [isCreateModuleOpen, setIsCreateModuleOpen] = useState(false);

  const activeModule = modules.find((module) => module.title === selectedTopic);

  const handleCreateModule = (title: string, subtitle: string) => {
    const existingTitleCount = modules.filter(
      (module) => module.title.toLowerCase() === title.toLowerCase(),
    ).length;

    const finalTitle =
      existingTitleCount > 0 ? `${title} ${existingTitleCount + 1}` : title;

    const newModule = createModule(finalTitle, subtitle);

    setModules((currentModules) => [newModule, ...currentModules]);
    setSelectedTopic(newModule.title);
    setIsCreateModuleOpen(false);
    setView("dashboard");
  };

  const handleOpenModule = (moduleId: string) => {
    const module = modules.find(
      (currentModule) => currentModule.id === moduleId,
    );

    if (!module) return;

    setSelectedTopic(module.title);
    setView("dashboard");
  };

  const handleLogout = () => {
    setView("landing");
  };

  return (
    <>
      {view === "landing" && (
        <LandingPage onGetStarted={() => setView("login")} />
      )}

      {view === "login" && <Login onLogin={() => setView("dashboard")} />}

      {view === "library" && (
        <ModuleLibrary
          modules={modules}
          activeModuleId={activeModule?.id}
          onOpenModule={handleOpenModule}
          onCreateModule={() => setIsCreateModuleOpen(true)}
          onBackToDashboard={() => setView("dashboard")}
        />
      )}

      {view === "dashboard" && (
        <Dashboard
          topic={selectedTopic}
          modules={modules}
          onModulesChange={setModules}
          onNavigate={setSelectedTopic}
          onOpenLibrary={() => setView("library")}
          onOpenCreateModule={() => setIsCreateModuleOpen(true)}
          onLogout={handleLogout}
        />
      )}

      <CreateModuleModal
        isOpen={isCreateModuleOpen}
        onClose={() => setIsCreateModuleOpen(false)}
        onCreateModule={handleCreateModule}
      />
    </>
  );
}

export default App;
