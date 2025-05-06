import React from 'react';
import { Navigate } from 'react-router-dom';
import BrandsPage from '../pages/Account/Brands';
import VendorsPage from '../pages/Account/Vendors';
import WorkersPage from '../pages/Account/Workers';
import createLogger from '../utils/logger';

const log = createLogger('AccountRoutes');

// Log components to help troubleshoot any issues
log.debug('Component checking:', {
  isBrandsComponent: typeof BrandsPage === 'function',
  isVendorsComponent: typeof VendorsPage === 'function',
  isWorkersComponent: typeof WorkersPage === 'function'
});

/**
 * Account management routes
 */
export const accountRoutes = [
  {
    path: '/account/brands',
    element: <BrandsPage />,
    label: 'Brands',
    listEvent: 'brndList'
  },
  {
    path: '/account/vendors',
    element: <VendorsPage />,
    label: 'Vendors',
    listEvent: 'vndrList'
  },
  {
    path: '/account/workers',
    element: <WorkersPage />,
    label: 'Workers',
    listEvent: 'wrkrList'
  },
  // Default redirect
  {
    path: '/account',
    element: <Navigate to="/account/brands" replace />
  },
  // Catch-all for account section
  {
    path: '/account/*',
    element: <Navigate to="/account/brands" replace />
  }
];
