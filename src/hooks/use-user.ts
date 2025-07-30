import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/services/user.service";
import { QUERY_KEYS } from "@/lib/constants";
import {
  User,
  UpdateUserRequest,
  UserResponse,
  UsersResponse,
  DeleteUserResponse,
} from "@/types/user.types";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "./use-auth";

// Get all users (admin function)
export const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: QUERY_KEYS.USERS.LIST,
    queryFn: async () => {
      const response = await UserService.getUsers();
      return response.data.users;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get a specific user
export const useUser = (id: string, enabled = true) => {
  return useQuery<User, Error>({
    queryKey: QUERY_KEYS.USERS.GET(id),
    queryFn: async () => {
      const response = await UserService.getUser(id);
      return response.data;
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Update user profile
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, { id: string; data: UpdateUserRequest }>({
    mutationFn: async ({ id, data }) => {
      const response = await UserService.updateUser(id, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch the user query
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.USERS.GET(variables.id),
      });

      // Update user in auth cache if it's the current user
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER });

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description:
          error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Delete user account
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: async (id) => {
      const response = await UserService.deleteUser(id);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // If deleting the current user, clear all caches
      if (user?.id === variables) {
        queryClient.clear();
      } else {
        // Otherwise, just invalidate the users list
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.LIST });
        queryClient.removeQueries({
          queryKey: QUERY_KEYS.USERS.GET(variables),
        });
      }

      toast({
        title: "Account deleted",
        description: "The account has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description:
          error.message || "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    },
  });
};

// Hook for user notification preferences (frontend only)
export const useUserNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const updateNotificationSettings = useMutation({
    mutationFn: async (settings: any) => {
      // This would typically call an API, but for now just simulate a successful update
      return new Promise<void>((resolve) => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Your notification preferences have been saved.",
      });

      // In a real app, we'd update the cached user data
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description:
          "Failed to update notification settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    user,
    updateNotificationSettings,
  };
};
