import { useQuery } from "@tanstack/react-query";

interface ServiceFilters {
  minPrice: string;
  maxPrice: string;
  module: string;
}

async function fetchServices(
  page: number,
  searchTerm: string,
  category?: string,
  subcategory?: string,
  filters?: ServiceFilters
) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api/";
  const url = new URL(`${baseUrl}skills/`);

  // Add pagination
  url.searchParams.append("page", page.toString());

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

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      results: Array.isArray(data) ? data : data.results || [],
      total: data.count || 0,
      page: page,
    };
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
  filters?: ServiceFilters
) {
  return useQuery({
    queryKey: ["services", page, searchTerm, category, subcategory, filters],
    queryFn: () =>
      fetchServices(page, searchTerm, category, subcategory, filters),
  });
}
