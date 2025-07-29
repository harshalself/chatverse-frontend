# Agent APIs Documentation

This document outlines the API endpoints available for managing AI agents in the system. These endpoints allow you to create, retrieve, update, delete, and manage AI agents across different providers.

## Base URL

- **Development**: `http://localhost:8000/api/v1`
- **Production**: `https://api.example.com/api/v1`

## Authentication

All agent endpoints require authentication via Bearer token:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### 1. Create a New Agent

Create a new AI agent with specified configuration.

- **URL**: `/agents`
- **Method**: `POST`
- **Auth Required**: Yes

**Request Body**:

```json
{
  "name": "My GPT-4 Assistant",
  "provider": "openai",
  "api_key": "sk-your-openai-key-here",
  "model": "gpt-4-turbo",
  "temperature": 0.7,
  "is_active": 1
}
```

**Required Fields**:

- `name`: String - The name of the agent
- `provider`: String - One of: "openai", "claude", "gemini", "groq"
- `api_key`: String - The API key for the selected provider

**Optional Fields**:

- `model`: String - Specific model to use (defaults to provider's default model)
- `temperature`: Number - Temperature setting (0-2, default 0.7)
- `is_active`: Integer - Whether the agent is active (0 or 1, default 1)

**Success Response (201 Created)**:

```json
{
  "id": 1,
  "name": "My GPT-4 Assistant",
  "api_key": "***hidden***",
  "is_active": 1,
  "model": "gpt-4-turbo",
  "temperature": 0.7,
  "provider": "openai",
  "user_id": 1,
  "created_by": 1,
  "created_at": "2025-07-29T10:00:00.000Z",
  "updated_by": 1,
  "updated_at": "2025-07-29T10:00:00.000Z",
  "is_deleted": false,
  "deleted_by": null,
  "deleted_at": null
}
```

**Error Responses**:

- `400`: Invalid input data or model not compatible with provider
- `401`: Unauthorized
- `409`: Agent with this name already exists

### 2. Get All Agents

Retrieve all agents belonging to the authenticated user.

- **URL**: `/agents`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters** (optional):
  - `page`: Page number (default: 1)
  - `limit`: Results per page (default: 20)

**Success Response (200 OK)**:

```json
{
  "data": [
    {
      "id": 1,
      "name": "My GPT-4 Assistant",
      "api_key": "***hidden***",
      "is_active": 1,
      "model": "gpt-4-turbo",
      "temperature": 0.7,
      "provider": "openai",
      "user_id": 1,
      "created_at": "2025-07-29T10:00:00.000Z",
      "updated_at": "2025-07-29T10:00:00.000Z",
      "is_deleted": false
    },
    {
      "id": 2,
      "name": "Claude Research Helper",
      "api_key": "***hidden***",
      "is_active": 1,
      "model": "claude-3-opus",
      "temperature": 0.5,
      "provider": "claude",
      "user_id": 1,
      "created_at": "2025-07-29T11:30:00.000Z",
      "updated_at": "2025-07-29T11:30:00.000Z",
      "is_deleted": false
    }
  ],
  "message": "Agents retrieved successfully"
}
```

**Error Response**:

- `401`: Unauthorized

### 3. Get Available Models

Retrieve available models for AI providers.

- **URL**: `/agents/models`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters** (optional):
  - `provider`: Filter models by specific provider (openai, claude, gemini, groq)

**Success Response (200 OK)**:

```json
{
  "data": {
    "openai": ["gpt-4-turbo", "gpt-4", "gpt-3.5-turbo", "gpt-3.5-turbo-16k"],
    "claude": [
      "claude-3-opus",
      "claude-3-sonnet",
      "claude-3-haiku",
      "claude-2.1",
      "claude-2"
    ],
    "gemini": [
      "gemini-2.5-pro",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
      "gemini-1.0-pro"
    ],
    "groq": [
      "llama-3.1-70b-versatile",
      "llama-3.1-8b-instant",
      "mixtral-8x7b-32768",
      "gemma-7b-it"
    ]
  },
  "message": "Provider models retrieved successfully"
}
```

**Error Response**:

- `401`: Unauthorized

### 4. Get Agent by ID

Retrieve a specific agent by its ID.

- **URL**: `/agents/{id}`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: ID of the agent to retrieve

**Success Response (200 OK)**:

```json
{
  "data": {
    "id": 1,
    "name": "My GPT-4 Assistant",
    "api_key": "***hidden***",
    "is_active": 1,
    "model": "gpt-4-turbo",
    "temperature": 0.7,
    "provider": "openai",
    "user_id": 1,
    "created_by": 1,
    "created_at": "2025-07-29T10:00:00.000Z",
    "updated_by": 1,
    "updated_at": "2025-07-29T10:00:00.000Z",
    "is_deleted": false,
    "deleted_by": null,
    "deleted_at": null
  },
  "message": "Agent retrieved successfully"
}
```

**Error Responses**:

- `401`: Unauthorized
- `404`: Agent not found

### 5. Update Agent

Update an existing agent.

- **URL**: `/agents/{id}`
- **Method**: `PUT`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: ID of the agent to update

**Request Body** (all fields optional):

```json
{
  "name": "Updated Agent Name",
  "provider": "openai",
  "api_key": "sk-your-updated-key-here",
  "model": "gpt-4-turbo",
  "temperature": 0.5,
  "is_active": 0
}
```

**Success Response (200 OK)**:

```json
{
  "data": {
    "id": 1,
    "name": "Updated Agent Name",
    "api_key": "***hidden***",
    "is_active": 0,
    "model": "gpt-4-turbo",
    "temperature": 0.5,
    "provider": "openai",
    "user_id": 1,
    "created_by": 1,
    "created_at": "2025-07-29T10:00:00.000Z",
    "updated_by": 1,
    "updated_at": "2025-07-29T15:45:00.000Z",
    "is_deleted": false,
    "deleted_by": null,
    "deleted_at": null
  },
  "message": "Agent updated successfully"
}
```

**Error Responses**:

- `400`: Invalid input data or model not compatible with provider
- `401`: Unauthorized
- `404`: Agent not found
- `409`: Agent with this name already exists

### 6. Delete Agent

Soft delete an agent (marks as deleted, doesn't remove from database).

- **URL**: `/agents/{id}`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: ID of the agent to delete

**Success Response (200 OK)**:

```json
{
  "message": "Agent deleted successfully"
}
```

**Error Responses**:

- `401`: Unauthorized
- `404`: Agent not found

### 7. Toggle Agent Status

Toggle the active status of an agent (active ↔ inactive).

- **URL**: `/agents/{id}/toggle`
- **Method**: `PATCH`
- **Auth Required**: Yes
- **URL Parameters**:
  - `id`: ID of the agent to toggle status

**Success Response (200 OK)**:

```json
{
  "data": {
    "id": 1,
    "name": "My GPT-4 Assistant",
    "api_key": "***hidden***",
    "is_active": 0, // Changed from 1 to 0 or vice versa
    "model": "gpt-4-turbo",
    "temperature": 0.7,
    "provider": "openai",
    "user_id": 1,
    "created_by": 1,
    "created_at": "2025-07-29T10:00:00.000Z",
    "updated_by": 1,
    "updated_at": "2025-07-29T16:20:00.000Z",
    "is_deleted": false,
    "deleted_by": null,
    "deleted_at": null
  },
  "message": "Agent deactivated successfully" // Or "Agent activated successfully"
}
```

**Error Responses**:

- `401`: Unauthorized
- `404`: Agent not found

## Error Response Format

All error responses follow this format:

```json
{
  "status": 401,
  "message": "Invalid authentication token"
}
```

## Provider Enums

The following providers are supported:

- `openai`: OpenAI (GPT models)
- `claude`: Anthropic Claude models
- `gemini`: Google Gemini models
- `groq`: Groq hosting platform (various models)

## Integration Notes

1. **Authentication**: Make sure to include the token in every request

   ```javascript
   const headers = {
     Authorization: `Bearer ${token}`,
     "Content-Type": "application/json",
   };
   ```

2. **API Key Security**: API keys are stored securely and masked in responses

3. **Pagination**: For endpoints that return multiple items, use `page` and `limit` query parameters

4. **Error Handling**: Always check response status codes and handle errors appropriately
