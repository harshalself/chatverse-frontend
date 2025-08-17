import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";

export interface UserPreferences {
  theme: Theme;
  language: "en" | "es" | "fr" | "de" | "zh" | "ja";
  timezone: string;
  dateFormat: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";
  timeFormat: "12" | "24";
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
    workspaceActivity: boolean;
    agentUpdates: boolean;
    systemMaintenance: boolean;
  };
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
    largeText: boolean;
    screenReader: boolean;
  };
  workspace: {
    defaultView: "dashboard" | "agents" | "sources" | "analytics";
    sidebarCollapsed: boolean;
    compactMode: boolean;
    showTooltips: boolean;
  };
  advanced: {
    enableBetaFeatures: boolean;
    enableAnalytics: boolean;
    autoSave: boolean;
    autoSaveInterval: number; // in seconds
  };
}

const defaultPreferences: UserPreferences = {
  theme: "system",
  language: "en",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  dateFormat: "MM/DD/YYYY",
  timeFormat: "12",
  notifications: {
    email: true,
    push: true,
    desktop: true,
    workspaceActivity: true,
    agentUpdates: true,
    systemMaintenance: true,
  },
  accessibility: {
    reduceMotion: false,
    highContrast: false,
    largeText: false,
    screenReader: false,
  },
  workspace: {
    defaultView: "dashboard",
    sidebarCollapsed: false,
    compactMode: false,
    showTooltips: true,
  },
  advanced: {
    enableBetaFeatures: false,
    enableAnalytics: true,
    autoSave: true,
    autoSaveInterval: 30,
  },
};

interface ThemeContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  applyTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export { ThemeContext };

function getStoredPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem("chatverse-preferences");
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to ensure all properties exist
      return { ...defaultPreferences, ...parsed };
    }
  } catch (error) {
    console.warn("Failed to parse stored preferences:", error);
  }
  return defaultPreferences;
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] =
    useState<UserPreferences>(getStoredPreferences);

  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(
    getSystemTheme
  );

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (e: MediaQueryListEvent) => {
        setSystemTheme(e.matches ? "dark" : "light");
      };

      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  // Calculate current theme
  const currentTheme =
    preferences.theme === "system" ? systemTheme : preferences.theme;
  const isDarkMode = currentTheme === "dark";

  // Apply theme to document
  const applyTheme = () => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(currentTheme);

      // Apply accessibility preferences
      if (preferences.accessibility.reduceMotion) {
        root.style.setProperty("--motion-reduce", "reduce");
      } else {
        root.style.removeProperty("--motion-reduce");
      }

      if (preferences.accessibility.largeText) {
        root.classList.add("large-text");
      } else {
        root.classList.remove("large-text");
      }

      if (preferences.accessibility.highContrast) {
        root.classList.add("high-contrast");
      } else {
        root.classList.remove("high-contrast");
      }
    }
  };

  // Apply theme when preferences change
  useEffect(() => {
    applyTheme();
  }, [currentTheme, preferences.accessibility]);

  // Store preferences in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        "chatverse-preferences",
        JSON.stringify(preferences)
      );
    } catch (error) {
      console.warn("Failed to store preferences:", error);
    }
  }, [preferences]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({
      ...prev,
      ...updates,
      // Handle nested objects specifically
      notifications: updates.notifications
        ? { ...prev.notifications, ...updates.notifications }
        : prev.notifications,
      accessibility: updates.accessibility
        ? { ...prev.accessibility, ...updates.accessibility }
        : prev.accessibility,
      workspace: updates.workspace
        ? { ...prev.workspace, ...updates.workspace }
        : prev.workspace,
      advanced: updates.advanced
        ? { ...prev.advanced, ...updates.advanced }
        : prev.advanced,
    }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  const toggleTheme = () => {
    const themes: Theme[] = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(preferences.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const setTheme = (theme: Theme) => {
    updatePreferences({ theme });
  };

  const value: ThemeContextType = {
    preferences,
    updatePreferences,
    resetPreferences,
    isDarkMode,
    toggleTheme,
    setTheme,
    applyTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// Convenience hooks
export function usePreferences() {
  const { preferences, updatePreferences } = useTheme();
  return { preferences, updatePreferences };
}

export function useDarkMode() {
  const { isDarkMode, toggleTheme, setTheme } = useTheme();
  return { isDarkMode, toggleTheme, setTheme };
}

export function useAccessibility() {
  const { preferences, updatePreferences } = useTheme();
  return {
    accessibility: preferences.accessibility,
    updateAccessibility: (updates: Partial<UserPreferences["accessibility"]>) =>
      updatePreferences({
        accessibility: { ...preferences.accessibility, ...updates },
      }),
  };
}

export function useWorkspacePreferences() {
  const { preferences, updatePreferences } = useTheme();
  return {
    workspace: preferences.workspace,
    updateWorkspace: (updates: Partial<UserPreferences["workspace"]>) =>
      updatePreferences({
        workspace: { ...preferences.workspace, ...updates },
      }),
  };
}
