import React from 'react';
import { Navigate } from 'react-router-dom';
import IngredientTypes from './IngredientTypes';
import Ingredients from './Ingredients';
import IngredientBatches from './IngredientBatches';
import { Box, Typography } from '@mui/material';
import createLogger from '../../utils/logger';

// Add logging to debug component exports
const log = createLogger('IngredientRoutes');

// Debug log the components to ensure they're properly exported
log.debug('Component checking:', {
  isIngredientTypesComponent: typeof IngredientTypes === 'function',
  isIngredientsComponent: typeof Ingredients === 'function',
  isIngredientBatchesComponent: typeof IngredientBatches === 'function',
  ingredients: Ingredients,
  ingredientsTypeof: typeof Ingredients,
  ingredientsConstructor: Ingredients?.constructor?.name
});

// Create Error Placeholder to use instead of invalid components
const ErrorPlaceholder = ({ message }) => (
  <Box sx={{ p: 3, border: '1px solid red', borderRadius: 1 }}>
    <Typography color="error" variant="h6">Component Error</Typography>
    <Typography>{message}</Typography>
  </Box>
);

// Use regular components directly without HOC that's causing issues
const routes = [
  // Base redirect
  {
    path: "/ingredients",
    element: <Navigate to="/ingredients/types" replace />
  },
  
  // Level 1: List of ingredient types
  {
    path: "/ingredients/types",
    element: typeof IngredientTypes === 'function' 
      ? <IngredientTypes /> 
      : <ErrorPlaceholder message={`IngredientTypes component is not valid (type: ${typeof IngredientTypes})`} />
  },
  
  // Level 2: Ingredients for a specific type
  {
    path: "/ingredients/types/:typeId/ingredients",
    element: typeof Ingredients === 'function'
      ? <Ingredients />
      : <ErrorPlaceholder message={`Ingredients component is not valid (type: ${typeof Ingredients}, constructor: ${Ingredients?.constructor?.name})`} />
  },
  
  // Level 3: Batches for a specific ingredient
  {
    path: "/ingredients/types/:typeId/ingredients/:ingredientId/batches",
    element: typeof IngredientBatches === 'function'
      ? <IngredientBatches />
      : <ErrorPlaceholder message={`IngredientBatches component is not valid (type: ${typeof IngredientBatches})`} />
  }
];

export default routes;
