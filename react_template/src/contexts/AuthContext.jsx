import { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useDispatch } from 'react-redux';
import { setCredentials, clearCredentials } from '../store/authSlice';

export const AuthContext = createContext();

const TOKEN_KEY = 'jasmin_token';
const USER_KEY = 'jasmin_user';
const TOKEN_EXPIRY_KEY = 'jasmin_token_expiry';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const clearAuthData = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    setUser(null);
    dispatch(clearCredentials());
    api.clearAuthToken();
  }, [dispatch]);

  const isTokenExpired = useCallback(() => {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiry) return true;
    return new Date().getTime() > parseInt(expiry, 10);
  }, []);

  // Check authentication status
  useEffect(() => {
    const validateSession = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (!token || !storedUser || isTokenExpired()) {
          clearAuthData();
          return;
        }

        const parsedUser = JSON.parse(storedUser);

        // Verify token with backend
        try {
          await api.validateToken(token);
        } catch (err) {
          console.error('Token validation failed:', err);
          clearAuthData();
          return;
        }

        setUser(parsedUser);
        dispatch(setCredentials({ user: parsedUser, token }));
        api.setAuthToken(token);
      } catch (e) {
        console.error('Session validation error:', e);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [dispatch, clearAuthData, isTokenExpired]);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.login(username, password);
      const { token, user: userData, expiresIn } = response;

      // Calculate token expiry
      const expiryTime = new Date().getTime() + (expiresIn * 1000);

      // Save auth data
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());

      setUser(userData);
      dispatch(setCredentials(response));
      api.setAuthToken(token);

      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to login';
      setError(errorMessage);
      console.error('Login error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    clearAuthData();
    navigate('/login');
  }, [clearAuthData, navigate]);

  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.register(userData);
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      console.error('Registration error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = useCallback(async (userData) => {
    try {
      const response = await api.updateUser(userData);
      const updatedUser = { ...user, ...response.data };
      setUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update user';
      setError(errorMessage);
      console.error('Update user error:', err);
      return false;
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        register,
        updateUser,
        clearError: () => setError(null)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
