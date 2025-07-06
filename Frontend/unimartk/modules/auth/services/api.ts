// api.ts
import {
  SecurityQuestion,
  UserRole,
  RegisterData,
  LoginRequest,
  LoginResponse,
  TwoFactorSetupResponse,
  TwoFactorVerifyRequest,
  TwoFactorEnableRequest,
  TwoFactorEnableResponse,
  BackupCodeVerifyRequest,
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

export async function verifyUserEmail(email: string) {
  const response = await fetch(`${API_BASE_URL}verify-user-by-email/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    throw new Error("Failed to verify user by email");
  }
  return response.json();
}

export async function verifyUserSecurityQuestion(data: {
  id: number;
  key: string;
  answer: string;
}) {
  const response = await fetch(`${API_BASE_URL}verify-security-question/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: data.id, key: data.key, answer: data.answer }),
  });
  if (!response.ok) {
    throw new Error("Failed to verify user security question");
  }
  return response.json();
}

export async function resetPassword(data: {
  id: number;
  new_password: string;
}) {
  const response = await fetch(`${API_BASE_URL}password-reset/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: data.id, new_password: data.new_password}),
  });
  if (!response.ok) {
    throw new Error("Failed to reset user password");
  }
  return response.json();
}

export const setupTwoFactor = async (userId: number): Promise<TwoFactorSetupResponse> => {
  const response = await fetch(`${API_BASE_URL}2fa/setup/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id: userId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error || `2FA setup failed: ${response.status}`);
  }

  return response.json();
};

export const verifyTwoFactor = async (data: TwoFactorVerifyRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}2fa/verify/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error || `2FA verification failed: ${response.status}`);
  }

  return response.json();
};

export const enableTwoFactor = async (data: TwoFactorEnableRequest): Promise<TwoFactorEnableResponse> => {
  const response = await fetch(`${API_BASE_URL}2fa/enable/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error || `2FA enable failed: ${response.status}`);
  }

  return response.json();
};

export const disableTwoFactor = async (data: TwoFactorVerifyRequest): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}2fa/disable/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error || `2FA disable failed: ${response.status}`);
  }

  return response.json();
};

export const verifyBackupCode = async (data: BackupCodeVerifyRequest): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}2fa/backup-verify/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error || `Backup code verification failed: ${response.status}`);
  }

  return response.json();
};
