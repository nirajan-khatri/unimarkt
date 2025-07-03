// modules/auth/contexts/authContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import {
  LoginResponse,
  UserProfile,
  StoredTokens,
  ROLE_MAP,
  UserRole,
} from "../types/auth";
import { fetchCurrentUser } from "../services/api";

// Cookie management utilities
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null; // Check for SSR
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

const removeCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

interface AuthContextType {
  // Authentication state
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: UserProfile | null;
  tokens: StoredTokens | null;

  // Actions
  login: (loginResponse: LoginResponse) => void;
  logout: () => void;
  updateTokens: (access: string, refresh?: string) => void;

  // Utility methods
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  getAuthHeader: () => { Authorization: string } | {};

  // RBAC helper
  hasRole: (role: UserRole) => boolean;
  setUserId: (id: string) => void;
  getUserId: () => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tokens, setTokens] = useState<StoredTokens | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize auth state from cookies
  useEffect(() => {
    const accessToken = getCookie("accessToken");
    const refreshToken = getCookie("refreshToken");

    if (accessToken && refreshToken) {
      setTokens({
        access: accessToken,
        refresh: refreshToken,
        timestamp: parseInt(
          getCookie("tokenTimestamp") || Date.now().toString()
        ),
      });
      setIsAuthenticated(true);

      fetchCurrentUser(accessToken)
        .then((data: UserProfile) => {
          setUser({
            ...data,
            role:
              ROLE_MAP[(data as any).role as keyof typeof ROLE_MAP] || "user",
          });
        })
        .catch((err: unknown) => {
          console.error("Error fetching user:", err);
          logout();
        });
    }
    setIsInitialized(true);
  }, []);

  const login = (loginResponse: LoginResponse) => {
    const newTokens: StoredTokens = {
      access: loginResponse.access,
      refresh: loginResponse.refresh,
      timestamp: Date.now(),
    };

    setTokens(newTokens);
    setIsAuthenticated(true);

    // Set cookies
    setCookie("accessToken", newTokens.access);
    setCookie("refreshToken", newTokens.refresh);
    setCookie("tokenTimestamp", newTokens.timestamp.toString());

    fetchCurrentUser(loginResponse.access)
      .then((data: UserProfile) => {
        setUser({
          ...data,
          role: ROLE_MAP[(data as any).role as keyof typeof ROLE_MAP] || "user",
        });
      })
      .catch((err: unknown) => {
        console.error("Error fetching user:", err);
        logout();
      });
  };

  const logout = () => {
    setTokens(null);
    setUser(null);
    setIsAuthenticated(false);

    removeCookie("accessToken");
    removeCookie("refreshToken");
    removeCookie("tokenTimestamp");
    removeCookie("userId");
  };

  const updateTokens = (access: string, refresh?: string) => {
    if (!tokens) {
      throw new Error("Cannot update tokens: no existing tokens found");
    }

    const updatedTokens: StoredTokens = {
      access,
      refresh: refresh || tokens.refresh,
      timestamp: Date.now(),
    };

    // Update state
    setTokens(updatedTokens);

    // Update cookies
    setCookie("accessToken", updatedTokens.access);
    if (refresh) {
      setCookie("refreshToken", refresh);
    }
    setCookie("tokenTimestamp", updatedTokens.timestamp.toString());
  };

  const getAccessToken = (): string | null =>
    tokens?.access || getCookie("accessToken");
  const getRefreshToken = (): string | null =>
    tokens?.refresh || getCookie("refreshToken");
  const getAuthHeader = (): { Authorization: string } | {} => {
    const token = getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // RBAC helper
  const hasRole = (role: UserRole) => {
    return user?.role === role;
  };

  const setUserId = (id: string) => {
    setCookie("userId", id);
  };

  const getUserId = (): number => {
    return Number(getCookie("userId"));
  };

  const value: AuthContextType = {
    isAuthenticated,
    isInitialized,
    user,
    tokens,
    login,
    logout,
    updateTokens,
    getAccessToken,
    getRefreshToken,
    getAuthHeader,
    hasRole,
    setUserId,
    getUserId,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
