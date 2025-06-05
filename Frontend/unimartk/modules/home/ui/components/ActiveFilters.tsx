interface PriceFilters {
  minPrice: string;
  maxPrice: string;
  selectedCities: string[];
}

interface ActiveFiltersProps {
  category?: string | null;
  subcategory?: string | null;
  priceFilters?: PriceFilters;
  onClearPriceFilters?: () => void;
}

export function ActiveFilters({ 
  category, 
  subcategory, 
  priceFilters,
  onClearPriceFilters 
}: ActiveFiltersProps) {
  const hasFilters = !!(
    category || 
    subcategory || 
    priceFilters?.minPrice || 
    priceFilters?.maxPrice || 
    (priceFilters?.selectedCities && priceFilters.selectedCities.length > 0)
  );

  if (!hasFilters) return null;

  return (
    <div className="mb-4 flex gap-2 flex-wrap">
      {category && (
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          Category: {category}
        </span>
      )}
      {subcategory && (
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
          Subcategory: {subcategory}
        </span>
      )}
      {priceFilters && (priceFilters.minPrice || priceFilters.maxPrice) && (
        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-1">
          Price: €{priceFilters.minPrice || '0'} - €{priceFilters.maxPrice || '∞'}
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
      {priceFilters?.selectedCities.map(city => (
        <span key={city} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
          City: {city}
        </span>
      ))}
    </div>
  );
}