import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/constants";
import { DatabaseSource, DatabaseSourceRequest } from "@/types/source.types";

/**
 * Database sources service for handling database-based sources
 */
export class DatabaseSourcesService {
  /**
   * Create a new database source
   */
  static async createDatabaseSource(
    agentId: number,
    data: DatabaseSourceRequest
  ): Promise<DatabaseSource> {
    const payload = {
      agent_id: agentId,
      ...data
    };
    
    const response = await apiClient.post(
      API_ENDPOINTS.SOURCES.DATABASE.CREATE,
      payload
    );
    return response.data;
  }

  /**
   * Test database connection
   */
  static async testDatabaseConnection(connectionString: string): Promise<{
    connected: boolean;
    tables?: string[];
    error?: string;
  }> {
    return apiClient.post(API_ENDPOINTS.SOURCES.DATABASE.TEST, { connectionString });
  }

  /**
   * Get all database sources for an agent
   */
  static async getDatabaseSources(agentId: number): Promise<DatabaseSource[]> {
    const response = await apiClient.get(
      API_ENDPOINTS.SOURCES.DATABASE.GET_ALL(agentId)
    );
    return response.data;
  }

  /**
   * Get a single database source by ID
   */
  static async getDatabaseSource(id: number): Promise<DatabaseSource> {
    const response = await apiClient.get(API_ENDPOINTS.SOURCES.DATABASE.GET(id));
    return response.data;
  }

  /**
   * Update a database source
   */
  static async updateDatabaseSource(
    id: number, 
    data: Partial<DatabaseSourceRequest>
  ): Promise<DatabaseSource> {
    const response = await apiClient.put(
      API_ENDPOINTS.SOURCES.DATABASE.UPDATE(id),
      data
    );
    return response.data;
  }

  /**
   * Delete a database source
   */
  static async deleteDatabaseSource(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.SOURCES.DATABASE.DELETE(id));
  }
}
