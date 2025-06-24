import { User } from "../profile/types";
import { DepartmentOrRoleOrSkillCategory } from "../skills/types";

export type Job = {
  job_id: string;
  title: string;
  description: string;
  salary_per_hour: number;
  category: DepartmentOrRoleOrSkillCategory;
  contact_email: string;
  user: User;
  location: string;
  status: "pending" | "approved" | "rejected";
  isArchived: boolean;
  created_at: string;
  updated_at: string;
};
export interface DepartmentOrRoleOrSkillCategory {
  id: string;
  name: string;
}

export interface Degree {
  id: string;
  department: DepartmentOrRoleOrSkillCategory;
  name: string;
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

export interface SkillMessageWindowProps {
  senderId: string;
  receiverId: string;
  productName: string;
  sellerName: string;
  initialMessage: string;
}