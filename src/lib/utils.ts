import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { APP_CONFIG } from "./constants";
import { TokenPayload } from "@/types/auth.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Environment utilities
export const env = {
  isDevelopment: APP_CONFIG.environment === "development",
  isStaging: APP_CONFIG.environment === "staging",
  isProduction: APP_CONFIG.environment === "production",
  isDebugMode: APP_CONFIG.debugMode,
} as const;

// Logging utility that respects environment
export const logger = {
  debug: (...args: any[]) => {
    if (env.isDevelopment || env.isDebugMode) {
      console.debug("[ChatVerse Debug]", ...args);
    }
  },
  info: (...args: any[]) => {
    if (!env.isProduction || env.isDebugMode) {
      console.info("[ChatVerse Info]", ...args);
    }
  },
  warn: (...args: any[]) => {
    console.warn("[ChatVerse Warning]", ...args);
  },
  error: (...args: any[]) => {
    console.error("[ChatVerse Error]", ...args);
  },
} as const;

// API URL helper
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = APP_CONFIG.apiBaseUrl;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

// JWT token utilities
export const jwtUtils = {
  /**
   * Decode JWT token payload (without verifying signature)
   * @param token - JWT token string
   * @returns Decoded payload or null if invalid
   */
  decodeToken: (token: string): TokenPayload | null => {
    try {
      if (!token || !token.includes('.')) {
        return null;
      }

      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload as TokenPayload;
    } catch (error) {
      logger.error('Error decoding JWT token:', error);
      return null;
    }
  },

  /**
   * Get user ID from JWT token
   * @param token - JWT token string
   * @returns User ID or null if invalid
   */
  getUserIdFromToken: (token: string): string | null => {
    const payload = jwtUtils.decodeToken(token);
    return payload?.userId || null;
  },

  /**
   * Check if JWT token is expired
   * @param token - JWT token string
   * @returns True if expired, false otherwise
   */
  isTokenExpired: (token: string): boolean => {
    const payload = jwtUtils.decodeToken(token);
    if (!payload?.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  }
} as const;

// Debounce utility
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
