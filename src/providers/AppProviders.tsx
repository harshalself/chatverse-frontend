/**
 * App Providers
 * Combines all context providers in the correct order
 */

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "../contexts";
import { AgentProvider } from "../contexts/AgentContext";
import { Toaster } from "@/components/ui/sonner";

// Configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 401, 403, 404
        if (error instanceof Error && "status" in error) {
          const status = (error as any).status;
          if ([401, 403, 404].includes(status)) {
            return false;
          }
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: (failureCount, error) => {
        // Don't retry mutations on 4xx errors
        if (error instanceof Error && "status" in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 2;
      },
    },
  },
});

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AgentProvider>
          {children}
          <Toaster position="top-right" expand={false} richColors closeButton />
        </AgentProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Export the query client for advanced usage
export { queryClient };
