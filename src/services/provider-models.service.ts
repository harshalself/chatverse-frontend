import { apiClient } from "@/lib/client";
import { API_ENDPOINTS } from "@/lib/constants";
import {
  ProviderModel,
  CreateProviderModelRequest,
  UpdateProviderModelRequest,
} from "@/types/common.types";
import {
  ProviderModelResponse,
  ProviderModelsResponse,
} from "@/types/api.types";

export class ProviderModelsService {
  /**
   * Get all provider models
   */
  static async getAllModels(): Promise<ProviderModel[]> {
    try {
      const response = await apiClient.get<ProviderModelsResponse>(
        API_ENDPOINTS.PROVIDER_MODELS.ALL
      );
      const result = (response as any)?.data || [];
      return result;
    } catch (error) {
      return [];
    }
  }

  /**
   * Get models by provider
   */
  static async getModelsByProvider(provider: string): Promise<ProviderModel[]> {
    try {
      const response = await apiClient.get<ProviderModelsResponse>(
        API_ENDPOINTS.PROVIDER_MODELS.BY_PROVIDER(provider)
      );
      const result = (response as any)?.data || [];
      return result;
    } catch (error) {
      return [];
    }
  }

  /**
   * Get provider model by ID
   */
  static async getModel(id: number): Promise<ProviderModel> {
    const response = await apiClient.get<ProviderModelResponse>(
      API_ENDPOINTS.PROVIDER_MODELS.GET(id)
    );
    return response.data.data;
  }

  /**
   * Create a new provider model
   */
  static async createModel(
    request: CreateProviderModelRequest
  ): Promise<ProviderModel> {
    const response = await apiClient.post<ProviderModelResponse>(
      API_ENDPOINTS.PROVIDER_MODELS.CREATE,
      request
    );
    return response.data.data;
  }

  /**
   * Update a provider model
   */
  static async updateModel(
    id: number,
    request: UpdateProviderModelRequest
  ): Promise<ProviderModel> {
    const response = await apiClient.put<ProviderModelResponse>(
      API_ENDPOINTS.PROVIDER_MODELS.UPDATE(id),
      request
    );
    return response.data.data;
  }

  /**
   * Delete a provider model
   */
  static async deleteModel(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.PROVIDER_MODELS.DELETE(id));
  }
}
