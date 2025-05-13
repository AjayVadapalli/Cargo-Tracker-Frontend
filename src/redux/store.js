import { configureStore } from '@reduxjs/toolkit';
import shipmentReducer from './slices/shipmentSlice';

export const store = configureStore({
  reducer: {
    shipments: shipmentReducer,
  },
});