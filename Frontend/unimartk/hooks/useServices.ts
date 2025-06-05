import { useQuery } from "@tanstack/react-query";
import { fetchFilteredServices } from "@/services/services";

interface ServiceFilters {
  minPrice: string;
  maxPrice: string;
  module: string;
}

export function useServices(
  page: number,
  searchTerm: string,
  category?: string | null,
  subcategory?: string | null,
  serviceFilters?: ServiceFilters
) {
  return useQuery({
    queryKey: ["services", page, searchTerm, category, subcategory, serviceFilters],
    queryFn: () => fetchFilteredServices(
      page, 
      searchTerm, 
      category || undefined, 
      subcategory || undefined,
      serviceFilters
    ),
  });
}