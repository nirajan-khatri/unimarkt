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

export interface SecurityQuestion {
    key: string;
    question: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    contact_number?: string;
    role?: number;
    security_question1: string;
    answer1: string;
    security_question2: string;
    answer2?: string;
    security_question3: string;
    answer3: string;
}

// types/auth.ts
export interface LoginRequest {
    email: string;
    password: string;
}
