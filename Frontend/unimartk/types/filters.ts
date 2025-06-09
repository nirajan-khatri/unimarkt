export interface PriceFilters {
  minPrice: string;
  maxPrice: string;
  pickupLocation: string;
}

export interface AllFilters extends PriceFilters {
  category: string;
  subcategory: string;
}

export interface FilterActions {
  setFilters: (filters: PriceFilters) => void;
  setCategory: (category: string) => void;
  setSubcategory: (subcategory: string) => void;
  clearPriceFilters: () => void;
  clearPickupLocation: () => void;
  clearCategory: () => void;
  clearSubcategory: () => void;
  clearAllFilters: () => void;
  setSearch: (search: string) => void;
  clearSearch: () => void;
}

export interface FilterState {
  filters: PriceFilters;
  allFilters: AllFilters;
  search: string;
  category: string;
  subcategory: string;
  hasFilters: boolean;
  hasPriceFilters: boolean;
  hasLocationFilter: boolean;
  hasCategoryFilters: boolean;
  hasSearch: boolean;
  hasAnyFilters: boolean;
} 