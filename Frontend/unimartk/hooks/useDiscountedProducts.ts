import { useQueryState, parseAsString } from "nuqs";
import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDiscountedProducts } from "@/services/products";
import { PaginatedProductsResponse } from "@/modules/products/types";

// URL parsers for discounted products
const discountedProductParamsParsers = {
  search: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
};

interface UseDiscountedProductsReturn {
  // State
  search: string;
  products: PaginatedProductsResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  currentPage: number;
  pageSize: number;
  sortField: 'created_at' | 'price';
  sortOrder: 'asc' | 'desc';

  // Actions
  setSearch: (search: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  setSortField: (field: 'created_at' | 'price') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;

  // Clear actions
  clearSearch: () => void;

  // Computed
  hasSearch: boolean;
  showPagination: boolean;

  // Additional state
  isSearching: boolean;
}

export function useDiscountedProducts(): UseDiscountedProductsReturn {
  // URL state management
  const [search, setSearch] = useQueryState(
    "search",
    discountedProductParamsParsers.search
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  // Sorting state
  const [sortField, setSortField] = useState<'created_at' | 'price'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Determine ordering string for API
  const ordering = useMemo(() => {
    let prefix = sortOrder === 'desc' ? '-' : '';
    return `${prefix}${sortField}`;
  }, [sortField, sortOrder]);

  // Debounced search term
  const debouncedSearchTerm = useMemo(() => {
    return search || "";
  }, [search]);

  // Products query
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["discountedProducts", currentPage, debouncedSearchTerm, ordering, pageSize],
    queryFn: () => fetchDiscountedProducts(debouncedSearchTerm, ordering),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // Pagination handlers
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onPageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Clear actions
  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
  };

  // Computed properties
  const hasSearch = !!search;
  const showPagination = !isLoading && !isError && products && products.count > 0;

  return {
    // State
    search,
    products: products || null,
    isLoading,
    isError,
    error: error as Error | null,
    currentPage,
    pageSize,
    sortField,
    sortOrder,

    // Actions
    setSearch,
    onPageChange,
    onPageSizeChange,
    setSortField,
    setSortOrder,

    // Clear actions
    clearSearch,

    // Computed
    hasSearch,
    showPagination,

    // Additional state
    isSearching: false, // Since we're not using debounced search for discounted products
  };
} 