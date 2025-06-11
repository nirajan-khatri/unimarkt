export interface UserRole {
    id: number;
    name: string;
}

export interface UserProfile {
    id: number;
    name: string;
    email: string;
    contact_number: string;
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
