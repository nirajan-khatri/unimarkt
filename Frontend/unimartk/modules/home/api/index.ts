import axios from "@/lib/axios";
import { Category } from "../types";

export const fetchproductCategories = async (): Promise<Category[]> => {
  // add logic to ckeck if user is actually superadmin
  const response = await axios.get(`/categories/`);
  return response.data;
};
export const fetchProductSubcategories = async (): Promise<Category[]> => {
  // add logic to ckeck if user is actually superadmin
  const response = await axios.get(`/subcategories/`);
  return response.data;
};
export const fetchJobCategories = async (): Promise<Category[]> => {
  // add logic to ckeck if user is actually superadmin
  const response = await axios.get(`/job-categories/`);
  return response.data;
};
