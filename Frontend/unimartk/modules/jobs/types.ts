<<<<<<< HEAD
import { User } from "../admin/types";
import { Category } from "../home/types";

export type Skill = {
  id: number;
  description: string;
  price: number;
  module: string;
  skill_category: Category;
  sub_category: Category;
  user: User;
=======
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
>>>>>>> f9d986bb45ac728319ee0a4d36ff534f3ab8b94b
  status: "pending" | "approved" | "rejected";
  isArchived: boolean;
  created_at: string;
  updated_at: string;
};
<<<<<<< HEAD

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
  initialMessage: string;
}
=======
>>>>>>> f9d986bb45ac728319ee0a4d36ff534f3ab8b94b
