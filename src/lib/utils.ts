import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { APP_CONFIG } from "./constants";

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

// Format file size utility
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

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
