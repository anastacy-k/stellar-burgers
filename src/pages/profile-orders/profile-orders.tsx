import { ProfileOrdersUI } from '@ui-pages';
import { fetchIngredients } from '@slices/ingredientsSlice';
import { fetchUserOrders } from '@slices/ordersSlice';
import { selectIngredients } from '@selectors/ingredientsSelectors';
import {
  selectIsUserOrdersLoading,
  selectUserOrders
} from '@selectors/ordersSelectors';
import { FC, useEffect } from 'react';

import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const isLoading = useSelector(selectIsUserOrdersLoading);
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    dispatch(fetchUserOrders());
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
