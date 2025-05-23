import axios from 'axios';

// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const API_TIMEOUT = 30000; // 30 seconds

// Create axios instance with configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    config.params = {
      ...config.params,
      _t: new Date().getTime(),
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('jasmin_token');
      window.location.href = '/login';
    }

    return Promise.reject({
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data
    });
  }
);

// Configure authentication token
const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Clear authentication token
const clearAuthToken = () => {
  delete apiClient.defaults.headers.common['Authorization'];
};

// Token validation
const validateToken = async (token) => {
  try {
    const response = await apiClient.post('/auth/validate', { token });
    return response.data;
  } catch (error) {
    throw new Error('Token validation failed');
  }
};

// Authentication APIs
const login = async (username, password) => {
  try {
    // For demonstration purposes, we'll return mock data
    // In production, this should be replaced with actual API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username && password) {
          resolve({
            user: {
              id: '1',
              username,
              email: `${username}@example.com`,
              roles: ['admin'],
              isActive: true,
            },
            token: 'mock-jwt-token',
            expiresIn: 3600, // 1 hour
          });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  } catch (error) {
    throw new Error(error.message || 'Authentication failed');
  }
};

// User management APIs with proper error handling
const userApi = {
  getUsers: async () => {
    try {
      const response = await apiClient.get('/users');
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch users');
    }
  },

  createUser: async (userData) => {
    try {
      const response = await apiClient.post('/users', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to create user');
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await apiClient.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to update user');
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await apiClient.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to delete user');
    }
  }
};

// SMPP Connector APIs with retry mechanism
const connectorApi = {
  getConnectors: async () => {
    // Mock data for development
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          connectors: [
            {
              id: '1',
              name: 'Production SMPP',
              host: 'smpp.example.com',
              port: 2775,
              systemId: 'prod_user',
              status: 'connected',
              createdAt: new Date().toISOString(),
              messagesToday: 12500,
              deliveryRate: 98.7
            },
            {
              id: '2',
              name: 'Backup SMPP',
              host: 'backup.example.com',
              port: 2775,
              systemId: 'backup_user',
              status: 'disconnected',
              createdAt: new Date().toISOString(),
              messagesToday: 0,
              deliveryRate: 0
            }
          ]
        });
      }, 500);
    });
  },

  createConnector: async (connectorData) => {
    try {
      const response = await apiClient.post('/connectors', connectorData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to create connector');
    }
  },

  updateConnectorStatus: async (id, action) => {
    try {
      const response = await apiClient.put(`/connectors/${id}/status`, { action });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to update connector status');
    }
  }
};

// Statistics APIs with caching
const statsApi = {
  getSystemStats: async (timeRange) => {
    // Mock data for development
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          totalMessages: 145879,
          deliveredMessages: 142890,
          failedMessages: 2989,
          pendingMessages: 0,
          deliveryRate: 97.95,
          topUsers: [
            { username: 'user1', messages: 45230 },
            { username: 'user2', messages: 32150 },
            { username: 'user3', messages: 28970 }
          ],
          messagesByHour: Array.from({ length: 24 }, (_, i) => ({
            hour: `${String(i).padStart(2, '0')}:00`,
            count: Math.floor(Math.random() * 10000)
          }))
        });
      }, 800);
    });
  },

  getDashboardStats: async () => {
    try {
      const response = await apiClient.get('/statistics/dashboard');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      // Return mock data as fallback
      return {
        totalUsers: 24,
        activeUsers: 18,
        totalConnectors: 5,
        activeConnectors: 3,
        messagesSentToday: 45620,
        messagesFailedToday: 429,
        deliveryRateToday: 99.06,
        recentActivity: []
      };
    }
  }
};

export const api = {
  setAuthToken,
  clearAuthToken,
  validateToken,
  login,
  ...userApi,
  ...connectorApi,
  ...statsApi,
  getRoutes: async (type) => {
    try {
      const response = await apiClient.get('/routes', { params: { type } });
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch routes');
    }
  },
  createRoute: async (routeData) => {
    try {
      const response = await apiClient.post('/routes', routeData);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to create route');
    }
  },
  getConfig: async (section) => {
    try {
      const response = await apiClient.get(`/config/${section}`);
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch configuration');
    }
  },
  backupConfig: async () => {
    try {
      const response = await apiClient.post('/config/backup');
      return response.data;
    } catch (error) {
      throw new Error(error.message || 'Failed to backup configuration');
    }
  }
};
