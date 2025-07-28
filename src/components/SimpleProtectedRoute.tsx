import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSimpleAuth } from "@/hooks/use-simple-auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function SimpleProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useSimpleAuth();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute check:', { 
    path: location.pathname, 
    isAuthenticated, 
    isLoading 
  });

  if (isLoading) {
    console.log('⏳ Auth loading...');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🔒 Not authenticated, redirecting to signin');
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  console.log('✅ Authenticated, rendering protected content');
  return <>{children}</>;
}