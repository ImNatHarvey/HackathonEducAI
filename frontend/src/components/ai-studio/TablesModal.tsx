import { useMemo, useState } from "react";
import ErrorState from "../states/ErrorState";
import LoadingState from "../states/LoadingState";
import { currentUser } from "../user/userMock";
import { generateTablesWithN8n } from "../../lib/n8n";
import type {
  StudyTableColumn,
  StudyTableRow,
  StudyTableType,
  TableDifficulty,
} from "../../lib/n8n";

const difficultyOptions: {
  label: string;
  value: TableDifficulty;
  rowCount: number;
  description: string;
}[] = [
  {
    label: "Easy",
    value: "easy",
    rowCount: 5,
    description: "5 beginner-friendly rows",
  },
  {
    label: "Medium",
    value: "medium",
    rowCount: 8,
    description: "8 balanced learning rows",
  },
  {
    label: "Hard",
    value: "hard",
    rowCount: 12,
    description: "12 detailed mastery rows",
  },
];

const tableTypes: {
  label: string;
  value: StudyTableType;
  description: string;
}[] = [
  {
    label: "Concept Comparison",
    value: "concept_comparison",
    description: "Compare key ideas side by side",
  },
  {
    label: "Term Definition",
    value: "term_definition",
    description: "Turn important terms into a study glossary",
  },
  {
    label: "Process Steps",
    value: "process_steps",
    description: "Break a process into clear stages",
  },
  {
    label: "Cause and Effect",
    value: "cause_effect",
    description: "Show causes, effects, and explanations",
  },
];

const TablesModal = () => {
  const [difficulty, setDifficulty] = useState<TableDifficulty>("easy");
  const [tableType, setTableType] =
    useState<StudyTableType>("concept_comparison");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [columns, setColumns] = useState<StudyTableColumn[]>([]);
  const [rows, setRows] = useState<StudyTableRow[]>([]);
  const [fallback, setFallback] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const selectedDifficulty = useMemo(() => {
    return (
      difficultyOptions.find((option) => option.value === difficulty) ??
      difficultyOptions[0]
    );
  }, [difficulty]);

  const selectedTableType = useMemo(() => {
    return (
      tableTypes.find((option) => option.value === tableType) ?? tableTypes[0]
    );
  }, [tableType]);

  const handleGenerateTable = async () => {
    setError("");
    setFallback(false);
    setIsGenerating(true);

    try {
      const response = await generateTablesWithN8n({
        topic: "Marine Biology 101",
        difficulty,
        tableType,
        rowCount: selectedDifficulty.rowCount,
        userId: currentUser.id,
      });

      setTitle(response.table.title);
      setDescription(response.table.description);
      setColumns(response.table.columns);
      setRows(response.table.rows);
      setFallback(Boolean(response.fallback));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to generate table.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewTable = () => {
    setTitle("");
    setDescription("");
    setColumns([]);
    setRows([]);
    setFallback(false);
    setError("");
  };

  const hasTable = columns.length > 0 && rows.length > 0;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-xl font-black text-aura-text">
          Generate Illustration Table
        </h3>
        <p className="mt-1 text-sm text-aura-muted">
          Create structured study tables for comparison, definitions, steps, or
          cause-and-effect learning.
        </p>
      </div>

      {!hasTable && (
        <>
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
              Table Type
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {tableTypes.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTableType(option.value)}
                  className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                    tableType === option.value
                      ? "border-aura-cyan/70 bg-aura-cyan/10 text-aura-cyan shadow-[0_0_24px_rgba(34,211,238,0.12)]"
                      : "border-aura-border bg-aura-panel text-aura-muted hover:border-aura-cyan/50"
                  }`}
                >
                  <p className="font-black">{option.label}</p>
                  <p className="mt-1 text-sm text-aura-muted">
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
              Difficulty
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {difficultyOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDifficulty(option.value)}
                  className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                    difficulty === option.value
                      ? "border-aura-gold/70 bg-aura-gold/10 text-aura-gold shadow-[0_0_24px_rgba(250,204,21,0.1)]"
                      : "border-aura-border bg-aura-panel text-aura-muted hover:border-aura-gold/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black">{option.label}</p>
                      <p className="mt-1 text-sm text-aura-muted">
                        {option.description}
                      </p>
                    </div>

                    <span className="rounded-full border border-aura-gold/30 bg-aura-gold/10 px-2 py-1 text-xs font-black text-aura-gold">
                      {option.rowCount}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-4">
            <p className="text-sm font-black text-aura-text">
              Selected: {selectedTableType.label} •{" "}
              {selectedDifficulty.label}
            </p>
            <p className="mt-1 text-sm text-aura-muted">
              Study Aura will generate {selectedDifficulty.rowCount} table rows
              for Marine Biology 101.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateTable}
            disabled={isGenerating}
            className="w-full rounded-2xl bg-gradient-to-r from-aura-primary to-aura-cyan py-3 font-black text-white transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isGenerating
              ? "Generating Table..."
              : `Generate ${selectedDifficulty.rowCount}-Row Table`}
          </button>

          {isGenerating && (
            <LoadingState
              title="Generating table..."
              description="Study Aura is building a structured table through n8n."
            />
          )}

          {error && (
            <ErrorState
              title="Table generation failed"
              description={error}
              actionLabel="Try Again"
              onRetry={handleGenerateTable}
            />
          )}
        </>
      )}

      {fallback && hasTable && (
        <div className="rounded-2xl border border-aura-gold/30 bg-aura-gold/10 p-4 text-sm leading-6 text-aura-gold">
          Demo fallback mode is active. Study Aura returned a safe fallback
          table.
        </div>
      )}

      {hasTable && (
        <div className="rounded-[1.75rem] border border-aura-border bg-aura-bg-soft p-5">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-dim">
                Generated Table
              </p>
              <h4 className="mt-1 text-xl font-black text-aura-text">
                {title}
              </h4>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-aura-muted">
                {description}
              </p>
            </div>

            <button
              type="button"
              onClick={handleNewTable}
              className="rounded-2xl border border-aura-pink/40 bg-aura-pink/10 px-4 py-2 text-sm font-black text-aura-pink transition hover:-translate-y-0.5"
            >
              New Table
            </button>
          </div>

          <div className="aura-scrollbar overflow-x-auto rounded-2xl border border-aura-border">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead className="bg-aura-panel">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="border-b border-aura-border px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-aura-cyan"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr
                    key={`${title}-${rowIndex}`}
                    className="transition hover:bg-aura-panel/60"
                  >
                    {columns.map((column) => (
                      <td
                        key={`${column.key}-${rowIndex}`}
                        className="border-b border-aura-border px-4 py-4 align-top text-sm leading-6 text-aura-muted"
                      >
                        {row[column.key] || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablesModal;