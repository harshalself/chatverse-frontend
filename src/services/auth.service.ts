import { apiClient, TokenManager } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  RefreshTokenResponse,
} from "@/types/auth.types";

export class AuthService {
  /**
   * Login user with email and password
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    // Store tokens
    TokenManager.setToken(response.token);
    if (response.refreshToken) {
      TokenManager.setRefreshToken(response.refreshToken);
    }

    return response;
  }

  /**
   * Register new user
   */
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    );

    // Store tokens
    TokenManager.setToken(response.token);
    if (response.refreshToken) {
      TokenManager.setRefreshToken(response.refreshToken);
    }

    return response;
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Continue with logout even if API call fails
      console.warn("Logout API call failed:", error);
    } finally {
      // Always clear tokens on logout
      TokenManager.clearTokens();
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
  }

  /**
   * Refresh access token
   */
  static async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );

    // Update stored token
    TokenManager.setToken(response.token);

    return response;
  }

  /**
   * Send forgot password email
   */
  static async forgotPassword(
    data: ForgotPasswordRequest
  ): Promise<{ message: string }> {
    return apiClient.post("/auth/forgot-password", data);
  }

  /**
   * Reset password with token
   */
  static async resetPassword(
    data: ResetPasswordRequest
  ): Promise<{ message: string }> {
    return apiClient.post("/auth/reset-password", data);
  }

  /**
   * Change user password
   */
  static async changePassword(
    data: ChangePasswordRequest
  ): Promise<{ message: string }> {
    return apiClient.post("/auth/change-password", data);
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: Partial<User>): Promise<User> {
    return apiClient.put<User>("/auth/profile", data);
  }

  /**
   * Upload user avatar
   */
  static async uploadAvatar(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ avatarUrl: string }> {
    return apiClient.uploadFile<{ avatarUrl: string }>(
      "/auth/avatar",
      file,
      onProgress
    );
  }

  /**
   * Verify email address
   */
  static async verifyEmail(token: string): Promise<{ message: string }> {
    return apiClient.post("/auth/verify-email", { token });
  }

  /**
   * Resend email verification
   */
  static async resendVerification(): Promise<{ message: string }> {
    return apiClient.post("/auth/resend-verification");
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!TokenManager.getToken();
  }

  /**
   * Get stored auth token
   */
  static getToken(): string | null {
    return TokenManager.getToken();
  }

  /**
   * Manually clear auth tokens (for testing/admin)
   */
  static clearTokens(): void {
    TokenManager.clearTokens();
  }
}
