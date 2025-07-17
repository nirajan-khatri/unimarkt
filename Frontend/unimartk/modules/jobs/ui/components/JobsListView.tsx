"use client";

import { Suspense } from "react";
import { ActiveJobFilters } from "./ActiveJobFilters";
import { JobGrid } from "./JobGrid";
import { JobFilters } from "./JobFilters";
import {
  JobPosting,
  PaginatedJobsResponse,
  JobFilters as JobFiltersType,
} from "@/modules/jobs/hooks/useJobs";
import { ProductGridSkeleton } from "@/components/skeletons/ProductSkeleton";
import { useSearchParams } from "next/navigation";
import { Pagination } from "@/components/ui/pagination";

interface JobsListViewProps {
  title?: string;
  showSort?: boolean;
  jobs: PaginatedJobsResponse;
  isLoading: boolean;
  error: Error | null;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSize: number;
  filters: JobFiltersType;
  onFiltersChange: (filters: JobFiltersType) => void;
  sortField: "created_at" | "salary_per_hour";
  sortOrder: "asc" | "desc";
  setSortField: (field: "created_at" | "salary_per_hour") => void;
  setSortOrder: (order: "asc" | "desc") => void;
}

export const JobsListView = ({
  title,
  showSort = false,
  jobs,
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
  setSortOrder,
}: JobsListViewProps) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const hasAnyFilters = !!(
    filters.location ||
    filters.minSalary ||
    filters.maxSalary ||
    search
  );

  const clearLocation = () => {
    onFiltersChange({
      ...filters,
      location: "",
    });
  };

  const clearMinSalary = () => {
    onFiltersChange({
      ...filters,
      minSalary: "",
    });
  };

  const clearMaxSalary = () => {
    onFiltersChange({
      ...filters,
      maxSalary: "",
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      location: "",
      minSalary: "",
      maxSalary: "",
    });
  };

  const showPagination = !isLoading && !error && jobs && jobs.count > 0;

  return (
    <div className="px-4 lg:px-12 py-8 flex flex-col gap-4">
      {/* Header Section */}
      <div className="flex flex-row lg:flex-row-reverse lg:items-center gap-y-2 lg:gap-y-0 justify-between">
        {showSort && (
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-sm text-gray-500">
              Sort by:
            </label>
            <select
              id="sort"
              className="border border-border rounded px-2 py-1 text-sm"
              value={sortField + "-" + sortOrder}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "created_at-desc") {
                  setSortField("created_at");
                  setSortOrder("desc");
                } else if (value === "created_at-asc") {
                  setSortField("created_at");
                  setSortOrder("asc");
                } else if (value === "salary_per_hour-asc") {
                  setSortField("salary_per_hour");
                  setSortOrder("asc");
                } else if (value === "salary_per_hour-desc") {
                  setSortField("salary_per_hour");
                  setSortOrder("desc");
                }
              }}
            >
              <option value="created_at-desc">Newest</option>
              <option value="created_at-asc">Oldest</option>
              <option value="salary_per_hour-asc">Salary: Low to High</option>
              <option value="salary_per_hour-desc">Salary: High to Low</option>
            </select>
          </div>
        )}
      </div>

      {/* Active Filters */}
      {hasAnyFilters && (
        <ActiveJobFilters
          jobFilters={filters}
          onClearLocation={clearLocation}
          onClearMinSalary={clearMinSalary}
          onClearMaxSalary={clearMaxSalary}
          onClearAll={clearAllFilters}
        />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
        {/* Filters Sidebar */}
        <div className="lg:col-span-2">
          <JobFilters filters={filters} onFiltersChange={onFiltersChange} />
        </div>

        {/* Jobs Grid and Pagination */}
        <div className="lg:col-span-4 xl:col-span-6 flex flex-col gap-4">
          <Suspense fallback={<ProductGridSkeleton />}>
            <JobGrid
              jobs={jobs?.results || []}
              isLoading={isLoading}
              error={error}
            />
          </Suspense>
          {showPagination && (
            <Pagination
              currentPage={jobs.currentPage}
              totalItems={jobs.count}
              pageSize={pageSize}
              hasNext={jobs.hasNext}
              hasPrevious={jobs.hasPrevious}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};
