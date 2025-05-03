import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import IngredientTypes from './IngredientTypes';
import Ingredients from './Ingredients';
import IngredientBatches from './IngredientBatches';
import { Box, Typography } from '@mui/material';
import createLogger from '../../utils/logger';
import { withMainLayout } from '../../layouts/MainLayout';

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

// Create this component to handle the parameterized redirect
const AccountRedirect = () => {
  const { acctID } = useParams();
  return <Navigate to={`/ingredients/${acctID}/types`} replace />;
};

// Use regular components directly without HOC that's causing issues
const routes = [
  // Base redirect
  {
    path: "/ingredients",
    element: <Navigate to="/ingredients/types" replace />
  },
  
  // Base redirect with account ID
  {
    path: "/ingredients/:acctID",
    element: <AccountRedirect />  // Special component needed (explained below)
  },

  // Level 1: List of ingredient types
  {
    path: "/ingredients/types",
    element: typeof IngredientTypes === 'function' 
      ? withMainLayout(IngredientTypes)()
      : <ErrorPlaceholder message={`IngredientTypes component is not valid (type: ${typeof IngredientTypes})`} />
  },
  
  // Level 1: List of ingredient types with account ID
  {
    path: "/ingredients/:acctID/types",
    element: <IngredientTypes />
  },

  // Level 2: Ingredients for a specific type
  {
    path: "/ingredients/types/:ingrTypeID/ingredients",
    element: typeof Ingredients === 'function'
      ? withMainLayout(Ingredients)()
      : <ErrorPlaceholder message={`Ingredients component is not valid (type: ${typeof Ingredients}, constructor: ${Ingredients?.constructor?.name})`} />
  },
  
  // Level 3: Batches for a specific ingredient
  {
    path: "/ingredients/types/:ingrTypeID/ingredients/:ingrID/batches",
    element: typeof IngredientBatches === 'function'
      ? <IngredientBatches />
      : <ErrorPlaceholder message={`IngredientBatches component is not valid (type: ${typeof IngredientBatches})`} />
  }
];

export default routes;
