"use client";

import { Suspense } from 'react';
import { ActiveFilters } from "@/modules/skills/ui/components/ActiveFilters";
import { ServiceGrid } from "@/modules/skills/ui/components/ServiceGrid";
import { ServiceFilters } from "@/modules/skills/ui/components/ServiceFilters";
import { ProductGridSkeleton } from "@/components/skeletons/ProductSkeleton";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

interface ServiceListViewProps {
  category?: string;
  subcategory?: string;
  tenantSlug?: string;
  narrowView?: boolean;
  title?: string;
  showSort?: boolean;
  services: any[];
  isLoading: boolean;
  error: Error | null;
}

export const ServiceListView = ({
  category,
  subcategory,
  tenantSlug,
  narrowView = false,
  title,
  showSort = false,
  services,
  isLoading,
  error
}: ServiceListViewProps) => {
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    module: ""
  });
  
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const hasAnyFilters = !!(filters.minPrice || filters.maxPrice || filters.module || search);

  const clearPriceFilters = () => {
    setFilters(prev => ({
      ...prev,
      minPrice: "",
      maxPrice: ""
    }));
  };

  const clearModule = () => {
    setFilters(prev => ({
      ...prev,
      module: ""
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      module: ""
    });
  };

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
          serviceFilters={filters}
          onClearPriceFilters={clearPriceFilters}
          onClearModule={clearModule}
          onClearAll={clearAllFilters}
        />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
        {/* Filters Sidebar */}
        <div className="lg:col-span-2">
          <ServiceFilters
            filters={filters}
            onFiltersChange={setFilters}
          />
        </div>

        {/* Services Grid */}
        <div className="lg:col-span-4 xl:col-span-6">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ServiceGrid
              services={services}
              isLoading={isLoading}
              error={error}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};