import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { QUERY_KEYS } from "@/lib/constants";
import { showSuccessToast } from "@/lib/error-handler";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/types/auth.types";

// Authentication state hook
export const useAuth = () => {
  const queryClient = useQueryClient();

  // Get current user query
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.USER,
    queryFn: AuthService.getCurrentUser,
    enabled: AuthService.isAuthenticated(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Check if user is authenticated
  const isAuthenticated = AuthService.isAuthenticated() && !!user;

  // Clear auth data
  const clearAuth = () => {
    AuthService.clearTokens();
    queryClient.clear();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    refetch,
    clearAuth,
  };
};

// Login mutation hook
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => AuthService.login(credentials),
    onSuccess: (data: AuthResponse) => {
      // Cache user data
      queryClient.setQueryData(QUERY_KEYS.USER, data.user);
      showSuccessToast("Welcome back!", "Login Successful");
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};

// Registration mutation hook
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterRequest) => AuthService.register(userData),
    onSuccess: (data: AuthResponse) => {
      // Cache user data
      queryClient.setQueryData(QUERY_KEYS.USER, data.user);
      showSuccessToast(
        "Account created successfully!",
        "Registration Successful"
      );
    },
    onError: (error) => {
      console.error("Registration error:", error);
    },
  });
};

// Logout mutation hook
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      showSuccessToast("You have been logged out successfully");
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Clear tokens anyway
      AuthService.clearTokens();
      queryClient.clear();
    },
  });
};

// Update profile mutation hook
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<User>) => AuthService.updateProfile(data),
    onSuccess: (updatedUser: User) => {
      // Update cached user data
      queryClient.setQueryData(QUERY_KEYS.USER, updatedUser);
      showSuccessToast("Profile updated successfully");
    },
    onError: (error) => {
      console.error("Update profile error:", error);
    },
  });
};

// Change password mutation hook
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      AuthService.changePassword(data),
    onSuccess: () => {
      showSuccessToast("Password changed successfully");
    },
    onError: (error) => {
      console.error("Change password error:", error);
    },
  });
};

// Forgot password mutation hook
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      AuthService.forgotPassword(data),
    onSuccess: () => {
      showSuccessToast("Password reset email sent. Please check your inbox.");
    },
    onError: (error) => {
      console.error("Forgot password error:", error);
    },
  });
};

// Reset password mutation hook
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => AuthService.resetPassword(data),
    onSuccess: () => {
      showSuccessToast(
        "Password reset successfully. You can now log in with your new password."
      );
    },
    onError: (error) => {
      console.error("Reset password error:", error);
    },
  });
};

// Upload avatar mutation hook
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      file,
      onProgress,
    }: {
      file: File;
      onProgress?: (progress: number) => void;
    }) => AuthService.uploadAvatar(file, onProgress),
    onSuccess: (data) => {
      // Update user data with new avatar
      queryClient.setQueryData(QUERY_KEYS.USER, (oldData: User | undefined) => {
        if (oldData) {
          return { ...oldData, avatar: data.avatarUrl };
        }
        return oldData;
      });
      showSuccessToast("Avatar uploaded successfully");
    },
    onError: (error) => {
      console.error("Upload avatar error:", error);
    },
  });
};

// Verify email mutation hook
export const useVerifyEmail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => AuthService.verifyEmail(token),
    onSuccess: () => {
      // Refetch user data to update verification status
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER });
      showSuccessToast("Email verified successfully");
    },
    onError: (error) => {
      console.error("Verify email error:", error);
    },
  });
};

// Resend verification mutation hook
export const useResendVerification = () => {
  return useMutation({
    mutationFn: AuthService.resendVerification,
    onSuccess: () => {
      showSuccessToast("Verification email sent. Please check your inbox.");
    },
    onError: (error) => {
      console.error("Resend verification error:", error);
    },
  });
};

// Refresh token hook (mainly for internal use)
export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthService.refreshToken,
    onSuccess: () => {
      // Invalidate user query to refetch with new token
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER });
    },
    onError: (error) => {
      console.error("Refresh token error:", error);
      // Clear auth on refresh failure
      AuthService.clearTokens();
      queryClient.clear();
    },
  });
};
