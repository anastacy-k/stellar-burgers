import { RootState } from '../store';

export const selectIsAuth = (state: RootState) => state.user.isAuth;

export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;

export const selectUser = (state: RootState) => state.user.user;

export const selectUserError = (state: RootState) => state.user.error;
