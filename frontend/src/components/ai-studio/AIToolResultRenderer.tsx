import type {
  N8nAudioResponse,
  N8nFlashcardsResponse,
  N8nMindMapResponse,
  N8nQuizResponse,
  N8nSlidesResponse,
  N8nTablesResponse,
} from "../../lib/n8n";
import type { AIToolName } from "../dashboard/dashboardTypes";

type AIToolResultRendererProps = {
  toolName: AIToolName;
  result: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const isQuizResponse = (result: unknown): result is N8nQuizResponse => {
  return isRecord(result) && isRecord(result.quiz);
};

const isFlashcardsResponse = (
  result: unknown,
): result is N8nFlashcardsResponse => {
  return isRecord(result) && isRecord(result.deck) && Array.isArray(result.deck.cards);
};

const isTablesResponse = (result: unknown): result is N8nTablesResponse => {
  return isRecord(result) && isRecord(result.table) && Array.isArray(result.table.rows);
};

const isMindMapResponse = (result: unknown): result is N8nMindMapResponse => {
  return isRecord(result) && isRecord(result.mindMap);
};

const isSlidesResponse = (result: unknown): result is N8nSlidesResponse => {
  return isRecord(result) && isRecord(result.deck) && Array.isArray(result.deck.slides);
};

const isAudioResponse = (result: unknown): result is N8nAudioResponse => {
  return isRecord(result) && isRecord(result.audioOverview);
};

const FallbackJsonView = ({ result }: { result: unknown }) => {
  return (
    <pre className="aura-scrollbar max-h-[52vh] overflow-auto rounded-2xl border border-aura-border bg-aura-bg px-4 py-4 text-xs leading-6 text-aura-muted">
      {JSON.stringify(result, null, 2)}
    </pre>
  );
};

const AIToolResultRenderer = ({
  toolName,
  result,
}: AIToolResultRendererProps) => {
  if (!result) return null;

  if (toolName === "Quiz" && isQuizResponse(result)) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-black text-aura-text">
            {result.quiz.title}
          </h3>

          {result.fallback && (
            <p className="mt-2 text-xs font-bold text-yellow-200">
              Fallback output was used.
            </p>
          )}
        </div>

        {result.quiz.questions.map((question, index) => (
          <div
            key={`${question.question}-${index}`}
            className="rounded-2xl border border-aura-border bg-aura-bg-soft p-4"
          >
            <p className="text-sm font-black text-aura-cyan">
              Question {index + 1}
            </p>

            <p className="mt-2 text-base font-bold leading-7 text-aura-text">
              {question.question}
            </p>

            <div className="mt-4 grid gap-2">
              {question.choices.map((choice) => (
                <div
                  key={choice}
                  className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                    choice === question.answer
                      ? "border-aura-cyan/60 bg-aura-cyan/10 text-aura-text"
                      : "border-aura-border bg-aura-panel text-aura-muted"
                  }`}
                >
                  {choice}
                </div>
              ))}
            </div>

            <p className="mt-4 text-sm leading-6 text-aura-muted">
              <span className="font-black text-aura-text">Answer:</span>{" "}
              {question.answer}
            </p>

            <p className="mt-2 text-sm leading-6 text-aura-muted">
              <span className="font-black text-aura-text">Explanation:</span>{" "}
              {question.explanation}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (toolName === "Cards" && isFlashcardsResponse(result)) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-black text-aura-text">
          {result.deck.title}
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          {result.deck.cards.map((card, index) => (
            <div
              key={`${card.prompt}-${index}`}
              className="rounded-2xl border border-aura-border bg-aura-bg-soft p-4"
            >
              <p className="text-xs font-black uppercase tracking-wider text-aura-cyan">
                {card.type === "fill_blank" ? "Fill in the Blank" : "Question"}
              </p>

              <p className="mt-3 text-base font-black leading-7 text-aura-text">
                {card.prompt}
              </p>

              <div className="mt-4 rounded-xl border border-aura-cyan/40 bg-aura-cyan/10 p-3">
                <p className="text-xs font-black uppercase tracking-wider text-aura-cyan">
                  Answer
                </p>

                <p className="mt-1 text-sm font-bold leading-6 text-aura-text">
                  {card.answer}
                </p>
              </div>

              <p className="mt-3 text-sm leading-6 text-aura-muted">
                <span className="font-black text-aura-text">Hint:</span>{" "}
                {card.hint}
              </p>

              <p className="mt-2 text-sm leading-6 text-aura-muted">
                {card.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (toolName === "Tables" && isTablesResponse(result)) {
    return (
      <div>
        <h3 className="text-xl font-black text-aura-text">
          {result.table.title}
        </h3>

        <p className="mt-2 text-sm leading-6 text-aura-muted">
          {result.table.description}
        </p>

        <div className="aura-scrollbar mt-5 overflow-x-auto rounded-2xl border border-aura-border">
          <table className="w-full min-w-[680px] border-collapse bg-aura-bg-soft text-left text-sm">
            <thead className="bg-aura-panel text-xs uppercase tracking-wider text-aura-dim">
              <tr>
                {result.table.columns.map((column) => (
                  <th key={column.key} className="border-b border-aura-border px-4 py-3">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {result.table.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-b border-aura-border/70 last:border-0">
                  {result.table.columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 leading-6 text-aura-muted">
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (toolName === "Mind Map" && isMindMapResponse(result)) {
    return (
      <div>
        <div className="rounded-[1.5rem] border border-aura-cyan/40 bg-aura-cyan/10 p-5 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-aura-cyan">
            Center Topic
          </p>

          <h3 className="mt-2 text-2xl font-black text-aura-text">
            {result.mindMap.center}
          </h3>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-aura-muted">
            {result.mindMap.description}
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {result.mindMap.branches.map((branch, index) => (
            <div
              key={`${branch.title}-${index}`}
              className="rounded-2xl border border-aura-border bg-aura-bg-soft p-4"
            >
              <p className="text-xs font-black uppercase tracking-wider text-aura-cyan">
                Branch {index + 1}
              </p>

              <h4 className="mt-2 text-lg font-black text-aura-text">
                {branch.title}
              </h4>

              <p className="mt-2 text-sm leading-6 text-aura-muted">
                {branch.summary}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {branch.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-aura-border bg-aura-panel px-3 py-1 text-xs font-bold text-aura-muted"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (toolName === "Slides" && isSlidesResponse(result)) {
    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-black text-aura-text">
            {result.deck.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-aura-muted">
            {result.deck.description}
          </p>
        </div>

        {result.deck.slides.map((slide) => (
          <div
            key={slide.slideNumber}
            className="rounded-2xl border border-aura-border bg-aura-bg-soft p-5"
          >
            <p className="text-xs font-black uppercase tracking-wider text-aura-cyan">
              Slide {slide.slideNumber}
            </p>

            <h4 className="mt-2 text-xl font-black text-aura-text">
              {slide.title}
            </h4>

            <p className="mt-1 text-sm font-semibold text-aura-muted">
              {slide.subtitle}
            </p>

            <ul className="mt-4 space-y-2">
              {slide.bullets.map((bullet) => (
                <li key={bullet} className="text-sm leading-6 text-aura-muted">
                  • {bullet}
                </li>
              ))}
            </ul>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-aura-border bg-aura-panel p-3">
                <p className="text-xs font-black uppercase tracking-wider text-aura-dim">
                  Speaker Notes
                </p>

                <p className="mt-2 text-sm leading-6 text-aura-muted">
                  {slide.speakerNotes}
                </p>
              </div>

              <div className="rounded-xl border border-aura-border bg-aura-panel p-3">
                <p className="text-xs font-black uppercase tracking-wider text-aura-dim">
                  Visual Idea
                </p>

                <p className="mt-2 text-sm leading-6 text-aura-muted">
                  {slide.visualIdea}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (toolName === "Audio" && isAudioResponse(result)) {
    return (
      <div className="space-y-4">
        <div className="rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-aura-cyan">
            Audio Overview
          </p>

          <h3 className="mt-2 text-2xl font-black text-aura-text">
            {result.audioOverview.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-aura-muted">
            {result.audioOverview.description}
          </p>

          <p className="mt-3 text-xs font-black uppercase tracking-wider text-aura-dim">
            Estimated Duration: {result.audioOverview.estimatedDuration}
          </p>
        </div>

        <div className="space-y-3">
          {result.audioOverview.segments.map((segment, index) => (
            <div
              key={`${segment.speaker}-${index}`}
              className="rounded-2xl border border-aura-border bg-aura-bg-soft p-4"
            >
              <p className="text-xs font-black uppercase tracking-wider text-aura-cyan">
                {segment.speaker}
              </p>

              <p className="mt-2 text-sm leading-6 text-aura-muted">
                {segment.text}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-aura-cyan/40 bg-aura-cyan/10 p-4">
          <p className="text-xs font-black uppercase tracking-wider text-aura-cyan">
            Recap
          </p>

          <ul className="mt-3 space-y-2">
            {result.audioOverview.recap.map((item) => (
              <li key={item} className="text-sm leading-6 text-aura-muted">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return <FallbackJsonView result={result} />;
};

export default AIToolResultRenderer;