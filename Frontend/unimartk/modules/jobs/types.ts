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
