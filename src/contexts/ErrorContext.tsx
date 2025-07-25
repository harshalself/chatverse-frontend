import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  ErrorInfo as ReactErrorInfo,
} from "react";

interface AppErrorInfo {
  message: string;
  stack?: string;
  timestamp: Date;
  id: string;
}

interface ErrorContextType {
  errors: AppErrorInfo[];
  addError: (error: Error | string, context?: string) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
  hasErrors: boolean;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export { ErrorContext };

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ReactErrorInfo | null;
}

class ErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ReactErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center p-8">
              <h1 className="text-2xl font-bold text-destructive mb-4">
                Something went wrong
              </h1>
              <p className="text-muted-foreground mb-4">
                An unexpected error occurred. Please refresh the page or try
                again later.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                Refresh Page
              </button>
              {process.env.NODE_ENV === "development" && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-muted-foreground">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs bg-muted p-4 rounded overflow-auto">
                    {this.state.error?.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<AppErrorInfo[]>([]);

  const addError = (error: Error | string, context?: string) => {
    const errorInfo: AppErrorInfo = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      message: typeof error === "string" ? error : error.message,
      stack: typeof error === "string" ? context : error.stack,
      timestamp: new Date(),
    };

    setErrors((prev) => [...prev, errorInfo]);

    // Auto-remove error after 30 seconds
    setTimeout(() => {
      removeError(errorInfo.id);
    }, 30000);
  };

  const removeError = (id: string) => {
    setErrors((prev) => prev.filter((error) => error.id !== id));
  };

  const clearErrors = () => {
    setErrors([]);
  };

  const value = {
    errors,
    addError,
    removeError,
    clearErrors,
    hasErrors: errors.length > 0,
  };

  return (
    <ErrorContext.Provider value={value}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </ErrorContext.Provider>
  );
}

export function useError() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
}

// Convenience hook for adding errors
export function useErrorHandler() {
  const { addError } = useError();

  return (error: Error | string, context?: string) => {
    addError(error, context);

    // Also log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error reported:", error, context);
    }
  };
}
