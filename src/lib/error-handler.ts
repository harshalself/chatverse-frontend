import { toast } from "@/hooks/use-toast";
import { ApiError } from "@/types/api.types";
import { ERROR_MESSAGES } from "./constants";

// Custom Error Classes
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public field?: string, details?: any) {
    super(message, "VALIDATION_ERROR", 400, details);
    this.name = "ValidationError";
  }
}

export class NetworkError extends AppError {
  constructor(message: string = ERROR_MESSAGES.NETWORK_ERROR) {
    super(message, "NETWORK_ERROR", 0);
    this.name = "NetworkError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = ERROR_MESSAGES.UNAUTHORIZED) {
    super(message, "AUTHENTICATION_ERROR", 401);
    this.name = "AuthenticationError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = ERROR_MESSAGES.NOT_FOUND) {
    super(message, "NOT_FOUND_ERROR", 404);
    this.name = "NotFoundError";
  }
}

export class ServerError extends AppError {
  constructor(message: string = ERROR_MESSAGES.SERVER_ERROR) {
    super(message, "SERVER_ERROR", 500);
    this.name = "ServerError";
  }
}

// Error Handler Function
export const handleApiError = (error: any): AppError => {
  console.error("API Error:", error);

  // Axios error with response
  if (error.response) {
    const { status, data } = error.response;
    const message = data?.message || getErrorMessageByStatus(status);
    const code = data?.code || `HTTP_${status}`;

    let appError: AppError;

    switch (status) {
      case 400:
        appError = new ValidationError(message, data?.field, data?.details);
        break;
      case 401:
        appError = new AuthenticationError(message);
        // Clear token on authentication error
        localStorage.removeItem("authToken");
        // Redirect to login (handled in axios interceptor)
        break;
      case 404:
        appError = new NotFoundError(message);
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        appError = new ServerError(message);
        break;
      default:
        appError = new AppError(message, code, status, data?.details);
    }

    // Show toast notification
    showErrorToast(appError);
    return appError;
  }

  // Network error (no response)
  if (error.request) {
    const networkError = new NetworkError();
    showErrorToast(networkError);
    return networkError;
  }

  // Other errors
  const message = error.message || "An unexpected error occurred";
  const appError = new AppError(message, "UNKNOWN_ERROR");
  showErrorToast(appError);
  return appError;
};

// Get error message by HTTP status code
const getErrorMessageByStatus = (status: number): string => {
  switch (status) {
    case 400:
      return ERROR_MESSAGES.VALIDATION_ERROR;
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 404:
      return ERROR_MESSAGES.NOT_FOUND;
    case 500:
    case 502:
    case 503:
    case 504:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return "An error occurred";
  }
};

// Show error toast notification
const showErrorToast = (error: AppError) => {
  toast({
    title: "Error",
    description: error.message,
    variant: "destructive",
  });
};

// Show success toast notification
export const showSuccessToast = (message: string, title = "Success") => {
  toast({
    title,
    description: message,
    variant: "default",
  });
};

// Validation helpers
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateFileSize = (
  file: File,
  maxSize: number = 10 * 1024 * 1024
): boolean => {
  return file.size <= maxSize;
};

export const validateFileType = (
  file: File,
  allowedTypes: string[]
): boolean => {
  const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
  return allowedTypes.includes(fileExtension);
};

// Error boundary fallback component props
export interface ErrorBoundaryFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

// Retry utility
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }

  throw lastError!;
};
