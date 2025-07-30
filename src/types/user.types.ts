import { ApiResponse, ID } from "./api.types";

// User entity
export interface User {
  id: ID;
  name: string;
  email: string;
  phone_number: string;
  created_at?: string;
  updated_at?: string;
}

// Auth requests
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

// User management requests
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone_number?: string;
  password?: string;
}

// API responses
export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface UpdateUserResponse {
  message: string;
  user: User;
}

export type UserResponse = ApiResponse<User>;
export type UsersResponse = ApiResponse<{ users: User[]; total: number }>;
export type DeleteUserResponse = ApiResponse<{ message: string }>;
export type AuthResponse = ApiResponse<LoginResponse>;

// User notification settings - Frontend only
export interface UserNotificationSettings {
  emailNotifications: boolean;
  browserNotifications: boolean;
  agentUpdates: boolean;
}
