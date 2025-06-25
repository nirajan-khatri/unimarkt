// Role mapping for RBAC
export const ROLE_MAP = {
  1: "user",
  2: "faculty",
  3: "admin",
  4: "superuser",
} as const;

export type UserRole = typeof ROLE_MAP[keyof typeof ROLE_MAP];

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  contact_number: string | null;
  role: UserRole;
}

export interface LoginResponse {
  user: UserProfile;
  refresh: string;
  access: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface StoredTokens {
  access: string;
  refresh: string;
  timestamp: number;
}

export interface SecurityQuestion {
  key: string;
  question: string;
}

// types/auth.ts
export interface LoginRequest {
  email: string;
  password: string;
}
