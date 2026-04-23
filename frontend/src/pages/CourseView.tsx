const BackIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>;

interface CourseViewProps {
  topic: string;
  onBack: () => void;
}

const CourseView = ({ topic, onBack }: CourseViewProps) => {
  return (
    <div className="min-h-screen bg-[#12141a] text-[#f3f4f6] flex flex-col items-center pt-10 px-4">
      <button onClick={onBack} className="absolute top-6 left-6 flex items-center gap-2 text-[#9ca3af] hover:text-white transition-colors">
        <BackIcon /> Back to Dashboard
      </button>
      <div className="w-full max-w-4xl flex items-center justify-between bg-[#1b1d26] border border-[#2e303a] rounded-2xl p-6 shadow-lg mt-8">
        <div className="text-center w-24"><h2 className="text-4xl font-bold">3</h2><p className="text-cyan-400 text-sm font-medium uppercase tracking-tighter">Modules</p></div>
        <div className="flex-1 text-center px-4"><h1 className="text-2xl font-bold mb-2 uppercase tracking-wide">{topic}</h1><p className="text-[#9ca3af] text-sm">Automated learning path generated from source material.</p></div>
        <div className="text-center w-24"><h2 className="text-4xl font-bold">1</h2><p className="text-orange-400 text-sm font-medium uppercase tracking-tighter">Rooms</p></div>
      </div>
      <div className="w-full max-w-4xl mt-8">
        <div className="w-full h-2 bg-[#2e303a] rounded-full overflow-hidden"><div className="h-full bg-[#39ff14] w-full rounded-full shadow-[0_0_8px_#39ff14]"></div></div>
        <p className="text-xs text-[#39ff14] mt-2 flex items-center gap-2 font-bold uppercase tracking-widest"><span className="w-2 h-2 rounded-full bg-[#39ff14] animate-pulse"></span>Completion 100%</p>
      </div>
      <div className="w-full max-w-4xl bg-[#1b1d26] border border-[#2e303a] rounded-2xl p-8 mt-8 shadow-xl">
        <h3 className="text-xl font-bold border-b border-[#2e303a] pb-4 mb-6 uppercase tracking-wider">Course Syllabus</h3>
        <div className="space-y-6">
          <div className="flex justify-between items-center group cursor-pointer border-b border-[#2e303a] pb-4"><div className="flex items-center gap-4"><div className="w-3 h-3 rounded-full border-2 border-gray-600 group-hover:border-[#39ff14]"></div><span className="text-lg font-bold text-[#39ff14] uppercase">1. Introduction to {topic}</span></div><span className="text-[#39ff14] font-bold">10/10</span></div>
          <div className="flex justify-between items-center group cursor-pointer border-b border-[#2e303a] pb-4"><div className="flex items-center gap-4"><div className="w-3 h-3 rounded-full border-2 border-gray-600 group-hover:border-[#39ff14]"></div><span className="text-lg font-bold text-[#39ff14] uppercase">2. Core Concepts & Frameworks</span></div><span className="text-[#39ff14] font-bold">30/30</span></div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;