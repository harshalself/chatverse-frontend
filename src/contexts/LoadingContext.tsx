import { createContext, useContext, useState, ReactNode } from "react";

interface LoadingState {
  [key: string]: boolean;
}

interface LoadingContextType {
  loading: LoadingState;
  setLoading: (key: string, isLoading: boolean) => void;
  isLoading: (key?: string) => boolean;
  clearLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export { LoadingContext };

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoadingState] = useState<LoadingState>({});

  const setLoading = (key: string, isLoading: boolean) => {
    setLoadingState((prev) => ({
      ...prev,
      [key]: isLoading,
    }));
  };

  const isLoading = (key?: string) => {
    if (key) {
      return loading[key] || false;
    }
    // If no key provided, check if any loading state is true
    return Object.values(loading).some(Boolean);
  };

  const clearLoading = () => {
    setLoadingState({});
  };

  const value = {
    loading,
    setLoading,
    isLoading,
    clearLoading,
  };

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
}

// Convenience hooks for common loading states
export function useGlobalLoading() {
  const { isLoading } = useLoading();
  return isLoading();
}

export function useApiLoading() {
  const { isLoading } = useLoading();
  return isLoading("api");
}

export function usePageLoading() {
  const { isLoading } = useLoading();
  return isLoading("page");
}
