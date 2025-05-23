import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const JASMIN_API_URL = import.meta.env.VITE_JASMIN_API_URL;
const JASMIN_USERNAME = import.meta.env.VITE_JASMIN_USERNAME;
const JASMIN_PASSWORD = import.meta.env.VITE_JASMIN_PASSWORD;

// Create axios instances
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const jasminApi = axios.create({
  baseURL: JASMIN_API_URL,
  timeout: 5000,
  auth: {
    username: JASMIN_USERNAME,
    password: JASMIN_PASSWORD,
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
const errorInterceptor = (error) => {
  if (error.response) {
    console.error('API Error Response:', error.response.data);
    console.error('Status:', error.response.status);
  } else if (error.request) {
    console.error('API Request Error:', error.request);
  } else {
    console.error('API Setup Error:', error.message);
  }
  return Promise.reject(error);
};

api.interceptors.response.use((response) => response, errorInterceptor);
jasminApi.interceptors.response.use((response) => response, errorInterceptor);

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// User management API
export const userAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  list: () => api.get('/users'),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (passwordData) => api.post('/users/change-password', passwordData),
};

// Connector management API
export const connectorAPI = {
  create: (connectorData) => jasminApi.post('/smppccm', connectorData),
  update: (cid, connectorData) => jasminApi.put(`/smppccm/${cid}`, connectorData),
  delete: (cid) => jasminApi.delete(`/smppccm/${cid}`),
  list: () => jasminApi.get('/smppccm'),
  getStatus: (cid) => jasminApi.get(`/smppccm/${cid}`),
  start: (cid) => jasminApi.post(`/smppccm/${cid}/start`),
  stop: (cid) => jasminApi.post(`/smppccm/${cid}/stop`),
};

// Route management API
export const routeAPI = {
  createMTRoute: (routeData) => jasminApi.post('/mtrouter', routeData),
  updateMTRoute: (order, routeData) => jasminApi.put(`/mtrouter/${order}`, routeData),
  deleteMTRoute: (order) => jasminApi.delete(`/mtrouter/${order}`),
  listMTRoutes: () => jasminApi.get('/mtrouter'),
  createMORoute: (routeData) => jasminApi.post('/morouter', routeData),
  updateMORoute: (order, routeData) => jasminApi.put(`/morouter/${order}`, routeData),
  deleteMORoute: (order) => jasminApi.delete(`/morouter/${order}`),
  listMORoutes: () => jasminApi.get('/morouter'),
};

// Statistics API
export const statsAPI = {
  getSMPPStats: () => jasminApi.get('/stats/smpp'),
  getHTTPStats: () => jasminApi.get('/stats/http'),
  getSystemStats: () => jasminApi.get('/stats/system'),
};

export default {
  userAPI,
  connectorAPI,
  routeAPI,
  statsAPI,
};