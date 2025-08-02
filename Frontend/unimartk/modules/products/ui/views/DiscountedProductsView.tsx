"use client";

import { Suspense } from "react";
import { ProductGrid } from "@/modules/home/ui/components/ProductGrid";
import { useDiscountedProducts } from "@/hooks/useDiscountedProducts";
import { ProductGridSkeleton } from "@/components/skeletons/ProductSkeleton";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/modules/home/ui/components/search-filters/search-input";

interface DiscountedProductsViewProps {
  title?: string;
  showSort?: boolean;
}

export const DiscountedProductsView = ({
  title = "Discounted Products",
  showSort = true,
}: DiscountedProductsViewProps) => {
  const {
    // State
    search,
    products,
    isLoading,
    isError,
    error,
    currentPage,
    pageSize,
    sortField,
    sortOrder,

    // Actions
    setSearch,
    onPageChange,
    onPageSizeChange,
    setSortField,
    setSortOrder,

    // Clear actions
    clearSearch,

    // Computed
    hasSearch,
    showPagination,
  } = useDiscountedProducts();

     return (
     <div className="px-4 lg:px-12 py-8 flex flex-col gap-4">
       {/* Search Section */}
       <div className="w-full">
         <SearchInput disabled={false} />
       </div>

       {/* Sort Section - Top Right Above Products */}
       {showSort && (
         <div className="flex justify-end">
           <div className="flex items-center gap-2">
             <label htmlFor="sort" className="text-sm text-gray-500">
               Sort by:
             </label>
             <select
               id="sort"
               className="border border-border rounded px-2 py-1 text-sm"
               value={sortField + "-" + sortOrder}
               onChange={(e) => {
                 const value = e.target.value;
                 if (value === "created_at-desc") {
                   setSortField("created_at");
                   setSortOrder("desc");
                 } else if (value === "created_at-asc") {
                   setSortField("created_at");
                   setSortOrder("asc");
                 } else if (value === "price-asc") {
                   setSortField("price");
                   setSortOrder("asc");
                 } else if (value === "price-desc") {
                   setSortField("price");
                   setSortOrder("desc");
                 }
               }}
             >
               <option value="created_at-desc">Newest</option>
               <option value="created_at-asc">Oldest</option>
               <option value="price-asc">Price: Low to High</option>
               <option value="price-desc">Price: High to Low</option>
             </select>
           </div>
         </div>
       )}

       {/* Products Grid and Pagination */}
       <div className="flex flex-col gap-4">
         <Suspense fallback={<ProductGridSkeleton />}>
           <ProductGrid
             products={products?.results || []}
             isLoading={isLoading}
             error={isError ? error : null}
           />
         </Suspense>

         {showPagination && (
           <Pagination
             currentPage={products?.currentPage || 1}
             totalItems={products?.count || 0}
             pageSize={pageSize}
             hasNext={products?.hasNext || false}
             hasPrevious={products?.hasPrevious || false}
             onPageChange={onPageChange}
             onPageSizeChange={onPageSizeChange}
           />
         )}
       </div>
     </div>
   );
}; 