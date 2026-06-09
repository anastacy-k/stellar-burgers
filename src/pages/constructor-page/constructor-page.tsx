import { ConstructorPageUI } from '@ui-pages';
import { fetchIngredients } from '@slices/ingredientsSlice';
import { selectIsIngredientsLoading } from '@selectors/ingredientsSelectors';
import { FC, useEffect } from 'react';

import { useDispatch, useSelector } from '../../services/store';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();
  const isIngredientsLoading = useSelector(selectIsIngredientsLoading);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return <ConstructorPageUI isIngredientsLoading={isIngredientsLoading} />;
};
