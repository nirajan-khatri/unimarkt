// hooks/useProductFilters.ts
import { useProducts } from "@/hooks/useProducts";
import { useUrlFilters } from "./useUrlFilters";
import { useCategoryState } from "./useCategoryState";
import { useSearchState } from "./useSearchState";
import { usePagination } from "./usePagination";
import { useEffect } from "react";

interface UseProductFiltersProps {
  initialCategory?: string;
  initialSubcategory?: string;
}

export function useProductFilters(props?: UseProductFiltersProps) {
  const { initialCategory, initialSubcategory } = props || {};
  
  // URL-based filters
  const urlFilters = useUrlFilters();
  
  // Category state
  const categoryState = useCategoryState();
  
  // Search state with debouncing
  const { debouncedSearchTerm, isSearching } = useSearchState(urlFilters.search);
  
  // Set initial values when component mounts or props change
  useEffect(() => {
    if (initialCategory && initialSubcategory) {
      // Both category and subcategory from URL
      categoryState.setBothCategoryAndSubcategory(initialCategory, initialSubcategory);
    } else if (initialCategory && !initialSubcategory) {
      // Only category from URL
      categoryState.handleCategorySelect(initialCategory);
    } else if (!initialCategory && !initialSubcategory) {
      // No URL categories, clear all
      categoryState.clearAllCategories();
    }
  }, [initialCategory, initialSubcategory]);

  // Determine the active category and subcategory
  // For API calls, use URL params if available, otherwise use local state
  const activeCategory = initialCategory || categoryState.selectedCategory;
  const activeSubcategory = initialSubcategory || categoryState.selectedSubcategory;
  
  // For display purposes, show what's actually selected
  const displayCategory = categoryState.selectedCategory || initialCategory;
  const displaySubcategory = categoryState.selectedSubcategory || initialSubcategory;
  
  // Pagination that resets when filters change
  const pagination = usePagination([
    debouncedSearchTerm,
    urlFilters.filters,
    activeCategory,
    activeSubcategory,
  ]);

  // Products query with the correct category values
  const productsQuery = useProducts(
    pagination.currentPage,
    debouncedSearchTerm,
    activeCategory,
    activeSubcategory,
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
    // Keep the current category when selecting subcategory
    categoryState.handleSubcategorySelect(subcategory, activeCategory || undefined);
    pagination.resetPage();
  };

  return {
    // State - use display values for UI, active values for API
    filters: urlFilters.filters,
    search: urlFilters.search,
    selectedCategory: displayCategory,
    selectedSubcategory: displaySubcategory,
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
    hasAnyFilters: urlFilters.hasFilters || urlFilters.hasSearch,
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