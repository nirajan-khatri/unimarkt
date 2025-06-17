import { User } from "../admin/types";

export interface Skill {
  skill_id: string;
  available_time_week: AvailableTimeWeekEntity[];
  skill_category: DepartmentOrRoleOrSkillCategory;
  department: DepartmentOrRoleOrSkillCategory;
  degree: Degree;
  user: User;
  status: "approved" | "pending" | "rejected";
  module: string;
  description: string;
  charge_per_hour: string;
  created_at: string;
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
