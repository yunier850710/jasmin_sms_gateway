// API service for Jasmin SMPP SMS Gateway
import axios from 'axios';

// Base API configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Replace with actual API URL in production
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// Authentication APIs
const login = async (username, password) => {
  // For demonstration purposes, we'll return mock data
  // In a real implementation, this would connect to your backend
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        resolve({
          user: {
            id: '1',
            username: 'admin',
            email: 'admin@example.com',
            roles: ['admin'],
            isActive: true,
          },
          token: 'mock-jwt-token',
        });
      } else {
        reject(new Error('Invalid username or password'));
      }
    }, 1000);
  });
};

// User management APIs
const getUsers = async () => {
  try {
    const response = await apiClient.get('/users');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

const createUser = async (userData) => {
  try {
    const response = await apiClient.post('/users', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create user');
  }
};

const updateUser = async (id, userData) => {
  try {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
};

const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
};

// Group management APIs
const getGroups = async () => {
  try {
    const response = await apiClient.get('/groups');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch groups');
  }
};

const createGroup = async (groupData) => {
  try {
    const response = await apiClient.post('/groups', groupData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create group');
  }
};

// SMPP Connector APIs
const getConnectors = async () => {
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
            createdAt: '2023-01-15T10:30:00Z',
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
            createdAt: '2023-01-15T11:45:00Z',
            messagesToday: 0,
            deliveryRate: 0
          },
          {
            id: '3',
            name: 'Test SMPP',
            host: 'test.example.com',
            port: 2775,
            systemId: 'test_user',
            status: 'connected',
            createdAt: '2023-01-16T09:15:00Z',
            messagesToday: 3420,
            deliveryRate: 99.1
          }
        ]
      });
    }, 500);
  });
};

const createConnector = async (connectorData) => {
  try {
    const response = await apiClient.post('/connectors', connectorData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create connector');
  }
};

const updateConnectorStatus = async (id, action) => {
  try {
    const response = await apiClient.put(`/connectors/${id}/status`, { action });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update connector status');
  }
};

// SMS Statistics APIs
const getSystemStats = async (timeRange) => {
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
        messagesByHour: [
          { hour: '00:00', count: 2340 },
          { hour: '01:00', count: 1890 },
          { hour: '02:00', count: 1230 },
          { hour: '03:00', count: 980 },
          { hour: '04:00', count: 870 },
          { hour: '05:00', count: 765 },
          { hour: '06:00', count: 1020 },
          { hour: '07:00', count: 2450 },
          { hour: '08:00', count: 5670 },
          { hour: '09:00', count: 7890 },
          { hour: '10:00', count: 8900 },
          { hour: '11:00', count: 9870 }
        ]
      });
    }, 800);
  });
};

const getUserStats = async (userId, timeRange) => {
  try {
    const response = await apiClient.get(`/statistics/users/${userId}`, {
      params: timeRange
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user statistics');
  }
};

const getDashboardStats = async () => {
  // Mock data for development
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        totalUsers: 24,
        activeUsers: 18,
        totalConnectors: 5,
        activeConnectors: 3,
        messagesSentToday: 45620,
        messagesFailedToday: 429,
        deliveryRateToday: 99.06,
        recentActivity: [
          { type: 'connector', action: 'connected', entity: 'Production SMPP', time: '10 minutes ago' },
          { type: 'message', action: 'sent', entity: 'Bulk Campaign #12345', time: '15 minutes ago' },
          { type: 'user', action: 'created', entity: 'new_user', time: '2 hours ago' },
          { type: 'route', action: 'updated', entity: 'MO Route #3', time: '3 hours ago' }
        ]
      });
    }, 600);
  });
};

// Routes management APIs
const getRoutes = async (type) => {
  try {
    const response = await apiClient.get('/routes', {
      params: { type }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch routes');
  }
};

const createRoute = async (routeData) => {
  try {
    const response = await apiClient.post('/routes', routeData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create route');
  }
};

// Configuration management APIs
const getConfig = async (section) => {
  try {
    const response = await apiClient.get(`/config/${section}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch configuration');
  }
};

const backupConfig = async () => {
  try {
    const response = await apiClient.post('/config/backup');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to backup configuration');
  }
};

export const api = {
  setAuthToken,
  clearAuthToken,
  login,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getGroups,
  createGroup,
  getConnectors,
  createConnector,
  updateConnectorStatus,
  getSystemStats,
  getUserStats,
  getDashboardStats,
  getRoutes,
  createRoute,
  getConfig,
  backupConfig
};