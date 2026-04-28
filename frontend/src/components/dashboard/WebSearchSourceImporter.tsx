import type { KeyboardEvent } from "react";
import { useWebSearchSources } from "../../hooks/useWebSearchSources";
import type { SourceUploadPayload } from "./dashboardTypes";

type WebSearchSourceImporterProps = {
  moduleId?: string;
  isImporting: boolean;
  onImportSources: (payloads: SourceUploadPayload[]) => void;
};

const WebSearchSourceImporter = ({
  moduleId,
  isImporting,
  onImportSources,
}: WebSearchSourceImporterProps) => {
  const {
    query,
    setQuery,
    results,
    selectedUrls,
    selectedResults,
    isSearching,
    searchError,
    lastResponse,
    providerLabel,
    handleSearch,
    handleToggleResult,
    resetSearch,
  } = useWebSearchSources({
    moduleId,
    maxResults: 5,
  });

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleImportSelected = () => {
    if (selectedResults.length === 0 || isImporting) return;

    const payloads = selectedResults.map<SourceUploadPayload>((result) => ({
      sourceType: "website",
      title: result.title,
      value: result.url,
    }));

    onImportSources(payloads);
    resetSearch();
  };

  return (
    <div className="rounded-[1.5rem] border border-aura-border bg-aura-bg-soft p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-aura-cyan/10 text-2xl">
          🔎
        </div>

        <div>
          <h3 className="text-base font-black text-aura-text">
            Search web sources
          </h3>

          <p className="mt-1 text-sm leading-6 text-aura-muted">
            Use the Web Search AI Agent pipeline to suggest educational sources,
            then import selected links into Study Aura.
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Example: neural network backpropagation beginner guide"
          className="min-w-0 flex-1 rounded-2xl border border-aura-border bg-aura-panel px-4 py-3 text-sm font-semibold text-aura-text outline-none transition placeholder:text-aura-dim focus:border-aura-cyan/70"
        />

        <button
          type="button"
          onClick={handleSearch}
          disabled={!query.trim() || isSearching || isImporting}
          className="rounded-2xl bg-aura-cyan px-4 py-3 text-sm font-black text-aura-bg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSearching ? "Searching..." : "Search"}
        </button>
      </div>

      {searchError && (
        <div className="mt-4 rounded-2xl border border-yellow-400/30 bg-yellow-500/10 px-4 py-3 text-sm font-semibold leading-6 text-yellow-100">
          {searchError}
        </div>
      )}

      {lastResponse?.message && !searchError && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold text-aura-muted">
          <span>{lastResponse.message}</span>

          {providerLabel && (
            <span className="rounded-full border border-aura-border bg-aura-panel px-3 py-1 text-aura-cyan">
              {providerLabel}
            </span>
          )}
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-aura-dim">
                Top Results
              </p>

              <p className="mt-1 text-xs font-semibold text-aura-muted">
                {selectedUrls.length} selected / {results.length} shown
              </p>
            </div>

            <button
              type="button"
              onClick={handleImportSelected}
              disabled={selectedUrls.length === 0 || isImporting}
              className="rounded-xl border border-aura-cyan/40 bg-aura-cyan/10 px-3 py-2 text-xs font-black text-aura-cyan transition hover:bg-aura-cyan hover:text-aura-bg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isImporting
                ? "Importing..."
                : `Import ${selectedUrls.length} selected`}
            </button>
          </div>

          <div className="max-h-[360px] space-y-3 overflow-y-auto pr-1">
            {results.map((result) => {
              const isSelected = selectedUrls.includes(result.url);

              return (
                <label
                  key={result.url}
                  className={`block cursor-pointer rounded-2xl border p-4 transition hover:-translate-y-0.5 ${
                    isSelected
                      ? "border-aura-cyan/60 bg-aura-cyan/10"
                      : "border-aura-border bg-aura-panel hover:border-aura-cyan/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleResult(result.url)}
                      className="mt-1 h-4 w-4 shrink-0 accent-aura-cyan"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-black leading-5 text-aura-text">
                        {result.title}
                      </p>

                      <p className="mt-1 truncate text-xs font-semibold text-aura-cyan">
                        {result.url}
                      </p>

                      <p className="mt-2 line-clamp-3 text-xs leading-5 text-aura-muted">
                        {result.snippet || "No preview snippet provided."}
                      </p>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WebSearchSourceImporter;