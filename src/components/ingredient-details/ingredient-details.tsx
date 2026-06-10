import {
  selectIngredientById,
  selectIsIngredientsLoading
} from '@selectors/ingredientsSelectors';
import { FC } from 'react';
import { useParams } from 'react-router-dom';

import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const isLoading = useSelector(selectIsIngredientsLoading);
  const ingredientData = useSelector(selectIngredientById(id || ''));

  if (isLoading || !ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
