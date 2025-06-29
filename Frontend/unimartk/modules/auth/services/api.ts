// api.ts
import {
  SecurityQuestion,
  UserRole,
  RegisterData,
  LoginRequest,
  LoginResponse,
} from "../types/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api/";

export const fetchSecurityQuestions = async (): Promise<SecurityQuestion[]> => {
  const response = await fetch(`${API_BASE_URL}security-questions/`);
  if (!response.ok) {
    throw new Error("Failed to fetch security questions");
  }
  return response.json();
};

export const fetchRoles = async (): Promise<UserRole[]> => {
  const response = await fetch(`${API_BASE_URL}roles/`);
  if (!response.ok) {
    throw new Error("Failed to fetch roles");
  }
  return response.json();
};

export const registerUser = async (data: RegisterData): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw errorData;
  }

  return response.json();
};

export const loginUser = async (
  loginData: LoginRequest
): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || `Login failed: ${response.status}`);
  }

  return response.json();
};

export async function fetchCurrentUser(accessToken: string) {
  const response = await fetch(`${API_BASE_URL}current-user/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token: accessToken }),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  return response.json();
}
