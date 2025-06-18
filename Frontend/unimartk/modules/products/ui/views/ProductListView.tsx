"use client";

import { Suspense } from 'react';
import { ActiveFilters } from "@/modules/home/ui/components/ActiveFilters";
import { ProductGrid } from "@/modules/home/ui/components/ProductGrid";
import { Filters } from "@/modules/home/ui/components/Filters";
import { useFilters } from "@/hooks";
import { ProductGridSkeleton } from "@/components/skeletons/ProductSkeleton";
import { Pagination } from "@/components/ui/pagination";

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
  const {
    // State
    filters,
    search,
    category: selectedCategory,
    subcategory: selectedSubcategory,
    products,
    isLoading,
    isError,
    error,
    currentPage,
    pageSize,
    
    // Actions
    setFilters,
    setCategory: handleCategorySelect,
    setSubcategory: handleSubcategorySelect,
    onPageChange,
    onPageSizeChange,
    
    // Clear actions
    clearPriceFilters,
    clearPickupLocation,
    clearCategory,
    clearSubcategory,
    clearAllFilters,
    
    // Computed
    hasAnyFilters,
  } = useFilters({ 
    initialCategory: category,
    initialSubcategory: subcategory 
  });

  const showPagination = !isLoading && !isError && products && products.count > 0;

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

        {/* Products Grid and Pagination */}
        <div className="lg:col-span-4 xl:col-span-6 flex flex-col gap-4">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid
              products={products?.results || []}
              isLoading={isLoading}
              error={isError ? error : null}
            />
          </Suspense>
          
          {showPagination && (
            <Pagination
              currentPage={products.currentPage}
              totalItems={products.count}
              pageSize={pageSize}
              hasNext={products.hasNext}
              hasPrevious={products.hasPrevious}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};