import { useMemo } from "react";

export type StudyTableColumn = {
  key: string;
  label: string;
};

export type StudyTableRow = Record<string, unknown>;

export type StudyTableData = {
  title?: string;
  description?: string;
  columns?: StudyTableColumn[];
  rows?: StudyTableRow[];
};

type SavedTablesResultProps = {
  data?: {
    table?: StudyTableData;
    result?: {
      table?: StudyTableData;
    };
    provider?: string;
    fallback?: boolean;
    [key: string]: unknown;
  };
};

const DEFAULT_COLUMNS: StudyTableColumn[] = [
  { key: "concept", label: "Concept" },
  { key: "meaning", label: "Meaning" },
  { key: "example", label: "Example" },
];

function normalizeKey(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function stringifyCellValue(value: unknown): string {
  if (value === null || value === undefined) return "";

  if (typeof value === "string") return value.trim();

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => stringifyCellValue(item))
      .filter(Boolean)
      .join(", ");
  }

  if (typeof value === "object") {
    try {
      const objectValue = value as Record<string, unknown>;

      const preferredKeys = [
        "text",
        "value",
        "label",
        "content",
        "description",
        "meaning",
        "example",
        "answer",
      ];

      for (const key of preferredKeys) {
        const nestedValue = objectValue[key];
        const cleaned = stringifyCellValue(nestedValue);
        if (cleaned) return cleaned;
      }

      return JSON.stringify(value);
    } catch {
      return "";
    }
  }

  return "";
}

function getCellValue(
  row: StudyTableRow,
  column: StudyTableColumn,
  columnIndex: number,
): string {
  const directValue = stringifyCellValue(row[column.key]);
  if (directValue) return directValue;

  const labelValue = stringifyCellValue(row[column.label]);
  if (labelValue) return labelValue;

  const normalizedColumnKey = normalizeKey(column.key);
  const normalizedColumnLabel = normalizeKey(column.label);

  for (const [rowKey, rowValue] of Object.entries(row)) {
    const normalizedRowKey = normalizeKey(rowKey);

    if (
      normalizedRowKey === normalizedColumnKey ||
      normalizedRowKey === normalizedColumnLabel
    ) {
      const matchedValue = stringifyCellValue(rowValue);
      if (matchedValue) return matchedValue;
    }
  }

  const rowValues = Object.values(row);
  const indexedValue = stringifyCellValue(rowValues[columnIndex]);
  if (indexedValue) return indexedValue;

  return "";
}

function isEmptyRow(row: StudyTableRow, columns: StudyTableColumn[]): boolean {
  if (!row || typeof row !== "object") return true;

  const hasColumnValue = columns.some((column, index) => {
    return Boolean(getCellValue(row, column, index));
  });

  if (hasColumnValue) return false;

  return Object.values(row).every((value) => !stringifyCellValue(value));
}

function removeEmptyRows(
  rows: StudyTableRow[],
  columns: StudyTableColumn[],
): StudyTableRow[] {
  return rows.filter((row) => !isEmptyRow(row, columns));
}

function getTablePayload(
  data?: SavedTablesResultProps["data"],
): StudyTableData | undefined {
  if (!data) return undefined;

  if (data.table && typeof data.table === "object") {
    return data.table;
  }

  if (
    data.result &&
    typeof data.result === "object" &&
    data.result.table &&
    typeof data.result.table === "object"
  ) {
    return data.result.table;
  }

  return undefined;
}

function normalizeColumns(
  columns?: StudyTableColumn[],
  rows?: StudyTableRow[],
): StudyTableColumn[] {
  if (Array.isArray(columns) && columns.length > 0) {
    return columns
      .map((column, index) => {
        const key =
          typeof column?.key === "string" && column.key.trim()
            ? column.key.trim()
            : `column_${index + 1}`;

        const label =
          typeof column?.label === "string" && column.label.trim()
            ? column.label.trim()
            : key
                .replace(/_/g, " ")
                .replace(/\b\w/g, (letter) => letter.toUpperCase());

        return { key, label };
      })
      .filter((column) => column.key && column.label);
  }

  if (Array.isArray(rows) && rows.length > 0) {
    const firstNonEmptyRow = rows.find(
      (row) => row && typeof row === "object" && Object.keys(row).length > 0,
    );

    if (firstNonEmptyRow) {
      return Object.keys(firstNonEmptyRow).map((key) => ({
        key,
        label: key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (letter) => letter.toUpperCase()),
      }));
    }
  }

  return DEFAULT_COLUMNS;
}

function normalizeRows(rows?: StudyTableRow[]): StudyTableRow[] {
  if (!Array.isArray(rows)) return [];

  return rows.filter((row) => {
    return row && typeof row === "object" && !Array.isArray(row);
  });
}

function formatProvider(provider?: unknown): string {
  if (typeof provider !== "string" || !provider.trim()) return "AI";
  return provider.trim().toUpperCase();
}

export default function SavedTablesResult({ data }: SavedTablesResultProps) {
  const table = getTablePayload(data);

  const normalized = useMemo(() => {
    const rawRows = normalizeRows(table?.rows);
    const columns = normalizeColumns(table?.columns, rawRows);
    const nonEmptyRows = removeEmptyRows(rawRows, columns);

    return {
      columns,
      rawRows,
      nonEmptyRows,
      emptyRowCount: rawRows.length - nonEmptyRows.length,
    };
  }, [table]);

  const title =
    typeof table?.title === "string" && table.title.trim()
      ? table.title.trim()
      : "Generated Study Table";

  const description =
    typeof table?.description === "string" && table.description.trim()
      ? table.description.trim()
      : "A generated table based on your selected study source.";

  const provider = formatProvider(data?.provider);
  const hasRows = normalized.nonEmptyRows.length > 0;
  const hasOnlyEmptyRows =
    normalized.rawRows.length > 0 && normalized.nonEmptyRows.length === 0;

  return (
    <section className="saved-table-result">
      <div className="saved-table-header">
        <div>
          <div className="saved-result-kicker">Study Table</div>

          <h3 className="saved-result-title">{title}</h3>

          <p className="saved-result-description">{description}</p>
        </div>

        <div className="saved-provider-pill">Generated by {provider}</div>
      </div>

      <div className="saved-table-stats">
        <div className="saved-table-stat-card">
          <strong>{normalized.columns.length}</strong>
          <span>Columns</span>
        </div>

        <div className="saved-table-stat-card">
          <strong>{normalized.nonEmptyRows.length}</strong>
          <span>Filled Rows</span>
        </div>

        <div className="saved-table-stat-card">
          <strong>{normalized.emptyRowCount}</strong>
          <span>Empty Rows Removed</span>
        </div>
      </div>

      {hasRows ? (
        <>
          <div className="saved-table-shell">
            <table className="saved-study-table">
              <thead>
                <tr>
                  {normalized.columns.map((column) => (
                    <th key={column.key}>{column.label}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {normalized.nonEmptyRows.map((row, rowIndex) => (
                  <tr key={`table-row-${rowIndex}`}>
                    {normalized.columns.map((column, columnIndex) => {
                      const value = getCellValue(row, column, columnIndex);

                      return (
                        <td key={`${rowIndex}-${column.key}`}>
                          {value || <span className="saved-table-muted">—</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="saved-table-card-grid">
            {normalized.nonEmptyRows.map((row, rowIndex) => (
              <article
                className="saved-table-row-card"
                key={`row-card-${rowIndex}`}
              >
                <h4>Row {rowIndex + 1}</h4>

                {normalized.columns.map((column, columnIndex) => {
                  const value = getCellValue(row, column, columnIndex);

                  return (
                    <div
                      className="saved-table-row-field"
                      key={`${rowIndex}-${column.key}`}
                    >
                      <span>{column.label}</span>
                      <p>{value || "—"}</p>
                    </div>
                  );
                })}
              </article>
            ))}
          </div>
        </>
      ) : (
        <div className="saved-table-empty-state">
          <div className="saved-table-empty-icon">!</div>

          <div>
            <h4>
              {hasOnlyEmptyRows
                ? "The AI returned empty table rows."
                : "No table rows were found."}
            </h4>

            <p>
              The table structure was generated, but the row values are blank.
              Try generating the table again after checking your selected sources.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}