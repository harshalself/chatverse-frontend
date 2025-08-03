import { apiClient, TokenManager } from "@/lib/client";
import { API_ENDPOINTS, APP_CONFIG } from "@/lib/constants";
import {
  FileSource,
  FileSourceUploadRequest,
  MultipleFilesUploadRequest,
} from "@/types/source.types";
import axios from "axios";

/**
 * File sources service for handling file-based sources
 */
export class FileSourcesService {
  /**
   * Upload a file source using the File Source API with multipart/form-data
   */
  static async uploadFileSource(
    agentId: number,
    file: File,
    name?: string,
    onProgress?: (progress: number) => void
  ): Promise<FileSource> {
    // Create FormData object
    const formData = new FormData();

    // Append file and other fields
    formData.append("file", file);
    formData.append("agent_id", agentId.toString());
    formData.append("name", name || file.name);

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
   * This method has been removed as we now use multipart/form-data
   * instead of base64 encoding for file uploads.
   */

  /**
   * Upload multiple file sources using the File Source API with multipart/form-data
   */
  static async uploadMultipleFileSources(
    agentId: number,
    files: File[],
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<FileSource[]> {
    if (files.length === 0) {
      return [];
    }

    if (files.length > 10) {
      throw new Error("Maximum 10 files allowed per batch upload");
    }

    // Create FormData object for multiple files
    const formData = new FormData();

    // Append agent_id
    formData.append("agent_id", agentId.toString());

    // Append each file with a unique key
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
      formData.append(`names[${index}]`, file.name);

      // Report initial progress
      if (onProgress) {
        onProgress(index, 0);
      }
    });

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
    const response = await apiClient.get(
      API_ENDPOINTS.SOURCES.FILE.GET_ALL(agentId)
    );
    return response.data;
  }

  /**
   * Get a single file source by ID
   */
  static async getFileSource(id: number): Promise<FileSource> {
    const response = await apiClient.get(API_ENDPOINTS.SOURCES.FILE.GET(id));
    return response.data;
  }

  /**
   * Update a file source name
   */
  static async updateFileSource(id: number, name: string): Promise<FileSource> {
    const response = await apiClient.put(
      API_ENDPOINTS.SOURCES.FILE.UPDATE(id),
      { name }
    );
    return response.data;
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
    const response = await axios.get(
      `${APP_CONFIG.apiBaseUrl}/sources/file/${id}/export?format=${format}`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${TokenManager.getToken()}`,
        },
      }
    );
    return response.data;
  }
}
