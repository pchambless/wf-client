/**
 * Application routes definition
 * This is the ONLY place routes should be defined
 */
import createLogger from '@utils/logger';
import SECTIONS from '../navigation/NavigationSections';

const log = createLogger('Routes');

export const ROUTES = {
  // Dashboard
  DASHBOARD: {
    path: '/welcome',
    label: 'Dashboard',
    icon: 'Dashboard',
    section: 'dashboard',
    sectionOrder: SECTIONS.dashboard.order,
    itemOrder: 10
  },

  // Select Account
  SELECT_ACCOUNT: {
    path: '/accounts/select',
    label: 'Select Account',
    icon: 'AccountBalance',
    section: 'dashboard',
    itemOrder: 20
  },
  
  // Ingredients section (pink)
  INGREDIENT_TYPES: {
    path: '/ingredients/types',
    label: 'Ingredient Types',
    icon: 'Category',
    section: 'ingredients',
    sectionOrder: SECTIONS.ingredients.order,
    itemOrder: 10
  },
  INGREDIENTS: {
    path: '/ingredients/:ingrTypeID/ingredients',
    label: 'Ingredients',
    icon: 'ListAlt',
    section: 'ingredients',
    itemOrder: 20,
    requiredParams: ['ingrTypeID']
  },
  INGREDIENT_BATCHES: {
    path: '/ingredients/:ingrTypeID/ingredients/:ingrID/batches',
    label: 'Ingredient Batches',
    icon: 'Inventory',
    section: 'ingredients',
    itemOrder: 30,
    requiredParams: ['ingrTypeID', 'ingrID']
  },
  
  // Products section (blue)
  PRODUCT_TYPES: {
    path: '/products/types',
    label: 'Product Types',
    icon: 'Category',
    section: 'products',
    sectionOrder: SECTIONS.products.order,
    itemOrder: 10
  },
  // ...other routes
};

/**
 * Helper to resolve parameterized routes with actual values
 */
export function resolveRoute(routeKey, params = {}) {
  const route = ROUTES[routeKey];
  if (!route) {
    log.error(`Route key not found: ${routeKey}`);
    return '/';
  }
  
  let resolvedPath = route.path;
  Object.entries(params).forEach(([key, value]) => {
    resolvedPath = resolvedPath.replace(`:${key}`, value);
  });
  return resolvedPath;
}

/**
 * Get route information by key
 */
export function getRoute(routeKey) {
  return ROUTES[routeKey];
}

export default ROUTES;
