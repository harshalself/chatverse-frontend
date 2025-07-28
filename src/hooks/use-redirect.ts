import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthService } from '@/services/auth.service';

/**
 * Hook for handling post-authentication redirects
 * Provides robust redirect logic with fallbacks and state management
 */
export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get intended destination from various sources
  const getIntendedDestination = useCallback(() => {
    // 1. Check URL state (from ProtectedRoute)
    const fromState = location.state?.from?.pathname;
    if (fromState && fromState !== '/signin' && fromState !== '/signup') {
      return fromState;
    }

    // 2. Check localStorage for saved intended route
    const savedRoute = localStorage.getItem('intendedRoute');
    if (savedRoute && savedRoute !== '/signin' && savedRoute !== '/signup') {
      localStorage.removeItem('intendedRoute'); // Clear after use
      return savedRoute;
    }

    // 3. Default to workspace
    return '/workspace';
  }, [location.state]);

  // Save current route as intended destination (for unauthenticated users)
  const saveIntendedRoute = useCallback((route: string) => {
    if (route !== '/signin' && route !== '/signup' && route !== '/') {
      localStorage.setItem('intendedRoute', route);
    }
  }, []);

  // Redirect authenticated user to intended destination
  const redirectAfterAuth = useCallback(() => {
    const destination = getIntendedDestination();
    navigate(destination, { replace: true });
  }, [navigate, getIntendedDestination]);

  // Redirect to sign-in and save current route
  const redirectToSignIn = useCallback(() => {
    const currentPath = location.pathname;
    saveIntendedRoute(currentPath);
    navigate('/signin', { 
      replace: true, 
      state: { from: location } 
    });
  }, [navigate, location, saveIntendedRoute]);

  return {
    redirectAfterAuth,
    redirectToSignIn,
    saveIntendedRoute,
    getIntendedDestination,
  };
};

/**
 * Hook for automatic redirect handling based on auth state
 */
export const useAutoRedirect = (isAuthenticated: boolean, isLoading: boolean) => {
  const { redirectAfterAuth, redirectToSignIn } = useAuthRedirect();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';
    const isHomePage = location.pathname === '/';

    if (isAuthenticated && (isAuthPage || isHomePage)) {
      // User is authenticated but on auth/home page - redirect to workspace
      redirectAfterAuth();
    } else if (!isAuthenticated && !isAuthPage && !isHomePage) {
      // User is not authenticated and trying to access protected route
      redirectToSignIn();
    }
  }, [isAuthenticated, isLoading, location.pathname, redirectAfterAuth, redirectToSignIn]);
};