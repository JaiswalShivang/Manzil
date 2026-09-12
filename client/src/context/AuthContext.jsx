import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api, { setAccessToken } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize session on page refresh via silent refresh
  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const res = await api.post('/auth/refresh');
        if (isMounted && res.data?.success && res.data.accessToken) {
          setAccessToken(res.data.accessToken);
          setUser(res.data.user);
        }
      } catch {
        if (isMounted) {
          setAccessToken(null);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // Login handler
  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success) {
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
        return {
          success: true,
          message: res.data.message || 'Authentication verified',
          user: res.data.user,
        };
      }
      return { success: false, message: 'Login failed' };
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Login failed. Please check your credentials.';
      const field = err.response?.data?.field || err.response?.data?.errors?.[0]?.field;
      setError(msg);
      return { success: false, message: msg, field };
    }
  }, []);

  // Register handler
  const register = useCallback(async (username, email, password) => {
    setError(null);
    try {
      const res = await api.post('/auth/register', { username, email, password });
      if (res.data?.success) {
        setAccessToken(res.data.accessToken);
        setUser(res.data.user);
        return {
          success: true,
          message: res.data.message || 'Agent commissioned successfully',
          user: res.data.user,
        };
      }
      return { success: false, message: 'Registration failed' };
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        'Registration failed. Please try again.';
      const field = err.response?.data?.field || err.response?.data?.errors?.[0]?.field;
      setError(msg);
      return { success: false, message: msg, field };
    }
  }, []);

  // Logout handler
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }, []);

  // Refetch user profile
  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get('/users/me');
      if (res.data?.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  }, []);

  // Direct updater for optimistic UI
  const updateUserData = useCallback((updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : prev));
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      register,
      logout,
      refreshUser,
      updateUserData,
    }),
    [user, isLoading, error, login, register, logout, refreshUser, updateUserData]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
