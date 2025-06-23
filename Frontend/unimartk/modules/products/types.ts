import { User } from "../admin/types";
import { Category } from "../home/types";

export type Product = {
  product_id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: Category;
  sub_category: Category;
  pickup_location: string;
  user: User;
  status: "pending" | "approved" | "rejected";
  isArchived: boolean;
  created_at: string;
  updated_at: string;
};

export interface PaginatedProductsResponse {
  count: number;
  hasNext: boolean;
  hasPrevious: boolean;
  currentPage: number;
  results: Product[];
}

export interface Message {
  id: number;
  content: string;
  timestamp: string;
  sender: User;
  receiver: User;
  product: Product;
}

export interface WebSocketMessage {
  message: string;
  sender_id: string;
  timestamp: string;
}

export interface ProductMessageWindowProps {
  senderId: string;
  receiverId: string;
  productName: string;
  sellerName: string;
}
