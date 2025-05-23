import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../config/RouteConstants';
import BrandsPage from '@pages/4-Account/01-Brands';
import VendorsPage from '@pages/4-Account/02-Vendors';
import WorkersPage from '@pages/4-Account/03-Workers';
import createLogger from '../utils/logger';

const log = createLogger('AccountRoutes');

// Log components to help troubleshoot any issues
log.debug('Component checking:', {
  isBrandsComponent: typeof BrandsPage === 'function',
  isVendorsComponent: typeof VendorsPage === 'function',
  isWorkersComponent: typeof WorkersPage === 'function'
});

/**
 * Account management routes - using RouteConstants as source of truth
 */
export const accountRoutes = [
  // Brands
  {
    ...ROUTES.BRANDS,
    element: <BrandsPage />
  },
  
  // Vendors
  {
    ...ROUTES.VENDORS,
    element: <VendorsPage />
  },
  
  // Workers
  {
    ...ROUTES.WORKERS,
    element: <WorkersPage />
  },
  
  // Default redirect
  {
    path: '/account',
    element: <Navigate to={ROUTES.BRANDS.path} replace />
  },
  
  // Catch-all for account section
  {
    path: '/account/*',
    element: <Navigate to={ROUTES.BRANDS.path} replace />
  }
];
