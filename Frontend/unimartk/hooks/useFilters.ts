import { useQueryState, parseAsString } from "nuqs";
import { useMemo, useEffect, useState } from "react";
import { PriceFilters, AllFilters, FilterActions, FilterState } from "@/types/filters";
import { useProducts } from "./useProducts";
import { useCategoryState } from "./useCategoryState";
import { useSearchState } from "./useSearchState";
import { usePagination } from "./usePagination";
import { PaginatedProductsResponse } from "@/modules/products/types";

// URL parsers for filters
const filterParamsParsers = {
  minPrice: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
  maxPrice: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
  pickupLocation: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
  category: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
  subcategory: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
  search: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
};

interface UseFiltersProps {
  initialCategory?: string | null;
  initialSubcategory?: string | null;
}

interface UseFiltersReturn {
  // State
  filters: PriceFilters;
  search: string;
  category: string | null;
  subcategory: string | null;
  products: PaginatedProductsResponse | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  currentPage: number;
  pageSize: number;
  
  // Actions
  setFilters: (filters: PriceFilters) => void;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setSubcategory: (subcategory: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  
  // Clear actions
  clearPriceFilters: () => void;
  clearPickupLocation: () => void;
  clearCategory: () => void;
  clearSubcategory: () => void;
  clearAllFilters: () => void;
  
  // Computed
  hasAnyFilters: boolean;

  // Additional state
  isSearching: boolean;
  
  // Debug info
  debug: {
    initialCategory: string | null;
    initialSubcategory: string | null;
    activeCategory: string | null;
    activeSubcategory: string | null;
    displayCategory: string | null;
    displaySubcategory: string | null;
  };
}

export function useFilters({ initialCategory = null, initialSubcategory = null }: UseFiltersProps = {}): UseFiltersReturn {
  // URL state management
  const [minPrice, setMinPrice] = useQueryState(
    "minPrice",
    filterParamsParsers.minPrice
  );
  const [maxPrice, setMaxPrice] = useQueryState(
    "maxPrice",
    filterParamsParsers.maxPrice
  );
  const [pickupLocation, setPickupLocation] = useQueryState(
    "pickupLocation",
    filterParamsParsers.pickupLocation
  );
  const [urlCategory, setUrlCategory] = useQueryState(
    "category",
    filterParamsParsers.category
  );
  const [urlSubcategory, setUrlSubcategory] = useQueryState(
    "subcategory",
    filterParamsParsers.subcategory
  );
  const [search, setSearch] = useQueryState(
    "search",
    filterParamsParsers.search
  );

  // Category state management
  const categoryState = useCategoryState({ initialCategory, initialSubcategory });
  
  // Search state with debouncing
  const { debouncedSearchTerm, isSearching } = useSearchState(search);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  // Memoized filters
  const filters = useMemo((): PriceFilters => ({
    minPrice: minPrice || "",
    maxPrice: maxPrice || "",
    pickupLocation: pickupLocation || "",
  }), [minPrice, maxPrice, pickupLocation]);

  // Determine active and display categories
  const activeCategory = urlCategory || categoryState.selectedCategory || initialCategory;
  const activeSubcategory = urlSubcategory || categoryState.selectedSubcategory || initialSubcategory;
  const displayCategory = categoryState.selectedCategory || initialCategory;
  const displaySubcategory = categoryState.selectedSubcategory || initialSubcategory;

  // Products query
  const { data: products, isLoading, isError, error } = useProducts(
    currentPage,
    debouncedSearchTerm,
    categoryState.selectedCategory,
    categoryState.selectedSubcategory,
    filters,
    pageSize
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, categoryState.selectedCategory, categoryState.selectedSubcategory, filters]);

  // Filter actions
  const actions: FilterActions = {
    setFilters: (newFilters: PriceFilters) => {
      setMinPrice(newFilters.minPrice);
      setMaxPrice(newFilters.maxPrice);
      setPickupLocation(newFilters.pickupLocation);
      setCurrentPage(1);
    },
    setCategory: (category: string) => {
      setUrlCategory(category);
      setUrlSubcategory(""); // Clear subcategory when setting category
      categoryState.handleCategorySelect(category);
      setCurrentPage(1);
    },
    setSubcategory: (subcategory: string) => {
      setUrlSubcategory(subcategory);
      categoryState.handleSubcategorySelect(subcategory);
      setCurrentPage(1);
    },
    clearPriceFilters: () => {
      setMinPrice("");
      setMaxPrice("");
      setCurrentPage(1);
    },
    clearPickupLocation: () => {
      setPickupLocation("");
      setCurrentPage(1);
    },
    clearCategory: () => {
      setUrlCategory("");
      categoryState.clearCategory();
      setCurrentPage(1);
    },
    clearSubcategory: () => {
      setUrlSubcategory("");
      categoryState.clearSubcategory();
      setCurrentPage(1);
    },
    clearAllFilters: () => {
      setMinPrice("");
      setMaxPrice("");
      setPickupLocation("");
      setUrlCategory("");
      setUrlSubcategory("");
      setSearch("");
      categoryState.clearCategory();
      categoryState.clearSubcategory();
      setCurrentPage(1);
    },
    setSearch: (newSearch: string) => {
      setSearch(newSearch);
      setCurrentPage(1);
    },
    clearSearch: () => {
      setSearch("");
      setCurrentPage(1);
    },
  };

  // Pagination handlers
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onPageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Computed properties
  const computed = {
    hasFilters: !!(minPrice || maxPrice || pickupLocation),
    hasPriceFilters: !!(minPrice || maxPrice),
    hasLocationFilter: !!pickupLocation,
    hasCategoryFilters: !!(activeCategory || activeSubcategory),
    hasSearch: !!search,
    hasAnyFilters: !!(minPrice || maxPrice || pickupLocation || search),
  };

  return {
    // State
    filters,
    search,
    category: activeCategory,
    subcategory: activeSubcategory,
    products: products || null,
    isLoading,
    isError,
    error: error as Error | null,
    currentPage,
    pageSize,
    
    // Actions
    ...actions,
    
    // Pagination handlers
    onPageChange,
    onPageSizeChange,
    
    // Computed
    ...computed,
    
    // Additional state
    isSearching,
    
    // Debug info
    debug: {
      initialCategory,
      initialSubcategory,
      activeCategory,
      activeSubcategory,
      displayCategory,
      displaySubcategory,
    }
  };
} 