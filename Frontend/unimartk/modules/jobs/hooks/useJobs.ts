import { useQuery } from "@tanstack/react-query";
import { PaginatedJobsResponse, JobFilters } from "../types";

async function fetchJobs(
  page: number,
  searchTerm: string,
  filters: JobFilters,
  pageSize: number = 9,
  category?: string,
  ordering?: string,
  excludeUserId?: string
): Promise<PaginatedJobsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api/";
  const url = new URL(`${baseUrl}jobs/?isArchived=false`);

  url.searchParams.append("page", page.toString());
  url.searchParams.append("page_size", pageSize.toString());

  if (searchTerm) {
    url.searchParams.append("title", searchTerm);
  }
  if (filters.location) {
    url.searchParams.append("location", filters.location);
  }
  if (filters.minSalary) {
    url.searchParams.append("min_salary", filters.minSalary);
  }
  if (filters.maxSalary) {
    url.searchParams.append("max_salary", filters.maxSalary);
  }
  if (category) {
    url.searchParams.append("category", category);
  }
  // Add ordering
  if (ordering) {
    url.searchParams.append("ordering", ordering);
  }

  // Add exclude_user_id parameter if provided
  if (excludeUserId) {
    url.searchParams.append("exclude_user_id", excludeUserId);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  // The backend should return a paginated response with count, results, etc.
  // If not, adapt this to match the backend response.
  const data = await response.json();
  // Add pagination helpers if not present
  return {
    count: data.count,
    results: data.results,
    currentPage: page,
    hasNext: !!data.next,
    hasPrevious: !!data.previous,
  };
}

export function useJobs(
  page: number,
  searchTerm: string,
  filters: JobFilters,
  pageSize: number = 9,
  category?: string,
  ordering?: string,
  excludeUserId?: string
) {
  return useQuery({
    queryKey: ["jobs", page, searchTerm, filters, pageSize, category, ordering, excludeUserId],
    queryFn: () => fetchJobs(page, searchTerm, filters, pageSize, category, ordering, excludeUserId),
  });
}

// Fetch jobs for a specific user
export async function fetchUserJobs(
  userId: string,
  page: number = 1,
  pageSize: number = 9,
  ordering?: string,
  status?: string,
  isArchived?: boolean
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api/";
  const url = new URL(`${baseUrl}jobs/?isArchived=false`);
  url.searchParams.append("user_id", userId);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("page_size", pageSize.toString());
  
  if (ordering) {
    url.searchParams.append("ordering", ordering);
  }
  
  if (status) {
    url.searchParams.append("status", status);
  }
  
  if (isArchived !== undefined) {
    url.searchParams.append("isArchived", isArchived.toString());
  }
  
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return {
    count: data.count,
    results: data.results,
    currentPage: page,
    hasNext: !!data.next,
    hasPrevious: !!data.previous,
  };
}

export function useUserJobs(
  userId: string,
  page: number = 1,
  pageSize: number = 9,
  ordering?: string,
  status?: string,
  isArchived?: boolean
) {
  return useQuery({
    queryKey: ["userJobs", userId, page, pageSize, ordering, status, isArchived],
    queryFn: () => fetchUserJobs(userId, page, pageSize, ordering, status, isArchived),
  });
} 