import { Category } from "../home/types";
import { User } from "../profile/types";

export interface Product {
  product_id: number;
  name: string;
  category: Category;
  sub_category: Category;
  description: string;
  price: string;
  images?: string[] | null;
  user: User;
  status: string;
  created_at: string;
  pickup_location: string;
}
