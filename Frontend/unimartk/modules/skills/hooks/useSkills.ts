import { useQuery } from "@tanstack/react-query";
import { fetchFilteredSkills } from "@/services/skills";
import { PriceFilters } from "@/types/filters";
import { ServiceFilters } from "@/hooks/useServices";

export function useSkills(
  page: number,
  searchTerm: string,
  category?: string | null,
  subcategory?: string | null,
  priceFilters?: PriceFilters,
  excludeUserId?: string
) {
  // Convert PriceFilters to ServiceFilters
  const serviceFilters: ServiceFilters | undefined = priceFilters ? {
    minPrice: priceFilters.minPrice,
    maxPrice: priceFilters.maxPrice,
    module: "", // Default empty module since PriceFilters doesn't have module
  } : undefined;

  return useQuery({
    queryKey: [
      "skills",
      page,
      searchTerm,
      category,
      subcategory,
      priceFilters,
      excludeUserId,
    ],
    queryFn: () =>
      fetchFilteredSkills(
        page,
        searchTerm,
        category || undefined,
        subcategory || undefined,
        serviceFilters,
        undefined, // pageSize
        undefined, // ordering
        excludeUserId
      ),
  });
}
