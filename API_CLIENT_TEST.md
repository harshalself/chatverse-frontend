# API Client Migration - Quick Test

## Test the new API client behavior

You can test this by temporarily modifying your backend response or mocking a response:

### Test 1: Standardized Success Response
```javascript
// When backend returns:
{
  "success": true,
  "message": "Agents retrieved successfully",
  "data": [
    { "id": 1, "name": "Agent 1" },
    { "id": 2, "name": "Agent 2" }
  ]
}

// Your existing service code will receive:
{
  "data": [
    { "id": 1, "name": "Agent 1" },
    { "id": 2, "name": "Agent 2" }
  ],
  "message": "Agents retrieved successfully",
  "success": true
}
```

### Test 2: Standardized Error Response
```javascript
// When backend returns:
{
  "success": false,
  "message": "Agent not found",
  "error": "NOT_FOUND"
}

// Your error handler will automatically:
// 1. Show appropriate toast message
// 2. Handle error code (NOT_FOUND, UNAUTHORIZED, etc.)
// 3. Log the error for debugging
```

### Test 3: Legacy Response (Backward Compatibility)
```javascript
// When backend returns old format:
{
  "data": [{ "id": 1, "name": "Agent 1" }],
  "message": "Success"
}

// Your service code receives exactly the same format
// No changes needed!
```

## Quick Verification

Add this temporary console log to any service method to see the transformation:

```typescript
static async getAgents(): Promise<AgentsResponse> {
  const response = await apiClient.get(API_ENDPOINTS.AGENTS.LIST);
  console.log('🔍 Service received:', response);
  return response;
}
```

You should see that regardless of whether the backend sends the old or new format, your service receives the expected legacy format.