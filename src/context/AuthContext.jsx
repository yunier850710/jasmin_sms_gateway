import React, { createContext, useContext, useState, useEffect } from 'react';
import { axiosInstance } from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and load user data
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    if (!token) return;
    
    try {
      // In a real implementation, this would fetch the user profile
      // const response = await axiosInstance.get('/auth/profile');
      // const userData = response.data;
      
      // Mock user data for development
      const userData = {
        id: 1,
        username: 'admin',
        email: 'admin@jasmin.local',
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
        permissions: ['read', 'write', 'delete'],
      };
      
      setUser(userData);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Token might be invalid or expired
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    // Verify admin credentials
    if (username === 'admin' && password === 'secret') {
      const token = 'mock-admin-token'; // In production, this would be a real JWT token
      localStorage.setItem('token', token);
      
      const userData = {
        id: 1,
        username: 'admin',
        email: 'admin@jasmin.local',
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
        permissions: ['read', 'write', 'delete'],
      };
      
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
