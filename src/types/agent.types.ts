import { ID, Timestamp, ApiResponse } from "./api.types";

// Provider types based on backend API
export type AgentProvider = "openai" | "claude" | "gemini" | "groq";

// Agent Types based on backend API response - aligned with agents.yaml
export interface Agent {
  id: ID;
  name: string;
  provider: AgentProvider;
  model: string;
  temperature: number;
  system_prompt?: string;
  is_active: number; // 0 or 1
  trained_on?: Timestamp; // Added field for when the agent was trained
  created_by: ID;
  created_at: Timestamp;
  updated_by: ID;
  updated_at: Timestamp;
  is_deleted: boolean;
  deleted_by?: ID;
  deleted_at?: Timestamp;
  has_api_key?: boolean; // Indicates if API key is configured
}

// Agent Request Types based on backend API - aligned with agents.yaml
export interface CreateAgentRequest {
  name: string;
  provider: AgentProvider;
  api_key: string;
  model: string;
  temperature: number;
  system_prompt?: string;
  is_active: number;
}

export interface UpdateAgentRequest {
  name?: string;
  provider?: string;
  api_key?: string;
  model?: string;
  temperature?: number;
  system_prompt?: string;
  is_active?: number;
}

// API Response Types
export type AgentResponse = ApiResponse<Agent>;
export type AgentsResponse = ApiResponse<Agent[]>;

// Training Types
export interface TrainAgentRequest {
  forceRetrain?: boolean;
  cleanupExisting?: boolean;
}

export interface TrainingStatus {
  agentId: ID;
  status:
    | "not_started"
    | "pending"
    | "processing"
    | "completed"
    | "failed"
    | "cancelled";
  progress?: number;
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  error?: {
    message: string;
    code: string;
    details?: string;
  };
  metrics?: {
    sourcesProcessed: number;
    totalSources: number;
    vectorsCreated: number;
    processingTime?: number;
  };
}

export interface TrainingAnalytics {
  agentId: ID;
  totalTrainingSessions: number;
  lastTrainingDate?: Timestamp;
  averageTrainingTime: number;
  successRate: number;
  vectorCount: number;
  sourceBreakdown: {
    [key: string]: {
      count: number;
      processingTime: number;
      successRate: number;
    };
  };
  recommendations?: string[];
}

export type TrainAgentResponse = ApiResponse<{ agentId: ID }>;
export type TrainingStatusResponse = ApiResponse<TrainingStatus>;
export type TrainingAnalyticsResponse = ApiResponse<TrainingAnalytics>;

// Conversation Types
export interface Conversation {
  id: ID;
  agentId: ID;
  userId: ID;
  title: string;
  messages: Message[];
  status: ConversationStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type ConversationStatus = "active" | "completed" | "archived";

export interface Message {
  id: ID;
  conversationId: ID;
  role: MessageRole;
  content: string;
  metadata?: MessageMetadata;
  createdAt: Timestamp;
}

export type MessageRole = "user" | "assistant" | "system";

export interface MessageMetadata {
  model?: string;
  tokens?: number;
  responseTime?: number;
  sources?: string[];
  confidence?: number;
}
