// hooks/useUrlFilters.ts
import { useQueryState, parseAsString } from "nuqs";
import { useMemo } from "react";

export interface PriceFilters {
  minPrice: string;
  maxPrice: string;
  pickupLocation: string;
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
  search: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
};

export function useUrlFilters() {
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
  const [search, setSearch] = useQueryState(
    "search",
    filterParamsParsers.search
  );

  // Memoized filters object
  const filters = useMemo((): PriceFilters => ({
    minPrice,
    maxPrice,
    pickupLocation,
  }), [minPrice, maxPrice, pickupLocation]);

  // Filter actions
  const actions = {
    setFilters: (newFilters: PriceFilters) => {
      setMinPrice(newFilters.minPrice);
      setMaxPrice(newFilters.maxPrice);
      setPickupLocation(newFilters.pickupLocation);
    },
    clearPriceFilters: () => {
      setMinPrice("");
      setMaxPrice("");
    },
    clearPickupLocation: () => {
      setPickupLocation("");
    },
    clearAllFilters: () => {
      setMinPrice("");
      setMaxPrice("");
      setPickupLocation("");
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
    hasSearch: !!search,
  };

  return {
    // State
    filters,
    search,
    
    // Actions
    ...actions,
    
    // Computed
    ...computed,
  };
}