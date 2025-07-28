// Context providers
export { AuthProvider, useAuthContext, useAuth } from "./AuthContext";
export {
  LoadingProvider,
  useLoading,
  useGlobalLoading,
  useApiLoading,
  usePageLoading,
} from "./LoadingContext";
export { ErrorProvider, useError, useErrorHandler } from "./ErrorContext";
export {
  ThemeProvider,
  useTheme,
  usePreferences,
  useDarkMode,
  useAccessibility,
  useWorkspacePreferences,
} from "./ThemeContext";
export {
  PersistenceProvider,
  usePersistence,
  useTokenPersistence,
  useDraftPersistence,
  useWorkspacePersistence,
  useOfflinePersistence,
} from "./PersistenceContext";

// Types
export type { Theme, UserPreferences } from "./ThemeContext";

// Context instances (for advanced usage)
export { LoadingContext } from "./LoadingContext";
export { ErrorContext } from "./ErrorContext";
export { ThemeContext } from "./ThemeContext";
export { PersistenceContext } from "./PersistenceContext";
