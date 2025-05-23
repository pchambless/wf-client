import React from 'react';
import { Navigate } from 'react-router-dom';
import createLogger from '@utils/logger';
import { ROUTES } from '../config/RouteConstants'; 

// Update imports to use the new numbered path structure
import IngredientTypes from '@pages/2-Ingredient/01-Types';
import Ingredients from '@pages/2-Ingredient/02-Ingredients';
import IngredientBatches from '@pages/2-Ingredient/03-Batches';


const log = createLogger('IngredientRoutes');

log.debug('Component checking:', {
  isIngredientTypesComponent: typeof IngredientTypes === 'function',
  isIngredientsComponent: typeof Ingredients === 'function',
  isIngredientBatchesComponent: typeof IngredientBatches === 'function'
});

/**
 * Ingredient management routes - using RouteConstants as source of truth
 */
export const ingredientRoutes = [
  // Primary route - ingredient types (spread all properties from constants)
  {
    ...ROUTES.INGREDIENT_TYPES,
    element: <IngredientTypes />
  },
  
  // Ingredients by type
  {
    ...ROUTES.INGREDIENTS,
    element: <Ingredients />
  },
  
  // Ingredient batches
  {
    ...ROUTES.INGREDIENT_BATCHES,
    element: <IngredientBatches />
  },
  
  // Redirects - keep these as they're not in RouteConstants
  {
    path: "/ingredients",
    element: <Navigate to={ROUTES.INGREDIENT_TYPES.path} replace />
  },
  
  {
    path: "/ingredients/smart",
    element: <Navigate to={ROUTES.INGREDIENT_TYPES.path} replace />
  }
];
