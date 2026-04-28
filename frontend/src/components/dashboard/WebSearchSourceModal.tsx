import { useEffect, useRef } from "react";
import { useWebSearchSources } from "../../hooks/useWebSearchSources";
import type { SourceUploadPayload } from "./dashboardTypes";

type WebSearchSourceModalProps = {
  isOpen: boolean;
  initialQuery: string;
  moduleId?: string;
  isImporting: boolean;
  onClose: () => void;
  onImportSources: (payloads: SourceUploadPayload[]) => void;
};

const WebSearchSourceModal = ({
  isOpen,
  initialQuery,
  moduleId,
  isImporting,
  onClose,
  onImportSources,
}: WebSearchSourceModalProps) => {
  const lastAutoSearchRef = useRef("");

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
    searchWithQuery,
    handleToggleResult,
    selectAllResults,
    clearSelectedResults,
    resetSearch,
  } = useWebSearchSources({
    moduleId,
    maxResults: 5,
  });

  useEffect(() => {
    if (!isOpen) return;

    const cleanQuery = initialQuery.trim();
    if (!cleanQuery) return;

    setQuery(cleanQuery);

    if (lastAutoSearchRef.current === cleanQuery) return;

    lastAutoSearchRef.current = cleanQuery;
    searchWithQuery(cleanQuery);
  }, [isOpen, initialQuery]);

  const handleClose = () => {
    if (isSearching || isImporting) return;

    lastAutoSearchRef.current = "";
    resetSearch();
    onClose();
  };

  const handleImportSelected = () => {
    if (selectedResults.length === 0 || isImporting) return;

    const payloads = selectedResults.map<SourceUploadPayload>((result) => ({
      sourceType: "website",
      title: result.title,
      value: result.url,
      originalUrl: result.url,
      summary: result.snippet,
      status: "pending",
      statusMessage: "Waiting to read source...",
      parserProvider: "web-search-ai-agent",
    }));

    onImportSources(payloads);
    lastAutoSearchRef.current = "";
    resetSearch();
    onClose();
  };

  if (!isOpen) return null;

  const hasResults = results.length > 0;
  const allSelected = hasResults && selectedUrls.length === results.length;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-aura-bg/80 px-3 py-3 backdrop-blur-xl">
      <div className="relative flex max-h-[94vh] w-full max-w-[1500px] flex-col overflow-hidden rounded-[2rem] border border-aura-border bg-aura-panel shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
        {(isSearching || isImporting) && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-aura-bg/70 px-6 backdrop-blur-md">
            <div className="w-full max-w-xl rounded-[2rem] border border-aura-cyan/25 bg-aura-panel/95 p-8 text-center shadow-[0_30px_100px_rgba(34,211,238,0.16)]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-aura-cyan/30 bg-aura-cyan/10">
                <span className="h-7 w-7 animate-spin rounded-full border-2 border-aura-cyan/30 border-t-aura-cyan" />
              </div>

              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.28em] text-aura-cyan">
                Web Source Finder
              </p>

              <h3 className="mt-3 text-2xl font-black text-aura-text">
                {isImporting ? "Importing sources..." : "Searching sources..."}
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-aura-muted">
                Aura is looking for 5 useful educational links for this module.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-start justify-between gap-4 border-b border-aura-border px-6 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-aura-cyan">
              Web Source Finder
            </p>

            <h2 className="mt-2 text-2xl font-black text-aura-text">
              Search web sources
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-aura-muted">
              Review the 5 suggested links, then select one or more to add as
              context sources for this module.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSearching || isImporting}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-aura-border bg-aura-bg-soft text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text disabled:opacity-50"
            aria-label="Close web search modal"
          >
            ✕
          </button>
        </div>

        <div className="aura-scrollbar min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <div className="rounded-[1.7rem] border border-aura-border bg-aura-bg-soft p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSearch();
                  }
                }}
                disabled={isSearching || isImporting}
                placeholder="Search a topic, lesson, or concept..."
                className="min-w-0 flex-1 rounded-2xl border border-aura-border bg-aura-panel px-4 py-3 text-sm font-semibold text-aura-text outline-none transition placeholder:text-aura-dim focus:border-aura-cyan/70 disabled:opacity-60"
              />

              <button
                type="button"
                onClick={handleSearch}
                disabled={!query.trim() || isSearching || isImporting}
                className="rounded-2xl bg-aura-cyan px-5 py-3 text-sm font-black text-aura-bg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Search
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
          </div>

          <div className="mt-5 rounded-[1.7rem] border border-aura-border bg-aura-bg-soft p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-aura-cyan">
                  Suggested Links
                </p>

                <p className="mt-1 text-xs font-semibold text-aura-muted">
                  {selectedUrls.length} selected / {results.length} shown
                </p>
              </div>

              {hasResults && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={selectAllResults}
                    disabled={allSelected || isSearching || isImporting}
                    className="rounded-xl border border-aura-border bg-aura-panel px-3 py-2 text-xs font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-cyan disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Select all
                  </button>

                  <button
                    type="button"
                    onClick={clearSelectedResults}
                    disabled={selectedUrls.length === 0 || isSearching || isImporting}
                    className="rounded-xl border border-aura-border bg-aura-panel px-3 py-2 text-xs font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-cyan disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {!hasResults && !isSearching && (
              <div className="mt-4 rounded-2xl border border-aura-border bg-aura-panel px-4 py-8 text-center">
                <div className="text-3xl">🔎</div>
                <h3 className="mt-3 text-base font-black text-aura-text">
                  No links yet
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-aura-muted">
                  Search from the left panel or type another topic above to find
                  source suggestions.
                </p>
              </div>
            )}

            {hasResults && (
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {results.map((result, index) => {
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
                          disabled={isSearching || isImporting}
                          className="mt-1 h-4 w-4 shrink-0 accent-aura-cyan"
                        />

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-aura-border bg-aura-bg-soft text-xs font-black text-aura-muted">
                          {index + 1}
                        </div>

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
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-aura-border px-6 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSearching || isImporting}
            className="rounded-2xl border border-aura-border bg-aura-bg-soft px-5 py-3 text-sm font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-text disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleImportSelected}
            disabled={selectedUrls.length === 0 || isSearching || isImporting}
            className="rounded-2xl bg-gradient-to-r from-aura-primary via-aura-cyan to-aura-gold px-5 py-3 text-sm font-black text-aura-bg transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(34,211,238,0.22)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isImporting
              ? "Importing..."
              : `Import ${selectedUrls.length} selected`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebSearchSourceModal;