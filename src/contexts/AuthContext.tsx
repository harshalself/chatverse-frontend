import { createContext, useContext, useEffect, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useAuth as useAuthHook,
  useLogin,
  useRegister,
  useLogout,
} from "@/hooks/use-auth";
import { User, LoginRequest, RegisterRequest } from "@/types/auth.types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<void>;
  signUp: (userData: RegisterRequest) => Promise<void>;
  signOut: () => Promise<void>;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  // Use the auth hook from our hooks file
  const {
    user,
    isLoading,
    error,
    refetch: refetchUser,
    isAuthenticated: hookIsAuthenticated,
  } = useAuthHook();

  // Auth mutations
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const signIn = async (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => {
    try {
      await loginMutation.mutateAsync({
        email,
        password,
        rememberMe,
      });
      // The user data will be updated automatically via React Query
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signUp = async (userData: RegisterRequest) => {
    try {
      await registerMutation.mutateAsync(userData);
      // The user data will be updated automatically via React Query
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await logoutMutation.mutateAsync();
      // Clear all React Query cache on logout
      queryClient.clear();
    } catch (error) {
      console.error("Sign out error:", error);
      // Even if logout fails, clear local state
      queryClient.clear();
    }
  };

  const value = {
    user: user || null,
    isAuthenticated: hookIsAuthenticated,
    isLoading:
      isLoading || loginMutation.isPending || registerMutation.isPending,
    signIn,
    signUp,
    signOut,
    refetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

// Backward compatibility export
export const useAuth = useAuthContext;
