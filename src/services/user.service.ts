import { apiClient } from "@/lib/client";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  User,
  UpdateUserRequest,
  UserResponse,
  UsersResponse,
  DeleteUserResponse,
} from "@/types/user.types";

export class UserService {
  /**
   * Get all users (admin only) - returns consistent ApiResponse structure
   */
  static async getUsers(): Promise<UsersResponse> {
    return apiClient.get(API_ENDPOINTS.USERS.LIST);
  }

  /**
   * Get user by ID - returns consistent ApiResponse structure
   */
  static async getUser(id: string): Promise<UserResponse> {
    return apiClient.get(API_ENDPOINTS.USERS.GET(id));
  }

  /**
   * Update user information - returns consistent ApiResponse structure
   */
  static async updateUser(
    id: string,
    userData: UpdateUserRequest
  ): Promise<UserResponse> {
    return apiClient.put(API_ENDPOINTS.USERS.UPDATE(id), userData);
  }

  /**
   * Delete user account - returns consistent ApiResponse structure
   */
  static async deleteUser(id: string): Promise<DeleteUserResponse> {
    return apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
  }
}
