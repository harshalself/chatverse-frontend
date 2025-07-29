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
import { useState, useEffect, useCallback } from "react";

// Global state for auth changes
let authListeners: (() => void)[] = [];

const notifyAuthChange = () => {
  authListeners.forEach((listener) => listener());
};

const subscribeToAuthChanges = (listener: () => void) => {
  authListeners.push(listener);
  return () => {
    authListeners = authListeners.filter((l) => l !== listener);
  };
};

// Simple authentication state hook
export const useAuth = () => {
  const queryClient = useQueryClient();

  // Add a force refresh state to trigger re-renders
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Subscribe to auth changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(() => {
      setRefreshTrigger((prev) => prev + 1);
    });
    return unsubscribe;
  }, []);

  // Get current user from localStorage
  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [...QUERY_KEYS.USER, refreshTrigger], // Include refresh trigger in query key
    queryFn: () => {
      const storedUser = AuthService.getStoredUser();
      const hasToken = AuthService.isAuthenticated();

      console.log("Auth query check:", {
        storedUser,
        hasToken,
        token: AuthService.getToken(),
        refreshTrigger,
      });

      if (storedUser && hasToken) {
        return storedUser;
      }
      return null;
    },
    retry: false,
    staleTime: 0, // Don't cache, always check fresh
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  // Check if user is authenticated
  const isAuthenticated = !!user && AuthService.isAuthenticated();

  // Add a function to force refresh
  const forceRefresh = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    refetch,
    forceRefresh,
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
      // Clear all cached data first
      queryClient.clear();

      // Notify all auth listeners to refresh
      notifyAuthChange();

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    },
  });
};
