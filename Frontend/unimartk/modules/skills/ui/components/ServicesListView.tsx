"use client";

import { Suspense } from 'react';
import { ActiveFilters } from "@/modules/skills/ui/components/ActiveFilters";
import { ServiceGrid } from "@/modules/skills/ui/components/ServiceGrid";
import { ServiceFilters } from "@/modules/skills/ui/components/ServiceFilters";
import { ProductGridSkeleton } from "@/components/skeletons/ProductSkeleton";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/ui/pagination";
import { PaginatedSkillsResponse } from "@/modules/skills/types";
import { ServiceFilters as ServiceFiltersType } from "@/hooks/useServices";

interface ServiceListViewProps {
  category?: string;
  subcategory?: string;
  tenantSlug?: string;
  narrowView?: boolean;
  title?: string;
  showSort?: boolean;
  skills: PaginatedSkillsResponse;
  isLoading: boolean;
  error: Error | null;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSize: number;
  filters: ServiceFiltersType;
  onFiltersChange: (filters: ServiceFiltersType) => void;
  sortField: 'created_at' | 'charge_per_hour';
  sortOrder: 'asc' | 'desc';
  setSortField: (field: 'created_at' | 'charge_per_hour') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
}

export const ServiceListView = ({
  category,
  subcategory,
  tenantSlug,
  narrowView = false,
  title,
  showSort = false,
  skills,
  isLoading,
  error,
  onPageChange,
  onPageSizeChange,
  pageSize,
  filters,
  onFiltersChange,
  sortField,
  sortOrder,
  setSortField,
  setSortOrder
}: ServiceListViewProps) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const hasAnyFilters = !!(filters.minPrice || filters.maxPrice || filters.module || search);

  const clearPriceFilters = () => {
    onFiltersChange({
      ...filters,
      minPrice: "",
      maxPrice: ""
    });
  };

  const clearModule = () => {
    onFiltersChange({
      ...filters,
      module: ""
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      minPrice: "",
      maxPrice: "",
      module: ""
    });
  };

  const showPagination = !isLoading && !error && skills && skills.count > 0;

  return (
    <div className="px-4 lg:px-12 py-8 flex flex-col gap-4">
      {/* Header Section */}
      <div className="flex flex-row lg:flex-row-reverse lg:items-center gap-y-2 lg:gap-y-0 justify-between">
        {showSort && (
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-500">Sort by:</label>
            <select
              id="sort"
              className="border rounded px-2 py-1 text-sm"
              value={sortField + '-' + sortOrder}
              onChange={e => {
                const value = e.target.value;
                if (value === 'created_at-desc') {
                  setSortField('created_at');
                  setSortOrder('desc');
                } else if (value === 'created_at-asc') {
                  setSortField('created_at');
                  setSortOrder('asc');
                } else if (value === 'charge_per_hour-asc') {
                  setSortField('charge_per_hour');
                  setSortOrder('asc');
                } else if (value === 'charge_per_hour-desc') {
                  setSortField('charge_per_hour');
                  setSortOrder('desc');
                }
              }}
            >
              <option value="created_at-desc">Newest</option>
              <option value="created_at-asc">Oldest</option>
              <option value="charge_per_hour-asc">Price: Low to High</option>
              <option value="charge_per_hour-desc">Price: High to Low</option>
            </select>
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
            onFiltersChange={onFiltersChange}
          />
        </div>

        {/* Services Grid and Pagination */}
        <div className="lg:col-span-4 xl:col-span-6 flex flex-col gap-4">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ServiceGrid
              services={skills?.results || []}
              isLoading={isLoading}
              error={error}
            />
          </Suspense>
          
          {showPagination && (
            <Pagination
              currentPage={skills.currentPage}
              totalItems={skills.count}
              pageSize={pageSize}
              hasNext={skills.hasNext}
              hasPrevious={skills.hasPrevious}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};