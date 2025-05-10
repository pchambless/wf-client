import React from 'react';
import { Navigate } from 'react-router-dom';
import IngredientTypes from '../pages/Ingredients/IngredientTypes';
import Ingredients from '../pages/Ingredients/Ingredients';
import IngredientBatches from '../pages/Ingredients/IngredientBatches';
import { Box, Typography } from '@mui/material';
import createLogger from '@utils/logger';

// Add logging to debug component exports
const log = createLogger('IngredientRoutes');

// Debug log the components to ensure they're properly exported
log.debug('Component checking:', {
  isIngredientTypesComponent: typeof IngredientTypes === 'function',
  isIngredientsComponent: typeof Ingredients === 'function',
  isIngredientBatchesComponent: typeof IngredientBatches === 'function'
});

// Error placeholder component
const ErrorPlaceholder = ({ message }) => (
  <Box sx={{ p: 3, border: '1px solid red', borderRadius: 1 }}>
    <Typography color="error" variant="h6">Component Error</Typography>
    <Typography>{message}</Typography>
  </Box>
);

/**
 * Ingredient management routes - CLEAN IMPLEMENTATION
 */
export const ingredientRoutes = [
  // Core path 3: Ingredient Batches
  {
    path: "/ingredients/:ingrID/batches",
    element: typeof IngredientBatches === 'function'
      ? <IngredientBatches />
      : <ErrorPlaceholder message={`IngredientBatches component is not valid`} />,
    label: "Ingredient Batches"
  },
  
  // Core path 2: Ingredients for a specific type
  {
    path: "/ingredients/:ingrTypeID/ingredients",
    element: typeof Ingredients === 'function'
      ? <Ingredients />
      : <ErrorPlaceholder message={`Ingredients component is not valid`} />,
    label: "Ingredients"
  },
  
  // Core path 1: Ingredient Types with account ID
  {
    path: "/ingredients/:acctID",
    element: typeof IngredientTypes === 'function'
      ? <IngredientTypes />
      : <ErrorPlaceholder message={`IngredientTypes component is not valid`} />,
    label: "Ingredient Types"
  },
  
  // Base route - redirect to welcome
  {
    path: "/ingredients",
    element: <Navigate to="/welcome" replace />
  }
];
