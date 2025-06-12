import { Category } from "@/modules/home/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api/";

export class CategoryService {
  static async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}categories/`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch categories: ${response.status} ${response.statusText}`
      );
    }
    return response.json();
  }

  static async getSubcategories(categoryId: number): Promise<Category[]> {
    const response = await fetch(
      `${API_BASE_URL}subcategories/?category_id=${categoryId}`
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch subcategories: ${response.status} ${response.statusText}`
      );
    }
    return response.json();
  }
}
