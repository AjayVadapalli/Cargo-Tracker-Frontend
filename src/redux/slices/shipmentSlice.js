import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL;

// Async thunks
export const fetchShipments = createAsyncThunk(
  'shipments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/shipments`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchShipmentById = createAsyncThunk(
  'shipments/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/shipment/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createShipment = createAsyncThunk(
  'shipments/create',
  async (shipmentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/shipment`, shipmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateShipment = createAsyncThunk(
  'shipments/update',
  async ({ id, ...shipmentData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/shipment/${id}`, shipmentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateShipmentLocation = createAsyncThunk(
  'shipments/updateLocation',
  async ({ id, locationData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/shipment/${id}/update-location`, locationData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchShipmentETA = createAsyncThunk(
  'shipments/fetchETA',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/shipment/${id}/eta`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteShipment = createAsyncThunk(
  'shipments/delete',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/shipment/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  shipments: [],
  currentShipment: null,
  loading: false,
  error: null,
  etaLoading: false,
  etaData: null,
};

const shipmentSlice = createSlice({
  name: 'shipments',
  initialState,
  reducers: {
    clearCurrentShipment: (state) => {
      state.currentShipment = null;
    },
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all shipments
      .addCase(fetchShipments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShipments.fulfilled, (state, action) => {
        state.loading = false;
        state.shipments = action.payload;
      })
      .addCase(fetchShipments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch shipments';
        toast.error(state.error);
      })
      
      // Fetch shipment by ID
      .addCase(fetchShipmentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShipmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShipment = action.payload;
      })
      .addCase(fetchShipmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch shipment';
        toast.error(state.error);
      })
      
      // Create shipment
      .addCase(createShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShipment.fulfilled, (state, action) => {
        state.loading = false;
        state.shipments.push(action.payload);
        toast.success('Shipment created successfully');
      })
      .addCase(createShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create shipment';
        toast.error(state.error);
      })

      // Update shipment
      .addCase(updateShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShipment.fulfilled, (state, action) => {
        state.loading = false;
        // Update in shipments array
        const index = state.shipments.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.shipments[index] = action.payload;
        }
        // Update current shipment if it's the same one
        if (state.currentShipment && state.currentShipment._id === action.payload._id) {
          state.currentShipment = action.payload;
        }
        toast.success('Shipment updated successfully');
      })
      .addCase(updateShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update shipment';
        toast.error(state.error);
      })
      
      // Update shipment location
      .addCase(updateShipmentLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShipmentLocation.fulfilled, (state, action) => {
        state.loading = false;
        // Update in shipments array
        const index = state.shipments.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.shipments[index] = action.payload;
        }
        // Update current shipment if it's the same one
        if (state.currentShipment && state.currentShipment._id === action.payload._id) {
          state.currentShipment = action.payload;
        }
        toast.success('Shipment location updated');
      })
      .addCase(updateShipmentLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update location';
        toast.error(state.error);
      })
      
      // Fetch shipment ETA
      .addCase(fetchShipmentETA.pending, (state) => {
        state.etaLoading = true;
        state.error = null;
      })
      .addCase(fetchShipmentETA.fulfilled, (state, action) => {
        state.etaLoading = false;
        state.etaData = action.payload;
      })
      .addCase(fetchShipmentETA.rejected, (state, action) => {
        state.etaLoading = false;
        state.error = action.payload?.message || 'Failed to fetch ETA';
        toast.error(state.error);
      })
      
      // Delete shipment
      .addCase(deleteShipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShipment.fulfilled, (state, action) => {
        state.loading = false;
        state.shipments = state.shipments.filter(shipment => shipment._id !== action.payload);
        if (state.currentShipment && state.currentShipment._id === action.payload) {
          state.currentShipment = null;
        }
        toast.success('Shipment deleted successfully');
      })
      .addCase(deleteShipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete shipment';
        toast.error(state.error);
      });
  },
});

export const { clearCurrentShipment, clearErrors } = shipmentSlice.actions;
export default shipmentSlice.reducer;