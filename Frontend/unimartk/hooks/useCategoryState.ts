// hooks/useCategoryState.ts
import { useState } from "react";

interface UseCategoryStateProps {
  initialCategory?: string | null;
  initialSubcategory?: string | null;
}

interface UseCategoryStateReturn {
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  handleCategorySelect: (category: string) => void;
  handleSubcategorySelect: (subcategory: string) => void;
  clearCategory: () => void;
  clearSubcategory: () => void;
}

export function useCategoryState({ 
  initialCategory = null, 
  initialSubcategory = null 
}: UseCategoryStateProps = {}): UseCategoryStateReturn {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(initialSubcategory);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null); // Clear subcategory when category changes
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
  };

  const clearCategory = () => {
    setSelectedCategory(null);
    setSelectedSubcategory(null); // Clear subcategory when clearing category
  };

  const clearSubcategory = () => {
    setSelectedSubcategory(null);
  };

  return {
    selectedCategory,
    selectedSubcategory,
    handleCategorySelect,
    handleSubcategorySelect,
    clearCategory,
    clearSubcategory,
  };
}