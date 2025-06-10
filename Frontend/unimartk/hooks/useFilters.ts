import { useQueryState, parseAsString } from "nuqs";
import { useMemo, useEffect } from "react";
import { PriceFilters, AllFilters, FilterActions, FilterState } from "@/types/filters";
import { useProducts } from "./useProducts";
import { useCategoryState } from "./useCategoryState";
import { useSearchState } from "./useSearchState";
import { usePagination } from "./usePagination";

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
  initialCategory?: string;
  initialSubcategory?: string;
}

interface UseFiltersReturn extends FilterState, FilterActions {
  // Products data
  products: any[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  
  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  
  // Additional state
  isSearching: boolean;
  
  // Debug info
  debug: {
    initialCategory: string | undefined;
    initialSubcategory: string | undefined;
    activeCategory: string;
    activeSubcategory: string;
    displayCategory: string;
    displaySubcategory: string;
  };
}

export function useFilters(props?: UseFiltersProps): UseFiltersReturn {
  const { initialCategory = "", initialSubcategory = "" } = props || {};
  
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
  const categoryState = useCategoryState();
  
  // Search state with debouncing
  const { debouncedSearchTerm, isSearching } = useSearchState(search);
  
  // Set initial values when component mounts or props change
  useEffect(() => {
    if (initialCategory && initialSubcategory) {
      categoryState.setBothCategoryAndSubcategory(initialCategory, initialSubcategory);
    } else if (initialCategory && !initialSubcategory) {
      categoryState.handleCategorySelect(initialCategory);
    } else if (!initialCategory && !initialSubcategory) {
      categoryState.clearAllCategories();
    }
  }, [initialCategory, initialSubcategory]);

  // Determine active and display categories
  const activeCategory = urlCategory || categoryState.selectedCategory || initialCategory;
  const activeSubcategory = urlSubcategory || categoryState.selectedSubcategory || initialSubcategory;
  const displayCategory = categoryState.selectedCategory || initialCategory;
  const displaySubcategory = categoryState.selectedSubcategory || initialSubcategory;

  // Memoized filters
  const priceFilters = useMemo((): PriceFilters => ({
    minPrice,
    maxPrice,
    pickupLocation,
  }), [minPrice, maxPrice, pickupLocation]);

  const allFilters = useMemo((): AllFilters => ({
    ...priceFilters,
    category: activeCategory,
    subcategory: activeSubcategory,
  }), [priceFilters, activeCategory, activeSubcategory]);

  // Pagination that resets when filters change
  const pagination = usePagination([
    debouncedSearchTerm,
    priceFilters,
    activeCategory,
    activeSubcategory,
  ]);

  // Products query
  const productsQuery = useProducts(
    pagination.currentPage,
    debouncedSearchTerm,
    activeCategory,
    activeSubcategory,
    priceFilters
  );

  // Filter actions
  const actions: FilterActions = {
    setFilters: (newFilters: PriceFilters) => {
      setMinPrice(newFilters.minPrice);
      setMaxPrice(newFilters.maxPrice);
      setPickupLocation(newFilters.pickupLocation);
      pagination.resetPage();
    },
    setCategory: (category: string) => {
      setUrlCategory(category);
      setUrlSubcategory(""); // Clear subcategory when setting category
      categoryState.handleCategorySelect(category);
      pagination.resetPage();
    },
    setSubcategory: (subcategory: string) => {
      setUrlSubcategory(subcategory);
      categoryState.handleSubcategorySelect(subcategory, activeCategory || undefined);
      pagination.resetPage();
    },
    clearPriceFilters: () => {
      setMinPrice("");
      setMaxPrice("");
      pagination.resetPage();
    },
    clearPickupLocation: () => {
      setPickupLocation("");
      pagination.resetPage();
    },
    clearCategory: () => {
      setUrlCategory("");
      categoryState.clearCategory();
      pagination.resetPage();
    },
    clearSubcategory: () => {
      setUrlSubcategory("");
      categoryState.clearSubcategory();
      pagination.resetPage();
    },
    clearAllFilters: () => {
      setMinPrice("");
      setMaxPrice("");
      setPickupLocation("");
      setUrlCategory("");
      setUrlSubcategory("");
      setSearch("");
      categoryState.clearAllCategories();
      pagination.resetPage();
    },
    setSearch: (newSearch: string) => {
      setSearch(newSearch);
      pagination.resetPage();
    },
    clearSearch: () => {
      setSearch("");
      pagination.resetPage();
    },
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
    filters: priceFilters,
    allFilters,
    search,
    category: activeCategory,
    subcategory: activeSubcategory,
    
    // Products data
    products: productsQuery.data || [],
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    error: productsQuery.error,
    
    // Pagination
    currentPage: pagination.currentPage,
    setCurrentPage: pagination.setCurrentPage,
    
    // Actions
    ...actions,
    
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