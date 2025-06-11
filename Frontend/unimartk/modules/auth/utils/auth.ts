// utils/auth.ts
import { LoginResponse, StoredTokens, UserProfile } from '../types/auth'; // You'll need to create this types file



export class AuthStorage {
  private static readonly TOKENS_COOKIE = 'auth_tokens';
  private static readonly USER_PROFILE_COOKIE = 'user_profile';
  private static readonly AUTH_STATE_COOKIE = 'is_authenticated';

  // Check if we're in a browser environment
  private static isClient(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  // Cookie utility methods
  private static setCookie(name: string, value: string, days: number = 7): void {
    if (!this.isClient()) return;

    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
  }

  private static getCookie(name: string): string | null {
    if (!this.isClient()) return null;

    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  }

  private static deleteCookie(name: string): void {
    if (!this.isClient()) return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }

  // Store authentication data
  static storeAuthData(loginResponse: LoginResponse): void {
    if (!this.isClient()) return;

    try {
      // Store tokens with timestamp for expiry tracking
      const tokens: StoredTokens = {
        access: loginResponse.access,
        refresh: loginResponse.refresh,
        timestamp: Date.now()
      };
      
      this.setCookie(this.TOKENS_COOKIE, JSON.stringify(tokens), 7);
      
      // Store user profile (non-sensitive data)
      const userProfile: UserProfile = {
        id: loginResponse.user.id,
        name: loginResponse.user.name,
        email: loginResponse.user.email,
        contact_number: loginResponse.user.contact_number,
        role: {
          id: loginResponse.user.role.id,
          name: loginResponse.user.role.name
        }
      };
      
      this.setCookie(this.USER_PROFILE_COOKIE, JSON.stringify(userProfile), 7);
      this.setCookie(this.AUTH_STATE_COOKIE, 'true', 7);
      
    } catch (error) {
      console.error('Failed to store authentication data in cookies:', error);
      throw new Error('Failed to store authentication data');
    }
  }

  // Get access token
  static getAccessToken(): string | null {
    if (!this.isClient()) return null;

    try {
      const tokens = this.getCookie(this.TOKENS_COOKIE);
      if (!tokens) return null;
      
      const parsedTokens: StoredTokens = JSON.parse(tokens);
      return parsedTokens.access;
    } catch (error) {
      console.error('Failed to retrieve access token from cookies:', error);
      return null;
    }
  }

  // Get refresh token
  static getRefreshToken(): string | null {
    if (!this.isClient()) return null;

    try {
      const tokens = this.getCookie(this.TOKENS_COOKIE);
      if (!tokens) return null;
      
      const parsedTokens: StoredTokens = JSON.parse(tokens);
      return parsedTokens.refresh;
    } catch (error) {
      console.error('Failed to retrieve refresh token from cookies:', error);
      return null;
    }
  }

  // Get user profile
  static getUserProfile(): UserProfile | null {
    if (!this.isClient()) return null;

    try {
      const profile = this.getCookie(this.USER_PROFILE_COOKIE);
      if (!profile) return null;
      
      return JSON.parse(profile);
    } catch (error) {
      console.error('Failed to retrieve user profile from cookies:', error);
      return null;
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    if (!this.isClient()) return false;
    return this.getCookie(this.AUTH_STATE_COOKIE) === 'true';
  }

  // Get authorization header for API calls
  static getAuthHeader(): { Authorization: string } | {} {
    const token = this.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Clear all authentication data (logout)
  static clearAuthData(): void {
    if (!this.isClient()) return;
    this.deleteCookie(this.TOKENS_COOKIE);
    this.deleteCookie(this.USER_PROFILE_COOKIE);
    this.deleteCookie(this.AUTH_STATE_COOKIE);
  }

  // Update tokens (for refresh token flow)
  static updateTokens(access: string, refresh?: string): void {
    if (!this.isClient()) return;

    try {
      const currentTokens = this.getCookie(this.TOKENS_COOKIE);
      if (!currentTokens) throw new Error('No existing tokens found');
      
      const parsedTokens: StoredTokens = JSON.parse(currentTokens);
      
      const updatedTokens: StoredTokens = {
        access,
        refresh: refresh || parsedTokens.refresh,
        timestamp: Date.now()
      };
      
      this.setCookie(this.TOKENS_COOKIE, JSON.stringify(updatedTokens), 7);
    } catch (error) {
      console.error('Failed to update tokens in cookies:', error);
      throw new Error('Failed to update tokens');
    }
  }

  // Check if tokens might be expired (basic check)
  static isTokenLikelyExpired(): boolean {
    if (!this.isClient()) return true;

    try {
      const tokens = this.getCookie(this.TOKENS_COOKIE);
      if (!tokens) return true;
      
      const parsedTokens: StoredTokens = JSON.parse(tokens);
      const now = Date.now();
      const tokenAge = now - parsedTokens.timestamp;
      
      // Assume tokens expire after 1 hour (adjust based on your backend)
      const ONE_HOUR = 60 * 60 * 1000;
      return tokenAge > ONE_HOUR;
    } catch (error) {
      console.error('Failed to check token expiry:', error);
      return true;
    }
  }

  // Get all cookies (for debugging)
  static getAllAuthCookies(): {
    tokens: StoredTokens | null;
    profile: UserProfile | null;
    isAuthenticated: boolean;
  } {
    if (!this.isClient()) {
      return {
        tokens: null,
        profile: null,
        isAuthenticated: false
      };
    }

    return {
      tokens: (() => {
        try {
          const tokens = this.getCookie(this.TOKENS_COOKIE);
          return tokens ? JSON.parse(tokens) : null;
        } catch {
          return null;
        }
      })(),
      profile: this.getUserProfile(),
      isAuthenticated: this.isAuthenticated()
    };
  }
}