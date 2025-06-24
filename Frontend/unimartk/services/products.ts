import { Job } from "@/modules/jobs/types";
import { Product, PaginatedProductsResponse } from "@/modules/products/types";
import { Skill, SkillDetail } from "@/modules/skills/types";
import { PriceFilters } from "@/types/filters";

export async function fetchFilteredProducts(
  page: number,
  searchTerm: string,
  category?: string,
  subcategory?: string,
  priceFilters?: PriceFilters,
  pageSize: number = 9
): Promise<PaginatedProductsResponse> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api/";
  const url = new URL(`${baseUrl}products/?status=approved&isArchived=false`);

  // Add pagination
  url.searchParams.append("page", page.toString());
  url.searchParams.append("page_size", pageSize.toString());

  // Add search term
  if (searchTerm) {
    url.searchParams.append("name", searchTerm);
  }

  // Add category and subcategory filters independently
  if (category) {
    url.searchParams.append("category__name", category);
  }
  if (subcategory) {
    url.searchParams.append("sub_category__name", subcategory);
  }

  // Add price filters
  if (priceFilters?.minPrice) {
    url.searchParams.append("price_min", priceFilters.minPrice);
  }
  if (priceFilters?.maxPrice) {
    url.searchParams.append("price_max", priceFilters.maxPrice);
  }

  // Add pickup location filter
  if (priceFilters?.pickupLocation) {
    url.searchParams.append("pickup_location", priceFilters.pickupLocation);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function fetchProductById(productId: string): Promise<Product> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api/";
  const response = await fetch(`${baseUrl}products/${productId}/`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function fetchSkillById(skillId: string): Promise<SkillDetail> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api/";
  const response = await fetch(`${baseUrl}skills/${skillId}/`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function fetchJobById(jobId: string): Promise<Job> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api/";
  const response = await fetch(`${baseUrl}job-postings/${jobId}/`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
