import { ID, Timestamp, ApiResponse } from "./api.types";
import { User } from "./user.types";

export type UserRole = "admin" | "user" | "guest";

// Authentication Request Types - Updated to match real API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone_number: string;
  password: string;
}

// Authentication Response Types - Updated to match real API
export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

// Additional request types for existing features
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

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone_number?: string;
  password?: string;
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

// API Error Response - Updated to match real API
export interface ApiErrorResponse {
  status: number;
  message: string;
  details?: string[];
}

// Users list response (for admin features)
export interface UsersResponse {
  users: User[];
  total: number;
}

export interface UserResponse {
  user: User;
}

export interface UpdateUserResponse {
  message: string;
  user: User;
}

export interface DeleteUserResponse {
  message: string;
}
