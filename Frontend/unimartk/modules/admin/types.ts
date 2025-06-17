import { UserRole } from "../auth/types/auth";

export interface User {
  id: string;
  password: string;
  last_login: string;
  is_superuser: boolean;
  name: string;
  email: string;
  contact_number: string;
  is_active: boolean;
  is_admin: boolean;
  is_staff: boolean;
  role: UserRole;
  status: "approved" | "pending" | "rejected";
  role_id: string;
}
