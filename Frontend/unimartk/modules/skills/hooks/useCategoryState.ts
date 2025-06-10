// hooks/useCategoryState.ts
import { useState, useCallback } from "react";

export function useCategoryState() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null); // Clear subcategory when selecting category
  }, []);

  // Fixed: Don't clear category when selecting subcategory
  const handleSubcategorySelect = useCallback((subcategory: string, category?: string) => {
    setSelectedSubcategory(subcategory);
    // Keep the category if provided, or keep existing category
    if (category) {
      setSelectedCategory(category);
    }
    // Don't clear category - we need both for subcategory pages
  }, []);

  // Set both category and subcategory (for URL-based navigation)
  const setBothCategoryAndSubcategory = useCallback((category: string, subcategory: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
  }, []);

  const clearCategory = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  const clearSubcategory = useCallback(() => {
    setSelectedSubcategory(null);
  }, []);

  const clearAllCategories = useCallback(() => {
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  }, []);

  return {
    // State
    selectedCategory,
    selectedSubcategory,
    
    // Actions
    handleCategorySelect,
    handleSubcategorySelect,
    setBothCategoryAndSubcategory,
    clearCategory,
    clearSubcategory,
    clearAllCategories,
    
    // Computed
    hasCategory: !!selectedCategory,
    hasSubcategory: !!selectedSubcategory,
    hasAnyCategory: !!(selectedCategory || selectedSubcategory),
  };
}