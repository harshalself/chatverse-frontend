# Agent Chat Integration

## Overview

The frontend now supports the new agent-based chat endpoint `/chat/agents/{agentId}` with automatic session management while maintaining backward compatibility with the legacy `/chat` endpoint.

## Features

### Agent-Based Chat

- **Endpoint**: `POST /chat/agents/{agentId}`
- **Session Management**: Automatically creates and manages chat sessions
- **Agent Context**: Uses the current agent from `AgentContext`
- **Session Persistence**: Maintains conversation history across sessions

### Legacy Chat Support

- **Endpoint**: `POST /chat`
- **No Session Management**: Traditional stateless chat
- **Fallback**: Used when no agent is selected

## Implementation Details

### 1. Constants (`src/lib/constants.ts`)

```typescript
PLAYGROUND: {
  CHAT: "/chat",
  AGENT_CHAT: (agentId: number) => `/chat/agents/${agentId}`,
  // ... other endpoints
}
```

### 2. Types (`src/types/chat.types.ts`)

```typescript
// Agent Chat Request
export interface AgentChatRequest {
  messages: Message[];
  sessionId?: string;
}

// Agent Chat Response
export interface AgentChatResponse {
  data: {
    message: string;
    model: string;
    provider: string;
    sessionId: number;
    agentId: number;
    agentName: string;
  };
  message: string;
}
```

### 3. Service (`src/services/chat.service.ts`)

```typescript
static async sendAgentChatMessage(
  agentId: number,
  messages: Message[] | UIMessage[],
  sessionId?: string
): Promise<AgentChatResponse>
```

### 4. Hooks (`src/hooks/use-chat.ts`)

```typescript
export const useSendAgentChatMessage = () => {
  // Automatically invalidates session queries on success
  // Provides optimistic UI updates
};
```

### 5. Components (`src/components/dashboard/playground/Chat.tsx`)

- **Smart Routing**: Automatically uses agent chat when an agent is selected
- **Session Management**: Shows current session information
- **History Loading**: Loads session history when switching sessions
- **UI Indicators**: Shows agent information and session status

## Usage

### With Agent Selected

1. Agent context provides `currentAgentId`
2. Chat component automatically uses agent chat endpoint
3. Sessions are filtered by the current agent
4. Session history is automatically loaded

### Without Agent (Legacy Mode)

1. Uses traditional `/chat` endpoint
2. No session management
3. Stateless conversation

## Session Management

### Session Sidebar

- **Filtered Sessions**: Shows only sessions for the current agent
- **New Sessions**: Creates new conversations
- **Session History**: Loads previous conversations
- **Delete Sessions**: Remove sessions with optimistic updates

### Session Persistence

- **Auto Creation**: New sessions created automatically on first message
- **Session Continuation**: Pass `sessionId` to continue existing conversations
- **History Loading**: Retrieve full conversation history
- **Cross-Session Navigation**: Switch between different conversation threads

## API Integration

### Agent Chat Request

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello! Can you help me with some questions?"
    }
  ],
  "sessionId": "123" // Optional - for continuing existing session
}
```

### Agent Chat Response

```json
{
  "data": {
    "message": "Hello! I'd be happy to help you with your questions.",
    "model": "meta-llama/llama-4-scout-17b-16e-instruct",
    "provider": "groq",
    "sessionId": 123,
    "agentId": 1,
    "agentName": "My AI Assistant"
  },
  "message": "Agent chat processed successfully"
}
```

## Error Handling

- **Agent Validation**: Handles invalid or inactive agents
- **Session Validation**: Manages session ownership and existence
- **Network Errors**: Graceful fallback and user feedback
- **Rate Limiting**: Proper error messages for API limits

## Benefits

1. **Session Persistence**: Conversations are saved and can be resumed
2. **Agent-Specific**: Each agent maintains separate conversation threads
3. **Better UX**: Users can navigate between different conversations
4. **Scalable**: Supports multiple agents and concurrent sessions
5. **Backward Compatible**: Legacy chat still works without agents

## Migration

The integration is backward compatible:

- Existing chat functionality continues to work
- No breaking changes to existing components
- Gradual adoption as agents are selected
- Legacy endpoints remain functional

## Testing

Build successfully completed with no TypeScript errors:

- ✅ Type safety maintained
- ✅ All imports resolved
- ✅ No compilation errors
- ✅ Production build successful
