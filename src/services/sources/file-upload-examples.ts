/**
 * file-upload-examples.ts
 * This file demonstrates the correct format for file upload requests with the FileSourcesService
 * using multipart/form-data
 */

import { API_ENDPOINTS, APP_CONFIG } from "@/lib/constants";
import axios from "axios";
import { TokenManager } from "@/lib/api/client";
import { FileSourcesService } from "../sources";

/**
 * Common file types and extensions for reference:
 * - PDF: .pdf
 * - JPEG/JPG: .jpg, .jpeg
 * - PNG: .png
 * - Word: .docx
 * - Excel: .xlsx
 * - Text: .txt
 */

// Example usage with FileSourcesService using multipart/form-data
async function exampleFileUpload(agentId: number, file: File) {
  // Using the FileSourcesService with File object (recommended approach)
  // This automatically handles form data creation and submission

  // Call the service method with your file
  const uploadedFile = await FileSourcesService.uploadFileSource(
    agentId,
    file,
    file.name, // Optional custom name
    (progress) => console.log(`Upload progress: ${progress}%`)
  );

  console.log("File uploaded successfully:", uploadedFile);
}

// Manual multipart/form-data approach (direct API usage example)
async function manualFormDataUpload(agentId: number, file: File) {
  // Create FormData object
  const formData = new FormData();

  // Append file
  formData.append("file", file);

  // Append other fields
  formData.append("agent_id", agentId.toString());
  formData.append("name", file.name);

  // Send the request using axios
  const response = await axios.post(
    `${APP_CONFIG.apiBaseUrl}${API_ENDPOINTS.SOURCES.FILE.UPLOAD}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${TokenManager.getToken()}`,
      },
      onUploadProgress: (progressEvent) => {
        const progress = progressEvent.total
          ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
          : 0;
        console.log(`Upload progress: ${progress}%`);
      },
    }
  );

  return response.data;
}

// Multiple files upload example
async function multipleFilesUpload(agentId: number, files: File[]) {
  // Using the service method (recommended)
  const uploadedFiles = await FileSourcesService.uploadMultipleFileSources(
    agentId,
    files,
    (fileIndex, progress) =>
      console.log(`File ${fileIndex + 1} progress: ${progress}%`)
  );

  console.log(`${uploadedFiles.length} files uploaded successfully`);
}

// Testing with Postman example (manual form-data submission)
/*
In Postman:
1. Create a new POST request to your API endpoint (e.g., http://localhost:8000/api/v1/sources/file)
2. Go to the "Body" tab
3. Select "form-data"
4. Add your key-value pairs:
   - agent_id: 123
   - name: My Document
   - file: [Select File] (change the type dropdown from "Text" to "File" and browse for your file)
5. Set your Authorization header with the token
6. Send the request
*/
