export interface User {
  id: string;
  password: string;
  last_login: string;
  is_superuser: boolean;
  name: string;
  email: string;
  contact_number: string;
  is_active: boolean;
  is_staff: boolean;
  role: string;
  groups: number[];
  user_permissions: number[];
}
