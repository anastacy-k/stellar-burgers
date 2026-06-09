import { RootState } from '../store';

export const selectUserOrders = (state: RootState) => state.orders.orders;

export const selectIsUserOrdersLoading = (state: RootState) =>
  state.orders.isLoading;
