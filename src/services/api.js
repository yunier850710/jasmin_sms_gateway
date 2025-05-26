import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define our base query
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:8000/api/',
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    return headers;
  },
});

// Error handling wrapper
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // Handle 401 errors (expired token)
    // You could try to refresh token here or redirect to login
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  
  return result;
};

// Initialize the API service
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Connectors', 'Routes', 'Messages', 'Filters', 'Templates', 'Contacts', 'Groups'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    // Dashboard endpoints
    getDashboardData: builder.query({
      query: () => 'dashboard',
      providesTags: ['Dashboard'],
    }),
    
    // Connector endpoints
    getConnectors: builder.query({
      query: () => 'connectors',
      providesTags: ['Connectors'],
    }),
    addConnector: builder.mutation({
      query: (connector) => ({
        url: 'connectors',
        method: 'POST',
        body: connector,
      }),
      invalidatesTags: ['Connectors'],
    }),
    updateConnector: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `connectors/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Connectors'],
    }),
    deleteConnector: builder.mutation({
      query: (id) => ({
        url: `connectors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Connectors'],
    }),
    
    // Route endpoints
    getRoutes: builder.query({
      query: () => 'routes',
      providesTags: ['Routes'],
    }),
    addRoute: builder.mutation({
      query: (route) => ({
        url: 'routes',
        method: 'POST',
        body: route,
      }),
      invalidatesTags: ['Routes'],
    }),
    updateRoute: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `routes/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Routes'],
    }),
    deleteRoute: builder.mutation({
      query: (id) => ({
        url: `routes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Routes'],
    }),
    
    // Add more endpoints as needed
  }),
});

// Export the auto-generated hooks
export const {
  useLoginMutation,
  useGetDashboardDataQuery,
  useGetConnectorsQuery,
  useAddConnectorMutation,
  useUpdateConnectorMutation,
  useDeleteConnectorMutation,
  useGetRoutesQuery,
  useAddRouteMutation,
  useUpdateRouteMutation,
  useDeleteRouteMutation,
} = apiSlice;

// Axios-based service for non-RTK Query needs
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);