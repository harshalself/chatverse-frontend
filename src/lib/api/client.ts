import axios, { AxiosInstance } from "axios";
import { APP_CONFIG } from "@/lib/constants";

// Simple token management
export class TokenManager {
  static getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  static setToken(token: string): void {
    localStorage.setItem("authToken", token);
  }

  static clearTokens(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use((config) => {
  const token = TokenManager.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data, // Return only the data part
  (error) => {
    if (error.response?.status === 401) {
      TokenManager.clearTokens();
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export { apiClient };
