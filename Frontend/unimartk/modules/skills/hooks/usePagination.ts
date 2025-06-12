// hooks/usePagination.ts
import { useState, useEffect, useCallback } from "react";

export function usePagination(dependencies: any[] = []) {
  const [currentPage, setCurrentPage] = useState(1);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Reset page when dependencies change
  useEffect(() => {
    setCurrentPage(1);
  }, dependencies);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, page));
  }, []);

  const nextPage = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  }, []);

  return {
    currentPage,
    setCurrentPage: goToPage,
    resetPage,
    nextPage,
    prevPage,
    isFirstPage: currentPage === 1,
  };
}