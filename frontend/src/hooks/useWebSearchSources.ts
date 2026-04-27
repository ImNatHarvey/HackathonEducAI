import { useState } from "react";
import { currentUser } from "../components/user/userMock";
import {
  searchWebSourcesWithN8n,
  type WebSearchResult,
} from "../lib/n8n";

type UseWebSearchSourcesParams = {
  moduleId?: string;
};

const createFallbackResults = (query: string): WebSearchResult[] => {
  const encodedQuery = encodeURIComponent(query.trim() || "study topic");

  return [
    {
      title: `Search result for ${query}`,
      url: `https://www.google.com/search?q=${encodedQuery}`,
      snippet:
        "Fallback search link. Connect VITE_N8N_WEB_SEARCH_WEBHOOK_URL to return Tavily or search API results.",
    },
  ];
};

export const useWebSearchSources = ({
  moduleId,
}: UseWebSearchSourcesParams) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<WebSearchResult[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const handleSearch = async () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery || isSearching) return;

    setIsSearching(true);
    setSearchError("");
    setResults([]);
    setSelectedUrls([]);

    try {
      const response = await searchWebSourcesWithN8n({
        query: trimmedQuery,
        moduleId,
        maxResults: 5,
        userId: currentUser.id,
      });

      if (!response.success) {
        throw new Error(response.message || "Web search failed.");
      }

      setResults(response.results.slice(0, 5));
    } catch (error) {
      setSearchError(
        error instanceof Error
          ? error.message
          : "Failed to search web sources.",
      );

      setResults(createFallbackResults(trimmedQuery));
    } finally {
      setIsSearching(false);
    }
  };

  const handleToggleResult = (url: string) => {
    setSelectedUrls((currentUrls) =>
      currentUrls.includes(url)
        ? currentUrls.filter((currentUrl) => currentUrl !== url)
        : [...currentUrls, url],
    );
  };

  const resetSearch = () => {
    setQuery("");
    setResults([]);
    setSelectedUrls([]);
    setSearchError("");
    setIsSearching(false);
  };

  return {
    query,
    setQuery,
    results,
    selectedUrls,
    isSearching,
    searchError,
    handleSearch,
    handleToggleResult,
    resetSearch,
  };
};