"use client";

import * as React from "react";
import { Sidebar } from "@/modules/home/ui/components/Sidebar";
import { PriceFilters, useProducts } from "@/hooks/useProducts";
import { SearchBar } from "@/modules/home/ui/components/SearchBar";
import { ActiveFilters } from "@/modules/home/ui/components/ActiveFilters";
import { ProductGrid } from "@/modules/home/ui/components/ProductGrid";
import { Filters } from "@/modules/home/ui/components/Filters";
import { useQueryState } from "nuqs";
import { searchParamsParsers } from "@/modules/home/ui/components/search-filters/search-input";

export default function Home() {
  const [currentPage, setCurrentPage] = React.useState(1);
  // const [searchTerm, setSearchTerm] = React.useState("");
  const [search, setSearch] = useQueryState(
    "search",
    searchParamsParsers.search
  );
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  );
  const [selectedSubcategory, setSelectedSubcategory] = React.useState<
    string | null
  >(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Add price filter state
  const [priceFilters, setPriceFilters] = React.useState<PriceFilters>({
    minPrice: "",
    maxPrice: "",
    pickupLocation: "",
    selectedCities: [],
  });

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
    setPriceFilters({
      minPrice: "",
      maxPrice: "",
      pickupLocation: "",
      selectedCities: [],
    });
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
    setPriceFilters(filters);
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
    setPriceFilters((prev) => ({
      ...prev,
      pickupLocation: "",
    }));
  };

  // Clear price filters handler
  const handleClearPriceFilters = () => {
    setPriceFilters((prev) => ({
      ...prev,
      minPrice: "",
      maxPrice: "",
    }));
  };

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      {/* <Header
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      /> */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        onCategorySelect={handleCategorySelect}
        onSubcategorySelect={handleSubcategorySelect}
      />
      <main className="p-6">
        {/* <div className="flex flex-row justify-between gap-4 mb-6">
          <SearchBar
            value={se}
            onChange={setSearchTerm}
            onClear={handleClearSearch}
            hasFilters={
              !!(
                search ||
                selectedCategory ||
                selectedSubcategory ||
                priceFilters.minPrice ||
                priceFilters.maxPrice ||
                priceFilters.pickupLocation
              )
            }
          />
        </div> */}

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
