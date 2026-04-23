import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; 
import CourseView from './pages/CourseView'; 

export default function App() {
  const [view, setView] = useState<'auth' | 'dashboard' | 'course'>('auth');
  const [topic, setTopic] = useState('Marine Biology 101');

  const handleLogin = () => setView('dashboard');
  const handleNavigateToCourse = (newTopic: string) => {
    setTopic(newTopic);
    setView('course');
  };

  return (
    <>
      {view === 'auth' && <Login onLogin={handleLogin} />}
      {view === 'dashboard' && (
        <Dashboard 
          topic={topic} 
          onNavigate={handleNavigateToCourse} 
          onLogout={() => setView('auth')} 
        />
      )}
      {view === 'course' && (
        <CourseView 
          topic={topic} 
          onBack={() => setView('dashboard')} 
        />
      )}
    </>
  );
}