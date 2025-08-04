import { ApiResponse, ID, Timestamp } from "./api.types";

// User entity - aligned with backend API
export interface User {
  id: ID;
  name: string;
  email: string;
  phone_number: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

// User management requests
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone_number?: string;
  password?: string;
}

// API responses - using consistent ApiResponse structure
export type UserResponse = ApiResponse<User>;
export type UsersResponse = ApiResponse<User[]>;
export type DeleteUserResponse = ApiResponse<{ message: string }>;

// User notification settings - Frontend only
export interface UserNotificationSettings {
  emailNotifications: boolean;
  browserNotifications: boolean;
  agentUpdates: boolean;
}
