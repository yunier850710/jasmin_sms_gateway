// Constants used throughout the application

// API Endpoints (would be replaced with actual endpoints)
export const API_BASE_URL = 'http://localhost:3000/api';

// Status Types
export const STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  BINDING: 'binding',
  ERROR: 'error',
  WARNING: 'warning',
  UNKNOWN: 'unknown'
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user'
};

// Route Types
export const ROUTE_TYPES = {
  MO: 'mo',
  MT: 'mt'
};

// Filter Types
export const FILTER_TYPES = {
  SOURCE_ADDRESS: 'source_address',
  DESTINATION_ADDRESS: 'destination_address',
  SHORT_MESSAGE: 'short_message',
  PRIORITY: 'priority'
};

// Filter Operators
export const FILTER_OPERATORS = {
  EQUAL: 'equal',
  NOT_EQUAL: 'not_equal',
  STARTS_WITH: 'starts_with',
  ENDS_WITH: 'ends_with',
  CONTAINS: 'contains',
  REGEX: 'regex'
};

// Chart Colors
export const CHART_COLORS = {
  primary: '#4F46E5', // indigo-600
  secondary: '#7C3AED', // violet-600
  success: '#10B981', // emerald-500
  danger: '#EF4444', // red-500
  warning: '#F59E0B', // amber-500
  info: '#3B82F6', // blue-500
  light: '#F3F4F6', // gray-100
  dark: '#1F2937', // gray-800
  defaultBorder: '#E5E7EB', // gray-200
  defaultText: '#6B7280', // gray-500
};

// Time Ranges
export const TIME_RANGES = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  WEEK: 'week',
  MONTH: 'month',
  CUSTOM: 'custom'
};

// Message Status
export const MESSAGE_STATUS = {
  DELIVERED: 'delivered',
  FAILED: 'failed',
  PENDING: 'pending',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
  UNKNOWN: 'unknown'
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
  USER: 'user',
  SETTINGS: 'settings'
};