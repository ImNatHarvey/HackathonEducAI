import { useEffect, useRef } from "react";
import { useWebSearchSources } from "../../hooks/useWebSearchSources";
import { useToast } from "../toast/ToastProvider";
import { InlineErrorState } from "../states/ErrorState";
import { LoadingOverlay } from "../states/LoadingState";
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
  const lastSearchStateRef = useRef<{
    isSearching: boolean;
    resultCount: number;
    error: string;
    query: string;
  }>({
    isSearching: false,
    resultCount: 0,
    error: "",
    query: "",
  });

  const { showToast } = useToast();

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

    showToast({
      type: "info",
      title: "Searching web sources",
      message: `Finding useful links for ${cleanQuery}.`,
      duration: 2600,
    });

    searchWithQuery(cleanQuery);
  }, [isOpen, initialQuery, searchWithQuery, setQuery, showToast]);

  useEffect(() => {
    if (!isOpen) return;

    const previousState = lastSearchStateRef.current;
    const currentState = {
      isSearching,
      resultCount: results.length,
      error: searchError,
      query,
    };

    if (isSearching && !previousState.isSearching) {
      showToast({
        type: "info",
        title: "Web Source Finder is searching",
        message: query.trim()
          ? `Looking for sources about ${query.trim()}.`
          : "Looking for useful educational links.",
        duration: 2200,
      });
    }

    if (!isSearching && previousState.isSearching) {
      if (searchError) {
        showToast({
          type: "error",
          title: "Web source search failed",
          message: searchError,
          duration: 6500,
        });
      } else if (results.length > 0) {
        showToast({
          type: "success",
          title: "Web sources found",
          message: `${results.length} suggested link${
            results.length === 1 ? "" : "s"
          } ready to review.`,
        });
      } else {
        showToast({
          type: "warning",
          title: "No web sources found",
          message: "Try a more specific topic or keyword.",
        });
      }
    }

    lastSearchStateRef.current = currentState;
  }, [isOpen, isSearching, query, results.length, searchError, showToast]);

  const handleClose = () => {
    if (isSearching || isImporting) return;

    lastAutoSearchRef.current = "";
    lastSearchStateRef.current = {
      isSearching: false,
      resultCount: 0,
      error: "",
      query: "",
    };
    resetSearch();
    onClose();
  };

  const handleRetry = () => {
    if (!query.trim()) {
      showToast({
        type: "warning",
        title: "Search query required",
        message: "Enter a topic or keyword before searching.",
      });
      return;
    }

    showToast({
      type: "info",
      title: "Retrying search",
      message: `Searching again for ${query.trim()}.`,
      duration: 2200,
    });

    searchWithQuery(query);
  };

  const handleManualSearch = () => {
    if (!query.trim()) {
      showToast({
        type: "warning",
        title: "Search query required",
        message: "Enter a topic or keyword before searching.",
      });
      return;
    }

    showToast({
      type: "info",
      title: "Searching web sources",
      message: `Finding useful links for ${query.trim()}.`,
      duration: 2200,
    });

    handleSearch();
  };

  const handleSelectAllResults = () => {
    selectAllResults();

    showToast({
      type: "info",
      title: "All links selected",
      message: `${results.length} suggested link${
        results.length === 1 ? "" : "s"
      } selected for import.`,
      duration: 2500,
    });
  };

  const handleClearSelectedResults = () => {
    clearSelectedResults();

    showToast({
      type: "info",
      title: "Selection cleared",
      message: "No web links are currently selected.",
      duration: 2500,
    });
  };

  const handleImportSelected = () => {
    if (selectedResults.length === 0 || isImporting) {
      showToast({
        type: "warning",
        title: "No links selected",
        message: "Select at least one suggested link before importing.",
      });
      return;
    }

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

    showToast({
      type: "info",
      title: "Importing web sources",
      message: `${payloads.length} source${
        payloads.length === 1 ? "" : "s"
      } selected for your workspace.`,
      duration: 2600,
    });

    onImportSources(payloads);
    lastAutoSearchRef.current = "";
    lastSearchStateRef.current = {
      isSearching: false,
      resultCount: 0,
      error: "",
      query: "",
    };
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
          <LoadingOverlay
            label={isImporting ? "Importing" : "Searching"}
            title={isImporting ? "Importing sources..." : "Searching sources..."}
            description={
              isImporting
                ? "Study Aura is adding the selected links as context sources."
                : "Study Aura is looking for 5 useful educational links for this module."
            }
          />
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
                    handleManualSearch();
                  }
                }}
                disabled={isSearching || isImporting}
                placeholder="Search a topic, lesson, or concept..."
                className="min-w-0 flex-1 rounded-2xl border border-aura-border bg-aura-panel px-4 py-3 text-sm font-semibold text-aura-text outline-none transition placeholder:text-aura-dim focus:border-aura-cyan/70 disabled:opacity-60"
              />

              <button
                type="button"
                onClick={handleManualSearch}
                disabled={!query.trim() || isSearching || isImporting}
                className="rounded-2xl bg-aura-cyan px-5 py-3 text-sm font-black text-aura-bg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Search
              </button>
            </div>

            {searchError && (
              <InlineErrorState
                title="Web search failed"
                description={searchError}
                actionLabel="Retry"
                onRetry={handleRetry}
                className="mt-4"
              />
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
                    onClick={handleSelectAllResults}
                    disabled={allSelected || isSearching || isImporting}
                    className="rounded-xl border border-aura-border bg-aura-panel px-3 py-2 text-xs font-black text-aura-muted transition hover:border-aura-cyan/60 hover:text-aura-cyan disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Select all
                  </button>

                  <button
                    type="button"
                    onClick={handleClearSelectedResults}
                    disabled={
                      selectedUrls.length === 0 || isSearching || isImporting
                    }
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