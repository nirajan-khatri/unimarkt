// hooks/useUrlFilters.ts
import { useQueryState, parseAsString } from "nuqs";
import { useMemo } from "react";

export interface PriceFilters {
  minPrice: string;
  maxPrice: string;
  pickupLocation: string;
}

export interface AllFilters extends PriceFilters {
  category: string;
  subcategory: string;
}

// URL parsers for filters
export const filterParamsParsers = {
  minPrice: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
  maxPrice: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
  pickupLocation: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
  category: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
  subcategory: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
  search: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
};

interface UseUrlFiltersProps {
  initialCategory?: string;
  initialSubcategory?: string;
}

export function useUrlFilters(props?: UseUrlFiltersProps) {
  const { initialCategory = "", initialSubcategory = "" } = props || {};
  
  const [minPrice, setMinPrice] = useQueryState(
    "minPrice",
    filterParamsParsers.minPrice
  );
  const [maxPrice, setMaxPrice] = useQueryState(
    "maxPrice",
    filterParamsParsers.maxPrice
  );
  const [pickupLocation, setPickupLocation] = useQueryState(
    "pickupLocation",
    filterParamsParsers.pickupLocation
  );
  const [urlCategory, setUrlCategory] = useQueryState(
    "category",
    filterParamsParsers.category
  );
  const [urlSubcategory, setUrlSubcategory] = useQueryState(
    "subcategory",
    filterParamsParsers.subcategory
  );
  const [search, setSearch] = useQueryState(
    "search",
    filterParamsParsers.search
  );

  // Use URL state or initial props
  const activeCategory = urlCategory || initialCategory;
  const activeSubcategory = urlSubcategory || initialSubcategory;

  // Memoized filters object
  const priceFilters = useMemo((): PriceFilters => ({
    minPrice,
    maxPrice,
    pickupLocation,
  }), [minPrice, maxPrice, pickupLocation]);

  const allFilters = useMemo((): AllFilters => ({
    minPrice,
    maxPrice,
    pickupLocation,
    category: activeCategory,
    subcategory: activeSubcategory,
  }), [minPrice, maxPrice, pickupLocation, activeCategory, activeSubcategory]);

  // Filter actions
  const actions = {
    setFilters: (newFilters: PriceFilters) => {
      setMinPrice(newFilters.minPrice);
      setMaxPrice(newFilters.maxPrice);
      setPickupLocation(newFilters.pickupLocation);
    },
    setCategory: (category: string) => {
      setUrlCategory(category);
      setUrlSubcategory(""); // Clear subcategory when setting category
    },
    setSubcategory: (subcategory: string) => {
      setUrlSubcategory(subcategory);
      setUrlCategory(""); // Clear category when setting subcategory
    },
    clearPriceFilters: () => {
      setMinPrice("");
      setMaxPrice("");
    },
    clearPickupLocation: () => {
      setPickupLocation("");
    },
    clearCategory: () => {
      setUrlCategory("");
    },
    clearSubcategory: () => {
      setUrlSubcategory("");
    },
    clearAllFilters: () => {
      setMinPrice("");
      setMaxPrice("");
      setPickupLocation("");
      setUrlCategory("");
      setUrlSubcategory("");
      setSearch("");
    },
    setSearch,
    clearSearch: () => setSearch(""),
  };

  // Computed properties
  const computed = {
    hasFilters: !!(minPrice || maxPrice || pickupLocation),
    hasPriceFilters: !!(minPrice || maxPrice),
    hasLocationFilter: !!pickupLocation,
    hasCategoryFilters: !!(activeCategory || activeSubcategory),
    hasSearch: !!search,
    hasAnyFilters: !!(minPrice || maxPrice || pickupLocation || search),
  };

  return {
    // State
    filters: priceFilters,
    allFilters,
    search,
    category: activeCategory,
    subcategory: activeSubcategory,
    
    // Actions
    ...actions,
    
    // Computed
    ...computed,
  };
}