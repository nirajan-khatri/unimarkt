// hooks/useProductFilters.ts
import { useProducts } from "@/hooks/useProducts";
import { useUrlFilters } from "./useUrlFilters";
import { useCategoryState } from "./useCategoryState";
import { useSearchState } from "./useSearchState";
import { usePagination } from "./usePagination";

export function useProductFilters() {
  // URL-based filters
  const urlFilters = useUrlFilters();
  
  // Category state
  const categoryState = useCategoryState();
  
  // Search state with debouncing
  const { debouncedSearchTerm, isSearching } = useSearchState(urlFilters.search);
  
  // Pagination that resets when filters change
  const pagination = usePagination([
    debouncedSearchTerm,
    urlFilters.filters,
    categoryState.selectedCategory,
    categoryState.selectedSubcategory,
  ]);

  // Products query
  const productsQuery = useProducts(
    pagination.currentPage,
    debouncedSearchTerm,
    categoryState.selectedCategory,
    categoryState.selectedSubcategory,
    urlFilters.filters
  );

  // Combined clear all functionality
  const clearAllFilters = () => {
    urlFilters.clearAllFilters();
    categoryState.clearAllCategories();
    pagination.resetPage();
  };

  // Filter handlers that also reset pagination
  const handleCategorySelect = (category: string) => {
    categoryState.handleCategorySelect(category);
    pagination.resetPage();
  };

  const handleSubcategorySelect = (subcategory: string) => {
    categoryState.handleSubcategorySelect(subcategory);
    pagination.resetPage();
  };

  return {
    // State
    filters: urlFilters.filters,
    search: urlFilters.search,
    selectedCategory: categoryState.selectedCategory,
    selectedSubcategory: categoryState.selectedSubcategory,
    currentPage: pagination.currentPage,
    
    // Products data
    products: productsQuery.data || [],
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    error: productsQuery.error,
    
    // Actions
    setFilters: urlFilters.setFilters,
    setSearch: urlFilters.setSearch,
    handleCategorySelect,
    handleSubcategorySelect,
    setCurrentPage: pagination.setCurrentPage,
    
    // Clear actions
    clearAllFilters,
    clearPriceFilters: urlFilters.clearPriceFilters,
    clearPickupLocation: urlFilters.clearPickupLocation,
    clearCategory: categoryState.clearCategory,
    clearSubcategory: categoryState.clearSubcategory,
    clearSearch: urlFilters.clearSearch,
    
    // Computed properties
    hasAnyFilters: urlFilters.hasFilters || categoryState.hasAnyCategory || urlFilters.hasSearch,
    isSearching,
  };
}