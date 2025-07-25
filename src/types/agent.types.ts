import { ID, Timestamp } from "./api.types";
import { User } from "./auth.types";

// Agent Types
export interface Agent {
  id: ID;
  name: string;
  description: string;
  type: AgentType;
  status: AgentStatus;
  configuration: AgentConfiguration;
  createdBy: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastActiveAt?: Timestamp;
  metrics: AgentMetrics;
}

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

// Agent Request Types
export interface CreateAgentRequest {
  name: string;
  description: string;
  type: AgentType;
  configuration: Partial<AgentConfiguration>;
}

export interface UpdateAgentRequest {
  name?: string;
  description?: string;
  configuration?: Partial<AgentConfiguration>;
  status?: AgentStatus;
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
