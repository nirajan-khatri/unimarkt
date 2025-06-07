// hooks/useCategoryState.ts
import { useState, useCallback } from "react";

export function useCategoryState() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const handleCategorySelect = useCallback((category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
  }, []);

  const handleSubcategorySelect = useCallback((subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setSelectedCategory(null);
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
    clearCategory,
    clearSubcategory,
    clearAllCategories,
    
    // Computed
    hasCategory: !!selectedCategory,
    hasSubcategory: !!selectedSubcategory,
    hasAnyCategory: !!(selectedCategory || selectedSubcategory),
  };
}