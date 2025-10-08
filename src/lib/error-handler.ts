import { toast } from "@/hooks/use-toast";

export interface ApiError {
  response?: {
    data?: {
      success?: boolean;
      message?: string;
      error?: string;
      details?: any;
    };
    status?: number;
  };
  message?: string;
  status?: number;
}

/**
 * Centralized error handler for API errors
 * Provides consistent error messaging across the application
 */
export class ErrorHandler {
  /**
   * Handle API errors with standardized error codes
   */
  static handleApiErrorWithCode(error: ApiError, defaultMessage?: string) {
    const errorMessage = this.extractErrorMessage(error, defaultMessage);
    const errorCode = error?.response?.data?.error;

    // Handle specific error codes
    switch (errorCode) {
      case 'UNAUTHORIZED':
        toast({
          title: "Authentication Required",
          description: "Please sign in to continue.",
          variant: "destructive",
        });
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/signin')) {
          window.location.href = '/signin';
        }
        break;
      
      case 'FORBIDDEN':
        toast({
          title: "Access Denied",
          description: "You don't have permission to perform this action.",
          variant: "destructive",
        });
        break;
      
      case 'NOT_FOUND':
        toast({
          title: "Not Found",
          description: "The requested resource was not found.",
          variant: "destructive",
        });
        break;
      
      case 'VALIDATION_FAILED':
        toast({
          title: "Invalid Input",
          description: errorMessage,
          variant: "destructive",
        });
        break;
      
      case 'CONFLICT':
        toast({
          title: "Conflict",
          description: errorMessage,
          variant: "destructive",
        });
        break;
      
      case 'RATE_LIMITED':
        toast({
          title: "Too Many Requests",
          description: "Please wait a moment before trying again.",
          variant: "destructive",
        });
        break;
      
      case 'INTERNAL_ERROR':
        toast({
          title: "Server Error",
          description: "Something went wrong on our end. Please try again later.",
          variant: "destructive",
        });
        break;
      
      default:
        // Fall back to generic error handling
        this.handleApiError(error, defaultMessage);
    }

    // Log the error for debugging
    console.error("API Error with code:", { errorCode, error });
  }

  /**
   * Handle API errors and show appropriate toast messages
   * Now uses standardized error code handling by default
   */
  static handleApiError(error: ApiError, defaultMessage?: string) {
    // Try standardized error handling first
    this.handleApiErrorWithCode(error, defaultMessage);
  }

  /**
   * Extract user-friendly error message from API error
   */
  static extractErrorMessage(
    error: ApiError,
    defaultMessage = "An unexpected error occurred"
  ): string {
    // Check for standardized API error response (success: false)
    if (error?.response?.data && typeof error.response.data === 'object') {
      const errorData = error.response.data;
      
      // New standardized format
      if ('success' in errorData && errorData.success === false) {
        return errorData.message || defaultMessage;
      }
      
      // Legacy format - for backward compatibility
      if (errorData.message) {
        return errorData.message;
      }
    }

    // Check for direct message property
    if (error?.message) {
      return error.message;
    }

    // Check for response data details
    if (error?.response?.data?.details) {
      const details = error.response.data.details;
      if (Array.isArray(details)) {
        return details.join(", ");
      }
      if (typeof details === 'string') {
        return details;
      }
    }

    // Handle specific HTTP status codes
    if (error?.response?.status || error?.status) {
      const status = error.response?.status || error.status;
      switch (status) {
        case 400:
          return "Invalid request. Please check your input.";
        case 401:
          return "Unauthorized. Please sign in again.";
        case 403:
          return "You don't have permission to perform this action.";
        case 404:
          return "The requested resource was not found.";
        case 409:
          return "A conflict occurred. The resource may already exist.";
        case 422:
          return "Invalid data provided. Please check your input.";
        case 429:
          return "Too many requests. Please try again later.";
        case 500:
          return "Server error. Please try again later.";
        case 503:
          return "Service temporarily unavailable. Please try again later.";
        default:
          return defaultMessage;
      }
    }

    return defaultMessage;
  }

  /**
   * Handle success responses and show toast messages
   */
  static handleSuccess(message: string, title = "Success") {
    toast({
      title,
      description: message,
    });
  }

  /**
   * Handle network errors specifically
   */
  static handleNetworkError() {
    toast({
      title: "Connection Error",
      description: "Please check your internet connection and try again.",
      variant: "destructive",
    });
  }
}
