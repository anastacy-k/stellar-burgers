import reducer, {
  initialState,
  fetchIngredients,
  TIngredientsState
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
    _id: '60d3b41abdacab0026a733c6',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react-burger/images/bun-02.png',
    image_large:
      'https://code.s3.yandex.net/react-burger/images/bun-02-large.png',
    image_mobile:
      'https://code.s3.yandex.net/react-burger/images/bun-02-mobile.png'
  },
  {
    _id: '60d3b41abdacab0026a733c8',
    name: 'Говяжий метеорит (отбивная)',
    type: 'main',
    proteins: 800,
    fat: 800,
    carbohydrates: 300,
    calories: 2674,
    price: 3000,
    image: 'https://code.s3.yandex.net/react-burger/images/meat-04.png',
    image_large:
      'https://code.s3.yandex.net/react-burger/images/meat-04-large.png',
    image_mobile:
      'https://code.s3.yandex.net/react-burger/images/meat-04-mobile.png'
  }
];

describe('ingredientsSlice reducer', () => {
  describe('начальное состояние', () => {
    it('возвращает initialState при неизвестном экшене', () => {
      expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
    });
  });

  describe('fetchIngredients.pending', () => {
    it('устанавливает isLoading в true и сбрасывает error', () => {
      const stateWithError: TIngredientsState = {
        ...initialState,
        error: 'предыдущая ошибка'
      };

      const state = reducer(
        stateWithError,
        fetchIngredients.pending('', undefined)
      );

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchIngredients.fulfilled', () => {
    it('сохраняет ингредиенты и устанавливает isLoading в false', () => {
      const loadingState: TIngredientsState = {
        ...initialState,
        isLoading: true
      };

      const state = reducer(
        loadingState,
        fetchIngredients.fulfilled(mockIngredients, '', undefined)
      );

      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
    });
  });

  describe('fetchIngredients.rejected', () => {
    it('сохраняет сообщение об ошибке и устанавливает isLoading в false', () => {
      const loadingState: TIngredientsState = {
        ...initialState,
        isLoading: true
      };

      const state = reducer(
        loadingState,
        fetchIngredients.rejected(new Error('Network error'), '', undefined)
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Network error');
    });

    it('использует запасной текст ошибки, если message в action.error - undefined', () => {
      const loadingState: TIngredientsState = {
        ...initialState,
        isLoading: true
      };

      // RTK action creator adds its own default message, поэтому передаём экшен вручную
      const actionWithNoMessage = {
        type: fetchIngredients.rejected.type,
        error: { message: undefined },
        meta: { requestId: 'test', requestStatus: 'rejected' as const }
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const state = reducer(loadingState, actionWithNoMessage as any);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Не удалось загрузить ингредиенты');
    });
  });
});
