import { Category } from "../home/types";
import { User } from "../profile/types";

type Product = {
  id: string;
  name: string;
  category: Category;
  subCategory: Category;
  description: string;
  price: string;
  images?: string[];
  user?: User;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

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
