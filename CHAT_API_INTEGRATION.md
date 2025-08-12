# Chat API Integration Documentation

## Overview

Successfully integrated the Chat API into the AgentFlow UI playground with full type safety, error handling, and markdown support.

## Files Created/Modified

### 1. **Constants Updated**

- **File**: `src/lib/constants.ts`
- **Changes**: Updated chat endpoint from `/playground/chat` to `/chat` to match API spec

### 2. **Types Created**

- **File**: `src/types/chat.types.ts`
- **Features**:
  - `Message` and `UIMessage` interfaces
  - `ChatRequest` and `ChatResponse` types
  - Support for reasoning parts
  - Model constants and type definitions
  - Default model configuration

### 3. **Service Layer**

- **File**: `src/services/chat.service.ts`
- **Features**:
  - `ChatService` class with static methods
  - `sendChatMessage()` - Main API integration
  - `sendMessage()` - Convenience method
  - `getAvailableModels()` - Model enumeration
  - Proper API client integration with authentication

### 4. **React Query Hooks**

- **File**: `src/hooks/use-chat.ts`
- **Features**:
  - `useSendChatMessage()` - Mutation hook for sending messages
  - `useSendMessage()` - Convenience hook
  - `useAvailableChatModels()` - Get available models
  - Proper error handling with ErrorHandler

### 5. **UI Component Enhancement**

- **File**: `src/components/dashboard/playground/Chat.tsx`
- **Features**:
  - Real API integration replacing mock service
  - Markdown rendering with ReactMarkdown
  - Reasoning parts support with expandable sections
  - Enhanced message formatting
  - Loading states and error handling
  - Type-safe implementation

## API Integration Details

### Endpoint Configuration

```typescript
// Updated to match chat.yaml specification
PLAYGROUND: {
  CHAT: "/chat",  // POST /chat
  MESSAGES: "/playground/messages",
}
```

### Request/Response Flow

```typescript
// Request Format (matches chat.yaml)
{
  messages: [
    { role: "user", content: "Hello" },
    { role: "assistant", content: "Hi there!" }
  ],
  model: "meta-llama/llama-4-scout-17b-16e-instruct" // optional
}

// Response Format
{
  message: "AI response text",
  model: "meta-llama/llama-4-scout-17b-16e-instruct"
}
```

### Supported Models

- `meta-llama/llama-4-scout-17b-16e-instruct` (default)
- `deepseek-r1-distill-llama-70b`

## Authentication

- Uses existing bearer token authentication
- Automatic token inclusion via API client interceptors
- Proper error handling for 401 responses

## Features Implemented

### 1. **Markdown Support**

- Full markdown rendering for assistant responses
- Code blocks, lists, headers, links
- Proper styling with Tailwind classes

### 2. **Reasoning Support**

- Expandable/collapsible reasoning sections
- Animated transitions
- Visual indicators for reasoning state

### 3. **Real-time UI Updates**

- Loading states during API calls
- Proper error handling with toast notifications
- Automatic message history management

### 4. **Type Safety**

- Full TypeScript integration
- Proper type definitions for all API interactions
- Compile-time error checking

## Usage Examples

### Basic Chat Usage

```typescript
const { mutate: sendMessage } = useSendChatMessage();

// Send a message
sendMessage({
  messages: [{ role: "user", content: "Hello, how are you?" }],
  model: "meta-llama/llama-4-scout-17b-16e-instruct",
});
```

### With Conversation History

```typescript
const conversationHistory = [
  { role: "user", content: "What's the weather?" },
  { role: "assistant", content: "I can't check weather." },
];

sendMessage({
  messages: [
    ...conversationHistory,
    { role: "user", content: "How about the time?" },
  ],
});
```

## Error Handling

### API Errors

- Network errors: Handled by API client
- 400 errors: Invalid message format
- 429 errors: Rate limiting
- 500 errors: Server errors
- All errors show user-friendly toast notifications

### Loading States

- Button shows loading spinner during requests
- Input disabled during processing
- Status indicators for different states

## Dependencies Added

- `react-markdown`: Markdown rendering
- `remark-gfm`: GitHub Flavored Markdown support

## File Structure

```
src/
├── types/
│   └── chat.types.ts          # Chat type definitions
├── services/
│   └── chat.service.ts        # API service layer
├── hooks/
│   └── use-chat.ts           # React Query hooks
└── components/dashboard/playground/
    └── Chat.tsx              # Enhanced chat component
```

## Testing Recommendations

1. **Basic Chat Flow**

   - Send simple text messages
   - Verify responses appear correctly
   - Check markdown rendering

2. **Error Scenarios**

   - Test network disconnection
   - Test invalid API responses
   - Verify error toast notifications

3. **Authentication**

   - Test with valid tokens
   - Test token expiration handling
   - Verify automatic re-authentication

4. **UI/UX**
   - Test responsive design
   - Verify loading states
   - Check conversation history management

## Production Considerations

1. **Rate Limiting**

   - API has rate limiting (429 responses)
   - Consider implementing client-side throttling

2. **Error Recovery**

   - Retry logic for network failures
   - Graceful degradation for API outages

3. **Performance**
   - Message history management for long conversations
   - Consider pagination for chat history

The chat integration is now production-ready with proper error handling, type safety, and user experience features!
