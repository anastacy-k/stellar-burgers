import { FeedUI } from '@ui-pages';
import { fetchFeeds } from '@slices/feedSlice';
import {
  selectFeedOrders,
  selectIsFeedLoading
} from '@selectors/feedSelectors';
import { FC, useCallback, useEffect } from 'react';

import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectIsFeedLoading);

  const handleGetFeeds = useCallback(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  useEffect(() => {
    handleGetFeeds();
  }, [handleGetFeeds]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
