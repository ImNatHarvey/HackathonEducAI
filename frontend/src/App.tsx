import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CourseView from "./pages/CourseView";

export default function App() {
  const [view, setView] = useState<"auth" | "dashboard" | "course">("auth");
  const [topic, setTopic] = useState("Untitled Study Module");

  const handleLogin = () => setView("dashboard");

  const handleNavigateDashboard = (newTopic: string) => {
    setTopic(newTopic);
    setView("dashboard");
  };

  const handleOpenCourseView = (newTopic: string) => {
    setTopic(newTopic);
    setView("course");
  };

  return (
    <div className="antialiased">
      {view === "auth" && <Login onLogin={handleLogin} />}

      {view === "dashboard" && (
        <Dashboard
          topic={topic}
          onNavigate={handleNavigateDashboard}
          onLogout={() => setView("auth")}
        />
      )}

      {view === "course" && (
        <CourseView topic={topic} onBack={() => setView("dashboard")} />
      )}
    </div>
  );
}