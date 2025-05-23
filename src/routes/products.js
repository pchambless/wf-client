import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../config/RouteConstants';
import ProductTypes from '@pages/3-Product/01-Types';
import Products from '@pages/3-Product/02-Products';
import ProductBatches from '@pages/3-Product/03-Batches';

import { Box, Typography } from '@mui/material';
import createLogger from '@utils/logger';

const log = createLogger('ProductRoutes');

// Debug log to verify correct component exports
log.debug('Component checking:', {
  isProductsComponent: typeof Products === 'function',
  isProductBatchesComponent: typeof ProductBatches === 'function',
  isProductTypesComponent: typeof ProductTypes === 'function'
});

// Error component for invalid routes
const ErrorPlaceholder = ({ message }) => (
  <Box sx={{ p: 3, border: '1px solid red', borderRadius: 1 }}>
    <Typography color="error" variant="h6">Component Error</Typography>
    <Typography>{message}</Typography>
  </Box>
);

/**
 * Product management routes - using RouteConstants as source of truth
 */
export const productRoutes = [
  // Base product route - redirect to types
  {
    path: '/products',
    element: <Navigate to={ROUTES.PRODUCT_TYPES.path} replace />
  },
  
  // Product types
  {
    ...ROUTES.PRODUCT_TYPES,
    element: typeof ProductTypes === 'function' 
      ? <ProductTypes />
      : <ErrorPlaceholder message="ProductTypes component is not valid" />
  },
  
  // Products within a type
  {
    ...ROUTES.PRODUCTS,
    element: typeof Products === 'function'
      ? <Products />
      : <ErrorPlaceholder message="Products component is not valid" />
  },
  
  // Product batches
  {
    ...ROUTES.PRODUCT_BATCHES,
    element: typeof ProductBatches === 'function'
      ? <ProductBatches />
      : <ErrorPlaceholder message="ProductBatches component is not valid" />
  }
];
