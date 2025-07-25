/**
 * Local Storage Utilities
 * Provides type-safe localStorage operations with fallbacks
 */

// Storage keys constants
export const STORAGE_KEYS = {
  AUTH_TOKEN: "agentflow-auth-token",
  REFRESH_TOKEN: "agentflow-refresh-token",
  USER_PREFERENCES: "agentflow-preferences",
  FORM_DRAFTS: "agentflow-form-drafts",
  WORKSPACE_STATE: "agentflow-workspace-state",
  OFFLINE_QUEUE: "agentflow-offline-queue",
  CACHE_TIMESTAMP: "agentflow-cache-timestamp",
} as const;

// Type for storage keys
export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

interface StorageData {
  value: any;
  timestamp: number;
  expiresAt?: number;
}

class LocalStorageManager {
  private isAvailable(): boolean {
    try {
      const test = "__localStorage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Set item in localStorage with optional expiration
   */
  setItem<T>(key: StorageKey, value: T, expirationMinutes?: number): boolean {
    if (!this.isAvailable()) {
      console.warn("localStorage is not available");
      return false;
    }

    try {
      const data: StorageData = {
        value,
        timestamp: Date.now(),
        expiresAt: expirationMinutes
          ? Date.now() + expirationMinutes * 60 * 1000
          : undefined,
      };

      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Failed to set localStorage item ${key}:`, error);
      return false;
    }
  }

  /**
   * Get item from localStorage with expiration check
   */
  getItem<T>(key: StorageKey): T | null {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const data: StorageData = JSON.parse(item);

      // Check if item has expired
      if (data.expiresAt && Date.now() > data.expiresAt) {
        this.removeItem(key);
        return null;
      }

      return data.value;
    } catch (error) {
      console.error(`Failed to get localStorage item ${key}:`, error);
      return null;
    }
  }

  /**
   * Remove item from localStorage
   */
  removeItem(key: StorageKey): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove localStorage item ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all AgentFlow related items
   */
  clearAll(): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        this.removeItem(key);
      });
      return true;
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
      return false;
    }
  }

  /**
   * Get storage usage information
   */
  getStorageInfo() {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const usage = Object.values(STORAGE_KEYS).reduce(
        (acc, key) => {
          const item = localStorage.getItem(key);
          acc[key] = item ? item.length : 0;
          acc.total += acc[key];
          return acc;
        },
        { total: 0 } as Record<string, number>
      );

      return usage;
    } catch (error) {
      console.error("Failed to get storage info:", error);
      return null;
    }
  }

  /**
   * Check if an item exists and is not expired
   */
  hasItem(key: StorageKey): boolean {
    return this.getItem(key) !== null;
  }
}

// Create singleton instance
export const storage = new LocalStorageManager();

// Convenience functions for specific data types
export const tokenStorage = {
  setAuthToken: (token: string, expirationMinutes?: number) =>
    storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token, expirationMinutes),

  getAuthToken: () => storage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN),

  setRefreshToken: (token: string) =>
    storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token),

  getRefreshToken: () => storage.getItem<string>(STORAGE_KEYS.REFRESH_TOKEN),

  clearTokens: () => {
    storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  },
};

export const formDraftStorage = {
  saveDraft: (formId: string, data: any) => {
    const drafts =
      storage.getItem<Record<string, any>>(STORAGE_KEYS.FORM_DRAFTS) || {};
    drafts[formId] = {
      data,
      timestamp: Date.now(),
    };
    return storage.setItem(STORAGE_KEYS.FORM_DRAFTS, drafts);
  },

  getDraft: (formId: string) => {
    const drafts =
      storage.getItem<Record<string, any>>(STORAGE_KEYS.FORM_DRAFTS) || {};
    return drafts[formId]?.data || null;
  },

  removeDraft: (formId: string) => {
    const drafts =
      storage.getItem<Record<string, any>>(STORAGE_KEYS.FORM_DRAFTS) || {};
    delete drafts[formId];
    return storage.setItem(STORAGE_KEYS.FORM_DRAFTS, drafts);
  },

  getAllDrafts: () =>
    storage.getItem<Record<string, any>>(STORAGE_KEYS.FORM_DRAFTS) || {},

  clearAllDrafts: () => storage.removeItem(STORAGE_KEYS.FORM_DRAFTS),
};

export const workspaceStorage = {
  saveState: (state: any) =>
    storage.setItem(STORAGE_KEYS.WORKSPACE_STATE, state),

  getState: () => storage.getItem<any>(STORAGE_KEYS.WORKSPACE_STATE),

  clearState: () => storage.removeItem(STORAGE_KEYS.WORKSPACE_STATE),
};
