import BrandsPage from './Brands';
import VendorsPage from './Vendors';
import WorkersPage from './Workers';

// Create route objects for each tab in account config
export const accountRoutes = [
  {
    path: '/account/brands',
    component: BrandsPage,
    exact: true,
    label: 'Brands',
    listEvent: 'brndList'
  },
  {
    path: '/account/vendors',
    component: VendorsPage,
    exact: true,
    label: 'Vendors',
    listEvent: 'vndrList'
  },
  {
    path: '/account/workers',
    component: WorkersPage,
    exact: true,
    label: 'Workers',
    listEvent: 'wrkrList'
  }
];

// Default route redirects to first entity
export const defaultAccountRoute = {
  path: '/account',
  redirect: '/account/brands',
  exact: true
};
