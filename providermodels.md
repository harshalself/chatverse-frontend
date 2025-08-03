# Provider Models API Documentation

This document describes the API endpoints available for managing AI provider models in the system.

## Base URL
All API routes are prefixed with `/provider-models`

## Available Endpoints

### Get All Provider Models
- **Method**: GET
- **Endpoint**: `/provider-models`
- **Description**: Retrieves a list of all provider models
- **Response**: 
  ```json
  {
    "data": [
      {
        "id": 1,
        "provider": "openai",
        "model_name": "gpt-4-turbo",
        "created_by": 1,
        "created_at": "2025-08-03T10:00:00Z",
        "updated_by": null,
        "updated_at": "2025-08-03T10:00:00Z",
        "is_deleted": false,
        "deleted_by": null,
        "deleted_at": null
      }
    ],
    "message": "Retrieved all provider models"
  }
  ```

### Get Models by Provider
- **Method**: GET
- **Endpoint**: `/provider-models/provider/:provider`
- **Parameters**: 
  - `provider` (path parameter): The name of the provider
- **Description**: Retrieves all models for a specific provider
- **Response**: 
  ```json
  {
    "data": [
      {
        "id": 1,
        "provider": "openai",
        "model_name": "gpt-4-turbo",
        "created_by": 1,
        "created_at": "2025-08-03T10:00:00Z",
        "updated_by": null,
        "updated_at": "2025-08-03T10:00:00Z",
        "is_deleted": false,
        "deleted_by": null,
        "deleted_at": null
      }
    ],
    "message": "Retrieved models for provider openai"
  }
  ```

### Get Provider Model by ID
- **Method**: GET
- **Endpoint**: `/provider-models/:id`
- **Parameters**:
  - `id` (path parameter): The ID of the provider model
- **Description**: Retrieves a specific provider model by its ID
- **Response**:
  ```json
  {
    "data": {
      "id": 1,
      "provider": "openai",
      "model_name": "gpt-4-turbo",
      "created_by": 1,
      "created_at": "2025-08-03T10:00:00Z",
      "updated_by": null,
      "updated_at": "2025-08-03T10:00:00Z",
      "is_deleted": false,
      "deleted_by": null,
      "deleted_at": null
    },
    "message": "Retrieved provider model"
  }
  ```

### Create New Provider Model
- **Method**: POST
- **Endpoint**: `/provider-models`
- **Description**: Creates a new provider model
- **Request Body**:
  ```json
  {
    "provider": "openai",
    "model_name": "gpt-4-turbo"
  }
  ```
- **Response**:
  ```json
  {
    "data": {
      "id": 1,
      "provider": "openai",
      "model_name": "gpt-4-turbo",
      "created_by": 1,
      "created_at": "2025-08-03T10:00:00Z",
      "updated_by": null,
      "updated_at": "2025-08-03T10:00:00Z",
      "is_deleted": false,
      "deleted_by": null,
      "deleted_at": null
    },
    "message": "Provider model created"
  }
  ```

### Update Provider Model
- **Method**: PUT
- **Endpoint**: `/provider-models/:id`
- **Parameters**:
  - `id` (path parameter): The ID of the provider model
- **Description**: Updates an existing provider model
- **Request Body**:
  ```json
  {
    "provider": "openai",
    "model_name": "gpt-4-turbo"
  }
  ```
- **Response**:
  ```json
  {
    "data": {
      "id": 1,
      "provider": "openai",
      "model_name": "gpt-4-turbo",
      "created_by": 1,
      "created_at": "2025-08-03T10:00:00Z",
      "updated_by": 1,
      "updated_at": "2025-08-03T11:00:00Z",
      "is_deleted": false,
      "deleted_by": null,
      "deleted_at": null
    },
    "message": "Provider model updated"
  }
  ```

### Delete Provider Model
- **Method**: DELETE
- **Endpoint**: `/provider-models/:id`
- **Parameters**:
  - `id` (path parameter): The ID of the provider model
- **Description**: Soft deletes a provider model
- **Response**:
  ```json
  {
    "message": "Provider model deleted"
  }
  ```

## Error Responses

The API can return the following error responses:

- **404 Not Found**:
  ```json
  {
    "message": "Provider model not found",
    "status": 404
  }
  ```

- **409 Conflict**:
  ```json
  {
    "message": "Provider model already exists",
    "status": 409
  }
  ```

- **500 Server Error**:
  ```json
  {
    "message": "Error message describing what went wrong",
    "status": 500
  }
  ```

## Authentication

All endpoints require authentication via the global authentication middleware.
