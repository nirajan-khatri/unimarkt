"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ServiceListView } from '@/modules/skills/ui/components/ServicesListView';
import { useServices } from '@/hooks/useServices';
import { ServiceFilters } from '@/hooks/useServices';

export default function SkillsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [filters, setFilters] = useState<ServiceFilters>({
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    module: searchParams.get("module") || ""
  });
  
  const search = searchParams.get("search") || "";

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update filter params
    if (filters.minPrice) {
      params.set("minPrice", filters.minPrice);
    } else {
      params.delete("minPrice");
    }
    
    if (filters.maxPrice) {
      params.set("maxPrice", filters.maxPrice);
    } else {
      params.delete("maxPrice");
    }
    
    if (filters.module) {
      params.set("module", filters.module);
    } else {
      params.delete("module");
    }

    // Update page param
    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    } else {
      params.delete("page");
    }

    // Update page size param if different from default
    if (pageSize !== 9) {
      params.set("pageSize", pageSize.toString());
    } else {
      params.delete("pageSize");
    }

    router.push(`${pathname}?${params.toString()}`);
  }, [filters, currentPage, pageSize, pathname, router, searchParams]);
  
  const { data, isLoading, error } = useServices(
    currentPage,
    search,
    undefined,
    undefined,
    filters,
    pageSize
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const handleFiltersChange = (newFilters: ServiceFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <main>
        <ServiceListView 
          skills={data || { results: [], count: 0, currentPage: 1, hasNext: false, hasPrevious: false }}
          isLoading={isLoading}
          error={error as Error | null}
          title="All Skills"
          showSort={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
      </main>
    </div>
  );
}