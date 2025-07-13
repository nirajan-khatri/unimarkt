import { useQuery } from "@tanstack/react-query";

export interface JobFilters {
  location: string;
  minSalary: string;
  maxSalary: string;
}

export interface JobPosting {
  job_id: number;
  title: string;
  description: string;
  qualifications: string;
  department: {
    id: number;
    name: string;
  };
  job_type: string;
  remuneration: string;
  contact_email: string;
  contact_name: string;
  contact_phone: string | null;
  status: string;
  status_display: string;
  posted_by: {
    id: number;
    name: string;
    email: string;
    contact_number: string | null;
    role: string | null;
  };
  created_at: string;
  updated_at: string;
  rejection_reason: string | null;
  can_archive: boolean;
  is_archived: boolean;
}

export interface PaginatedJobsResponse {
  count: number;
  hasNext: boolean;
  hasPrevious: boolean;
  currentPage: number;
  results: JobPosting[];
}

async function fetchJobs(
  page: number,
  searchTerm: string,
  filters: JobFilters,
  pageSize: number = 9,
  category?: string,
  ordering?: string
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
  ordering?: string
) {
  return useQuery({
    queryKey: ["jobs", page, searchTerm, filters, pageSize, category, ordering],
    queryFn: () => fetchJobs(page, searchTerm, filters, pageSize, category, ordering),
  });
}

// Fetch jobs for a specific user
export async function fetchUserJobs(
  userId: string,
  page: number = 1,
  pageSize: number = 9,
  ordering?: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api/";
  const url = new URL(`${baseUrl}jobs/?isArchived=false`);
  url.searchParams.append("user_id", userId);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("page_size", pageSize.toString());
  if (ordering) {
    url.searchParams.append("ordering", ordering);
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
  ordering?: string
) {
  return useQuery({
    queryKey: ["userJobs", userId, page, pageSize, ordering],
    queryFn: () => fetchUserJobs(userId, page, pageSize, ordering),
  });
} 