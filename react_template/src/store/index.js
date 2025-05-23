import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import connectorReducer from './connectorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    connectors: connectorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});