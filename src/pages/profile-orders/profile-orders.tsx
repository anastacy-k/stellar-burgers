import { ProfileOrdersUI } from '@ui-pages';
import { fetchUserOrders } from '@slices/ordersSlice';
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

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
