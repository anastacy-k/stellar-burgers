import { selectIngredients } from '@selectors/ingredientsSelectors';
import { selectFeedOrders } from '@selectors/feedSelectors';
import { selectUserOrders } from '@selectors/ordersSelectors';
import { FC, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getOrderByNumberApi } from '@api';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();

  const feedOrders = useSelector(selectFeedOrders);
  const userOrders = useSelector(selectUserOrders);
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  const [fetchedOrder, setFetchedOrder] = useState<TOrder | null>(null);

  const orderData = useMemo(() => {
    const orderNumber = Number(number);
    return (
      feedOrders.find((o) => o.number === orderNumber) ||
      userOrders.find((o) => o.number === orderNumber) ||
      fetchedOrder
    );
  }, [feedOrders, userOrders, fetchedOrder, number]);

  useEffect(() => {
    if (!orderData && number) {
      getOrderByNumberApi(Number(number)).then((res) => {
        if (res.orders.length) setFetchedOrder(res.orders[0]);
      });
    }
  }, [number, orderData]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !orderData._id || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
