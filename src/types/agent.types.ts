import { ID, Timestamp } from "./api.types";
import { User } from "./auth.types";

// Provider types based on backend API
export type AgentProvider = "openai" | "claude" | "gemini" | "groq";

// Agent Types based on backend API response
export interface Agent {
  id: ID;
  name: string;
  api_key: string; // Will be "***hidden***" in responses
  is_active: number; // 0 or 1
  model: string;
  temperature: number;
  provider: AgentProvider;
  user_id: ID;
  created_by: ID;
  created_at: Timestamp;
  updated_by: ID;
  updated_at: Timestamp;
  trained_on?: Timestamp;
  is_deleted: boolean;
  deleted_by?: ID;
  deleted_at?: Timestamp;
}

// Legacy types for backward compatibility (can be removed later)
export type AgentType = "chatbot" | "assistant" | "analyst" | "automation";
export type AgentStatus = "active" | "inactive" | "training" | "error";

export interface AgentConfiguration {
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  tools: string[];
  knowledgeBase: ID[];
}

export interface AgentMetrics {
  totalConversations: number;
  totalMessages: number;
  averageResponseTime: number;
  successRate: number;
  lastWeekUsage: number;
}

// Agent Request Types based on backend API
export interface CreateAgentRequest {
  name: string;
  provider: AgentProvider;
  api_key: string;
  model?: string; // Optional, defaults to provider's default
  temperature?: number; // Optional, default 0.7
  is_active?: number; // Optional, default 1
}

export interface UpdateAgentRequest {
  name?: string;
  provider?: AgentProvider;
  api_key?: string;
  model?: string;
  temperature?: number;
  is_active?: number;
}

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
