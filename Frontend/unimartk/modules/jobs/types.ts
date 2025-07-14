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
  degree: string;
  department: DepartmentOrRoleOrSkillCategory;
  status: "pending" | "approved" | "rejected";
  isArchived: boolean;
  created_at: string;
  updated_at: string;
};

export interface JobFilters {
  department: string;
  jobType: string;
}

export interface JobPosting {
  job_id: number;
  title: string;
  description: string;
  qualifications: string;
  department: {
    id: number;
    name: string;
  };
  job_type: string;
  remuneration: string;
  contact_email: string;
  contact_name: string;
  contact_phone: string | null;
  status: string;
  status_display: string;
  posted_by: {
    id: number;
    name: string;
    email: string;
    contact_number: string | null;
    role: string | null;
  };
  created_at: string;
  updated_at: string;
  rejection_reason: string | null;
  can_archive: boolean;
  is_archived: boolean;
}

export interface PaginatedJobsResponse {
  count: number;
  hasNext: boolean;
  hasPrevious: boolean;
  currentPage: number;
  results: JobPosting[];
}
