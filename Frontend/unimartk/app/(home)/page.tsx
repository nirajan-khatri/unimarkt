"use client";

import * as React from "react";
import { Sidebar } from "@/modules/home/ui/components/Sidebar";
import { SearchBar } from "@/modules/home/ui/components/SearchBar";
import { ActiveFilters } from "@/modules/home/ui/components/ActiveFilters";
import { ProductGrid } from "@/modules/home/ui/components/ProductGrid";
import { Filters } from "@/modules/home/ui/components/Filters";
import { useProductFilters } from "@/hooks/useProductFilters";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  
  // All filter logic is now contained in this single hook
  const {
    // State
    filters,
    search,
    selectedCategory,
    selectedSubcategory,
    products,
    isLoading,
    isError,
    error,
    
    // Actions
    setFilters,
    handleCategorySelect,
    handleSubcategorySelect,
    
    // Clear actions
    clearPriceFilters,
    clearPickupLocation,
    clearCategory,
    clearSubcategory,
    clearAllFilters,
    
    // Computed
    hasAnyFilters,
  } = useProductFilters();

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        onCategorySelect={handleCategorySelect}
        onSubcategorySelect={handleSubcategorySelect}
      />
      <main className="p-6">
        {hasAnyFilters && (
          <ActiveFilters
            category={selectedCategory}
            subcategory={selectedSubcategory}
            priceFilters={filters}
            onClearPriceFilters={clearPriceFilters}
            onClearCategory={clearCategory}
            onClearSubcategory={clearSubcategory}
            onClearPickupLocation={clearPickupLocation}
          />
        )}
        <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
          <Filters
            filters={filters}
            onFiltersChange={setFilters}
          />
          <ProductGrid
            products={products}
            isLoading={isLoading}
            error={isError ? error : null}
          />
        </div>
      </main>
    </div>
  );
}