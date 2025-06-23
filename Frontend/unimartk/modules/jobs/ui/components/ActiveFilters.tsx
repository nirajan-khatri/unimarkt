'use client';

interface ServiceFilters {
  minPrice: string;
  maxPrice: string;
  module: string;
}

interface ActiveFiltersProps {
  serviceFilters: ServiceFilters;
  onClearPriceFilters: () => void;
  onClearModule: () => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  serviceFilters,
  onClearPriceFilters,
  onClearModule,
  onClearAll,
}: ActiveFiltersProps) {
  const { minPrice, maxPrice, module } = serviceFilters;
  const hasFilters = !!(minPrice || maxPrice || module);

  if (!hasFilters) return null;

  return (
    <div className="mb-4 flex gap-2 flex-wrap items-center">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Active filters:
      </span>
      
      {/* Price Range Filter */}
      {(minPrice || maxPrice) && (
        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm flex items-center gap-1">
          Price: €{minPrice || '0'} - €{maxPrice || '∞'}
          <button
            onClick={onClearPriceFilters}
            className="ml-1 text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-100 font-bold"
            aria-label="Clear price filters"
          >
            ×
          </button>
        </span>
      )}
      
      {/* Module Filter */}
      {module && (
        <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm flex items-center gap-1">
          Module: {module}
          <button
            onClick={onClearModule}
            className="ml-1 text-orange-600 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-100 font-bold"
            aria-label="Clear module filter"
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