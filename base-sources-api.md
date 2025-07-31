# Base Source API Documentation Guide

This document provides comprehensive information for frontend developers on how to interact with the Base Source API. The API allows you to manage sources across different types (file, text, website, database, and QA).

## Authentication

All endpoints require authentication using a JWT bearer token. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Base Endpoints

These endpoints apply to all source types.

### 1. Get All Sources for an Agent

Retrieves all sources associated with a specific agent.

**Endpoint:** `GET /sources/agent/{agentId}`

**Parameters:**

- `agentId` (path parameter, integer): ID of the agent to get sources for

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "agent_id": 1,
      "source_type": "file",
      "name": "Document 1",
      "created_by": 1,
      "created_at": "2025-07-30T14:33:39Z",
      "updated_by": 1,
      "updated_at": "2025-07-30T14:33:39Z",
      "is_deleted": false,
      "deleted_by": null,
      "deleted_at": null
    }
    // Additional sources...
  ],
  "message": "findAll"
}
```

### 2. Get Source by ID

Retrieves a specific source by its ID.

**Endpoint:** `GET /sources/{id}`

**Parameters:**

- `id` (path parameter, integer): ID of the source to retrieve

**Response:**

```json
{
  "data": {
    "id": 1,
    "agent_id": 1,
    "source_type": "file",
    "name": "Document 1",
    "created_by": 1,
    "created_at": "2025-07-30T14:33:39Z",
    "updated_by": 1,
    "updated_at": "2025-07-30T14:33:39Z",
    "is_deleted": false,
    "deleted_by": null,
    "deleted_at": null
  },
  "message": "findOne"
}
```

### 3. Delete Source

Deletes a source.

**Endpoint:** `DELETE /sources/{id}`

**Parameters:**

- `id` (path parameter, integer): ID of the source to delete

**Response:**

```json
{
  "message": "deleted"
}
```

## Integration with Specific Source Types

The base source API provides a foundation for all source types. For specific source types (file, text, website, database, and QA), refer to their respective API documentation:

- File Sources: See `file-source-api-guide.md`
- Text Sources: See `text-source-api-guide.md`
- Website Sources: See `website-source-api-guide.md`
- Database Sources: See `database-source-api-guide.md`
- QA Sources: See `qa-source-api-guide.md`

## Common Patterns

1. **Source Type Identification**: The `source_type` field in the response indicates the specific type of a source. Use this to determine which specific API endpoints to use for further operations.

2. **Error Handling**: Common error codes:

   - 400: Bad Request - Invalid parameters
   - 401: Unauthorized - Authentication failure
   - 404: Not Found - Source or agent not found
   - 500: Server Error - Unexpected server error

3. **Source Management Flow**:
   - Create a specific source type using its dedicated endpoint
   - List all sources for an agent using the base endpoint
   - Access source details using either the base endpoint or the specific source type endpoint
   - Delete sources using the base delete endpoint

## Implementation Notes

1. The base source API operates on the core "sources" table that stores common fields across all source types.
2. Specific source types have their own tables that join with the base source table.
3. Authentication is handled globally so you don't need to worry about implementing per-route authentication.

## Examples

### React/TypeScript Example: Fetching All Sources for an Agent

```typescript
import axios from "axios";

interface BaseSource {
  id: number;
  agent_id: number;
  source_type: string;
  name: string;
  created_by: number;
  created_at: string;
  updated_by: number;
  updated_at: string;
  is_deleted: boolean;
  deleted_by: number | null;
  deleted_at: string | null;
}

interface SourcesResponse {
  data: BaseSource[];
  message: string;
}

const fetchSources = async (
  agentId: number,
  token: string
): Promise<BaseSource[]> => {
  try {
    const response = await axios.get<SourcesResponse>(
      `${API_BASE_URL}/sources/agent/${agentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching sources:", error);
    throw error;
  }
};
```

### React/TypeScript Example: Deleting a Source

```typescript
const deleteSource = async (sourceId: number, token: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/sources/${sourceId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error deleting source:", error);
    throw error;
  }
};
```
