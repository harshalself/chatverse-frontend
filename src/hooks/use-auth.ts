import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { QUERY_KEYS } from "@/lib/constants";
import { showSuccessToast } from "@/lib/error-handler";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RegisterResponse,
  User,
  UpdateUserRequest,
  UsersResponse,
  UserResponse,
  UpdateUserResponse,
  DeleteUserResponse,
} from "@/types/auth.types";

// Authentication state hook
export const useAuth = () => {
  const queryClient = useQueryClient();

  // Get current user from localStorage with robust validation
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.USER,
    queryFn: () => {
      // Use robust authentication check
      if (AuthService.isAuthenticated()) {
        return AuthService.getStoredUser();
      }
      return null;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true, // Always refetch on mount
  });

  // Check if user is authenticated with robust validation
  const isAuthenticated = !!user && AuthService.isAuthenticated();

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
      // Cache user data and invalidate queries to trigger re-render
      queryClient.setQueryData(QUERY_KEYS.USER, data.user);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER });
      showSuccessToast(data.message || "Welcome back!", "Login Successful");
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
    onSuccess: (data: RegisterResponse) => {
      // Note: Your API doesn't return a token on registration,
      // so users need to login after registration
      showSuccessToast(
        data.message || "Account created successfully!",
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

// Get all users hook (admin functionality)
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: AuthService.getAllUsers,
    enabled: AuthService.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get user by ID hook
export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => AuthService.getUserById(id),
    enabled: !!id && AuthService.isAuthenticated(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Update user mutation hook
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      userData,
    }: {
      id: string;
      userData: UpdateUserRequest;
    }) => AuthService.updateUser(id, userData),
    onSuccess: (data: UpdateUserResponse, variables) => {
      // Update cached user data
      queryClient.setQueryData(["users", variables.id], { user: data.user });
      // Also update users list cache
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // If updating current user, update user cache
      const currentUser = AuthService.getStoredUser();
      if (currentUser && currentUser.id.toString() === variables.id) {
        queryClient.setQueryData(QUERY_KEYS.USER, data.user);
        AuthService.storeUser(data.user);
      }
      showSuccessToast(data.message || "User updated successfully");
    },
    onError: (error) => {
      console.error("Update user error:", error);
    },
  });
};

// Delete user mutation hook
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => AuthService.deleteUser(id),
    onSuccess: (data: DeleteUserResponse) => {
      // Invalidate users cache
      queryClient.invalidateQueries({ queryKey: ["users"] });
      showSuccessToast(data.message || "User deleted successfully");
    },
    onError: (error) => {
      console.error("Delete user error:", error);
    },
  });
};

// Update current user profile hook
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const currentUser = AuthService.getStoredUser();

  return useMutation({
    mutationFn: (userData: UpdateUserRequest) => {
      if (!currentUser) throw new Error("No current user");
      return AuthService.updateUser(currentUser.id.toString(), userData);
    },
    onSuccess: (data: UpdateUserResponse) => {
      // Update cached user data
      queryClient.setQueryData(QUERY_KEYS.USER, data.user);
      AuthService.storeUser(data.user);
      showSuccessToast(data.message || "Profile updated successfully");
    },
    onError: (error) => {
      console.error("Update profile error:", error);
    },
  });
};
