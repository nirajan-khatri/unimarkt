import { User } from "../profile/types";
import { DepartmentOrRoleOrSkillCategory } from "../skills/types";

export type Job = {
  job_id: string;
  title: string;
  description: string;
  remuneration: number;
  department: DepartmentOrRoleOrSkillCategory;
  department_id: string;
  job_type?: "research" | "hiwi" | "tutoring" | "administrative" | "other";
  contact_email: string;
  contact_name: string;
  contact_phone?: string;
  posted_by: User;
  status: "pending" | "approved" | "rejected";
  isArchived: boolean;
  created_at: string;
  updated_at: string;
};
