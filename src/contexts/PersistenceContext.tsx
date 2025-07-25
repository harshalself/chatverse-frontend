/**
 * Persistence Context
 * Coordinates localStorage, form drafts, and workspace state
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  storage,
  tokenStorage,
  formDraftStorage,
  workspaceStorage,
} from "../lib/storage";
import { useOfflineQueue } from "../lib/offline-queue";

interface PersistenceContextType {
  // Storage info
  storageInfo: Record<string, number> | null;
  storageAvailable: boolean;

  // Token management
  tokens: {
    authToken: string | null;
    refreshToken: string | null;
  };
  setTokens: (authToken: string, refreshToken?: string) => void;
  clearTokens: () => void;

  // Draft management
  draftCount: number;
  hasDrafts: boolean;
  clearAllDrafts: () => void;
  cleanupOldDrafts: (olderThanDays?: number) => number;

  // Workspace state
  workspaceState: any;
  saveWorkspaceState: (state: any) => void;
  clearWorkspaceState: () => void;

  // Offline queue
  offlineStatus: {
    isOnline: boolean;
    queueLength: number;
    isProcessing: boolean;
    highPriorityCount: number;
    mediumPriorityCount: number;
    lowPriorityCount: number;
  };
  clearOfflineQueue: () => void;

  // Storage management
  clearAllStorage: () => void;
  exportData: () => string;
  importData: (data: string) => boolean;
}

const PersistenceContext = createContext<PersistenceContextType | undefined>(
  undefined
);

export { PersistenceContext };

export function PersistenceProvider({ children }: { children: ReactNode }) {
  const [storageInfo, setStorageInfo] = useState<Record<string, number> | null>(
    null
  );
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [tokens, setTokensState] = useState({
    authToken: tokenStorage.getAuthToken(),
    refreshToken: tokenStorage.getRefreshToken(),
  });
  const [draftCount, setDraftCount] = useState(0);
  const [workspaceState, setWorkspaceStateLocal] = useState(
    workspaceStorage.getState()
  );

  const { getStatus: getOfflineStatus, clearQueue: clearOfflineQueue } =
    useOfflineQueue();

  // Update storage info periodically
  useEffect(() => {
    const updateStorageInfo = () => {
      try {
        const info = storage.getStorageInfo();
        setStorageInfo(info);
        setStorageAvailable(true);
      } catch (error) {
        console.warn("Storage not available:", error);
        setStorageAvailable(false);
      }
    };

    updateStorageInfo();
    const interval = setInterval(updateStorageInfo, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // Update draft count
  useEffect(() => {
    const updateDraftCount = () => {
      const drafts = formDraftStorage.getAllDrafts();
      setDraftCount(Object.keys(drafts).length);
    };

    updateDraftCount();

    // Listen for storage changes (from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes("agentflow-form-drafts")) {
        updateDraftCount();
      }
      if (
        e.key?.includes("agentflow-auth-token") ||
        e.key?.includes("agentflow-refresh-token")
      ) {
        setTokensState({
          authToken: tokenStorage.getAuthToken(),
          refreshToken: tokenStorage.getRefreshToken(),
        });
      }
      if (e.key?.includes("agentflow-workspace-state")) {
        setWorkspaceStateLocal(workspaceStorage.getState());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const setTokens = (authToken: string, refreshToken?: string) => {
    tokenStorage.setAuthToken(authToken);
    if (refreshToken) {
      tokenStorage.setRefreshToken(refreshToken);
    }
    setTokensState({
      authToken,
      refreshToken: refreshToken || tokens.refreshToken,
    });
  };

  const clearTokens = () => {
    tokenStorage.clearTokens();
    setTokensState({
      authToken: null,
      refreshToken: null,
    });
  };

  const clearAllDrafts = () => {
    formDraftStorage.clearAllDrafts();
    setDraftCount(0);
  };

  const cleanupOldDrafts = (olderThanDays: number = 7) => {
    const drafts = formDraftStorage.getAllDrafts();
    const cutoffTime = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;
    let cleaned = 0;

    Object.entries(drafts).forEach(([formId, draft]) => {
      if (draft.timestamp < cutoffTime) {
        formDraftStorage.removeDraft(formId);
        cleaned++;
      }
    });

    setDraftCount(Object.keys(formDraftStorage.getAllDrafts()).length);
    return cleaned;
  };

  const saveWorkspaceState = (state: any) => {
    workspaceStorage.saveState(state);
    setWorkspaceStateLocal(state);
  };

  const clearWorkspaceState = () => {
    workspaceStorage.clearState();
    setWorkspaceStateLocal(null);
  };

  const clearAllStorage = () => {
    storage.clearAll();
    setTokensState({ authToken: null, refreshToken: null });
    setDraftCount(0);
    setWorkspaceStateLocal(null);
    clearOfflineQueue();
  };

  const exportData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      preferences: storage.getItem("agentflow-preferences"),
      drafts: formDraftStorage.getAllDrafts(),
      workspaceState: workspaceStorage.getState(),
      // Note: We don't export tokens for security reasons
    };

    return JSON.stringify(data, null, 2);
  };

  const importData = (dataString: string) => {
    try {
      const data = JSON.parse(dataString);

      // Validate data structure
      if (!data.timestamp || !data.version) {
        throw new Error("Invalid data format");
      }

      // Import preferences
      if (data.preferences) {
        storage.setItem("agentflow-preferences", data.preferences);
      }

      // Import drafts
      if (data.drafts) {
        Object.entries(data.drafts).forEach(([formId, draft]) => {
          formDraftStorage.saveDraft(formId, (draft as any).data);
        });
        setDraftCount(Object.keys(data.drafts).length);
      }

      // Import workspace state
      if (data.workspaceState) {
        saveWorkspaceState(data.workspaceState);
      }

      return true;
    } catch (error) {
      console.error("Failed to import data:", error);
      return false;
    }
  };

  const value: PersistenceContextType = {
    storageInfo,
    storageAvailable,
    tokens,
    setTokens,
    clearTokens,
    draftCount,
    hasDrafts: draftCount > 0,
    clearAllDrafts,
    cleanupOldDrafts,
    workspaceState,
    saveWorkspaceState,
    clearWorkspaceState,
    offlineStatus: getOfflineStatus(),
    clearOfflineQueue,
    clearAllStorage,
    exportData,
    importData,
  };

  return (
    <PersistenceContext.Provider value={value}>
      {children}
    </PersistenceContext.Provider>
  );
}

export function usePersistence() {
  const context = useContext(PersistenceContext);
  if (context === undefined) {
    throw new Error("usePersistence must be used within a PersistenceProvider");
  }
  return context;
}

// Convenience hooks
export function useTokenPersistence() {
  const { tokens, setTokens, clearTokens } = usePersistence();
  return { tokens, setTokens, clearTokens };
}

export function useDraftPersistence() {
  const { draftCount, hasDrafts, clearAllDrafts, cleanupOldDrafts } =
    usePersistence();
  return { draftCount, hasDrafts, clearAllDrafts, cleanupOldDrafts };
}

export function useWorkspacePersistence() {
  const { workspaceState, saveWorkspaceState, clearWorkspaceState } =
    usePersistence();
  return { workspaceState, saveWorkspaceState, clearWorkspaceState };
}

export function useOfflinePersistence() {
  const { offlineStatus, clearOfflineQueue } = usePersistence();
  return { offlineStatus, clearOfflineQueue };
}
