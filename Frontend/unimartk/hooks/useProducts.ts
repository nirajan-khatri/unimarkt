import { useQuery } from "@tanstack/react-query";
import { fetchFilteredProducts } from "@/services/products";

export interface PriceFilters {
  minPrice: string;
  maxPrice: string;
  pickupLocation: string;
}

export function useProducts(
  page: number,
  searchTerm: string,
  category?: string | null,
  subcategory?: string | null,
  priceFilters?: PriceFilters
) {
  return useQuery({
    queryKey: [
      "products",
      page,
      searchTerm,
      category,
      subcategory,
      priceFilters,
    ],
    queryFn: () =>
      fetchFilteredProducts(
        page,
        searchTerm,
        category || undefined,
        subcategory || undefined,
        priceFilters
      ),
  });
}
