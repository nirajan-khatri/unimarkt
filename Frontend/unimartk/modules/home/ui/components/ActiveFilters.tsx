interface PriceFilters {
  minPrice: string;
  maxPrice: string;
  pickupLocation: string;
}

interface ActiveFiltersProps {
  category?: string | null;
  subcategory?: string | null;
  priceFilters?: PriceFilters;
  onClearPriceFilters?: () => void;
  onClearCategory?: () => void;
  onClearSubcategory?: () => void;
  onClearPickupLocation?: () => void;
  onClearAll?: () => void;
}

export function ActiveFilters({
  priceFilters,
  onClearPriceFilters,
  onClearPickupLocation,
  onClearAll
}: ActiveFiltersProps) {
  const hasFilters = !!(
    priceFilters?.minPrice ||
    priceFilters?.maxPrice ||
    priceFilters?.pickupLocation
  );

  if (!hasFilters) return null;

  return (
    <div className="mb-4 flex gap-2 flex-wrap items-center">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Active filters:
      </span>
      
      {/* Price Range Filter */}
      {priceFilters && (priceFilters.minPrice || priceFilters.maxPrice) && (
        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm flex items-center gap-1">
          Price: €{priceFilters.minPrice || '0'} - €{priceFilters.maxPrice || '∞'}
          {onClearPriceFilters && (
            <button
              onClick={onClearPriceFilters}
              className="ml-1 text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-100 font-bold"
              aria-label="Clear price filters"
            >
              ×
            </button>
          )}
        </span>
      )}
      
      {/* Pickup Location Filter */}
      {priceFilters?.pickupLocation && (
        <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded-full text-sm flex items-center gap-1">
          Pickup: {priceFilters.pickupLocation}
          {onClearPickupLocation && (
            <button
              onClick={onClearPickupLocation}
              className="ml-1 text-orange-600 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-100 font-bold"
              aria-label="Clear pickup location filter"
            >
              ×
            </button>
          )}
        </span>
      )}
      
      {/* Clear All Button */}
      {onClearAll && (
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