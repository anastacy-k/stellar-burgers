import { combineReducers } from '@reduxjs/toolkit';

import constructorReducer from './slices/constructorSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import feedReducer from './slices/feedSlice';
import ordersReducer from './slices/ordersSlice';
import userReducer from './slices/userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  orders: ordersReducer,
  burgerConstructor: constructorReducer,
  user: userReducer
});
