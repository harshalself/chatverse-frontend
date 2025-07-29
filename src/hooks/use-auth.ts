import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AuthService from "@/services/auth.service";
import { QUERY_KEYS } from "@/lib/constants";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RegisterResponse,
  User,
} from "@/types/auth.types";
import { toast } from "@/hooks/use-toast";

// Simple authentication state hook
export const useAuth = () => {
  const queryClient = useQueryClient();

  // Get current user from localStorage
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.USER,
    queryFn: () => {
      const storedUser = AuthService.getStoredUser();
      const hasToken = AuthService.isAuthenticated();

      console.log("Auth query check:", { storedUser, hasToken, token: AuthService.getToken() });

      if (storedUser && hasToken) {
        return storedUser;
      }
      return null;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  // Check if user is authenticated
  const isAuthenticated = !!user && AuthService.isAuthenticated();

  return {
    user,
    isAuthenticated,
    isLoading,
    refetch,
  };
};

// Login mutation hook
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => AuthService.login(credentials),
    onSuccess: (data: AuthResponse) => {
      console.log("Login success:", data);
      
      // Cache user data and invalidate queries
      queryClient.setQueryData(QUERY_KEYS.USER, data.user);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER });

      toast({
        title: "Welcome back!",
        description: data.message || "You have been successfully signed in.",
      });
    },
    onError: (error: any) => {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description:
          error.response?.data?.message ||
          "Please check your credentials and try again.",
        variant: "destructive",
      });
    },
  });
};

// Registration mutation hook
export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: RegisterRequest) => AuthService.register(userData),
    onSuccess: (data: RegisterResponse) => {
      toast({
        title: "Registration Successful",
        description: data.message || "Account created successfully!",
      });
    },
    onError: (error: any) => {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Logout mutation hook
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    },
  });
};
