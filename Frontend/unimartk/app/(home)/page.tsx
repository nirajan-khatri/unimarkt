"use client";

import * as React from "react";
import { Sidebar } from "@/modules/home/ui/components/Sidebar";
import { PriceFilters, useProducts } from "@/hooks/useProducts";
import { SearchBar } from "@/modules/home/ui/components/SearchBar";
import { ActiveFilters } from "@/modules/home/ui/components/ActiveFilters";
import { ProductGrid } from "@/modules/home/ui/components/ProductGrid";
import { Filters } from "@/modules/home/ui/components/Filters";
import { searchParamsParsers } from "@/modules/home/ui/components/search-filters/search-input";
import { useQueryState, parseAsString } from "nuqs";

// Add filter parsers
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
};

export default function Home() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [search, setSearch] = useQueryState(
    "search",
    searchParamsParsers.search
  );
  
  // URL state for filters
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

  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  );
  const [selectedSubcategory, setSelectedSubcategory] = React.useState<
    string | null
  >(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Create price filters object from URL state
  const priceFilters: PriceFilters = React.useMemo(() => ({
    minPrice,
    maxPrice,
    pickupLocation,
  }), [minPrice, maxPrice, pickupLocation]);

  // Debounce search term
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(search);
      setCurrentPage(1);
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [priceFilters]);

  const { data, isLoading, isError, error } = useProducts(
    currentPage,
    debouncedSearchTerm,
    selectedCategory,
    selectedSubcategory,
    priceFilters
  );

  const handleClearSearch = () => {
    setSearch("");
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setMinPrice("");
    setMaxPrice("");
    setPickupLocation("");
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setCurrentPage(1);
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  const handleFiltersChange = (filters: PriceFilters) => {
    setMinPrice(filters.minPrice);
    setMaxPrice(filters.maxPrice);
    setPickupLocation(filters.pickupLocation);
  };

  // Clear individual filter handlers
  const handleClearCategory = () => {
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  const handleClearSubcategory = () => {
    setSelectedSubcategory(null);
    setCurrentPage(1);
  };

  const handleClearPickupLocation = () => {
    setPickupLocation("");
  };

  // Clear price filters handler
  const handleClearPriceFilters = () => {
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        onCategorySelect={handleCategorySelect}
        onSubcategorySelect={handleSubcategorySelect}
      />
      <main className="p-6">
        <ActiveFilters
          category={selectedCategory}
          subcategory={selectedSubcategory}
          priceFilters={priceFilters}
          onClearPriceFilters={handleClearPriceFilters}
          onClearCategory={handleClearCategory}
          onClearSubcategory={handleClearSubcategory}
          onClearPickupLocation={handleClearPickupLocation}
        />
        <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
          <Filters
            filters={priceFilters}
            onFiltersChange={handleFiltersChange}
          />
          <ProductGrid
            products={data || []}
            isLoading={isLoading}
            error={isError ? error : null}
          />
        </div>
      </main>
    </div>
  );
}