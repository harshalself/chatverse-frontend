import { ApiResponse } from "./api.types";

// Message Types based on chat.yaml
export interface Message {
  role: "user" | "assistant";
  content: string;
}

// Chat Request and Response types based on chat.yaml
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
}

// API Response Types
export type ChatApiResponse = ApiResponse<ChatResponse>;

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
