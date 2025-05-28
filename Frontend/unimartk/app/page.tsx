'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';

async function fetchFilteredProducts(page: number, searchTerm: string, category?: string, subcategory?: string) {
  let url;
  if (category) {
    url = new URL(`http://localhost:8000/api/products/filter-by-category/`);
    url.searchParams.append('category_name', category);
  } else if (subcategory) {
    url = new URL(`http://localhost:8000/api/products/filter-by-subcategory/`);
    url.searchParams.append('subcategory_name', subcategory);
  } else {
    url = new URL('http://localhost:8000/api/products/');
  }

  url.searchParams.append('page', page.toString());
  url.searchParams.append('page_size', '10');

  if (searchTerm) {
    url.searchParams.append('name', searchTerm);
  }

  const response = await fetch(url.toString(), {
    headers: {
      'accept': 'application/json',
      'X-CSRFTOKEN': 'E1QRLlXIS1RE4mx3QX9ECchSoKYaa58qiMmyPDtUbcutPpk3M4GxmqCOOyt47pV2'
    }
  });

  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

export default function Home() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = React.useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Debounce search term
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
      // Clear filters when searching
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products', currentPage, debouncedSearchTerm, selectedCategory, selectedSubcategory],
    queryFn: () => fetchFilteredProducts(
      currentPage,
      debouncedSearchTerm,
      selectedCategory || undefined,
      selectedSubcategory || undefined
    ),
    keepPreviousData: true
  });

  const handleClearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
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

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        onCategorySelect={handleCategorySelect}
        onSubcategorySelect={handleSubcategorySelect}
      />
      <main className="p-6">
        {/* Loader */}
        {isLoading && (
          <div className="fixed inset-0 bg-white/50 flex items-center justify-center z-50">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
          </div>
        )}

        <div className="relative w-full mb-6">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg bg-slate-50 py-3 pl-10 pr-10 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-50 dark:placeholder-slate-500 dark:focus:ring-blue-600"
            aria-label="Search"
          />
          {(searchTerm || selectedCategory || selectedSubcategory) && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Active Filters */}
        {(selectedCategory || selectedSubcategory) && (
          <div className="mb-4 flex gap-2">
            {selectedCategory && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Category: {selectedCategory}
              </span>
            )}
            {selectedSubcategory && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                Subcategory: {selectedSubcategory}
              </span>
            )}
          </div>
        )}

        {isError && (
          <div className="text-center text-red-500">Error: {error.message}</div>
        )}

        {!isLoading && data?.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No results found
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((product: any) => (
            <ProductCard key={product?.product_ id} product={product} />
          ))}
        </div>

        {/* Simplified Pagination */}
        {(data?.length > 0) && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(old => Math.max(old - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-sm text-slate-600 dark:text-slate-300">
              Page {currentPage}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(old => old + 1)}
              disabled={data.length < 10}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}