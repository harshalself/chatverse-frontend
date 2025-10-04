// App Configuration
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || "ChatVerse",
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
  AGENT_SESSION: "/agent/:agentId/session/:sessionId",
  AGENT_SESSION_WITH_IDS: (agentId: string, sessionId: string) =>
    `/agent/${agentId}/session/${sessionId}`,
} as const;

// React Query Keys
export const QUERY_KEYS = {
  // Auth
  USER: ["user"],
  AUTH: ["auth"],

  // Users
  USERS: {
    LIST: ["users"],
    GET: (id: string) => ["users", id],
  },

  // Provider Models
  PROVIDER_MODELS: ["provider-models"],
  PROVIDER_MODEL: (provider: string) => ["provider-models", provider], // Agents
  AGENTS: ["agents"],
  AGENT: (id: string) => ["agents", id],
  AGENT_TRAINING_STATUS: (id: string) => ["agents", id, "training-status"],
  AGENT_TRAINING_ANALYTICS: (id: string) => [
    "agents",
    id,
    "training-analytics",
  ],

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
  CHAT_SESSIONS: ["chat", "sessions"],
  CHAT_SESSION_HISTORY: (sessionId: string) => [
    "chat",
    "sessions",
    sessionId,
    "history",
  ],
} as const;

// API Endpoints - Updated to match real User API
export const API_ENDPOINTS = {
  // Authentication & Users - Real API endpoints
  AUTH: {
    LOGIN: "/users/login",
    REGISTER: "/users/register",
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
    TRAIN: (id: string) => `/agents/${id}/train`,
    RETRAIN: (id: string) => `/agents/${id}/retrain`,
    TRAINING_STATUS: (id: string) => `/agents/${id}/training-status`,
    TRAINING_ANALYTICS: (id: string) => `/agents/${id}/training-analytics`,
  },

  // Provider Models
  PROVIDER_MODELS: {
    ALL: "/provider-models", // Get all provider models
    BY_PROVIDER: (provider: string) => `/provider-models/provider/${provider}`, // Get models for specific provider
    GET: (id: number) => `/provider-models/${id}`, // Get provider model by ID
    CREATE: "/provider-models", // Create new provider model
    UPDATE: (id: number) => `/provider-models/${id}`, // Update provider model
    DELETE: (id: number) => `/provider-models/${id}`, // Delete provider model
  },

  // Dashboard
  DASHBOARD: {
    ANALYTICS: "/dashboard/analytics",
    ACTIVITY: "/dashboard/activity",
    USAGE: "/dashboard/usage",
  },

  // Analytics API Endpoints
  ANALYTICS: {
    AGENTS: {
      PERFORMANCE: (agentId: number) => `/analytics/agents/${agentId}/performance`,
      COMPARE: "/analytics/agents/compare",
      TOP: "/analytics/agents/top",
      OPTIMIZE: (agentId: number) => `/analytics/agents/${agentId}/optimize`,
    },
    MODELS: {
      USAGE: "/analytics/models/usage",
      COSTS: "/analytics/models/costs",
      PERFORMANCE: "/analytics/models/performance",
    },
    SYSTEM: {
      PERFORMANCE: "/analytics/system/performance",
    },
    USER: {
      ENGAGEMENT: "/analytics/user/engagement",
      BEHAVIOR: "/analytics/user/behavior",
    },
  },

  // Sources - Base Sources API
  SOURCES: {
    // Base Sources API - aligned with backend
    LIST_BY_AGENT: (agentId: number) => `/sources/agent/${agentId}`,
    CREATE_FOR_AGENT: (agentId: number) => `/sources/agent/${agentId}`,
    GET: (id: number) => `/sources/${id}`,
    UPDATE: (id: number) => `/sources/${id}`,
    DELETE: (id: number) => `/sources/${id}`,

    // File Sources API
    FILE: {
      UPLOAD: "/sources/file",
      UPLOAD_MULTIPLE: "/sources/file/multiple",
      GET_ALL: (agentId: number) => `/sources/file/agent/${agentId}`,
      GET: (id: number) => `/sources/file/${id}`,
      UPDATE: (id: number) => `/sources/file/${id}`,
      // EXPORT: (id: number) => `/sources/file/${id}/export`, // Not available in backend yet
    },

    // Text Sources API
    TEXT: {
      CREATE: "/sources/text",
      GET_ALL: (agentId: number) => `/sources/text/agent/${agentId}`,
      GET: (id: number) => `/sources/text/${id}`,
      UPDATE: (id: number) => `/sources/text/${id}`,
    },

    // Website Sources API
    WEBSITE: {
      CREATE: "/sources/website",
      TEST: "/sources/website/test",
      GET_ALL: (agentId: number) => `/sources/website/agent/${agentId}`,
      GET: (id: number) => `/sources/website/${id}`,
      UPDATE: (id: number) => `/sources/website/${id}`,
    },

    // Database Sources API
    DATABASE: {
      CREATE: "/sources/database",
      TEST: "/sources/database/test",
      GET_ALL: (agentId: number) => `/sources/database/agent/${agentId}`,
      GET: (id: number) => `/sources/database/${id}`,
      UPDATE: (id: number) => `/sources/database/${id}`,
    },

    // QA Sources API
    QA: {
      CREATE: "/sources/qa",
      GET_ALL: (agentId: number) => `/sources/qa/agent/${agentId}`,
      GET: (id: number) => `/sources/qa/${id}`,
      UPDATE: (id: number) => `/sources/qa/${id}`,
    },
  },

  // Playground
  PLAYGROUND: {
    CHAT: "/chat",
    AGENT_CHAT: (agentId: number) => `/chat/agents/${agentId}`,
    SESSIONS: "/chat/sessions",
    CREATE_SESSION: "/chat/sessions",
    SESSION_HISTORY: (sessionId: string) =>
      `/chat/sessions/${sessionId}/history`,
    DELETE_SESSION: (sessionId: string) => `/chat/sessions/${sessionId}`,
    MESSAGES: "/playground/messages",
  },
} as const;

// UI Constants
export const UI_CONSTANTS = {
  TOAST_DURATION: 5000,
  DEBOUNCE_DELAY: 300,
  PAGINATION_SIZE: 10,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB as per API docs
  MAX_FILES_PER_UPLOAD: 10, // Maximum files per batch upload
  SUPPORTED_FILE_TYPES: [".pdf", ".doc", ".docx", ".txt"], // Updated to match API docs
  SUPPORTED_MIME_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ],
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
  AGENT_TRAINING_STARTED: "Agent training started successfully",
  AGENT_RETRAINING_STARTED: "Agent retraining started successfully",
  AGENT_TRAINING_COMPLETED: "Agent training completed successfully",
  AGENT_TRAINING_FAILED: "Agent training failed",
  AGENT_TRAINING_CANCELLED: "Agent training was cancelled",
  SOURCE_CREATED: "Source created successfully",
  SOURCE_UPDATED: "Source updated successfully",
  SOURCE_DELETED: "Source deleted successfully",
  TEXT_SOURCE_CREATED: "Text source created successfully",
  TEXT_SOURCE_UPDATED: "Text source updated successfully",
  TEXT_SOURCE_DELETED: "Text source deleted successfully",
  WEBSITE_SOURCE_CREATED: "Website source created successfully",
  FILE_UPLOADED: "File uploaded successfully",
  SETTINGS_SAVED: "Settings saved successfully",
  USER_UPDATED: "User updated successfully",
  USER_DELETED: "User deleted successfully",
} as const;
