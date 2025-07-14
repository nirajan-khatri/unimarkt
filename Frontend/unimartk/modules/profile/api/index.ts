import axios from "@/lib/axios";

import {
  Degree,
  DepartmentOrRoleOrSkillCategory,
} from "@/modules/skills/types";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  isArchived?: boolean;
}

export interface ProductsResponse {
  count: number;
  hasNext: boolean;
  hasPrevious: boolean;
  currentPage: number;
  results: Product[];
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/";

export const fetchUserProducts = async (
  userId: string,
  page: number = 1,
  pageSize: number = 9,
  status?: string,
  isArchived?: boolean
): Promise<ProductsResponse> => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const url = new URL(`${baseUrl}products/`);
  url.searchParams.append("user_id", userId);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("page_size", pageSize.toString());
  
  if (status) {
    url.searchParams.append("status", status);
  }
  
  if (isArchived !== undefined) {
    url.searchParams.append("isArchived", isArchived.toString());
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Add authorization header if needed
      // 'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch products: ${response.status} ${response.statusText}`
    );
  }

  const data: ProductsResponse = await response.json();
  return data;
};

// services/skillService.ts
export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  price_per_hour?: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  is_available?: boolean;
  isArchived?: boolean;
}

export interface SkillsResponse {
  count: number;
  hasNext: boolean;
  hasPrevious: boolean;
  currentPage: number;
  results: Skill[];
}

export const fetchUserSkills = async (
  userId: string,
  page: number = 1,
  pageSize: number = 9,
  status?: string,
  isArchived?: boolean
): Promise<SkillsResponse> => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const url = new URL(`${baseUrl}skills/`);
  url.searchParams.append("user_id", userId);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("page_size", pageSize.toString());
  
  if (status) {
    url.searchParams.append("status", status);
  }
  
  if (isArchived !== undefined) {
    url.searchParams.append("isArchived", isArchived.toString());
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Add authorization header if needed
      // 'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch skills: ${response.status} ${response.statusText}`
    );
  }

  const data: SkillsResponse = await response.json();
  return data;
};

export const fetchDepartments = async (): Promise<
  DepartmentOrRoleOrSkillCategory[]
> => {
  // add logic to ckeck if user is actually superadmin
  const response = await axios.get(`/departments/`);
  return response.data;
};
export const fetchDegrees = async (): Promise<Degree[]> => {
  // add logic to ckeck if user is actually superadmin
  const response = await axios.get(`/degrees/`);
  return response.data;
};

export const deleteUserProfile = async (userId: string) => {
  const response = await axios.delete(`/user/${userId}/`);
  return response.data;
};

export const updateUserProfile = async (userId: string) => {
  const response = await axios.put(`/user/${userId}/`);
  return response.data;
};

export const archiveProduct = async ({
  productId,
  isArchived,
}: {
  productId: string;
  isArchived: boolean;
}) => {
  const response = await axios.post(`/products/${productId}/archive-toggle/`, {
    archive: !isArchived,
  });
  return response.data;
};

// Delete product
export const deleteProduct = async (productId: string) => {
  const response = await axios.delete(`/products/${productId}/`);
  return response.data;
};

export const archiveSkill = async ({
  skillId,
  isArchived,
}: {
  skillId: string;
  isArchived: boolean;
}) => {
  const response = await axios.post(`/skills/${skillId}/archive-toggle/`, {
    archive: !isArchived,
  });
  return response.data;
};

// Delete product
export const deleteSkill = async (skillId: string) => {
  const response = await axios.delete(`/skills/${skillId}/`);
  return response.data;
};

export const archiveJob = async ({
  jobId,
  isArchived,
}: {
  jobId: string;
  isArchived: boolean;
}) => {
  const response = await axios.post(`/jobs/${jobId}/archive-toggle/`, {
    archive: !isArchived,
  });
  return response.data;
};

// Delete product
export const deleteJob = async (jobId: string) => {
  const response = await axios.delete(`/jobs/${jobId}/`);
  return response.data;
};
