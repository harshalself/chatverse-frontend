// Context providers
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
export { AgentProvider, useAgent } from "./AgentContext";
export { NotificationProvider, useNotifications } from "./NotificationContext";
// Types
export type { Theme, UserPreferences } from "./ThemeContext";
export type { Notification } from "./NotificationContext";

// Context instances (for advanced usage)
export { LoadingContext } from "./LoadingContext";
export { ErrorContext } from "./ErrorContext";
export { ThemeContext } from "./ThemeContext";
export { NotificationContext } from "./NotificationContext";
