interface CourseViewProps {
  topic: string;
  onBack: () => void;
}

const CourseView = ({ topic, onBack }: CourseViewProps) => {
  return (
    <div className="min-h-screen bg-aura-ink text-aura-text p-6">
      <button onClick={onBack} className="text-aura-muted mb-6">← Back</button>

      <div className="aura-card p-6 rounded-2xl">
        <h1 className="text-xl font-black aura-gold-text mb-2">{topic}</h1>
        <p className="text-aura-muted text-sm">Generated learning path</p>

        {/* PROGRESS */}
        <div className="mt-6">
          <div className="w-full h-2 bg-aura-panel-soft rounded-full overflow-hidden">
            <div className="h-full bg-aura-gold w-full"></div>
          </div>
          <p className="text-xs text-aura-gold mt-2">100% Complete</p>
        </div>

        {/* MODULES */}
        <div className="mt-6 space-y-3">
          {['Intro','Core Concepts','Advanced Topics'].map((m,i)=> (
            <div key={i} className="aura-card p-4 rounded-xl flex justify-between">
              <span>{m}</span>
              <span className="text-aura-gold">Done</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseView;