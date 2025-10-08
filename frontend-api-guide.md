# Frontend API Integration Guide

## 🚀 API Response Standardization

This guide explains the standardized API response format implemented across all Chatverse backend endpoints. All API responses now follow a consistent structure to improve frontend integration and maintainability.

## 📋 Response Structure

### Success Response Format
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Actual response data (object, array, or primitive)
  },
  "meta": {
    // Optional metadata (pagination, timestamps, etc.)
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Human-readable error message",
  "error": "ERROR_CODE",
  "details": {
    // Optional additional error details
  },
  "timestamp": "2025-10-09T10:30:00.000Z"
}
```

## 🔧 Integration Guidelines

### 1. Always Check `success` Field First
```javascript
// ✅ Correct approach
const response = await apiCall();
if (response.success) {
  // Handle success
  console.log(response.message);
  processData(response.data);
} else {
  // Handle error
  console.error(response.message);
  showErrorToUser(response.error, response.details);
}
```

### 2. Response Data Access
- **`response.data`**: Contains the actual API response payload
- **`response.message`**: Human-readable success/error message
- **`response.meta`**: Optional metadata (pagination info, timestamps, etc.)

### 3. Error Handling
```javascript
// Error response handling
if (!response.success) {
  switch (response.error) {
    case 'UNAUTHORIZED':
      // Redirect to login
      redirectToLogin();
      break;
    case 'VALIDATION_FAILED':
      // Show validation errors
      displayValidationErrors(response.details);
      break;
    case 'NOT_FOUND':
      // Show 404 page
      showNotFoundPage();
      break;
    default:
      // Generic error handling
      showGenericError(response.message);
  }
}
```

## 📚 API Endpoint Examples

### Authentication
```javascript
// POST /api/v1/users/login
const loginResponse = await fetch('/api/v1/users/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});

// Success Response
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "jwt_token_here"
  }
}

// Error Response
{
  "success": false,
  "message": "Invalid credentials",
  "error": "INVALID_CREDENTIALS",
  "timestamp": "2025-10-09T10:30:00.000Z"
}
```

### CRUD Operations

#### Create (POST)
```javascript
// POST /api/v1/agents
const createResponse = await fetch('/api/v1/agents', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify(agentData)
});

// Response
{
  "success": true,
  "message": "Agent created successfully",
  "data": {
    "id": 123,
    "name": "My Agent",
    "model": "gpt-4",
    "created_at": "2025-10-09T10:30:00.000Z"
  }
}
```

#### Read (GET)
```javascript
// GET /api/v1/agents
const listResponse = await fetch('/api/v1/agents', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Response
{
  "success": true,
  "message": "Agents retrieved successfully",
  "data": [
    {
      "id": 123,
      "name": "Agent 1",
      "model": "gpt-4"
    },
    {
      "id": 124,
      "name": "Agent 2",
      "model": "claude-3"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Update (PUT/PATCH)
```javascript
// PUT /api/v1/agents/123
const updateResponse = await fetch('/api/v1/agents/123', {
  method: 'PUT',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ name: "Updated Agent Name" })
});

// Response
{
  "success": true,
  "message": "Agent updated successfully",
  "data": {
    "id": 123,
    "name": "Updated Agent Name",
    "updated_at": "2025-10-09T10:30:00.000Z"
  }
}
```

#### Delete (DELETE)
```javascript
// DELETE /api/v1/agents/123
const deleteResponse = await fetch('/api/v1/agents/123', {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}` }
});

// Response
{
  "success": true,
  "message": "Agent deleted successfully"
}
```

### Chat Operations
```javascript
// POST /api/v1/chat/agents/123
const chatResponse = await fetch('/api/v1/chat/agents/123', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    messages: [{ role: "user", content: "Hello!" }],
    sessionId: "session_123"
  })
});

// Response
{
  "success": true,
  "message": "Agent chat processed successfully",
  "data": {
    "message": "Hello! How can I help you today?",
    "model": "gpt-4",
    "sessionId": 123,
    "contextUsed": true,
    "contextLength": 1500,
    "performance": {
      "totalTime": "2500ms"
    }
  }
}
```

## 🎯 Frontend Framework Examples

### React Hook Example
```javascript
import { useState, useEffect } from 'react';

function useApi(endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(endpoint, options)
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          setData(result.data);
          setError(null);
        } else {
          setError(result.message);
          setData(null);
        }
      })
      .catch(err => {
        setError('Network error occurred');
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [endpoint]);

  return { data, loading, error };
}

// Usage
function AgentList() {
  const { data: agents, loading, error } = useApi('/api/v1/agents', {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {agents.map(agent => (
        <li key={agent.id}>{agent.name}</li>
      ))}
    </ul>
  );
}
```

### Vue.js Composition API Example
```javascript
import { ref, computed } from 'vue';

export function useApi(url, options = {}) {
  const data = ref(null);
  const loading = ref(true);
  const error = ref(null);

  const fetchData = async () => {
    try {
      const response = await fetch(url, options);
      const result = await response.json();

      if (result.success) {
        data.value = result.data;
        error.value = null;
      } else {
        error.value = result.message;
        data.value = null;
      }
    } catch (err) {
      error.value = 'Network error occurred';
      data.value = null;
    } finally {
      loading.value = false;
    }
  };

  fetchData();

  return {
    data: computed(() => data.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    refetch: fetchData
  };
}

// Usage in component
export default {
  setup() {
    const { data: agents, loading, error } = useApi('/api/v1/agents', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    return { agents, loading, error };
  }
};
```

### Angular Service Example
```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  meta?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(url: string): Observable<T> {
    return this.http.get<ApiResponse<T>>(url).pipe(
      map(response => {
        if (response.success) {
          return response.data!;
        } else {
          throw new Error(response.message);
        }
      }),
      catchError(this.handleError)
    );
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<ApiResponse<T>>(url, body).pipe(
      map(response => {
        if (response.success) {
          return response.data!;
        } else {
          throw new Error(response.message);
        }
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (error.error && typeof error.error === 'object') {
      const apiError = error.error as ApiResponse<any>;
      if (!apiError.success) {
        errorMessage = apiError.message;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}

// Usage in component
export class AgentListComponent {
  agents: Agent[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.get<Agent[]>('/api/v1/agents')
      .subscribe({
        next: (agents) => this.agents = agents,
        error: (error) => console.error('Error loading agents:', error.message)
      });
  }
}
```

## 🔄 Migration Guide for Frontend Developers

### Before (Old Format)
```javascript
// Old inconsistent responses
const userResponse = await api.get('/users/1');
// Sometimes: { data: {...}, message: "..." }
// Sometimes: { success: true, message: "...", data: {...} }

const agentResponse = await api.post('/agents', agentData);
// Sometimes: { data: {...}, message: "..." }
// Sometimes: { success: true, message: "...", data: {...} }
```

### After (New Standardized Format)
```javascript
// New consistent responses
const userResponse = await api.get('/users/1');
// Always: { success: true, message: "...", data: {...} }

const agentResponse = await api.post('/agents', agentData);
// Always: { success: true, message: "...", data: {...} }

// Error responses
// Always: { success: false, message: "...", error: "CODE", details: {...} }
```

### Migration Steps

1. **Update API Service Layer**
   - Modify HTTP interceptors to handle the new response format
   - Update error handling logic to check `response.success`
   - Standardize data extraction to always use `response.data`

2. **Update Component Logic**
   - Replace direct response access with `response.data`
   - Update error handling to use `response.success` checks
   - Remove any format-specific logic

3. **Update Type Definitions**
   ```typescript
   // Old types
   interface UserResponse {
     data: User;
     message: string;
   }

   // New types
   interface ApiResponse<T> {
     success: boolean;
     message: string;
     data?: T;
     meta?: any;
   }

   interface UserResponse extends ApiResponse<User> {}
   ```

4. **Update Error Handling**
   ```javascript
   // Old error handling
   if (response.status >= 400) {
     // Handle error
   }

   // New error handling
   if (!response.success) {
     // Handle error using response.error code
   }
   ```

## 📋 Error Codes Reference

| Error Code | Description | HTTP Status |
|------------|-------------|-------------|
| `UNAUTHORIZED` | Authentication required | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `VALIDATION_FAILED` | Input validation error | 400 |
| `CONFLICT` | Resource conflict | 409 |
| `RATE_LIMITED` | Too many requests | 429 |
| `INTERNAL_ERROR` | Server error | 500 |

## 🧪 Testing Checklist

- [ ] All API calls check `response.success` first
- [ ] Error handling uses `response.error` codes
- [ ] Success data accessed via `response.data`
- [ ] Loading states work correctly
- [ ] Error messages display to users appropriately
- [ ] Pagination uses `response.meta` when available
- [ ] Authentication errors redirect to login
- [ ] Network errors are handled gracefully

## 📞 Support

If you encounter any issues with the new API response format:

1. Check this documentation first
2. Review the error codes and their meanings
3. Test with the API endpoints directly using tools like Postman
4. Contact the backend team if response format seems incorrect

---

**Last Updated**: October 9, 2025
**API Version**: v1
**Response Format Version**: 2.0</content>
<parameter name="filePath">/Users/harshalpatil/Documents/Projects/chatverse-backend/FRONTEND_API_INTEGRATION_GUIDE.md