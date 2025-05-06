import React from 'react';
import { Navigate } from 'react-router-dom';
import ProductTypes from '../pages/Products/ProductTypes';
import Products from '../pages/Products/Products';
import ProductBatches from '../pages/Products/ProductBatches';
import { Box, Typography } from '@mui/material';
import createLogger from '../utils/logger';

const log = createLogger('ProductRoutes');

// Debug log to verify correct component exports
log.debug('Component checking:', {
  isProductTypesComponent: typeof ProductTypes === 'function',
  isProductsComponent: typeof Products === 'function',
  isProductBatchesComponent: typeof ProductBatches === 'function'
});

// Error component for invalid routes
const ErrorPlaceholder = ({ message }) => (
  <Box sx={{ p: 3, border: '1px solid red', borderRadius: 1 }}>
    <Typography color="error" variant="h6">Component Error</Typography>
    <Typography>{message}</Typography>
  </Box>
);

/**
 * Product management routes
 */
export const productRoutes = [
  // Base product route
  {
    path: '/products',
    element: <Navigate to="/products/types" replace />
  },
  
  // Product types
  {
    path: '/products/types',
    element: typeof ProductTypes === 'function' 
      ? <ProductTypes />
      : <ErrorPlaceholder message="ProductTypes component is not valid" />,
    label: 'Product Types'
  },
  
  // Products within a type
  {
    path: '/products/types/:typeId/products',
    element: typeof Products === 'function'
      ? <Products />
      : <ErrorPlaceholder message="Products component is not valid" />,
    label: 'Products'
  },
  
  // Product batches
  {
    path: '/products/types/:typeId/products/:productId/batches',
    element: typeof ProductBatches === 'function'
      ? <ProductBatches />
      : <ErrorPlaceholder message="ProductBatches component is not valid" />,
    label: 'Product Batches'
  },
  
  // Direct route to product batches
  {
    path: '/products/batches',
    element: typeof ProductBatches === 'function'
      ? <ProductBatches isGlobalView={true} />
      : <ErrorPlaceholder message="ProductBatches component is not valid" />
  }
];
