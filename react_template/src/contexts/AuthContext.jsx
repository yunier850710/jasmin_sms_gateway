import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useDispatch } from 'react-redux';
import { setCredentials, clearCredentials } from '../store/authSlice';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        dispatch(setCredentials({ user: parsedUser, token }));
        api.setAuthToken(token);
      } catch (e) {
        console.error("Failed to parse stored user data", e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, [dispatch]);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would make an API call
      // For now, we'll simulate a successful login with mock data
      const response = await api.login(username, password);
      
      // Save auth data to local storage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Update context state
      setUser(response.user);
      
      // Update Redux store
      dispatch(setCredentials(response));
      
      // Configure API with auth token
      api.setAuthToken(response.token);
      
      return true;
    } catch (err) {
      setError(err.message || 'Failed to login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Update context state
    setUser(null);
    
    // Update Redux store
    dispatch(clearCredentials());
    
    // Clear API auth token
    api.clearAuthToken();
    
    // Redirect to login
    navigate('/login');
  };
  
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.register(userData);
      return response;
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user,
        loading,
        error,
        login,
        logout,
        register,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};