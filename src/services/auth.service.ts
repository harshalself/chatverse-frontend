import { apiClient, TokenManager } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RegisterResponse,
  User,
} from "@/types/auth.types";

class AuthService {
  /**
   * Login user with email and password
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = (await apiClient.post(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    )) as AuthResponse;

    // Store token and user
    TokenManager.setToken(response.token);
    this.storeUser(response.user);

    return response;
  }

  /**
   * Register new user
   */
  static async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = (await apiClient.post(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    )) as RegisterResponse;

    return response;
  }

  /**
   * Logout user
   */
  static async logout(): Promise<void> {
    try {
      // Clear tokens and user data
      TokenManager.clearTokens();
      this.clearStoredUser();
    } catch (error) {
      console.warn("Logout error:", error);
      // Always clear local data even if API call fails
      TokenManager.clearTokens();
      this.clearStoredUser();
    }
  }

  /**
   * Get current user profile (not available in current backend)
   * Using localStorage instead since backend doesn't have /auth/me endpoint
   */
  // static async getCurrentUser(): Promise<User> {
  //   return apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
  // }

  /**
   * Check if user is authenticated with robust validation
   */
  static isAuthenticated(): boolean {
    const token = TokenManager.getToken();
    const user = this.getStoredUser();

    // Must have both token and user data
    if (!token || !user) {
      return false;
    }

    // Basic token validation (check if it's not expired if it's a JWT)
    try {
      // If token is JWT, check expiry
      if (token.includes(".")) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < now) {
          // Token is expired, clear auth data
          TokenManager.clearTokens();
          this.clearStoredUser();
          return false;
        }
      }
    } catch (error) {
      // If token parsing fails, assume it's still valid (might not be JWT)
      console.warn("Token validation warning:", error);
    }

    return true;
  }

  /**
   * Get stored user from localStorage
   */
  static getStoredUser(): User | null {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  /**
   * Store user in localStorage
   */
  static storeUser(user: User): void {
    localStorage.setItem("user", JSON.stringify(user));
  }

  /**
   * Clear stored user and related data
   */
  static clearStoredUser(): void {
    localStorage.removeItem("user");
    localStorage.removeItem("intendedRoute"); // Clear any saved intended route
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
    this.clearStoredUser();
  }
}

export default AuthService;
