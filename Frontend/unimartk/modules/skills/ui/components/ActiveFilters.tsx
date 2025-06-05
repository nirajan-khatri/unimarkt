interface ServiceFilters {
  minPrice: string;
  maxPrice: string;
  module: string;
}

interface ActiveFiltersProps {
  category?: string | null;
  subcategory?: string | null;
  serviceFilters?: ServiceFilters;
  onClearPriceFilters?: () => void;
  onClearCategory?: () => void;
  onClearSubcategory?: () => void;
  onClearModule?: () => void;
}

export function ActiveFilters({
  category,
  subcategory,
  serviceFilters,
  onClearPriceFilters,
  onClearCategory,
  onClearSubcategory,
  onClearModule
}: ActiveFiltersProps) {
  const hasFilters = !!(
    category ||
    subcategory ||
    serviceFilters?.minPrice ||
    serviceFilters?.maxPrice ||
    serviceFilters?.module
  );

  if (!hasFilters) return null;

  return (
    <div className="mb-4 flex gap-2 flex-wrap">
      {category && (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
          Category: {category}
          {onClearCategory && (
            <button
              onClick={onClearCategory}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          )}
        </span>
      )}
      {subcategory && (
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1">
          Subcategory: {subcategory}
          {onClearSubcategory && (
            <button
              onClick={onClearSubcategory}
              className="ml-1 text-green-600 hover:text-green-800"
            >
              ×
            </button>
          )}
        </span>
      )}
      {serviceFilters && (serviceFilters.minPrice || serviceFilters.maxPrice) && (
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-1">
          Price: ${serviceFilters.minPrice || '0'} - ${serviceFilters.maxPrice || '∞'}
          {onClearPriceFilters && (
            <button
              onClick={onClearPriceFilters}
              className="ml-1 text-purple-600 hover:text-purple-800"
            >
              ×
            </button>
          )}
        </span>
      )}
      {serviceFilters?.module && (
        <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm flex items-center gap-1">
          Module: {serviceFilters.module}
          {onClearModule && (
            <button
              onClick={onClearModule}
              className="ml-1 text-orange-600 hover:text-orange-800"
            >
              ×
            </button>
          )}
        </span>
      )}
    </div>
  );
}