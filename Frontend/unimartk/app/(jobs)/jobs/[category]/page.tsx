"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter, usePathname } from "next/navigation";
import { JobsListView } from '@/modules/jobs/ui/components/JobsListView';
import { useJobs } from '@/modules/jobs/hooks/useJobs';
import { JobFilters } from '@/modules/jobs/types';
import { useAuth } from '@/modules/auth/contexts/authContext';

export default function DepartmentJobsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const department = params.category as string;
  const [filters, setFilters] = useState<JobFilters>({
    department: "",
    jobType: searchParams.get("jobType") || ""
  });

  // Sorting state
  const [sortField, setSortField] = useState<'created_at' | 'salary_per_hour'>("created_at");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("desc");

  const search = searchParams.get("search") || "";

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (filters.jobType) {
      params.set("jobType", filters.jobType);
    } else {
      params.delete("jobType");
    }
    if (currentPage > 1) {
      params.set("page", currentPage.toString());
    } else {
      params.delete("page");
    }
    if (pageSize !== 9) {
      params.set("pageSize", pageSize.toString());
    } else {
      params.delete("pageSize");
    }
    router.push(`${pathname}?${params.toString()}`);
  }, [filters, currentPage, pageSize, pathname, router, searchParams]);

  const { data, isLoading, error } = useJobs(
    currentPage,
    search,
    filters,
    pageSize,
    department,
    undefined, // ordering
    isAuthenticated && user ? user.id : undefined // <-- pass user ID if authenticated
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <main>
        <JobsListView
          jobs={data || { results: [], count: 0, currentPage: 1, hasNext: false, hasPrevious: false }}
          isLoading={isLoading}
          error={error as Error | null}
          title={`${department} Jobs`}
          showSort={true}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSize={pageSize}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          sortField={sortField}
          sortOrder={sortOrder}
          setSortField={setSortField}
          setSortOrder={setSortOrder}
        />
      </main>
    </div>
  );
}