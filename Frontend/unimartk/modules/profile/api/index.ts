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
    is_sold?: boolean;
  }
  
  export interface ProductsResponse {
    count: number;
    hasNext: boolean;
    hasPrevious: boolean;
    currentPage: number;
    results: Product[];
  }
  
  export const fetchUserProducts = async (
    userId: string, 
    page: number = 1, 
    pageSize: number = 9
  ): Promise<ProductsResponse> => {
    if (!userId) {
      throw new Error('User ID is required');
    }
  
    const response = await fetch(
      `http://localhost:8000/api/products/?user_id=${userId}&page=${page}&page_size=${pageSize}`, 
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`,
        },
      }
    );
  
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
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
    pageSize: number = 9
  ): Promise<SkillsResponse> => {
    if (!userId) {
      throw new Error('User ID is required');
    }
  
    const response = await fetch(
      `http://localhost:8000/api/skills/?user_id=${userId}&page=${page}&page_size=${pageSize}`, 
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${token}`,
        },
      }
    );
  
    if (!response.ok) {
      throw new Error(`Failed to fetch skills: ${response.status} ${response.statusText}`);
    }
  
    const data: SkillsResponse = await response.json();
    return data;
  };