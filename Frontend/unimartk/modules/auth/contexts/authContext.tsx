// modules/auth/contexts/authContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { LoginResponse, UserProfile, StoredTokens } from '../types/auth';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tokens, setTokens] = useState<StoredTokens | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(true);

  const login = (loginResponse: LoginResponse) => {
    const newTokens: StoredTokens = {
      access: loginResponse.access,
      refresh: loginResponse.refresh,
      timestamp: Date.now()
    };
    const userProfile: UserProfile = { ...loginResponse.user };

    setTokens(newTokens);
    setUser(userProfile);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setTokens(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateTokens = (access: string, refresh?: string) => {
    if (!tokens) {
      throw new Error('Cannot update tokens: no existing tokens found');
    }

    const updatedTokens: StoredTokens = {
      access,
      refresh: refresh || tokens.refresh,
      timestamp: Date.now()
    };

    setTokens(updatedTokens);
  };

  const getAccessToken = (): string | null => tokens?.access || null;
  const getRefreshToken = (): string | null => tokens?.refresh || null;
  const getAuthHeader = (): { Authorization: string } | {} => {
    const token = getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};