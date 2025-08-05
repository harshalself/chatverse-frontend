import { apiClient, TokenManager } from "@/lib/client";
import { API_ENDPOINTS, APP_CONFIG, UI_CONSTANTS } from "@/lib/constants";
import {
  FileSource,
  FileSourceUploadRequest,
  MultipleFilesUploadRequest,
  UpdateFileSourceRequest,
  FileSourceResponse,
  FileSourcesResponse,
} from "@/types/source.types";
import axios from "axios";

/**
 * File validation utilities
 */
export class FileValidationUtils {
  static validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file size
    if (file.size > UI_CONSTANTS.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size exceeds ${
          UI_CONSTANTS.MAX_FILE_SIZE / (1024 * 1024)
        }MB limit`,
      };
    }

    // Check file type
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!UI_CONSTANTS.SUPPORTED_FILE_TYPES.includes(fileExtension as any)) {
      return {
        isValid: false,
        error: `Unsupported file type. Supported: ${UI_CONSTANTS.SUPPORTED_FILE_TYPES.join(
          ", "
        )}`,
      };
    }

    // Check MIME type if available
    if (
      file.type &&
      !UI_CONSTANTS.SUPPORTED_MIME_TYPES.includes(file.type as any)
    ) {
      return {
        isValid: false,
        error: `Unsupported MIME type: ${file.type}`,
      };
    }

    return { isValid: true };
  }

  static validateMultipleFiles(files: File[]): {
    isValid: boolean;
    error?: string;
  } {
    if (files.length === 0) {
      return { isValid: false, error: "No files provided" };
    }

    if (files.length > UI_CONSTANTS.MAX_FILES_PER_UPLOAD) {
      return {
        isValid: false,
        error: `Maximum ${UI_CONSTANTS.MAX_FILES_PER_UPLOAD} files allowed per upload`,
      };
    }

    // Validate each file
    for (const file of files) {
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return { isValid: false, error: `${file.name}: ${validation.error}` };
      }
    }

    return { isValid: true };
  }
}

/**
 * File sources service for handling file-based sources using multipart/form-data
 */
export class FileSourcesService {
  /**
   * Upload a single file source using multipart/form-data
   */
  static async uploadFileSource(
    agentId: number,
    file: File,
    name?: string,
    description?: string,
    onProgress?: (progress: number) => void
  ): Promise<FileSource> {
    // Validate file before upload
    const validation = FileValidationUtils.validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    // Create FormData object
    const formData = new FormData();

    // Append required fields
    formData.append("agent_id", agentId.toString());
    formData.append("name", name || file.name);
    formData.append("file", file);

    // Append optional description
    if (description) {
      formData.append("description", description);
    }

    const response = await axios.post(
      `${APP_CONFIG.apiBaseUrl}${API_ENDPOINTS.SOURCES.FILE.UPLOAD}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${TokenManager.getToken()}`,
        },
        onUploadProgress: onProgress
          ? (progressEvent) => {
              const progress = progressEvent.total
                ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
                : 0;
              onProgress(progress);
            }
          : undefined,
      }
    );
    return response.data.data;
  }

  /**
   * Upload multiple file sources using multipart/form-data
   */
  static async uploadMultipleFileSources(
    agentId: number,
    files: File[],
    names: string[],
    descriptions?: string[],
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<FileSource[]> {
    // Validate files before upload
    const validation = FileValidationUtils.validateMultipleFiles(files);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    if (names.length !== files.length) {
      throw new Error("Names array must match files array length");
    }

    if (descriptions && descriptions.length !== files.length) {
      throw new Error(
        "Descriptions array must match files array length if provided"
      );
    }

    // Create FormData object for multiple files
    const formData = new FormData();

    // Append agent_id
    formData.append("agent_id", agentId.toString());

    // Append files array
    files.forEach((file, index) => {
      formData.append("files", file);
    });

    // Append names array
    names.forEach((name, index) => {
      formData.append("names", name);
    });

    // Append descriptions array if provided
    if (descriptions) {
      descriptions.forEach((description, index) => {
        formData.append("descriptions", description);
      });
    }

    const response = await axios.post(
      `${APP_CONFIG.apiBaseUrl}${API_ENDPOINTS.SOURCES.FILE.UPLOAD_MULTIPLE}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${TokenManager.getToken()}`,
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const overallProgress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            // Distribute progress across all files
            files.forEach((_, index) => {
              onProgress(index, overallProgress);
            });
          }
        },
      }
    );

    // Report completion for all files
    if (onProgress) {
      files.forEach((_, index) => onProgress(index, 100));
    }

    return response.data.data;
  }

  /**
   * Get all file sources for an agent
   */
  static async getFileSources(agentId: number): Promise<FileSource[]> {
    const response = await apiClient.get<FileSourcesResponse>(
      API_ENDPOINTS.SOURCES.FILE.GET_ALL(agentId)
    );
    // Ensure we always return an array, even if the response is undefined/null
    return response.data?.data || [];
  }

  /**
   * Get a single file source by ID
   */
  static async getFileSource(id: number): Promise<FileSource> {
    const response = await apiClient.get<FileSourceResponse>(
      API_ENDPOINTS.SOURCES.FILE.GET(id)
    );
    return response.data.data;
  }

  /**
   * Update a file source
   */
  static async updateFileSource(
    id: number,
    data: UpdateFileSourceRequest
  ): Promise<FileSource> {
    const response = await apiClient.put<FileSourceResponse>(
      API_ENDPOINTS.SOURCES.FILE.UPDATE(id),
      data
    );
    return response.data.data;
  }

  /**
   * Delete a file source
   */
  static async deleteFileSource(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.SOURCES.FILE.DELETE(id));
  }

  /**
   * Export file source data
   */
  static async exportFileSource(
    id: number,
    format: "json" | "csv" | "txt" = "json"
  ): Promise<Blob> {
    // Since the backend doesn't have export endpoint yet, we'll implement client-side export
    // First get the file source data
    const fileSource = await this.getFileSource(id);

    let content = "";
    let mimeType = "";

    switch (format) {
      case "json":
        content = JSON.stringify(fileSource, null, 2);
        mimeType = "application/json";
        break;
      case "csv":
        // Simple CSV export of file metadata
        const headers = [
          "ID",
          "Name",
          "File Size",
          "MIME Type",
          "Status",
          "Created At",
        ];
        const values = [
          fileSource.id,
          fileSource.name || "Unknown",
          fileSource.file_size || 0,
          fileSource.mime_type || "Unknown",
          fileSource.status || "Unknown",
          fileSource.created_at || "Unknown",
        ];
        content =
          headers.join(",") + "\n" + values.map((v) => `"${v}"`).join(",");
        mimeType = "text/csv";
        break;
      case "txt":
        content = `File Source Export\n\nID: ${fileSource.id}\nName: ${
          fileSource.name || "Unknown"
        }\nFile Size: ${fileSource.file_size || 0} bytes\nMIME Type: ${
          fileSource.mime_type || "Unknown"
        }\nStatus: ${fileSource.status || "Unknown"}\nCreated: ${
          fileSource.created_at || "Unknown"
        }\nUpdated: ${fileSource.updated_at || "Unknown"}`;
        mimeType = "text/plain";
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }

    return new Blob([content], { type: mimeType });
  }
}
