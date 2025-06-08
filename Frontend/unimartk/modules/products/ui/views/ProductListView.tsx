"use client";

import { Suspense } from 'react';
import { ActiveFilters } from "@/modules/home/ui/components/ActiveFilters";
import { ProductGrid } from "@/modules/home/ui/components/ProductGrid";
import { Filters } from "@/modules/home/ui/components/Filters";
import { useProductFilters } from "@/hooks/useProductFilters";
import { ProductGridSkeleton } from "@/components/skeletons/ProductSkeleton";

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

  return (
    <div className="px-4 lg:px-12 py-8 flex flex-col gap-4">
      {/* Header Section */}
      <div className="flex flex-row lg:flex-row-reverse lg:items-center gap-y-2 lg:gap-y-0 justify-between">
        {showSort && (
          <div className="flex items-center gap-2">
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
          <Suspense fallback={<ProductGridSkeleton />}>
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