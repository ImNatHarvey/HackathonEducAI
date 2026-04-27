import type { N8nTablesResponse } from "../../../lib/n8n";
import { ProviderBadge } from "./resultUtils";

type UnknownRow = Record<string, unknown>;

const normalizeKey = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
};

const stringifyCellValue = (value: unknown): string => {
  if (value === undefined || value === null || value === "") return "";

  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => stringifyCellValue(item)).filter(Boolean).join(", ");
  }

  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>)
      .map((item) => stringifyCellValue(item))
      .filter(Boolean)
      .join(" • ");
  }

  return String(value);
};

const getRowValue = (
  row: UnknownRow,
  column: { key: string; label: string },
  columnIndex: number,
) => {
  const directValue = stringifyCellValue(row[column.key]);
  if (directValue) return directValue;

  const labelValue = stringifyCellValue(row[column.label]);
  if (labelValue) return labelValue;

  const normalizedColumnKey = normalizeKey(column.key);
  const normalizedColumnLabel = normalizeKey(column.label);

  const matchingEntry = Object.entries(row).find(([rowKey]) => {
    const normalizedRowKey = normalizeKey(rowKey);

    return (
      normalizedRowKey === normalizedColumnKey ||
      normalizedRowKey === normalizedColumnLabel ||
      normalizedRowKey.includes(normalizedColumnKey) ||
      normalizedColumnKey.includes(normalizedRowKey) ||
      normalizedRowKey.includes(normalizedColumnLabel) ||
      normalizedColumnLabel.includes(normalizedRowKey)
    );
  });

  const matchedValue = stringifyCellValue(matchingEntry?.[1]);
  if (matchedValue) return matchedValue;

  const values = Object.values(row);
  const fallbackValue = stringifyCellValue(values[columnIndex]);
  if (fallbackValue) return fallbackValue;

  return "—";
};

const getRowPreview = (row: UnknownRow) => {
  const values = Object.values(row)
    .map((value) => stringifyCellValue(value))
    .filter(Boolean);

  if (values.length > 0) return values.join(" • ");

  return JSON.stringify(row);
};

const SavedTablesResult = ({ result }: { result: N8nTablesResponse }) => {
  const columns = result.table.columns ?? [];
  const rows = (result.table.rows ?? []) as UnknownRow[];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-aura-cyan">
            Saved Table
          </p>

          <h3 className="mt-1 text-xl font-black text-aura-text">
            {result.table.title}
          </h3>

          <p className="mt-2 text-sm leading-6 text-aura-muted">
            {result.table.description}
          </p>
        </div>

        <ProviderBadge result={result} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-4">
          <p className="text-2xl font-black text-aura-text">{columns.length}</p>
          <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-aura-dim">
            Columns
          </p>
        </div>

        <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-4">
          <p className="text-2xl font-black text-aura-text">{rows.length}</p>
          <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-aura-dim">
            Rows
          </p>
        </div>

        <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-4">
          <p className="text-2xl font-black text-aura-text">
            {rows.length > 0 ? "Ready" : "Empty"}
          </p>
          <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-aura-dim">
            Status
          </p>
        </div>
      </div>

      {columns.length > 0 && rows.length > 0 ? (
        <>
          <div className="aura-scrollbar overflow-x-auto rounded-2xl border border-aura-border">
            <table className="w-full min-w-[900px] border-collapse bg-aura-bg-soft text-left text-sm">
              <thead className="bg-aura-panel text-xs uppercase tracking-wider text-aura-dim">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={`${column.key}-${column.label}`}
                      className="border-b border-aura-border px-4 py-4"
                    >
                      {column.label || column.key}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-b border-aura-border/70 last:border-0"
                  >
                    {columns.map((column, columnIndex) => {
                      const value = getRowValue(row, column, columnIndex);

                      return (
                        <td
                          key={`${column.key}-${columnIndex}`}
                          className="align-top px-4 py-4 leading-6 text-aura-muted"
                        >
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="rounded-2xl border border-aura-border bg-aura-bg-soft p-4"
              >
                <p className="text-xs font-black uppercase tracking-wider text-aura-cyan">
                  Row {rowIndex + 1}
                </p>

                <div className="mt-3 space-y-3">
                  {columns.map((column, columnIndex) => {
                    const value = getRowValue(row, column, columnIndex);

                    return (
                      <div
                        key={`${column.key}-${columnIndex}`}
                        className="rounded-xl border border-aura-border bg-aura-panel p-3"
                      >
                        <p className="text-[10px] font-black uppercase tracking-wider text-aura-dim">
                          {column.label || column.key}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-aura-muted">
                          {value}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {columns.every(
                  (column, columnIndex) =>
                    getRowValue(row, column, columnIndex) === "—",
                ) && (
                  <div className="mt-3 rounded-xl border border-aura-gold/30 bg-aura-gold/10 p-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-aura-gold">
                      Raw Row Preview
                    </p>
                    <p className="mt-1 text-xs leading-5 text-aura-muted">
                      {getRowPreview(row)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-aura-border bg-aura-bg-soft p-6 text-center">
          <p className="text-lg font-black text-aura-text">No table rows found</p>
          <p className="mt-2 text-sm leading-6 text-aura-muted">
            The workflow returned a table object, but it has no usable columns or
            rows. Regenerate the table or check the n8n table JSON cleaner node.
          </p>
        </div>
      )}
    </div>
  );
};

export default SavedTablesResult;