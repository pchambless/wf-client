import React from 'react';
import Welcome from '../pages/Welcome';
import createLogger from '../utils/logger';

const log = createLogger('DashboardRoutes');

// Make sure this is exported as a named export
export const dashboardRoutes = [
  {
    path: '/welcome',
    element: <Welcome />,
    label: 'Dashboard'
  }
];

// For debugging, add this
log.debug('Dashboard routes loaded:', dashboardRoutes);
