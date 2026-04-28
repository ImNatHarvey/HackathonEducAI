import { useMemo, useState } from "react";
import { currentUser } from "../components/user/userMock";
import {
  searchWebSourcesWithN8n,
  type N8nWebSearchResponse,
  type WebSearchResult,
} from "../lib/n8n";

type UseWebSearchSourcesParams = {
  moduleId?: string;
  maxResults?: number;
};

export const useWebSearchSources = ({
  moduleId,
  maxResults = 5,
}: UseWebSearchSourcesParams) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WebSearchResult[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [lastResponse, setLastResponse] = useState<N8nWebSearchResponse | null>(
    null,
  );

  const selectedResults = useMemo(() => {
    const selectedSet = new Set(selectedUrls);
    return results.filter((result) => selectedSet.has(result.url));
  }, [results, selectedUrls]);

  const providerLabel = useMemo(() => {
    if (!lastResponse?.provider) return "";
    return lastResponse.fallback
      ? `${lastResponse.provider} fallback`
      : lastResponse.provider;
  }, [lastResponse]);

  const searchWithQuery = async (nextQuery: string) => {
    const trimmedQuery = nextQuery.trim();

    if (!trimmedQuery || isSearching) return;

    setQuery(trimmedQuery);
    setIsSearching(true);
    setSearchError("");
    setResults([]);
    setSelectedUrls([]);
    setLastResponse(null);

    try {
      const response = await searchWebSourcesWithN8n({
        query: trimmedQuery,
        moduleId,
        maxResults,
        userId: currentUser.id,
      });

      setLastResponse(response);

      if (!response.success || response.results.length === 0) {
        throw new Error(
          response.message || "Web Search AI Agent did not return results.",
        );
      }

      setResults(response.results.slice(0, maxResults));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to search web sources.";

      setSearchError(message);
      setResults([]);
      setSelectedUrls([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async () => {
    await searchWithQuery(query);
  };

  const handleToggleResult = (url: string) => {
    setSelectedUrls((currentUrls) =>
      currentUrls.includes(url)
        ? currentUrls.filter((currentUrl) => currentUrl !== url)
        : [...currentUrls, url],
    );
  };

  const selectAllResults = () => {
    setSelectedUrls(results.map((result) => result.url));
  };

  const clearSelectedResults = () => {
    setSelectedUrls([]);
  };

  const resetSearch = () => {
    setQuery("");
    setResults([]);
    setSelectedUrls([]);
    setSearchError("");
    setIsSearching(false);
    setLastResponse(null);
  };

  return {
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
  };
};