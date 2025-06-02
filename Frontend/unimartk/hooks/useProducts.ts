import { useQuery } from "@tanstack/react-query";
import { fetchFilteredProducts } from "@/services/products";

export function useProducts(
  page: number,
  searchTerm: string,
  category?: string | null,
  subcategory?: string | null
) {
  return useQuery({
    queryKey: ["products", page, searchTerm, category, subcategory],
    queryFn: () => fetchFilteredProducts(page, searchTerm, category || undefined, subcategory || undefined),
  });
}