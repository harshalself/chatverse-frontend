// Re-export all types for easy importing
export * from "./api.types";
export * from "./auth.types";
export * from "./agent.types";

// Additional common types that don't fit in other files

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Form Types
export interface FormFieldProps {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

// Modal/Dialog Types
export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<any>;
  badge?: string | number;
  children?: NavigationItem[];
}

// Theme Types
export type Theme = "light" | "dark" | "system";

// Loading State Types
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

// Data Source Types
export interface DataSource {
  id: string;
  name: string;
  type: "file" | "text" | "website" | "database" | "qa";
  status: "pending" | "processing" | "ready" | "error";
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Analytics Types
export interface AnalyticsData {
  period: string;
  metrics: {
    totalUsers: number;
    totalAgents: number;
    totalConversations: number;
    totalMessages: number;
    averageResponseTime: number;
    successRate: number;
  };
  trends: {
    users: TrendData[];
    conversations: TrendData[];
    messages: TrendData[];
  };
}

export interface TrendData {
  date: string;
  value: number;
}

// Settings Types
export interface UserSettings {
  theme: Theme;
  language: string;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  desktop: boolean;
  frequency: "immediate" | "daily" | "weekly";
}

export interface PrivacySettings {
  profileVisibility: "public" | "private";
  dataSharing: boolean;
  analytics: boolean;
}
