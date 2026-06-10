import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import { orderBurgerApi } from '@api';
import { TConstructorIngredient, TIngredient } from '@utils-types';

export type TOrderModalData = {
  number: number;
};

export type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrderModalData | null;
};

export const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null
};

export const createOrder = createAsyncThunk(
  'burgerConstructor/createOrder',
  async (_, { getState, rejectWithValue }) => {
    const { bun, ingredients } = (
      getState() as { burgerConstructor: TConstructorState }
    ).burgerConstructor;

    if (!bun) {
      return rejectWithValue('Выберите булки');
    }

    const orderIngredients = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id
    ];

    const data = await orderBurgerApi(orderIngredients);
    return data.order;
  }
);

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        if (payload.type === 'bun') {
          state.bun = payload;
        } else {
          state.ingredients.push(payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        const temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index - 1];
        state.ingredients[index - 1] = temp;
      }
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.ingredients.length - 1) {
        const temp = state.ingredients[index];
        state.ingredients[index] = state.ingredients[index + 1];
        state.ingredients[index + 1] = temp;
      }
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    closeOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderModalData = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = { number: action.payload.number };
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
  closeOrderModal
} = constructorSlice.actions;

export default constructorSlice.reducer;
