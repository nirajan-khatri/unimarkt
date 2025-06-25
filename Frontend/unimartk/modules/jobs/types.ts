import { User } from "../admin/types";
import { Category } from "../home/types";
import { Degree, DepartmentOrRoleOrSkillCategory } from "../skills/types";

export type Job = {
  job_id: string;
  title: string;
  location: string;
  description: string;
  qualifications: string;
  salary_per_hour: number;
  category: { id: string; name: string };
  contact_email: string;
  user: User;
  degree: Degree;
  department: DepartmentOrRoleOrSkillCategory;
  status: "pending" | "approved" | "rejected";
  isArchived: boolean;
  created_at: string;
  updated_at: string;
};
