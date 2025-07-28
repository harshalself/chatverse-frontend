import { ID, Timestamp } from "./api.types";

// User Types
export interface User {
  id: ID;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  role: UserRole;
  isEmailVerified: boolean;
}

export type UserRole = "admin" | "user" | "guest";

// Authentication Request Types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Authentication Response Types
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}

// Authentication State
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Token Types
export interface TokenPayload {
  userId: ID;
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
}
