import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  User,
  UpdateUserRequest,
  UserResponse,
  UsersResponse,
  DeleteUserResponse,
} from "@/types/user.types";

class UserService {
  /**
   * Get all users (admin only)
   */
  static async getUsers(): Promise<UsersResponse> {
    return await apiClient.get(API_ENDPOINTS.USERS.LIST);
  }

  /**
   * Get user by ID
   */
  static async getUser(id: string): Promise<UserResponse> {
    return await apiClient.get(API_ENDPOINTS.USERS.GET(id));
  }

  /**
   * Update user information
   */
  static async updateUser(
    id: string,
    userData: UpdateUserRequest
  ): Promise<UserResponse> {
    return await apiClient.put(API_ENDPOINTS.USERS.UPDATE(id), userData);
  }

  /**
   * Delete user account
   */
  static async deleteUser(id: string): Promise<DeleteUserResponse> {
    return await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
  }
}

export { UserService };
