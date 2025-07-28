# User APIs Integration Guide

## 🚀 Overview

This document provides comprehensive information about the User APIs for frontend integration. The User API handles user registration, authentication, and user management operations.

**Base URL:** `http://localhost:8000/api/v1`  
**Interactive Documentation:** `http://localhost:8000/api-docs`

---

## 📋 API Endpoints Summary

| Method | Endpoint          | Auth Required | Description                         |
| ------ | ----------------- | ------------- | ----------------------------------- |
| POST   | `/users/register` | ❌ No         | Register a new user                 |
| POST   | `/users/login`    | ❌ No         | Authenticate user and get JWT token |
| GET    | `/users`          | ✅ Yes        | Get all users (admin)               |
| GET    | `/users/:id`      | ✅ Yes        | Get specific user by ID             |
| PUT    | `/users/:id`      | ✅ Yes        | Update user information             |
| DELETE | `/users/:id`      | ✅ Yes        | Delete user account                 |

---

## 🔐 Authentication Flow

### 1. User Registration

```javascript
// No authentication required
POST / api / v1 / users / register;
```

### 2. User Login

```javascript
// Returns JWT token for subsequent requests
POST / api / v1 / users / login;
```

### 3. Protected Endpoints

```javascript
// Include JWT token in Authorization header
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

---

## 📝 Detailed API Documentation

### 1. User Registration

**Endpoint:** `POST /api/v1/users/register`  
**Authentication:** ❌ Not required  
**Description:** Register a new user account

#### Request Body

```json
{
  "name": "string (required, min 2 characters)",
  "email": "string (required, valid email format)",
  "phone_number": "string (required, valid phone format)",
  "password": "string (required, min 6 characters)"
}
```

#### Example Request

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone_number": "+1234567890",
  "password": "SecurePass123"
}
```

#### Response (201 - Success)

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone_number": "+1234567890",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Error Responses

```json
// 400 - Validation Error
{
  "status": 400,
  "message": "Validation failed",
  "details": [
    "email must be a valid email",
    "password must be at least 6 characters"
  ]
}

// 409 - Email Already Exists
{
  "status": 409,
  "message": "Email already registered"
}
```

---

### 2. User Login

**Endpoint:** `POST /api/v1/users/login`  
**Authentication:** ❌ Not required  
**Description:** Authenticate user and receive JWT token

#### Request Body

```json
{
  "email": "string (required, valid email)",
  "password": "string (required)"
}
```

#### Example Request

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

#### Response (200 - Success)

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone_number": "+1234567890"
  }
}
```

#### Error Responses

```json
// 400 - Invalid Credentials
{
  "status": 400,
  "message": "Invalid email or password"
}

// 404 - User Not Found
{
  "status": 404,
  "message": "User not found"
}
```

---

### 3. Get All Users

**Endpoint:** `GET /api/v1/users`  
**Authentication:** ✅ Required (JWT Token)  
**Description:** Retrieve all users (admin functionality)

#### Headers

```javascript
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

#### Response (200 - Success)

```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone_number": "+1234567890",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 1
}
```

---

### 4. Get User by ID

**Endpoint:** `GET /api/v1/users/:id`  
**Authentication:** ✅ Required (JWT Token)  
**Description:** Retrieve specific user information

#### Parameters

- `id` (path parameter): User ID (integer)

#### Headers

```javascript
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

#### Response (200 - Success)

```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone_number": "+1234567890",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### Error Responses

```json
// 404 - User Not Found
{
  "status": 404,
  "message": "User not found"
}

// 401 - Unauthorized
{
  "status": 401,
  "message": "Authentication token missing"
}
```

---

### 5. Update User

**Endpoint:** `PUT /api/v1/users/:id`  
**Authentication:** ✅ Required (JWT Token)  
**Description:** Update user information

#### Parameters

- `id` (path parameter): User ID (integer)

#### Headers

```javascript
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

#### Request Body (All fields optional)

```json
{
  "name": "string (optional)",
  "email": "string (optional, valid email)",
  "phone_number": "string (optional)",
  "password": "string (optional, min 6 characters)"
}
```

#### Example Request

```json
{
  "name": "John Smith",
  "phone_number": "+1987654321"
}
```

#### Response (200 - Success)

```json
{
  "message": "User updated successfully",
  "user": {
    "id": 1,
    "name": "John Smith",
    "email": "john.doe@example.com",
    "phone_number": "+1987654321",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

---

### 6. Delete User

**Endpoint:** `DELETE /api/v1/users/:id`  
**Authentication:** ✅ Required (JWT Token)  
**Description:** Delete user account

#### Parameters

- `id` (path parameter): User ID (integer)

#### Headers

```javascript
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

#### Response (200 - Success)

```json
{
  "message": "User deleted successfully"
}
```

---

## 💻 Frontend Integration Examples

### 1. User Service Class

```javascript
class UserService {
  constructor(baseURL = "http://localhost:8000/api/v1") {
    this.baseURL = baseURL;
  }

  // Get stored token
  getToken() {
    return localStorage.getItem("authToken");
  }

  // Set auth headers
  getAuthHeaders() {
    const token = this.getToken();
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Register user
  async register(userData) {
    try {
      const response = await fetch(`${this.baseURL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await fetch(`${this.baseURL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get all users
  async getAllUsers() {
    try {
      const response = await fetch(`${this.baseURL}/users`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get user by ID
  async getUserById(id) {
    try {
      const response = await fetch(`${this.baseURL}/users/${id}`, {
        method: "GET",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user");
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Update user
  async updateUser(id, updateData) {
    try {
      const response = await fetch(`${this.baseURL}/users/${id}`, {
        method: "PUT",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update user");
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Delete user
  async deleteUser(id) {
    try {
      const response = await fetch(`${this.baseURL}/users/${id}`, {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete user");
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Logout
  logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken();
  }

  // Get current user from storage
  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
}

// Export singleton instance
export const userService = new UserService();
```

### 2. React Hook Example

```javascript
import { useState, useEffect } from "react";
import { userService } from "./userService";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = userService.getCurrentUser();
    if (currentUser && userService.isAuthenticated()) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await userService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await userService.register(userData);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    userService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };
};
```

---

## ✅ Frontend Validation Rules

Match the backend validation by implementing these rules in your frontend forms:

```javascript
const validationRules = {
  register: {
    name: {
      required: true,
      minLength: 2,
      message: "Name must be at least 2 characters long",
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
    phone_number: {
      required: true,
      pattern: /^\+?[\d\s\-\(\)]+$/,
      message: "Please enter a valid phone number",
    },
    password: {
      required: true,
      minLength: 6,
      message: "Password must be at least 6 characters long",
    },
  },
  login: {
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
    password: {
      required: true,
      message: "Password is required",
    },
  },
};
```

---

## 🔧 Environment Configuration

Add these environment variables to your frontend `.env` file:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1

# Full API base URL (computed)
# Final URL: ${NEXT_PUBLIC_API_URL}/api/${NEXT_PUBLIC_API_VERSION}
```

---

## 🚨 Error Handling

### Common HTTP Status Codes

| Status | Meaning      | Action                                 |
| ------ | ------------ | -------------------------------------- |
| 200    | Success      | Continue with response data            |
| 201    | Created      | Resource created successfully          |
| 400    | Bad Request  | Show validation errors to user         |
| 401    | Unauthorized | Redirect to login page                 |
| 404    | Not Found    | Show "resource not found" message      |
| 409    | Conflict     | Show "resource already exists" message |
| 500    | Server Error | Show generic error message             |

### Error Response Format

All error responses follow this format:

```json
{
  "status": 400,
  "message": "Error description",
  "details": ["Detailed error messages array (optional)"]
}
```

---

## 🔒 Security Best Practices

1. **Token Storage:**

   - Use `localStorage` for development
   - Consider `httpOnly` cookies for production
   - Implement token refresh mechanism

2. **API Calls:**

   - Always validate data before sending
   - Handle network errors gracefully
   - Implement request timeouts

3. **Authentication:**

   - Check token expiration
   - Auto-logout on 401 responses
   - Redirect to login when needed

4. **Validation:**
   - Validate on both frontend and backend
   - Sanitize user inputs
   - Show clear error messages

---

## 📱 Integration Checklist

- [ ] Set up UserService class with all API methods
- [ ] Implement authentication state management
- [ ] Create registration form with validation
- [ ] Create login form with validation
- [ ] Implement protected routes
- [ ] Add error handling and user feedback
- [ ] Add loading states for better UX
- [ ] Implement logout functionality
- [ ] Add auto-login on page refresh
- [ ] Handle token expiration
- [ ] Add user profile management
- [ ] Implement user listing (if admin)
- [ ] Add user update functionality
- [ ] Add user deletion (if admin)

---

## 🔗 Additional Resources

- **Swagger UI (Interactive):** `http://localhost:8000/api-docs`
- **OpenAPI JSON:** `http://localhost:8000/api-docs.json`
- **Backend Documentation:** `./README.md`
- **Security Analysis:** `./issues.md`

---

## 🆘 Troubleshooting

### Common Issues

1. **CORS Errors:**

   - Ensure `ALLOWED_ORIGINS` includes your frontend URL
   - Check if frontend is running on expected port

2. **401 Unauthorized:**

   - Verify JWT token is included in headers
   - Check if token is expired
   - Ensure token format: `Bearer <token>`

3. **Network Errors:**

   - Verify backend server is running
   - Check API base URL configuration
   - Ensure correct port numbers

4. **Validation Errors:**
   - Match frontend validation with backend DTOs
   - Check required fields and formats
   - Verify data types match expected schema

For more detailed troubleshooting, check the backend logs and browser network tab.

---

**Happy Coding! 🚀**
