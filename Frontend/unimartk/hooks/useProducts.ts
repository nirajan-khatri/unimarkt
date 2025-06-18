import { useQuery } from "@tanstack/react-query";
import { fetchFilteredProducts } from "@/services/products";
import { PriceFilters } from "@/types/filters";

export function useProducts(
  page: number,
  searchTerm: string,
  category: string | null,
  subcategory: string | null,
  priceFilters?: PriceFilters,
  pageSize: number = 9
) {
  return useQuery({
    queryKey: [
      "products",
      page,
      searchTerm,
      category,
      subcategory,
      priceFilters,
      pageSize
    ],
    queryFn: () =>
      fetchFilteredProducts(
        page,
        searchTerm,
        category || undefined,
        subcategory || undefined,
        priceFilters,
        pageSize
      ),
  });
}
