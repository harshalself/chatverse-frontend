# File Source API Guide

This guide explains how to use the File Source API to manage file sources in the AI-Chatbot system.

## File Source API Overview

The File Source API allows you to:

- Upload single or multiple files to be used as knowledge sources for AI agents
- Retrieve file sources by ID or get all files for a specific agent
- Update file source name
- Delete file sources

All file uploads are organized in user-specific folders and securely stored in the cloud.

## Basic File Source Operations

### 1. Upload a Single File

**Endpoint:** `POST /sources/file`

**Request Body:**

```json
{
  "agent_id": 1,
  "name": "document1",
  "file": "data:application/pdf;base64,BASE64_ENCODED_CONTENT"
}
```

**Response:**

```json
{
  "data": {
    "id": 1,
    "agent_id": 1,
    "name": "document1",
    "file_name": "document1.pdf",
    "file_url": "https://storage.example.com/users/username/agents/1/files/1627634819-document1.pdf",
    "mime_type": "application/pdf",
    "created_at": "2025-07-30T14:33:39Z",
    "updated_at": "2025-07-30T14:33:39Z"
  },
  "message": "created"
}
```

### 2. Upload Multiple Files at Once

**Endpoint:** `POST /sources/file/multiple`

**Request Body:**

```json
{
  "agent_id": 1,
  "files": [
    {
      "name": "document1",
      "base64String": "data:application/pdf;base64,BASE64_ENCODED_CONTENT"
    },
    {
      "name": "document2",
      "base64String": "data:image/png;base64,BASE64_ENCODED_CONTENT"
    }
  ]
}
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "agent_id": 1,
      "name": "document1",
      "file_name": "document1.pdf",
      "file_url": "https://storage.example.com/users/username/agents/1/files/1627634819-document1.pdf",
      "mime_type": "application/pdf",
      "created_at": "2025-07-30T14:33:39Z",
      "updated_at": "2025-07-30T14:33:39Z"
    },
    {
      "id": 2,
      "agent_id": 1,
      "name": "document2",
      "file_name": "document2.png",
      "file_url": "https://storage.example.com/users/username/agents/1/files/1627634819-document2.png",
      "mime_type": "image/png",
      "created_at": "2025-07-30T14:33:39Z",
      "updated_at": "2025-07-30T14:33:39Z"
    }
  ],
  "message": "multiple files uploaded"
}
```

### 3. Get All File Sources for an Agent

**Endpoint:** `GET /sources/file/agent/:agentId`

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "agent_id": 1,
      "name": "document1",
      "file_name": "document1.pdf",
      "file_url": "https://storage.example.com/users/username/agents/1/files/1627634819-document1.pdf",
      "mime_type": "application/pdf",
      "created_at": "2025-07-30T14:33:39Z",
      "updated_at": "2025-07-30T14:33:39Z"
    },
    {
      "id": 2,
      "agent_id": 1,
      "name": "document2",
      "file_name": "document2.png",
      "file_url": "https://storage.example.com/users/username/agents/1/files/1627634819-document2.png",
      "mime_type": "image/png",
      "created_at": "2025-07-30T14:33:39Z",
      "updated_at": "2025-07-30T14:33:39Z"
    }
  ],
  "message": "findAllFileSources"
}
```

### 4. Get a Single File Source

**Endpoint:** `GET /sources/file/:id`

**Response:**

```json
{
  "data": {
    "id": 1,
    "agent_id": 1,
    "name": "document1",
    "file_name": "document1.pdf",
    "file_url": "https://storage.example.com/users/username/agents/1/files/1627634819-document1.pdf",
    "mime_type": "application/pdf",
    "created_at": "2025-07-30T14:33:39Z",
    "updated_at": "2025-07-30T14:33:39Z"
  },
  "message": "findOneFileSource"
}
```

### 5. Update a File Source Name

**Endpoint:** `PUT /sources/file/:id`

**Request Body:**

```json
{
  "name": "Updated document name"
}
```

**Note:** Only the file name can be updated. To update file content, you must create a new file source.

**Response:**

```json
{
  "data": {
    "id": 1,
    "agent_id": 1,
    "name": "Updated document name",
    "file_name": "document1.pdf",
    "file_url": "https://storage.example.com/users/username/agents/1/files/1627634819-document1.pdf",
    "mime_type": "application/pdf",
    "created_at": "2025-07-30T14:33:39Z",
    "updated_at": "2025-07-30T15:45:54Z"
  },
  "message": "updated"
}
```

### 6. Delete a File Source

**Endpoint:** `DELETE /sources/file/:id`

**Response:**

```json
{
  "message": "deleted"
}
```

## Notes

- File uploads use base64 encoding. The format should be `data:[MIME type];base64,[BASE64 ENCODED CONTENT]`
- Maximum file size: 10MB per file
- Maximum number of files per batch upload: 10
- File storage is organized in user-specific folders: `users/{username}/agents/{agentId}/files/`
- Files are automatically named with a timestamp prefix to avoid name collisions
- Supported file types:
  - Images: JPEG, JPG, PNG, GIF, WebP
  - Documents: PDF, TXT, DOC, DOCX

## Example Usage

### Single File Upload with JavaScript Fetch API

```javascript
/**
 * Upload a single file to the File Source API
 * @param {number} agentId - ID of the agent
 * @param {string} fileName - Name of the file
 * @param {string} base64String - Base64 encoded file with MIME type prefix
 * @returns {Promise<Object>} - Response data or error
 */
const uploadSingleFile = async (agentId, fileName, base64String) => {
  try {
    const response = await fetch("/api/v1/sources/file", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_JWT_TOKEN",
      },
      body: JSON.stringify({
        agent_id: agentId,
        name: fileName,
        file: base64String,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload file");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
```

### Multiple File Upload with JavaScript Fetch API

```javascript
/**
 * Upload multiple files to the File Source API
 * @param {number} agentId - ID of the agent
 * @param {Array<Object>} files - Array of file objects {name, base64String}
 * @returns {Promise<Object>} - Response data or error
 */
const uploadMultipleFiles = async (agentId, files) => {
  try {
    // Validate files before sending
    if (!files || files.length === 0) {
      throw new Error("No files provided");
    }

    if (files.length > 10) {
      throw new Error("Maximum 10 files allowed per batch upload");
    }

    // Ensure all files have required properties
    files.forEach((file) => {
      if (!file.name || !file.base64String) {
        throw new Error("Each file must have name and base64String properties");
      }
    });

    const response = await fetch("/api/v1/sources/file/multiple", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_JWT_TOKEN",
      },
      body: JSON.stringify({
        agent_id: agentId,
        files: files,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to upload files");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading multiple files:", error);
    throw error;
  }
};
```

### Converting a File to Base64

```javascript
/**
 * Convert a file to base64 string with MIME type prefix
 * @param {File} file - File object from file input
 * @returns {Promise<string>} - Base64 encoded file with MIME type prefix
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Example usage with file input element
document.getElementById("fileInput").addEventListener("change", async (e) => {
  try {
    const file = e.target.files[0];
    const base64String = await fileToBase64(file);
    console.log("File converted to base64:", base64String);
    // Now you can use this base64String with uploadSingleFile
  } catch (error) {
    console.error("Error converting file:", error);
  }
});
```

## Error Handling

The API returns appropriate HTTP status codes and error messages in case of failures:

- `400 Bad Request`: Invalid input data, file validation failure
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: File source or agent not found
- `413 Payload Too Large`: File size exceeds the maximum allowed (10MB)
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server-side error

**Example Error Response:**

```json
{
  "status": 400,
  "message": "Invalid file format. Only PDF, TXT, DOC, DOCX, JPEG, JPG, PNG, GIF, and WebP files are allowed."
}
```

## Best Practices

1. **Authentication**: Always include the JWT token in the Authorization header
2. **File Validation**: Validate file types and sizes on the client-side before uploading
3. **Error Handling**: Implement proper error handling to provide user feedback
4. **Batch Uploads**: For multiple files, use the batch upload endpoint instead of multiple single uploads
5. **Rate Limiting**: Be mindful of API rate limits and implement appropriate backoff strategies
6. **File Size**: Optimize large files before uploading to stay under the 10MB limit
7. **Base64 Encoding**: Use the correct MIME type in the base64 prefix for proper file handling

## Progress Monitoring

For larger files, consider implementing a progress indicator using XMLHttpRequest:

```javascript
const uploadFileWithProgress = (
  agentId,
  fileName,
  base64String,
  progressCallback
) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        progressCallback(percentComplete);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        try {
          reject(JSON.parse(xhr.responseText));
        } catch (e) {
          reject({ message: "Unknown error occurred" });
        }
      }
    });

    xhr.addEventListener("error", () => {
      reject({ message: "Network error occurred" });
    });

    xhr.open("POST", "/api/v1/sources/file");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer YOUR_JWT_TOKEN");

    const data = JSON.stringify({
      agent_id: agentId,
      name: fileName,
      file: base64String,
    });

    xhr.send(data);
  });
};
```
