'use client';

import React from 'react';
import { JobFilters } from '@/modules/jobs/hooks/useJobs';

interface ActiveJobFiltersProps {
  jobFilters: JobFilters;
  onClearRemunerationFilters: () => void;
  onClearDepartment: () => void;
  onClearJobType: () => void;
  onClearAll: () => void;
}

export function ActiveJobFilters({
  jobFilters,
  onClearRemunerationFilters,
  onClearDepartment,
  onClearJobType,
  onClearAll,
}: ActiveJobFiltersProps) {
  const { department, jobType, minRemuneration, maxRemuneration } = jobFilters;
  const hasFilters = !!(department || jobType || minRemuneration || maxRemuneration);

  if (!hasFilters) return null;

  return (
    <div className="mb-4 flex gap-2 flex-wrap items-center">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Active filters:
      </span>
      {/* Department Filter */}
      {department && (
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-1">
          Department: {department}
          <button
            onClick={onClearDepartment}
            className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 font-bold"
            aria-label="Clear department filter"
          >
            ×
          </button>
        </span>
      )}
      {/* Job Type Filter */}
      {jobType && (
        <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm flex items-center gap-1">
          Job Type: {jobType}
          <button
            onClick={onClearJobType}
            className="ml-1 text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-100 font-bold"
            aria-label="Clear job type filter"
          >
            ×
          </button>
        </span>
      )}
      {/* Remuneration Filter */}
      {(minRemuneration || maxRemuneration) && (
        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm flex items-center gap-1">
          Remuneration: €{minRemuneration || '0'} - €{maxRemuneration || '∞'}
          <button
            onClick={onClearRemunerationFilters}
            className="ml-1 text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-100 font-bold"
            aria-label="Clear remuneration filters"
          >
            ×
          </button>
        </span>
      )}
      {/* Clear All Button */}
      <button
        onClick={onClearAll}
        className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
      >
        Clear All
      </button>
    </div>
  );
} 