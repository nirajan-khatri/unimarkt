import { User } from "../admin/types";

export interface Skill {
  skill_id: string;
  available_time_week?: AvailableTimeWeekEntity[] | null;
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
  status: string;
}
export interface DepartmentOrRoleOrSkillCategory {
  id: number;
  name: string;
}
export interface Degree {
  id: number;
  department: DepartmentOrRoleOrSkillCategory;
  name: string;
}
