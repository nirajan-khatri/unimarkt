'use client';

import React from 'react';
import { JobFilters } from '@/modules/jobs/hooks/useJobs';

interface ActiveJobFiltersProps {
  jobFilters: { location: string; minSalary: string; maxSalary: string };
  onClearLocation: () => void;
  onClearMinSalary: () => void;
  onClearMaxSalary: () => void;
  onClearAll: () => void;
}

export function ActiveJobFilters({
  jobFilters,
  onClearLocation,
  onClearMinSalary,
  onClearMaxSalary,
  onClearAll,
}: ActiveJobFiltersProps) {
  const { location, minSalary, maxSalary } = jobFilters;
  const hasFilters = !!(location || minSalary || maxSalary);

  if (!hasFilters) return null;

  return (
    <div className="mb-4 flex gap-2 flex-wrap items-center">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Active filters:
      </span>
      {/* Location Filter */}
      {location && (
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-1">
          Location: {location}
          <button
            onClick={onClearLocation}
            className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 font-bold"
            aria-label="Clear location filter"
          >
            ×
          </button>
        </span>
      )}
      {/* Min Salary Filter */}
      {minSalary && (
        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-sm flex items-center gap-1">
          Min Salary: {minSalary}
          <button
            onClick={onClearMinSalary}
            className="ml-1 text-yellow-600 dark:text-yellow-300 hover:text-yellow-800 dark:hover:text-yellow-100 font-bold"
            aria-label="Clear min salary filter"
          >
            ×
          </button>
        </span>
      )}
      {/* Max Salary Filter */}
      {maxSalary && (
        <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm flex items-center gap-1">
          Max Salary: {maxSalary}
          <button
            onClick={onClearMaxSalary}
            className="ml-1 text-orange-600 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-100 font-bold"
            aria-label="Clear max salary filter"
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