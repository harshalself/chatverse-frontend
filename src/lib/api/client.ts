import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { APP_CONFIG } from "@/lib/constants";
import { handleApiError, withRetry } from "@/lib/error-handler";
import { ApiResponse } from "@/types/api.types";
import { tokenStorage } from "@/lib/storage";
import { offlineQueue } from "@/lib/offline-queue";

// Token management (keeping backward compatibility)
class TokenManager {
  static getToken(): string | null {
    return tokenStorage.getAuthToken();
  }

  static setToken(token: string): void {
    tokenStorage.setAuthToken(token);
  }

  static getRefreshToken(): string | null {
    return tokenStorage.getRefreshToken();
  }

  static setRefreshToken(token: string): void {
    tokenStorage.setRefreshToken(token);
  }

  static clearTokens(): void {
    tokenStorage.clearTokens();
  }
}

// API Client Class
class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor() {
    this.client = axios.create({
      baseURL: APP_CONFIG.apiBaseUrl,
      timeout: 30000, // 30 seconds
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = TokenManager.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add request timestamp for debugging
        if (APP_CONFIG.debugMode) {
          console.log(
            `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
            {
              data: config.data,
              params: config.params,
            }
          );
        }

        return config;
      },
      (error) => {
        console.error("[API Request Error]", error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        if (APP_CONFIG.debugMode) {
          console.log(
            `[API Response] ${response.config.method?.toUpperCase()} ${
              response.config.url
            }`,
            {
              status: response.status,
              data: response.data,
            }
          );
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors with token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Add to queue if already refreshing
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return this.client(originalRequest);
              })
              .catch((err) => {
                return Promise.reject(err);
              });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = TokenManager.getRefreshToken();
            if (refreshToken) {
              const response = await this.refreshAccessToken(refreshToken);
              const newToken = response.data.token;

              TokenManager.setToken(newToken);
              this.processQueue(null, newToken);

              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            TokenManager.clearTokens();
            // Redirect to login
            window.location.href = "/signin";
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(handleApiError(error));
      }
    );
  }

  private processQueue(error: any, token: string | null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  private async refreshAccessToken(refreshToken: string) {
    return this.client.post("/auth/refresh", { refreshToken });
  }

  // Generic request methods with offline support
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    // Check if we should queue this request
    if (offlineQueue.shouldQueue("POST", url)) {
      const queueId = offlineQueue.addRequest({
        url: `${APP_CONFIG.apiBaseUrl}${url}`,
        method: "POST",
        data,
        headers: config?.headers as Record<string, string>,
        maxRetries: 3,
        priority: "medium",
      });

      // Return a promise that will be resolved when the request is processed
      throw new Error("Request queued for offline processing");
    }

    const response = await this.client.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    // Check if we should queue this request
    if (offlineQueue.shouldQueue("PUT", url)) {
      offlineQueue.addRequest({
        url: `${APP_CONFIG.apiBaseUrl}${url}`,
        method: "PUT",
        data,
        headers: config?.headers as Record<string, string>,
        maxRetries: 3,
        priority: "medium",
      });
      throw new Error("Request queued for offline processing");
    }

    const response = await this.client.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    // Check if we should queue this request
    if (offlineQueue.shouldQueue("PATCH", url)) {
      offlineQueue.addRequest({
        url: `${APP_CONFIG.apiBaseUrl}${url}`,
        method: "PATCH",
        data,
        headers: config?.headers as Record<string, string>,
        maxRetries: 3,
        priority: "medium",
      });
      throw new Error("Request queued for offline processing");
    }

    const response = await this.client.patch<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    // Check if we should queue this request
    if (offlineQueue.shouldQueue("DELETE", url)) {
      offlineQueue.addRequest({
        url: `${APP_CONFIG.apiBaseUrl}${url}`,
        method: "DELETE",
        headers: config?.headers as Record<string, string>,
        maxRetries: 3,
        priority: "high", // Deletes are high priority
      });
      throw new Error("Request queued for offline processing");
    }

    const response = await this.client.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  // Upload file with progress
  async uploadFile<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    };

    const response = await this.client.post<ApiResponse<T>>(
      url,
      formData,
      config
    );
    return response.data.data;
  }

  // Download file
  async downloadFile(url: string, filename?: string): Promise<void> {
    const response = await this.client.get(url, {
      responseType: "blob",
    });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename || "download";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  }

  // Request with retry logic
  async requestWithRetry<T>(
    method: "get" | "post" | "put" | "patch" | "delete",
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
    maxRetries: number = 3
  ): Promise<T> {
    return withRetry(
      () => this[method]<T>(url, data, config),
      maxRetries,
      1000
    );
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.get("/health");
  }

  // Get raw axios instance for custom requests
  getAxiosInstance(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export { TokenManager };
