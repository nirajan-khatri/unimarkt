"use client";

import * as React from "react";
import { Sidebar } from "@/modules/home/ui/components/Sidebar";
import { Header } from "@/components/Header";
import { useServices } from "@/hooks/useServices";
import { SearchBar } from "@/modules/skills/ui/components/SearchBar";
import { ActiveFilters } from "@/modules/skills/ui/components/ActiveFilters";
import { ServiceGrid } from "@/modules/skills/ui/components/ServiceGrid";
import { ServiceFilters } from "@/modules/skills/ui/components/ServiceFilters";

interface ServiceFilters {
  minPrice: string;
  maxPrice: string;
  module: string;
}

export default function Services() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = React.useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  
  // Service-specific filter state
  const [serviceFilters, setServiceFilters] = React.useState<ServiceFilters>({
    minPrice: "",
    maxPrice: "",
    module: ""
  });

  // Debounce search term
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [serviceFilters]);

  const { data, isLoading, isError, error } = useServices(
    currentPage,
    debouncedSearchTerm,
    selectedCategory,
    selectedSubcategory,
    serviceFilters
  );

  const handleClearSearch = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setServiceFilters({
      minPrice: "",
      maxPrice: "",
      module: ""
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

  const handleFiltersChange = (filters: ServiceFilters) => {
    setServiceFilters(filters);
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

  const handleClearModule = () => {
    setServiceFilters(prev => ({
      ...prev,
      module: ""
    }));
  };

  // Clear price filters handler
  const handleClearPriceFilters = () => {
    setServiceFilters(prev => ({
      ...prev,
      minPrice: "",
      maxPrice: ""
    }));
  };

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <main className="p-6">
        <ActiveFilters
          category={selectedCategory}
          subcategory={selectedSubcategory}
          serviceFilters={serviceFilters}
          onClearPriceFilters={handleClearPriceFilters}
          onClearCategory={handleClearCategory}
          onClearSubcategory={handleClearSubcategory}
          onClearModule={handleClearModule}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
          <ServiceFilters 
            filters={serviceFilters}
            onFiltersChange={handleFiltersChange}
          />
          <ServiceGrid
            services={data || []}
            isLoading={isLoading}
            error={isError ? error : null}
          />
        </div>
      </main>
    </div>
  );
}