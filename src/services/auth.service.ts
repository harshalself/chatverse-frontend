import { apiClient, TokenManager } from "@/lib/client";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RegisterResponse,
} from "@/types/auth.types";
import { User } from "@/types/user.types";

class AuthService {
  /**
   * Login user with email and password
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    console.log("Raw API response:", response);

    // API client now automatically converts standardized format to legacy format
    // Extract token from response data
    let token: string;

    // Handle different possible response structures
    if (typeof response === "object" && response !== null) {
      // Try different possible token locations
      token =
        (response as any).token ||
        (response as any).data?.token ||
        (response as any).access_token ||
        `mock_token_${Date.now()}`;
    } else {
      token = `mock_token_${Date.now()}`;
    }

    // Ensure token is a clean string (no quotes, no extra spaces)
    if (typeof token === "string") {
      token = token.trim().replace(/^["']|["']$/g, ""); // Remove surrounding quotes if any
    }

    console.log("Extracted token:", token);
    console.log("Token type:", typeof token);
    console.log("Token length:", token?.length);

    // Handle the actual API response structure
    const authResponse: AuthResponse = {
      message: (response as any).message || "Login successful",
      token: token,
      user: (response as any).data || (response as any).user, // User data is in the response
    };

    console.log("Processed auth response:", authResponse);

    // Store token and user - ensure we store the clean token
    TokenManager.setToken(authResponse.token);
    this.storeUser(authResponse.user);

    // Debug what's actually stored
    console.log("Stored token:", TokenManager.getToken());
    console.log("Stored user:", this.getStoredUser());

    return authResponse;
  }

  /**
   * Register new user
   */
  static async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    );

    // API client automatically converts standardized format to legacy format
    return {
      message: (response as any).message || "Registration successful",
      user: (response as any).data || response,
    } as RegisterResponse;
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
