import { ConstructorPageUI } from '@ui-pages';
import { selectIsIngredientsLoading } from '@selectors/ingredientsSelectors';
import { FC } from 'react';

import { useSelector } from '../../services/store';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(selectIsIngredientsLoading);

  return <ConstructorPageUI isIngredientsLoading={isIngredientsLoading} />;
};
