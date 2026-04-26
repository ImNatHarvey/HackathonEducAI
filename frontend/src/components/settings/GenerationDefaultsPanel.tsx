import QuizDefaults from "./generation-defaults/QuizDefaults";
import FlashcardsDefaults from "./generation-defaults/FlashcardsDefaults";
import MindMapDefaults from "./generation-defaults/MindMapDefaults";
import TablesDefaults from "./generation-defaults/TablesDefaults";
import SlidesDefaults from "./generation-defaults/SlidesDefaults";
import AudioDefaults from "./generation-defaults/AudioDefaults";

const GenerationDefaultsPanel = () => {
  return (
    <section className="mx-auto max-w-5xl space-y-5">
      <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-6">
        <h3 className="text-xl font-black text-aura-text">
          Generation Defaults
        </h3>
        <p className="mt-2 text-sm leading-6 text-aura-muted">
          Default behavior for Study Aura tools. Quiz is now connected to n8n;
          the other tools are ready as placeholders.
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