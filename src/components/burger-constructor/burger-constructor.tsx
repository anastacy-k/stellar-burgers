import { FC, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { closeOrderModal, createOrder } from '@slices/constructorSlice';
import {
  selectConstructorItems,
  selectOrderModalData,
  selectOrderRequest
} from '@selectors/constructorSelectors';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

import { selectIsAuth } from '@selectors/userSelectors';
import { useDispatch, useSelector } from '../../services/store';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const isAuth = useSelector(selectIsAuth);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!isAuth) {
      navigate('/login', { state: { from: location } });
      return;
    }

    dispatch(createOrder());
  };

  const handleCloseOrderModal = () => {
    dispatch(closeOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={handleCloseOrderModal}
    />
  );
};
