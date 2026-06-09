import { FeedUI } from '@ui-pages';
import { fetchFeeds } from '@slices/feedSlice';
import { fetchIngredients } from '@slices/ingredientsSlice';
import {
  selectFeedOrders,
  selectIsFeedLoading
} from '@selectors/feedSelectors';
import { selectIngredients } from '@selectors/ingredientsSelectors';
import { FC, useCallback, useEffect } from 'react';

import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectIsFeedLoading);
  const ingredients = useSelector(selectIngredients);

  const handleGetFeeds = useCallback(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  useEffect(() => {
    handleGetFeeds();
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, handleGetFeeds, ingredients.length]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
