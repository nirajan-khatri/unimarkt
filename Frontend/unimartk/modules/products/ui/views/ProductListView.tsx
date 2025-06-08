"use client";

import { Suspense } from 'react';
import { ActiveFilters } from "@/modules/home/ui/components/ActiveFilters";
import { ProductGrid } from "@/modules/home/ui/components/ProductGrid";
import { Filters } from "@/modules/home/ui/components/Filters";
import { useProductFilters } from "@/hooks/useProductFilters";

// Skeleton component for loading state
const ProductGridSkeleton = ({ narrowView }: { narrowView?: boolean }) => (
  <div className="lg:col-span-4 xl:col-span-6">
    <div className={`grid gap-4 ${
      narrowView 
        ? 'grid-cols-1 md:grid-cols-2' 
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }`}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg" />
      ))}
    </div>
  </div>
);

interface ProductListViewProps {
  category?: string;
  subcategory?: string;
  tenantSlug?: string;
  narrowView?: boolean;
  title?: string;
  showSort?: boolean;
}

export const ProductListView = ({
  category,
  subcategory,
  tenantSlug,
  narrowView = false,
  title,
  showSort = false,
}: ProductListViewProps) => {
  // Use the hook with initial values
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
  } = useProductFilters({ 
    initialCategory: category,
    initialSubcategory: subcategory 
  });

  // Generate dynamic title if not provided
  const pageTitle = title || (() => {
    if (subcategory) {
      return `${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} Products`;
    }
    if (category) {
      return `${category.charAt(0).toUpperCase() + category.slice(1)} Products`;
    }
    return 'Curated for you';
  })();

  return (
    <div className="px-4 lg:px-12 py-8 flex flex-col gap-4">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between">
        <p className="text-2xl font-medium">
          {pageTitle}
        </p>
        {showSort && (
          <div className="flex items-center gap-2">
            {/* Add your ProductSort component here if you have one */}
            {/* <ProductSort /> */}
            <div className="text-sm text-gray-500">
              Sort functionality can be added here
            </div>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {hasAnyFilters && (
        <ActiveFilters
          priceFilters={filters}
          onClearPriceFilters={clearPriceFilters}
          onClearPickupLocation={clearPickupLocation}
          onClearAll={clearAllFilters}
        />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
        {/* Filters Sidebar */}
        <div className="lg:col-span-2">
          <Filters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-4 xl:col-span-6">
          <Suspense fallback={<ProductGridSkeleton narrowView={narrowView} />}>
            <ProductGrid
              products={products}
              isLoading={isLoading}
              error={isError ? error : null}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};