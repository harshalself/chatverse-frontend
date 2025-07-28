import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  phone_number: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Simple localStorage-based auth for testing
class SimpleAuthService {
  private static STORAGE_KEYS = {
    USER: 'simple_auth_user',
    TOKEN: 'simple_auth_token'
  };

  static login(email: string, password: string): Promise<{ user: User; token: string }> {
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        if (email && password) {
          const user: User = {
            id: '1',
            name: 'Test User',
            email,
            phone_number: '+1234567890'
          };
          const token = 'simple_token_' + Date.now();
          
          // Store in localStorage
          localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
          localStorage.setItem(this.STORAGE_KEYS.TOKEN, token);
          
          console.log('✅ Simple auth login successful:', { user, token });
          resolve({ user, token });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  }

  static logout(): void {
    localStorage.removeItem(this.STORAGE_KEYS.USER);
    localStorage.removeItem(this.STORAGE_KEYS.TOKEN);
    console.log('✅ Simple auth logout successful');
  }

  static getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem(this.STORAGE_KEYS.USER);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  static getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEYS.TOKEN);
  }

  static isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    const token = this.getToken();
    const isAuth = !!(user && token);
    console.log('🔍 Simple auth check:', { user: !!user, token: !!token, isAuth });
    return isAuth;
  }
}

export const useSimpleAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Check auth state on mount
  useEffect(() => {
    console.log('🔄 Checking auth state...');
    const user = SimpleAuthService.getCurrentUser();
    const isAuthenticated = SimpleAuthService.isAuthenticated();
    
    setAuthState({
      user,
      isAuthenticated,
      isLoading: false
    });
    
    console.log('✅ Auth state loaded:', { user: !!user, isAuthenticated });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    console.log('🔄 Signing in with simple auth...');
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { user, token } = await SimpleAuthService.login(email, password);
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false
      });

      // Get intended destination
      const from = location.state?.from?.pathname || '/workspace';
      console.log('✅ Login successful, redirecting to:', from);
      
      // Navigate to intended destination
      navigate(from, { replace: true });
      
    } catch (error) {
      console.error('❌ Login error:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [navigate, location.state]);

  const signOut = useCallback(() => {
    console.log('🔄 Signing out...');
    SimpleAuthService.logout();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
    navigate('/', { replace: true });
  }, [navigate]);

  return {
    ...authState,
    signIn,
    signOut
  };
};