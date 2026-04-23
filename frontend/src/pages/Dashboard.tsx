import { useState } from 'react';

const Icons = {
  Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>,
  Send: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>,
  Doc: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>,
  User: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  History: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>,
  Trophy: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  Lock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Audio: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>,
  Slide: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
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
    <div className="flex flex-col h-screen w-full bg-[#0a0c10] text-[#a0a5b1]">
      {/* TOP NAVBAR - STI NAVY */}
      <nav className="h-16 border-b border-[#1f2937] bg-[#111827] flex items-center justify-between px-6 shrink-0 z-10 shadow-md">
        <div className="text-xl font-black tracking-tighter text-white">
          <span className="text-[#FFD200]">Educ</span>AI
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs font-bold text-[#FFD200] flex items-center gap-2 bg-[#FFD20015] px-3 py-1.5 rounded-full border border-[#FFD20030]">
            <Icons.Trophy /> DOLPHIN EXPERT
          </div>
          <button onClick={onLogout} className="flex items-center gap-2 hover:bg-[#1f2937] px-3 py-1.5 rounded-lg border border-[#374151] text-[#f3f4f6] transition-all">
            <div className="w-7 h-7 bg-[#FFD200] text-[#0038A8] rounded-full flex items-center justify-center font-bold text-[10px]">JD</div>
            <span className="text-sm font-semibold">John Doe</span>
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <div className="w-[20%] min-w-[280px] flex flex-col border-r border-[#1f2937] bg-[#111827] p-5 shadow-xl">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4b5563] mb-4 px-1">Generated Lessons</h2>
          <div className="space-y-1 mb-8">
            {generatedLessons.map((lesson, i) => (
              <button key={i} onClick={() => onNavigate(lesson)} className="w-full text-left px-3 py-2.5 text-sm hover:bg-[#0038A8] hover:text-white rounded-xl transition-all flex items-center gap-3 group">
                <div className="text-[#FFD200] group-hover:text-white"><Icons.Doc /></div>
                <span className="font-medium">{lesson}</span>
              </button>
            ))}
          </div>

          <button className="flex items-center justify-center gap-2 w-full bg-[#FFD200] text-[#0038A8] hover:bg-yellow-300 py-3 px-4 rounded-2xl font-bold shadow-lg transition-transform active:scale-95">
            <Icons.Plus /> ADD SOURCES
          </button>
        </div>

        {/* MAIN PANEL */}
        <div className="w-[60%] flex flex-col bg-[#0a0c10] relative">
          <div className="h-14 border-b border-[#1f2937] bg-[#111827]/50 flex items-center justify-between px-8 shrink-0">
            <div className="flex items-center gap-3 font-bold text-[#f3f4f6] text-sm">
              <div className="text-[#FFD200]"><Icons.Doc /></div>
              {topic.toUpperCase()}
            </div>
            <div className="flex items-center gap-5 text-[10px] font-bold text-[#6b7280]">
              <button className="hover:text-[#FFD200] flex items-center gap-1.5 transition-colors"><Icons.Lock /> FILTER: STRICT</button>
              <button className="hover:text-[#FFD200] flex items-center gap-1.5 transition-colors"><Icons.Settings /> INSTRUCTIONS</button>
              <button className="hover:text-[#FFD200] flex items-center gap-1.5 transition-colors"><Icons.History /> LOGS</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-8">
             <div className="flex gap-5 max-w-[85%]">
              <div className="w-10 h-10 rounded-2xl bg-[#0038A8] text-[#FFD200] flex items-center justify-center border border-[#0038A8] text-xs font-black shrink-0 shadow-lg">AI</div>
              <div className="space-y-4">
                <p className="text-[#d1d5db] leading-relaxed text-sm bg-[#111827] p-5 rounded-2xl border border-[#1f2937]">
                  Paste a link or ask a question to begin learning about <strong>{topic}</strong>!
                </p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="relative max-w-4xl mx-auto group">
              <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Type your message..." className="w-full bg-[#111827] border border-[#1f2937] text-white rounded-2xl py-4.5 pl-6 pr-14 outline-none focus:border-[#0038A8] transition-all shadow-2xl" />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-[#0038A8] text-[#FFD200] hover:scale-105 transition-all disabled:opacity-20" disabled={!inputValue.trim()}><Icons.Send /></button>
            </div>
          </div>
        </div>

        {/* STUDIO PANEL */}
        <div className="w-[20%] min-w-[280px] border-l border-[#1f2937] bg-[#111827] p-5 flex flex-col gap-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4b5563] mb-2 px-1">AI Studio</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Audio', icon: <Icons.Audio /> },
                { name: 'Slides', icon: <Icons.Slide /> },
                { name: 'Mind Map', icon: <Icons.MindMap /> },
                { name: 'Cards', icon: <Icons.Cards /> },
                { name: 'Tables', icon: <Icons.Data /> },
                { name: 'Quiz', icon: <Icons.Doc /> },
              ].map((tool, index) => (
                <button key={index} className="group flex flex-col items-center justify-center gap-3 p-4 bg-[#0a0c10] border border-[#1f2937] rounded-2xl hover:border-[#0038A8] hover:bg-[#0038A8]/10 transition-all h-28 text-center shadow-md">
                  <div className="text-[#4b5563] group-hover:text-[#FFD200] transition-colors">{tool.icon}</div>
                  <span className="text-[9px] font-black uppercase text-[#6b7280] group-hover:text-white tracking-widest">{tool.name}</span>
                </button>
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;