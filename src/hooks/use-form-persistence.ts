/**
 * Form Persistence Hooks
 * Auto-save and restore form data
 */

import { useEffect, useCallback, useRef } from "react";

// Simple localStorage wrapper for form drafts
const formDraftStorage = {
  getDraft: (formId: string) => {
    try {
      const draft = localStorage.getItem(`form_draft_${formId}`);
      return draft ? JSON.parse(draft) : null;
    } catch {
      return null;
    }
  },

  saveDraft: (formId: string, data: any) => {
    try {
      localStorage.setItem(
        `form_draft_${formId}`,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
      return true;
    } catch {
      return false;
    }
  },

  removeDraft: (formId: string) => {
    try {
      localStorage.removeItem(`form_draft_${formId}`);
      return true;
    } catch {
      return false;
    }
  },

  getAllDrafts: () => {
    try {
      const drafts: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("form_draft_")) {
          const formId = key.replace("form_draft_", "");
          const draft = localStorage.getItem(key);
          if (draft) {
            drafts[formId] = JSON.parse(draft);
          }
        }
      }
      return drafts;
    } catch {
      return {};
    }
  },

  clearAllDrafts: () => {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("form_draft_")) {
          keys.push(key);
        }
      }
      keys.forEach((key) => localStorage.removeItem(key));
      return true;
    } catch {
      return false;
    }
  },
};

interface UseFormPersistenceOptions {
  formId: string;
  autoSave?: boolean;
  autoSaveDelay?: number; // in milliseconds
  onDraftLoaded?: (data: any) => void;
  onDraftSaved?: (data: any) => void;
  onDraftCleared?: () => void;
}

export function useFormPersistence(options: UseFormPersistenceOptions) {
  const {
    formId,
    autoSave = true,
    autoSaveDelay = 2000,
    onDraftLoaded,
    onDraftSaved,
    onDraftCleared,
  } = options;

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>("");

  /**
   * Load draft data from storage
   */
  const loadDraft = useCallback(() => {
    const draft = formDraftStorage.getDraft(formId);
    if (draft) {
      onDraftLoaded?.(draft);
      return draft;
    }
    return null;
  }, [formId, onDraftLoaded]);

  /**
   * Save draft data to storage
   */
  const saveDraft = useCallback(
    (data: any) => {
      const dataString = JSON.stringify(data);

      // Don't save if data hasn't changed
      if (dataString === lastSavedDataRef.current) {
        return;
      }

      const success = formDraftStorage.saveDraft(formId, data);
      if (success) {
        lastSavedDataRef.current = dataString;
        onDraftSaved?.(data);
      }
      return success;
    },
    [formId, onDraftSaved]
  );

  /**
   * Clear draft data from storage
   */
  const clearDraft = useCallback(() => {
    const success = formDraftStorage.removeDraft(formId);
    if (success) {
      lastSavedDataRef.current = "";
      onDraftCleared?.();
    }
    return success;
  }, [formId, onDraftCleared]);

  /**
   * Auto-save with debouncing
   */
  const autoSaveDraft = useCallback(
    (data: any) => {
      if (!autoSave) return;

      // Clear previous timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Set new timeout
      autoSaveTimeoutRef.current = setTimeout(() => {
        saveDraft(data);
      }, autoSaveDelay);
    },
    [autoSave, autoSaveDelay, saveDraft]
  );

  /**
   * Check if draft exists
   */
  const hasDraft = useCallback(() => {
    return formDraftStorage.getDraft(formId) !== null;
  }, [formId]);

  /**
   * Get draft age in minutes
   */
  const getDraftAge = useCallback(() => {
    const drafts = formDraftStorage.getAllDrafts();
    const draft = drafts[formId];
    if (draft?.timestamp) {
      return Math.floor((Date.now() - draft.timestamp) / (1000 * 60));
    }
    return null;
  }, [formId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  return {
    loadDraft,
    saveDraft,
    clearDraft,
    autoSaveDraft,
    hasDraft,
    getDraftAge,
  };
}

/**
 * Hook for managing multiple form drafts
 */
export function useFormDraftManager() {
  const getAllDrafts = useCallback(() => {
    return formDraftStorage.getAllDrafts();
  }, []);

  const clearAllDrafts = useCallback(() => {
    return formDraftStorage.clearAllDrafts();
  }, []);

  const getDraftCount = useCallback(() => {
    const drafts = getAllDrafts();
    return Object.keys(drafts).length;
  }, [getAllDrafts]);

  const getOldDrafts = useCallback(
    (olderThanDays: number = 7) => {
      const drafts = getAllDrafts();
      const cutoffTime = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;

      return Object.entries(drafts).filter(([_, draft]) => {
        return draft.timestamp < cutoffTime;
      });
    },
    [getAllDrafts]
  );

  const cleanupOldDrafts = useCallback(
    (olderThanDays: number = 7) => {
      const oldDrafts = getOldDrafts(olderThanDays);

      oldDrafts.forEach(([formId, _]) => {
        formDraftStorage.removeDraft(formId);
      });

      return oldDrafts.length;
    },
    [getOldDrafts]
  );

  return {
    getAllDrafts,
    clearAllDrafts,
    getDraftCount,
    getOldDrafts,
    cleanupOldDrafts,
  };
}

/**
 * Hook for React Hook Form integration
 */
export function useFormPersistenceWithRHF(formId: string, form: any) {
  const { loadDraft, saveDraft, clearDraft, autoSaveDraft, hasDraft } =
    useFormPersistence({
      formId,
      onDraftLoaded: (data) => {
        Object.keys(data).forEach((key) => {
          form.setValue(key, data[key]);
        });
      },
    });

  // Watch form changes for auto-save
  useEffect(() => {
    const subscription = form.watch((data: any) => {
      autoSaveDraft(data);
    });

    return () => subscription.unsubscribe();
  }, [form.watch, autoSaveDraft]);

  // Load draft on mount
  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  return {
    saveDraft: () => saveDraft(form.getValues()),
    clearDraft,
    hasDraft,
  };
}
