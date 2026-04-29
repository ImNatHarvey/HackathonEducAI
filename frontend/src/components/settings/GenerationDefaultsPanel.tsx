import QuizDefaults from "./generation-defaults/QuizDefaults";
import FlashcardsDefaults from "./generation-defaults/FlashcardsDefaults";
import MindMapDefaults from "./generation-defaults/MindMapDefaults";
import TablesDefaults from "./generation-defaults/TablesDefaults";
import SlidesDefaults from "./generation-defaults/SlidesDefaults";
import AudioDefaults from "./generation-defaults/AudioDefaults";

const GenerationDefaultsPanel = () => {
  return (
    <section className="space-y-5">
      <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-6">
        <p className="max-w-3xl text-sm leading-6 text-aura-muted">
          Default behavior for Study Aura tools. These presets keep AI
          generation predictable and help control token usage.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <QuizDefaults />
          <FlashcardsDefaults />
          <MindMapDefaults />
          <TablesDefaults />
          <SlidesDefaults />
          <AudioDefaults />
        </div>
      </div>
    </section>
  );
};

export default GenerationDefaultsPanel;