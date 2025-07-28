// App Configuration
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || "AgentFlow",
  version: import.meta.env.VITE_APP_VERSION || "1.0.0",
  environment: import.meta.env.VITE_ENVIRONMENT || "development",
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  debugMode: import.meta.env.VITE_DEBUG_MODE === "true",
} as const;

// Route Constants
export const ROUTES = {
  HOME: "/",
  SIGNIN: "/signin",
  SIGNUP: "/signup",
  WORKSPACE: "/workspace",
  AGENT: "/agent/:agentId",
  AGENT_WITH_ID: (id: string) => `/agent/${id}`,
} as const;

// React Query Keys
export const QUERY_KEYS = {
  // Auth
  USER: ["user"],
  AUTH: ["auth"],

  // Agents
  AGENTS: ["agents"],
  AGENT: (id: string) => ["agents", id],

  // Dashboard
  DASHBOARD: ["dashboard"],
  ANALYTICS: ["analytics"],
  ACTIVITY: ["activity"],
  USAGE: ["usage"],

  // Sources
  SOURCES: ["sources"],
  SOURCE: (id: string) => ["sources", id],
  FILES: ["files"],

  // Playground
  PLAYGROUND: ["playground"],
  CHAT: ["chat"],
} as const;

// API Endpoints - Updated to match real User API
export const API_ENDPOINTS = {
  // Authentication & Users - Real API endpoints
  AUTH: {
    LOGIN: "/users/login",
    REGISTER: "/users/register",
    // Note: These endpoints don't exist in current backend
    // LOGOUT: "/auth/logout",
    // ME: "/auth/me",
    // REFRESH: "/auth/refresh",
  },

  // Users Management
  USERS: {
    LIST: "/users",
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },

  // Agents
  AGENTS: {
    LIST: "/agents",
    GET: (id: string) => `/agents/${id}`,
    CREATE: "/agents",
    UPDATE: (id: string) => `/agents/${id}`,
    DELETE: (id: string) => `/agents/${id}`,
  },

  // Dashboard
  DASHBOARD: {
    ANALYTICS: "/dashboard/analytics",
    ACTIVITY: "/dashboard/activity",
    USAGE: "/dashboard/usage",
  },

  // Sources
  SOURCES: {
    LIST: "/sources",
    GET: (id: string) => `/sources/${id}`,
    CREATE: "/sources",
    UPDATE: (id: string) => `/sources/${id}`,
    DELETE: (id: string) => `/sources/${id}`,
    UPLOAD: "/sources/upload",
  },

  // Playground
  PLAYGROUND: {
    CHAT: "/playground/chat",
    MESSAGES: "/playground/messages",
  },
} as const;

// UI Constants
export const UI_CONSTANTS = {
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 300,
  PAGINATION_SIZE: 10,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FILE_TYPES: [".pdf", ".doc", ".docx", ".txt", ".csv"],
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error - please check your connection",
  UNAUTHORIZED: "You are not authorized to perform this action",
  NOT_FOUND: "The requested resource was not found",
  SERVER_ERROR: "Internal server error - please try again later",
  VALIDATION_ERROR: "Please check your input and try again",
  FILE_TOO_LARGE: `File size must be less than ${
    UI_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)
  }MB`,
  UNSUPPORTED_FILE_TYPE: `Supported file types: ${UI_CONSTANTS.SUPPORTED_FILE_TYPES.join(
    ", "
  )}`,
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  AGENT_CREATED: "Agent created successfully",
  AGENT_UPDATED: "Agent updated successfully",
  AGENT_DELETED: "Agent deleted successfully",
  SOURCE_CREATED: "Source created successfully",
  SOURCE_UPDATED: "Source updated successfully",
  SOURCE_DELETED: "Source deleted successfully",
  FILE_UPLOADED: "File uploaded successfully",
  SETTINGS_SAVED: "Settings saved successfully",
} as const;
