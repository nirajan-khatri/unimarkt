// hooks/useSearchState.ts
import { useState, useEffect } from "react";

export function useSearchState(searchTerm: string, delay: number = 500) {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, delay);

    return () => clearTimeout(handler);
  }, [searchTerm, delay]);

  return {
    debouncedSearchTerm,
    isSearching: searchTerm !== debouncedSearchTerm,
  };
}