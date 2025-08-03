import { apiClient } from "@/lib/client";
import { API_ENDPOINTS } from "@/lib/constants";

export interface ProviderModel {
  id: number;
  provider: string;
  model_name: string;
  created_by: number;
  created_at: string;
  updated_by: number | null;
  updated_at: string;
  is_deleted: boolean;
  deleted_by: number | null;
  deleted_at: string | null;
}

export class ProviderModelsService {
  /**
   * Get all provider models - use this to get list of available providers
   */
  static async getAllModels(): Promise<{ data: ProviderModel[]; message: string }> {
    return apiClient.get(API_ENDPOINTS.PROVIDER_MODELS.ALL);
  }

  /**
   * Get models by provider
   */
  static async getModelsByProvider(provider: string): Promise<{ data: ProviderModel[]; message: string }> {
    return apiClient.get(API_ENDPOINTS.PROVIDER_MODELS.BY_PROVIDER(provider));
  }
}
