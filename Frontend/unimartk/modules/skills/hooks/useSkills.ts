import { useQuery } from "@tanstack/react-query";
import { fetchFilteredSkills } from "@/services/skills";
import { PriceFilters } from "@/types/filters";

export function useSkills(
  page: number,
  searchTerm: string,
  category?: string | null,
  subcategory?: string | null,
  priceFilters?: PriceFilters
) {
  return useQuery({
    queryKey: [
      "skills",
      page,
      searchTerm,
      category,
      subcategory,
      priceFilters,
    ],
    queryFn: () =>
      fetchFilteredSkills(
        page,
        searchTerm,
        category || undefined,
        subcategory || undefined,
        priceFilters,
        module,
      ),
  });
}
