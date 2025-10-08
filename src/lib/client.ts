import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
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

// Simple in-memory request cache
type CacheRecord = {
  data: any;
  timestamp: number;
};

class RequestCache {
  private cache: Map<string, CacheRecord> = new Map();
  private readonly DEFAULT_TTL = 60 * 1000; // 1 minute default TTL

  generateCacheKey(config: AxiosRequestConfig): string {
    const { method, url, params, data } = config;
    return `${method}-${url}-${JSON.stringify(params || {})}-${JSON.stringify(
      data || {}
    )}`;
  }

  get(key: string): any | null {
    const record = this.cache.get(key);

    if (!record) return null;

    // Check if cache entry is still valid
    if (Date.now() - record.timestamp > this.DEFAULT_TTL) {
      this.cache.delete(key);
      return null;
    }

    return record.data;
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  invalidate(urlPattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(urlPattern)) {
        this.cache.delete(key);
      }
    }
  }
}

const requestCache = new RequestCache();

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token and handle caching
apiClient.interceptors.request.use((config) => {
  const token = TokenManager.getToken();
  if (token) {
    // Include schema in Authorization header as expected by backend
    const authHeader = `Bearer ${token} public`;
    config.headers.Authorization = authHeader;
  }

  // Debug logging
  console.log('🚀 API Request:', {
    method: config.method?.toUpperCase(),
    url: config.url,
    fullUrl: `${config.baseURL}${config.url}`,
    headers: {
      ...config.headers,
      Authorization: config.headers.Authorization ? '[REDACTED]' : undefined
    },
    params: config.params,
    data: config.data
  });

  // Check cache for GET requests in production
  if (
    config.method?.toLowerCase() === "get" &&
    process.env.NODE_ENV === "production" &&
    !config.headers?.["x-bypass-cache"]
  ) {
    const cacheKey = requestCache.generateCacheKey(config);
    const cachedData = requestCache.get(cacheKey);

    if (cachedData) {
      // Cancel the request and resolve with cached data
      const source = axios.CancelToken.source();
      config.cancelToken = source.token;

      setTimeout(() => {
        source.cancel(
          JSON.stringify({
            status: 200,
            data: cachedData,
            fromCache: true,
          })
        );
      }, 0);
    }
  }

  return config;
});

// Response interceptor for error handling and caching
apiClient.interceptors.response.use(
  (response) => {
    // Debug logging for successful responses
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      fullUrl: `${response.config.baseURL}${response.config.url}`,
      method: response.config.method?.toUpperCase(),
      data: response.data,
      headers: response.headers
    });

    const responseData = response.data;
    
    // Handle new standardized format: { success: true, data: T, message: string }
    if (typeof responseData === 'object' && responseData !== null && 'success' in responseData) {
      if (!responseData.success) {
        // Handle API-level errors (success: false)
        const error = new Error(responseData.message || 'API request failed');
        (error as any).response = {
          data: responseData,
          status: response.status,
          statusText: response.statusText
        };
        return Promise.reject(error);
      }
      
      // For successful standardized responses, return in the legacy format
      // This maintains backward compatibility with all existing services
      return {
        data: responseData.data,
        message: responseData.message,
        meta: responseData.meta,
        // Include success for new code that might check it
        success: responseData.success
      };
    }

    // Cache successful GET responses
    if (
      response.config.method?.toLowerCase() === "get" &&
      process.env.NODE_ENV === "production"
    ) {
      const cacheKey = requestCache.generateCacheKey(response.config);
      requestCache.set(cacheKey, response.data);
    }

    // Invalidate cache for POST/PUT/DELETE/PATCH methods
    if (
      ["post", "put", "delete", "patch"].includes(
        response.config.method?.toLowerCase() || ""
      )
    ) {
      const url = response.config.url || "";
      requestCache.invalidate(url);
    }

    // For legacy responses, return as-is
    return responseData;
  },
  (error) => {
    // Debug logging for errors
    console.error('❌ API Error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      fullUrl: error.config ? `${error.config.baseURL}${error.config.url}` : 'N/A',
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
      headers: error.config?.headers
    });

    // Handle canceled requests with cached data
    if (axios.isCancel(error)) {
      try {
        const responseData = JSON.parse(error.message);
        if (responseData.fromCache) {
          return Promise.resolve(responseData.data);
        }
      } catch (e) {
        // If parsing fails, continue with error handling
      }
    }

    // Authentication error handling - but don't redirect on login/register endpoints
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes("/users/login");
      const isRegisterRequest = error.config?.url?.includes("/users/register");

      // Only clear tokens and redirect if it's NOT a login/register attempt
      if (!isLoginRequest && !isRegisterRequest) {
        TokenManager.clearTokens();
        window.location.href = "/signin";
        return Promise.reject(
          new Error("Authentication failed. Please sign in again.")
        );
      }
      // For login/register requests, just pass the error through
    }

    // Network error handling
    if (error.code === "ECONNABORTED" || !error.response) {
      console.error("Network error:", error.message);
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    }

    // Server error handling
    if (error.response?.status >= 500) {
      console.error("Server error:", error.response);
      return Promise.reject(new Error("Server error. Please try again later."));
    }

    return Promise.reject(error);
  }
);

export { apiClient };
