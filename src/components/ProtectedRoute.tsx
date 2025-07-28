import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useAuthRedirect } from "@/hooks/use-redirect";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const { saveIntendedRoute } = useAuthRedirect();

  // Save the current route as intended destination for after login
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      saveIntendedRoute(location.pathname);
    }
  }, [isAuthenticated, isLoading, location.pathname, saveIntendedRoute]);

  if (isLoading) {
    // Show loading spinner while checking authentication
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to sign in page with the current location as state
    // The intended route is already saved in localStorage
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
