/**
 * Offline Queue Manager
 * Handles queuing and retrying API requests when offline
 */

import { storage, STORAGE_KEYS } from "./storage";

export interface QueuedRequest {
  id: string;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: any;
  headers?: Record<string, string>;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  priority: "low" | "medium" | "high";
}

class OfflineQueueManager {
  private queue: QueuedRequest[] = [];
  private isOnline: boolean = navigator.onLine;
  private isProcessing: boolean = false;
  private readonly maxQueueSize = 100;
  private readonly retryDelays = [1000, 3000, 5000, 10000]; // in ms

  constructor() {
    this.loadQueue();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.processQueue();
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
    });
  }

  private loadQueue() {
    const stored = storage.getItem<QueuedRequest[]>(STORAGE_KEYS.OFFLINE_QUEUE);
    if (stored) {
      this.queue = stored;
    }
  }

  private saveQueue() {
    storage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, this.queue);
  }

  /**
   * Add request to offline queue
   */
  addRequest(
    request: Omit<QueuedRequest, "id" | "timestamp" | "retryCount">
  ): string {
    if (this.queue.length >= this.maxQueueSize) {
      // Remove oldest low priority items
      this.queue = this.queue
        .filter((item) => item.priority !== "low")
        .slice(-this.maxQueueSize + 1);
    }

    const queuedRequest: QueuedRequest = {
      ...request,
      id: this.generateId(),
      timestamp: Date.now(),
      retryCount: 0,
    };

    // Insert based on priority
    const insertIndex = this.queue.findIndex((item) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return (
        priorityOrder[item.priority] < priorityOrder[queuedRequest.priority]
      );
    });

    if (insertIndex === -1) {
      this.queue.push(queuedRequest);
    } else {
      this.queue.splice(insertIndex, 0, queuedRequest);
    }

    this.saveQueue();

    // Try to process immediately if online
    if (this.isOnline) {
      this.processQueue();
    }

    return queuedRequest.id;
  }

  /**
   * Remove request from queue
   */
  removeRequest(id: string): boolean {
    const index = this.queue.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.queue.splice(index, 1);
      this.saveQueue();
      return true;
    }
    return false;
  }

  /**
   * Get queue status
   */
  getQueueStatus() {
    return {
      isOnline: this.isOnline,
      isProcessing: this.isProcessing,
      queueLength: this.queue.length,
      highPriorityCount: this.queue.filter((item) => item.priority === "high")
        .length,
      mediumPriorityCount: this.queue.filter(
        (item) => item.priority === "medium"
      ).length,
      lowPriorityCount: this.queue.filter((item) => item.priority === "low")
        .length,
    };
  }

  /**
   * Clear all queued requests
   */
  clearQueue(): void {
    this.queue = [];
    this.saveQueue();
  }

  /**
   * Process queued requests when online
   */
  private async processQueue(): Promise<void> {
    if (!this.isOnline || this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0 && this.isOnline) {
      const request = this.queue[0];

      try {
        await this.executeRequest(request);
        this.removeRequest(request.id);
      } catch (error) {
        console.error("Failed to execute queued request:", error);

        request.retryCount++;

        if (request.retryCount >= request.maxRetries) {
          // Remove failed request after max retries
          this.removeRequest(request.id);
        } else {
          // Move to end of queue for retry
          this.queue.shift();
          this.queue.push(request);
          this.saveQueue();

          // Wait before processing next request
          const delay =
            this.retryDelays[
              Math.min(request.retryCount - 1, this.retryDelays.length - 1)
            ];
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    this.isProcessing = false;
  }

  /**
   * Execute a queued request
   */
  private async executeRequest(request: QueuedRequest): Promise<any> {
    const { url, method, data, headers } = request;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Generate unique ID for requests
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Check if we should queue this request
   */
  shouldQueue(method: string, url: string): boolean {
    // Don't queue GET requests (they're not critical for offline)
    if (method === "GET") return false;

    // Don't queue authentication requests (handle differently)
    if (url.includes("/auth/")) return false;

    // Queue if offline or if specifically requested
    return !this.isOnline;
  }
}

// Create singleton instance
export const offlineQueue = new OfflineQueueManager();

// Hook for React components
export function useOfflineQueue() {
  const addToQueue = (
    request: Omit<QueuedRequest, "id" | "timestamp" | "retryCount">
  ) => {
    return offlineQueue.addRequest(request);
  };

  const getStatus = () => offlineQueue.getQueueStatus();
  const clearQueue = () => offlineQueue.clearQueue();

  return {
    addToQueue,
    getStatus,
    clearQueue,
    isOnline: navigator.onLine,
  };
}
