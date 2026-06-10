import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

export type TOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

export const initialState: TOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  getOrdersApi
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message ?? 'Не удалось загрузить заказы пользователя';
      });
  }
});

export default ordersSlice.reducer;
