import { useState } from 'react';

interface DashboardProps {
  topic: string;
  onNavigate: (topic: string) => void;
  onLogout: () => void;
}

const lessonsMock = [
  'Marine Biology 101',
  'Intro to AI Agents',
  'Neural Networks Basics',
  'Advanced C# Structs',
  'Web Security Essentials',
  'React Performance Tuning',
];

const Dashboard = ({ topic, onNavigate, onLogout }: DashboardProps) => {
  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');

  const filtered = lessonsMock.filter(l =>
    l.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen w-full bg-aura-ink text-aura-text">
      {/* LEFT PANEL */}
      <aside className="w-[320px] border-r aura-gold-border flex flex-col bg-aura-panel">

        {/* FIXED HEADER */}
        <div className="p-5 border-b aura-gold-border">
          <h1 className="text-lg font-black aura-gold-text tracking-wide">EducAI</h1>
          <button className="mt-4 w-full bg-aura-gold text-black py-3 rounded-xl font-bold hover:brightness-110 transition">
            + Add Sources
          </button>

          {/* DRAG DROP */}
          <div className="mt-4 border border-dashed border-aura-border p-4 rounded-xl text-xs text-aura-muted text-center">
            Drag & drop files here
          </div>
        </div>

        {/* SEARCH */}
        <div className="p-4">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search modules..."
            className="w-full bg-aura-panel-soft border aura-gold-border rounded-xl p-2 text-sm"
          />
        </div>

        {/* MODULE LIST */}
        <div className="flex-1 overflow-y-auto aura-scrollbar p-3">
          <div className="grid grid-cols-2 gap-2">
            {filtered.map((lesson, i) => (
              <button
                key={i}
                onClick={() => onNavigate(lesson)}
                className="aura-card p-3 text-left rounded-xl hover:border-aura-gold transition"
              >
                <p className="text-xs text-aura-muted">Module</p>
                <p className="text-sm font-bold text-aura-text">{lesson}</p>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col">

        {/* NAV */}
        <div className="h-16 flex items-center justify-between px-6 border-b aura-gold-border">
          <div className="font-bold text-sm">{topic}</div>
          <button onClick={onLogout} className="text-xs text-aura-muted">Logout</button>
        </div>

        {/* CHAT */}
        <div className="flex-1 p-6 space-y-4">
          <div className="aura-card p-4 rounded-xl max-w-xl">
            Ask anything about <b>{topic}</b>
          </div>
        </div>

        {/* INPUT */}
        <div className="p-6">
          <div className="relative">
            <input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Ask Aura..."
              className="w-full bg-aura-panel-soft border aura-gold-border rounded-xl p-4"
            />
          </div>
        </div>
      </main>

      {/* RIGHT PANEL */}
      <aside className="w-[280px] border-l aura-gold-border p-4 bg-aura-panel">
        <h2 className="text-xs text-aura-muted mb-4">AI Studio</h2>
        <div className="grid grid-cols-2 gap-3">
          {['Audio','Slides','MindMap','Cards','Tables','Quiz'].map((tool, i) => (
            <button key={i} className="aura-card p-4 rounded-xl text-center hover:border-aura-gold transition">
              <p className="text-sm font-bold text-aura-text">{tool}</p>
              <p className="text-xs text-aura-muted">Generate</p>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default Dashboard;