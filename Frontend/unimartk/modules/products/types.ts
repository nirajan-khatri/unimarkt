import { User } from "../admin/types";
import { Category } from "../home/types";

export type Product = {
  product_id: string;
  name: string;
  category: Category;
  sub_category: Category;
  description: string;
  price: string;
  images?: string[];
  user?: User;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  pickup_location: string;
};
