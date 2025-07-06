// Role mapping for RBAC
export const ROLE_MAP = {
  1: "user",
  2: "faculty",
  3: "admin",
  4: "superuser",
} as const;

export type UserRole = (typeof ROLE_MAP)[keyof typeof ROLE_MAP];

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  contact_number: string | null;
  role: UserRole;
  two_factor_enabled: boolean;
}

export interface LoginResponse {
  user: UserProfile;
  refresh: string;
  access: string;
  requires_2fa?: boolean;
  user_id?: string;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterData {
  answer1: string;
  answer2: string;
  answer3: string;
  contact_number?: string;
  email: string;
  is_admin?: boolean;
  is_staff?: boolean;
  name: string;
  password: string;
  security_question1: string;
  security_question2: string;
  security_question3: string;
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

export interface TwoFactorSetupResponse {
  secret: string;
  qr_code: string;
  message: string;
}

export interface TwoFactorVerifyRequest {
  user_id: number;
  code: string;
}

export interface TwoFactorEnableRequest {
  user_id: number;
  code: string;
}

export interface TwoFactorEnableResponse {
  message: string;
  backup_codes: string[];
  warning: string;
}

export interface BackupCodeVerifyRequest {
  user_id: number;
  backup_code: string;
}

// types/auth.ts
export interface LoginRequest {
  email: string;
  password: string;
}
