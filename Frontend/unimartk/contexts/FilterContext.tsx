// contexts/FilterContext.tsx
"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useProductFilters } from '@/hooks/useProductFilters';

type FilterContextType = ReturnType<typeof useProductFilters>;

const FilterContext = createContext<FilterContextType | null>(null);

interface FilterProviderProps {
  children: ReactNode;
}

export function FilterProvider({ children }: FilterProviderProps) {
  const filterState = useProductFilters();

  return (
    <FilterContext.Provider value={filterState}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
}

// Alternative: More specific contexts for better performance
export const SearchContext = createContext<{
  search: string;
  setSearch: (search: string) => void;
  clearSearch: () => void;
} | null>(null);

export const CategoryContext = createContext<{
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  handleCategorySelect: (category: string) => void;
  handleSubcategorySelect: (subcategory: string) => void;
  clearCategory: () => void;
  clearSubcategory: () => void;
} | null>(null);

// Usage in your app
// Wrap your app or specific routes with FilterProvider
// Then use useFilterContext() in any component that needs filter state