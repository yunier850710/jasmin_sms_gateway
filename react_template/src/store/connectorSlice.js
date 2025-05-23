import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

// Async thunks
export const fetchConnectors = createAsyncThunk(
  'connectors/fetchConnectors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getConnectors();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const startConnector = createAsyncThunk(
  'connectors/startConnector',
  async (connectorId, { rejectWithValue }) => {
    try {
      const response = await api.updateConnectorStatus(connectorId, 'start');
      return { connectorId, status: 'connected' };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const stopConnector = createAsyncThunk(
  'connectors/stopConnector',
  async (connectorId, { rejectWithValue }) => {
    try {
      const response = await api.updateConnectorStatus(connectorId, 'stop');
      return { connectorId, status: 'disconnected' };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNewConnector = createAsyncThunk(
  'connectors/createConnector',
  async (connectorData, { rejectWithValue }) => {
    try {
      const response = await api.createConnector(connectorData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const connectorSlice = createSlice({
  name: 'connectors',
  initialState: {
    entities: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateConnectorStatus: (state, action) => {
      const { connectorId, status } = action.payload;
      const connector = state.entities.find(c => c.id === connectorId);
      if (connector) {
        connector.status = status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch connectors
      .addCase(fetchConnectors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConnectors.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload.connectors;
      })
      .addCase(fetchConnectors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Start connector
      .addCase(startConnector.fulfilled, (state, action) => {
        const { connectorId, status } = action.payload;
        const connector = state.entities.find(c => c.id === connectorId);
        if (connector) {
          connector.status = status;
        }
      })
      // Stop connector
      .addCase(stopConnector.fulfilled, (state, action) => {
        const { connectorId, status } = action.payload;
        const connector = state.entities.find(c => c.id === connectorId);
        if (connector) {
          connector.status = status;
        }
      })
      // Create connector
      .addCase(createNewConnector.fulfilled, (state, action) => {
        state.entities.push(action.payload);
      });
  },
});

export const { updateConnectorStatus } = connectorSlice.actions;

export default connectorSlice.reducer;

// Selectors
export const selectAllConnectors = (state) => state.connectors.entities;
export const selectConnectorById = (state, connectorId) => 
  state.connectors.entities.find(connector => connector.id === connectorId);
export const selectConnectorsLoading = (state) => state.connectors.loading;
export const selectConnectorsError = (state) => state.connectors.error;