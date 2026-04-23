import { useState } from 'react';

// Common Icons with fixed ViewBox
const Icons = {
  Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Send: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>,
  Doc: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>,
  User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  History: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>,
  Trophy: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2h12v7a6 6 0 0 1-12 0V2zM4 22h16M10 14.66V22M14 14.66V22"/></svg>,
  Lock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Audio: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>,
  Slide: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  MindMap: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 9V5M12 19v-4M19 12h-4M5 12h4"/></svg>,
  Cards: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 10h18M10 3v18"/></svg>,
  Data: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 9v12"/></svg>
};

interface DashboardProps {
  topic: string;
  onNavigate: (topic: string) => void;
  onLogout: () => void;
}

const Dashboard = ({ topic, onNavigate, onLogout }: DashboardProps) => {
  const [inputValue, setInputValue] = useState('');
  const generatedLessons = ['Marine Biology 101', 'Intro to N8N', 'Advanced C# Structs'];

  return (
    <div className="flex flex-col h-screen w-full bg-[#12141a] text-[#9ca3af]">
      {/* TOP NAVBAR */}
      <nav className="h-16 border-b border-[#2e303a] bg-[#1b1d26] flex items-center justify-between px-6 shrink-0 z-10">
        <div className="text-xl font-bold text-[#f3f4f6]">EducAI</div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-[#c084fc] flex items-center gap-2 bg-[#c084fc15] px-3 py-1 rounded-full border border-[#c084fc50]"><Icons.Trophy /> Dolphin Expert</div>
          <button onClick={onLogout} className="flex items-center gap-2 hover:bg-[#2e303a] px-3 py-1.5 rounded-lg border border-[#2e303a] text-[#f3f4f6]">
            <div className="w-7 h-7 bg-[#c084fc] rounded-full flex items-center justify-center text-xs"><Icons.User /></div>
            <span>John Doe</span>
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <div className="w-[20%] min-w-[260px] flex flex-col border-r border-[#2e303a] bg-[#1b1d26] p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider mb-3 px-1">Generated Lessons</h2>
          <div className="space-y-1 mb-6">
            {generatedLessons.map((lesson, i) => (
              <button key={i} onClick={() => onNavigate(lesson)} className="w-full text-left px-3 py-2 text-sm hover:bg-[#2e303a] hover:text-[#f3f4f6] rounded-lg transition-colors flex items-center gap-3">
                <Icons.Doc /> {lesson}
              </button>
            ))}
          </div>
          <button className="flex items-center justify-center gap-2 w-full bg-[#f3f4f6] text-[#12141a] hover:bg-white py-3 px-4 rounded-full font-medium mb-8">
            <Icons.Plus /> Add sources
          </button>
        </div>

        {/* MAIN CHAT PANEL */}
        <div className="w-[60%] flex flex-col bg-[#12141a]">
          <div className="h-14 border-b border-[#2e303a] flex items-center justify-between px-6">
            <div className="flex items-center gap-2 font-semibold text-[#f3f4f6]"><Icons.Doc /> {topic}</div>
            <div className="flex items-center gap-4 text-xs">
              <button className="hover:text-[#f3f4f6] flex items-center gap-1.5"><Icons.Lock /> AI Filter: Strict</button>
              <button className="hover:text-[#f3f4f6] flex items-center gap-1.5"><Icons.Settings /> Custom Instructions</button>
              <button className="hover:text-[#f3f4f6] flex items-center gap-1.5"><Icons.History /> Activity Log</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
             {/* AI Message Component Placeholder */}
             <div className="flex gap-4 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-[#c084fc20] text-[#c084fc] flex items-center justify-center border border-[#c084fc40] text-xs font-bold shrink-0">AI</div>
              <p className="text-[#f3f4f6] leading-relaxed pt-1">Paste a link or ask a question to begin learning about {topic}!</p>
            </div>
          </div>
          <div className="p-6">
            <div className="relative max-w-4xl mx-auto">
              <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Ask a question..." className="w-full bg-[#1b1d26] border border-[#2e303a] text-[#f3f4f6] rounded-2xl py-4 pl-6 pr-14 outline-none focus:border-[#c084fc]" />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-[#c084fc] text-white disabled:opacity-30" disabled={!inputValue.trim()}><Icons.Send /></button>
            </div>
          </div>
        </div>

        {/* RIGHT STUDIO PANEL */}
        <div className="w-[20%] min-w-[260px] border-l border-[#2e303a] bg-[#1b1d26] p-4 grid grid-cols-2 gap-3 content-start">
            {[
              { name: 'Audio Overview', icon: <Icons.Audio /> },
              { name: 'Slide Deck', icon: <Icons.Slide /> },
              { name: 'Mind Map', icon: <Icons.MindMap /> },
              { name: 'Flashcards', icon: <Icons.Cards /> },
              { name: 'Data Table', icon: <Icons.Data /> },
              { name: 'Quiz', icon: <Icons.Doc /> },
            ].map((tool, index) => (
              <button key={index} className="group flex flex-col items-center justify-center gap-2 p-4 bg-[#12141a] border border-[#2e303a] rounded-xl hover:border-[#c084fc50] transition-all h-28 text-center">
                <div className="text-[#6b7280] group-hover:text-[#c084fc]">{tool.icon}</div>
                <span className="text-[10px] font-bold uppercase text-[#9ca3af] group-hover:text-[#f3f4f6]">{tool.name}</span>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;