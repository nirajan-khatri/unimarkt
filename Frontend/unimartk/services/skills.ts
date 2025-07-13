import { ServiceFilters } from "@/hooks/useServices";
import { PaginatedSkillsResponse } from "@/modules/skills/types";

export async function fetchFilteredSkills(
  page: number,
  searchTerm: string,
  category?: string,
  subcategory?: string,
  filters?: ServiceFilters,
  pageSize: number = 9,
  ordering?: string // <-- add ordering param
): Promise<PaginatedSkillsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api/";
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
  if (subcategory) {
    url.searchParams.append("sub_category__name", subcategory);
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

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
} 