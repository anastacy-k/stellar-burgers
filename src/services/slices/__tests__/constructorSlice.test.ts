import { v4 as uuidV4 } from 'uuid';
import reducer, {
  initialState,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
  closeOrderModal,
  createOrder,
  TConstructorState
} from '../constructorSlice';
import { TIngredient } from '@utils-types';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid')
}));

const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png'
};

const mockFilling: TIngredient = {
  _id: 'main-1',
  name: 'Говяжий метеорит (отбивная)',
  type: 'main',
  proteins: 800,
  fat: 800,
  carbohydrates: 300,
  calories: 2674,
  price: 3000,
  image: 'main.png',
  image_large: 'main-large.png',
  image_mobile: 'main-mobile.png'
};

const mockOrderPayload = {
  _id: 'order-id-mock',
  status: 'done',
  name: 'Флюоресцентный бургер',
  owner: {
    name: 'Test User',
    email: 'test@test.com',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 9999,
  price: 4255
};

describe('constructorSlice reducer', () => {
  describe('начальное состояние', () => {
    it('возвращает initialState при undefined-состоянии и неизвестном экшене', () => {
      expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
    });
  });

  describe('addIngredient', () => {
    it('устанавливает булку, если тип ингредиента - bun', () => {
      const state = reducer(initialState, addIngredient(mockBun));

      expect(state.bun).toMatchObject({ ...mockBun, id: 'test-uuid' });
      expect(state.ingredients).toHaveLength(0);
    });

    it('заменяет существующую булку новой', () => {
      const anotherBun: TIngredient = {
        ...mockBun,
        _id: 'bun-2',
        name: 'Флюоресцентная булка R2-D3'
      };

      const stateWithBun = reducer(initialState, addIngredient(mockBun));
      const state = reducer(stateWithBun, addIngredient(anotherBun));

      expect(state.bun?._id).toBe('bun-2');
    });

    it('добавляет начинку в конец массива ингредиентов', () => {
      const state = reducer(initialState, addIngredient(mockFilling));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toMatchObject({
        ...mockFilling,
        id: 'test-uuid'
      });
    });

    it('накапливает несколько начинок в массиве', () => {
      (uuidV4 as jest.Mock)
        .mockReturnValueOnce('uuid-1')
        .mockReturnValueOnce('uuid-2');

      let state = reducer(initialState, addIngredient(mockFilling));
      state = reducer(state, addIngredient(mockFilling));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].id).toBe('uuid-1');
      expect(state.ingredients[1].id).toBe('uuid-2');
    });
  });

  describe('removeIngredient', () => {
    it('удаляет ингредиент по id', () => {
      const stateWithItems: TConstructorState = {
        ...initialState,
        ingredients: [
          { ...mockFilling, id: 'uuid-1' },
          { ...mockFilling, id: 'uuid-2' }
        ]
      };

      const state = reducer(stateWithItems, removeIngredient('uuid-1'));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].id).toBe('uuid-2');
    });
  });

  describe('moveIngredientUp', () => {
    const stateWithThreeItems: TConstructorState = {
      ...initialState,
      ingredients: [
        { ...mockFilling, id: 'uuid-1', name: 'First' },
        { ...mockFilling, id: 'uuid-2', name: 'Second' },
        { ...mockFilling, id: 'uuid-3', name: 'Third' }
      ]
    };

    it('меняет местами ингредиент с предыдущим', () => {
      const state = reducer(stateWithThreeItems, moveIngredientUp(1));

      expect(state.ingredients[0].id).toBe('uuid-2');
      expect(state.ingredients[1].id).toBe('uuid-1');
      expect(state.ingredients[2].id).toBe('uuid-3');
    });

    it('не перемещает первый ингредиент', () => {
      const state = reducer(stateWithThreeItems, moveIngredientUp(0));

      expect(state.ingredients).toEqual(stateWithThreeItems.ingredients);
    });
  });

  describe('moveIngredientDown', () => {
    const stateWithThreeItems: TConstructorState = {
      ...initialState,
      ingredients: [
        { ...mockFilling, id: 'uuid-1', name: 'First' },
        { ...mockFilling, id: 'uuid-2', name: 'Second' },
        { ...mockFilling, id: 'uuid-3', name: 'Third' }
      ]
    };

    it('меняет местами ингредиент со следующим', () => {
      const state = reducer(stateWithThreeItems, moveIngredientDown(1));

      expect(state.ingredients[1].id).toBe('uuid-3');
      expect(state.ingredients[2].id).toBe('uuid-2');
    });

    it('не перемещает последний ингредиент', () => {
      const state = reducer(stateWithThreeItems, moveIngredientDown(2));

      expect(state.ingredients).toEqual(stateWithThreeItems.ingredients);
    });
  });

  describe('clearConstructor', () => {
    it('очищает булку и массив ингредиентов', () => {
      const filledState: TConstructorState = {
        ...initialState,
        bun: { ...mockBun, id: 'bun-uuid' },
        ingredients: [{ ...mockFilling, id: 'fill-uuid' }]
      };

      const state = reducer(filledState, clearConstructor());

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('closeOrderModal', () => {
    it('устанавливает orderModalData в null', () => {
      const stateWithModal: TConstructorState = {
        ...initialState,
        orderModalData: { number: 42 }
      };

      const state = reducer(stateWithModal, closeOrderModal());

      expect(state.orderModalData).toBeNull();
    });
  });

  describe('createOrder async thunk', () => {
    it('pending - устанавливает orderRequest в true и сбрасывает orderModalData', () => {
      const stateWithModal: TConstructorState = {
        ...initialState,
        orderModalData: { number: 1 }
      };

      const state = reducer(stateWithModal, createOrder.pending('', undefined));

      expect(state.orderRequest).toBe(true);
      expect(state.orderModalData).toBeNull();
    });

    it('fulfilled - сохраняет номер заказа, очищает конструктор, сбрасывает orderRequest', () => {
      const filledState: TConstructorState = {
        ...initialState,
        orderRequest: true,
        bun: { ...mockBun, id: 'bun-uuid' },
        ingredients: [{ ...mockFilling, id: 'fill-uuid' }]
      };

      const state = reducer(
        filledState,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        createOrder.fulfilled(mockOrderPayload as any, '', undefined)
      );

      expect(state.orderRequest).toBe(false);
      expect(state.orderModalData).toEqual({ number: 9999 });
      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });

    it('rejected - устанавливает orderRequest в false', () => {
      const requestingState: TConstructorState = {
        ...initialState,
        orderRequest: true
      };

      const state = reducer(
        requestingState,
        createOrder.rejected(null, '', undefined)
      );

      expect(state.orderRequest).toBe(false);
    });
  });
});
