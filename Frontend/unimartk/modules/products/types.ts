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

export interface Message {
  id: string | number;
  message: string;
  sender_id: string;
  receiver_id: string;
  timestamp: string;
  created_at?: string;
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
