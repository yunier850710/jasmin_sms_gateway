/**
 * Authentication utility functions for Jasmin Web Panel
 */

/**
 * Parse the JWT token to extract user information
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 */
export const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return {};
  }
};

/**
 * Check if the token has expired
 * @param {string} token - JWT token
 * @returns {boolean} Whether the token has expired
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = parseJwt(token);
    if (!decoded.exp) return true;
    
    // Check if the token has expired
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Check if the user has the required permission
 * @param {Object} user - User object with permissions array
 * @param {string} permission - Required permission
 * @returns {boolean} Whether the user has the permission
 */
export const hasPermission = (user, permission) => {
  if (!user || !user.permissions) return false;
  
  // Check if user has admin role (full access)
  if (user.role === 'admin') return true;
  
  // Check specific permission
  return user.permissions.includes(permission);
};

/**
 * Check if the user has access to a specific route/feature
 * @param {Object} user - User object
 * @param {string} route - Route or feature name
 * @returns {boolean} Whether the user has access
 */
export const hasRouteAccess = (user, route) => {
  if (!user) return false;
  
  // Admin has access to all routes
  if (user.role === 'admin') return true;
  
  // Define route access based on roles
  const routePermissions = {
    '/dashboard': ['user', 'manager', 'admin'],
    '/connectors': ['manager', 'admin'],
    '/routes': ['manager', 'admin'],
    '/messages': ['user', 'manager', 'admin'],
    '/analytics': ['manager', 'admin'],
    '/settings': ['admin'],
  };
  
  // Check if the user's role has access to the route
  return routePermissions[route]?.includes(user.role) || false;
};

/**
 * Initialize and setup authentication headers for API requests
 * @param {string} token - JWT token
 * @returns {Object} Headers object
 */
export const getAuthHeaders = (token) => {
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};
