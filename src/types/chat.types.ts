import { ApiResponse } from "./api.types";

// Message Types
export interface Message {
  role: "user" | "assistant";
  content: string;
}

// Chat Request and Response types
export interface ChatRequest {
  messages: Message[];
  model?:
    | "meta-llama/llama-4-scout-17b-16e-instruct"
    | "deepseek-r1-distill-llama-70b";
}

export interface ChatResponse {
  message: string;
  model: string;
}

// Agent Chat Request and Response types
export interface AgentChatRequest {
  messages: Message[];
  sessionId?: string;
}

export interface AgentChatData {
  message: string;
  model: string;
  provider: string;
  sessionId: number;
  agentId: number;
  agentName: string;
}

export interface AgentChatResponse {
  data: AgentChatData;
  message: string;
}

// Create Session Request and Response types
export interface CreateSessionRequest {
  agentId: number;
}

export interface CreateSessionData {
  id: number;
  agent_id: number;
  agent_name: string;
  created_at: string;
}

export interface CreateSessionResponse {
  data: CreateSessionData;
  message: string;
}

// Session Types
export interface ChatSession {
  id: number;
  agent_id: number;
  created_at: string;
  message_count: number;
  last_message: string;
  last_message_time: string;
}

export interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ChatHistory {
  session_id: number;
  messages: HistoryMessage[];
}

export interface SessionsResponse {
  data: ChatSession[];
  message: string;
}

export interface HistoryResponse {
  data: ChatHistory;
  message: string;
}

// UI Message Types (extended from the basic Message for UI purposes)
export interface MessagePart {
  type: "text" | "reasoning";
  text?: string;
}

export interface UIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  parts?: MessagePart[];
  timestamp?: string;
  created_at?: string;
}

// API Response Types
export type ChatApiResponse = ApiResponse<ChatResponse>;
export type AgentChatApiResponse = ApiResponse<AgentChatResponse>;

// Chat Status Types
export type ChatStatus = "ready" | "streaming" | "submitted" | "error";

// Supported Models
export const SUPPORTED_CHAT_MODELS = [
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "deepseek-r1-distill-llama-70b",
] as const;

export type ChatModel = (typeof SUPPORTED_CHAT_MODELS)[number];

// Default Model
export const DEFAULT_CHAT_MODEL: ChatModel =
  "meta-llama/llama-4-scout-17b-16e-instruct";
