import { toast } from "@/hooks/use-toast";

export interface ApiError {
  response?: {
    data?: {
      message?: string;
      details?: string[];
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
   * Handle API errors and show appropriate toast messages
   */
  static handleApiError(error: ApiError, defaultMessage?: string) {
    const errorMessage = this.extractErrorMessage(error, defaultMessage);

    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });

    // Log the error for debugging
    console.error("API Error:", error);
  }

  /**
   * Extract user-friendly error message from API error
   */
  static extractErrorMessage(
    error: ApiError,
    defaultMessage = "An unexpected error occurred"
  ): string {
    // Check for response data message (most common)
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    // Check for direct message property
    if (error?.message) {
      return error.message;
    }

    // Check for response data details array
    if (
      error?.response?.data?.details &&
      Array.isArray(error.response.data.details)
    ) {
      return error.response.data.details.join(", ");
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
