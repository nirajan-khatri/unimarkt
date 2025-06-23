'use client';

import React from 'react';
import { JobFilters } from '@/modules/jobs/hooks/useJobs';

interface ActiveJobFiltersProps {
  jobFilters: { jobType: string };
  onClearJobType: () => void;
  onClearAll: () => void;
}

export function ActiveJobFilters({
  jobFilters,
  onClearJobType,
  onClearAll,
}: ActiveJobFiltersProps) {
  const { jobType } = jobFilters;
  const hasFilters = !!jobType;

  if (!hasFilters) return null;

  return (
    <div className="mb-4 flex gap-2 flex-wrap items-center">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Active filters:
      </span>
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
      {/* Clear All Button */}
      {jobType && (
        <button
          onClick={onClearAll}
          className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
        >
          Clear All
        </button>
      )}
    </div>
  );
} 