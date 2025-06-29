import { User } from "../admin/types";
import { Category } from "../home/types";

export type Skill = {
  skill_id: string;
  description: string;
  price: number;
  module: string;
  skill_category: Category;
  sub_category: Category;
  user: User;
  status: "pending" | "approved" | "rejected";
  isArchived: boolean;
  created_at: string;
  updated_at: string;
};

export type SkillDetail = {
  skill_id: string;
  description: string;
  module: string;
  skill_category: Category;
  sub_category: Category;
  user: User;
  status: "pending" | "approved" | "rejected";
  isArchived: boolean;
  created_at: string;
  updated_at: string;
  available_time_week: AvailableTimeWeekEntity[];
  degree: Degree;
  department: DepartmentOrRoleOrSkillCategory;
  charge_per_hour: string;
};

export interface PaginatedSkillsResponse {
  count: number;
  hasNext: boolean;
  hasPrevious: boolean;
  currentPage: number;
  results: Skill[];
}

export interface AvailableTimeWeekEntity {
  day:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  start_time: string;
  end_time: string;
  status: "open" | "booked" | undefined;
}

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
  data: SkillDetail;
}
