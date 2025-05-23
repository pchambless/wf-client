import React from 'react';
import { ROUTES } from '@config/RouteConstants';
import Dashboard from '@pages/1-Dashboard';
import createLogger from '../utils/logger';

const log = createLogger('DashboardRoutes');

/**
 * Dashboard routes - using RouteConstants as source of truth
 */
export const dashboardRoutes = [
  {
    ...ROUTES.DASHBOARD,
    element: <Dashboard />
  }
];

// For debugging
log.debug('Dashboard routes loaded:', {
  routeCount: dashboardRoutes.length,
  paths: dashboardRoutes.map(r => r.path)
});
