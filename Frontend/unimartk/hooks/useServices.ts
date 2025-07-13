import { useQuery } from "@tanstack/react-query";
import { PaginatedSkillsResponse } from "@/modules/skills/types";

export interface ServiceFilters {
  minPrice: string;
  maxPrice: string;
  module: string;
}

async function fetchServices(
  page: number,
  searchTerm: string,
  category?: string,
  subcategory?: string,
  filters?: ServiceFilters,
  pageSize: number = 9,
  ordering?: string // <-- add ordering param
): Promise<PaginatedSkillsResponse> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api/";
  const url = new URL(`${baseUrl}skills/?status=approved&isArchived=false`);

  // Add pagination
  url.searchParams.append("page", page.toString());
  url.searchParams.append("page_size", pageSize.toString());

  // Add search term
  if (searchTerm) {
    url.searchParams.append("description", searchTerm);
    // Also search in module name
    url.searchParams.append("module", searchTerm);
  }

  // Add category filters
  if (category) {
    url.searchParams.append("skill_category__name", category);
  }

  // Add price filters
  if (filters?.minPrice) {
    url.searchParams.append("price_min", filters.minPrice);
  }
  if (filters?.maxPrice) {
    url.searchParams.append("price_max", filters.maxPrice);
  }

  // Add module filter
  if (filters?.module) {
    url.searchParams.append("module", filters.module);
  }

  // Add ordering
  if (ordering) {
    url.searchParams.append("ordering", ordering);
  }

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
}

export function useServices(
  page: number,
  searchTerm: string,
  category?: string,
  subcategory?: string,
  filters?: ServiceFilters,
  pageSize: number = 9,
  ordering?: string // <-- add ordering param
) {
  return useQuery({
    queryKey: ["services", page, searchTerm, category, subcategory, filters, pageSize, ordering],
    queryFn: () =>
      fetchServices(page, searchTerm, category, subcategory, filters, pageSize, ordering),
  });
}
