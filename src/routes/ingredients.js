import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
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

// Create Error Placeholder to use instead of invalid components
const ErrorPlaceholder = ({ message }) => (
  <Box sx={{ p: 3, border: '1px solid red', borderRadius: 1 }}>
    <Typography color="error" variant="h6">Component Error</Typography>
    <Typography>{message}</Typography>
  </Box>
);

// Create this component to handle the parameterized redirect
const AccountRedirect = () => {
  const { acctID } = useParams();
  return <Navigate to={`/ingredients/${acctID}/types`} replace />;
};

/**
 * Ingredient management routes
 */
export const ingredientRoutes = [
  // Base redirect
  {
    path: "/ingredients",
    element: <Navigate to="/ingredients/types" replace />
  },
  
  // Base redirect with account ID
  {
    path: "/ingredients/:acctID",
    element: <AccountRedirect />
  },

  // Level 1: List of ingredient types
  {
    path: "/ingredients/types",
    element: typeof IngredientTypes === 'function' 
      ? <IngredientTypes />
      : <ErrorPlaceholder message={`IngredientTypes component is not valid`} />,
    label: "Ingredient Types"
  },
  
  // Ingredient types with account ID
  {
    path: "/ingredients/:acctID/types",
    element: <IngredientTypes />,
    label: "Ingredient Types"
  },
  
  // Level 2: Ingredients for a specific type
  {
    path: "/ingredients/types/:ingrTypeID/ingredients",
    element: typeof Ingredients === 'function'
      ? <Ingredients />
      : <ErrorPlaceholder message={`Ingredients component is not valid`} />,
    label: "Ingredients"
  },
  
  // Level 3: Batches for a specific ingredient
  {
    path: "/ingredients/types/:ingrTypeID/ingredients/:ingrID/batches",
    element: typeof IngredientBatches === 'function'
      ? <IngredientBatches />
      : <ErrorPlaceholder message={`IngredientBatches component is not valid`} />,
    label: "Ingredient Batches"
  },
  
  // Direct route to ingredient batches
  {
    path: "/ingredients/batches",
    element: typeof IngredientBatches === 'function'
      ? <IngredientBatches isGlobalView={true} />
      : <ErrorPlaceholder message={`IngredientBatches component is not valid`} />
  }
];
