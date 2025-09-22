import React, { createContext, useContext, useReducer, useEffect } from "react";

export interface Notification {
  id: string;
  title?: string;
  description?: string;
  type?: "default" | "destructive" | "success" | "warning";
  timestamp: Date;
  read: boolean;
}

interface NotificationState {
  notifications: Notification[];
}

type NotificationAction =
  | {
      type: "ADD_NOTIFICATION";
      payload: Omit<Notification, "id" | "timestamp" | "read">;
    }
  | { type: "MARK_AS_READ"; payload: string }
  | { type: "MARK_ALL_AS_READ" }
  | { type: "CLEAR_NOTIFICATION"; payload: string }
  | { type: "CLEAR_ALL_NOTIFICATIONS" };

const initialState: NotificationState = {
  notifications: [],
};

const notificationReducer = (
  state: NotificationState,
  action: NotificationAction
): NotificationState => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      const newNotification: Notification = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        read: false,
      };
      return {
        ...state,
        notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep only last 50 notifications
      };

    case "MARK_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
      };

    case "MARK_ALL_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) => ({
          ...notification,
          read: true,
        })),
      };

    case "CLEAR_NOTIFICATION":
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload
        ),
      };

    case "CLEAR_ALL_NOTIFICATIONS":
      return {
        ...state,
        notifications: [],
      };

    default:
      return state;
  }
};

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export { NotificationContext };
export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem("chatverse-notifications");
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        parsed.forEach((notification: any) => {
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              ...notification,
              timestamp: new Date(notification.timestamp),
            },
          });
        });
      } catch (error) {
        console.error("Failed to load notifications from localStorage:", error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      "chatverse-notifications",
      JSON.stringify(state.notifications)
    );
  }, [state.notifications]);

  // Listen for custom events from toast system
  useEffect(() => {
    const handleAddNotification = (event: CustomEvent) => {
      const { title, description, type } = event.detail;
      dispatch({
        type: "ADD_NOTIFICATION",
        payload: { title, description, type },
      });
    };

    window.addEventListener(
      "add-notification",
      handleAddNotification as EventListener
    );

    return () => {
      window.removeEventListener(
        "add-notification",
        handleAddNotification as EventListener
      );
    };
  }, []);

  const unreadCount = state.notifications.filter(
    (notification) => !notification.read
  ).length;

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => {
    dispatch({ type: "ADD_NOTIFICATION", payload: notification });
  };

  const markAsRead = (id: string) => {
    dispatch({ type: "MARK_AS_READ", payload: id });
  };

  const markAllAsRead = () => {
    dispatch({ type: "MARK_ALL_AS_READ" });
  };

  const clearNotification = (id: string) => {
    dispatch({ type: "CLEAR_NOTIFICATION", payload: id });
  };

  const clearAllNotifications = () => {
    dispatch({ type: "CLEAR_ALL_NOTIFICATIONS" });
  };

  const value: NotificationContextType = {
    notifications: state.notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}
